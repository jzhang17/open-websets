import { AIMessage, BaseMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { StateGraph, Annotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

import { ConfigurationSchema, ensureConfiguration } from "./configuration.js";
import { TOOLS } from "./tools.js";
import { loadChatModel } from "./utils.js";
import { 
    graph as entityQualificationSubgraph, 
    QualificationItem 
} from "../entity_qualification_agent_js/graph.js";

// Explicitly define the messages channel annotation
const messagesChannelAnnotation = Annotation<BaseMessage[]>({
    reducer: (currentMessages, newMessagesUpdate) => {
        const newMessages = Array.isArray(newMessagesUpdate) ? newMessagesUpdate : [newMessagesUpdate];
        return (currentMessages ?? []).concat(newMessages.filter(msg => msg !== undefined) as BaseMessage[]);
    },
    default: () => [],
});

const ParentAppStateAnnotation = Annotation.Root({
  messages: messagesChannelAnnotation,
  entitiesToQualify: Annotation<string[]>({
    reducer: (currentState, updateValue) => {
      const current = currentState ?? [];
      if (Array.isArray(updateValue)) {
        return current.concat(updateValue);
      }
      if (typeof updateValue === 'string') {
        return current.concat([updateValue]);
      }
      return current;
    },
    default: () => [],
  }),
  qualificationSummary: Annotation<QualificationItem[]>({
    reducer: (
      _currentState: QualificationItem[] | undefined, 
      updateValue: QualificationItem | QualificationItem[] | undefined
    ): QualificationItem[] => {
      if (Array.isArray(updateValue)) {
        return updateValue; // Replace
      }
      return Array.isArray(_currentState) ? _currentState : []; 
    },
    default: () => [],
  }),
  verificationResults: Annotation<Record<string, any>>({
    reducer: (_currentState, updateValue) => updateValue ?? {},
    default: () => ({}),
  }),
  verificationLoopCount: Annotation<number>({
    reducer: (_currentState, updateValue) => typeof updateValue === 'number' ? updateValue : (_currentState ?? 0),
    default: () => 0,
  }),
  continueQualificationSignal: Annotation<boolean>({
    reducer: (_currentState, updateValue) => typeof updateValue === 'boolean' ? updateValue : (_currentState ?? false),
    default: () => false,
  }),
});

type ParentAppState = typeof ParentAppStateAnnotation.State;
type ParentAppStateUpdate = typeof ParentAppStateAnnotation.Update;

async function callModel(
  state: ParentAppState, 
  config: RunnableConfig,
): Promise<ParentAppStateUpdate> { 
  const configuration = ensureConfiguration(config);
  const model = (await loadChatModel(configuration.model)).bindTools(TOOLS);
  const response = await model.invoke([
    {
      role: "system",
      content: configuration.systemPromptTemplate.replace(
        "{system_time}",
        new Date().toISOString(),
      ),
    },
    ...(state.messages ?? []),
  ]);
  return { messages: [response] };
}

// Original router, used by the subgraph
function routeModelOutput(state: ParentAppState): string { 
  const messages = state.messages ?? [];
  if (messages.length === 0) {
    return "__end__"; 
  }
  const lastMessage = messages[messages.length - 1]; 
  if (lastMessage && (lastMessage as AIMessage).tool_calls && (lastMessage as AIMessage).tool_calls!.length > 0) {
    return "tools";
  }
  else {
    return "__end__";
  }
}

// New router for the main callModel node for 3-way decision
function routeMainAgentDecision(state: ParentAppState): "invoke_tools" | "invoke_subgraph" | "terminate_process" {
  const messages = state.messages ?? [];
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  // 1. Check for tool calls from callModel's own output
  if (lastMessage && (lastMessage as AIMessage).tool_calls && (lastMessage as AIMessage).tool_calls!.length > 0) {
    return "invoke_tools";
  }

  // 2. If no tools from callModel, decide if subgraph needs to run or if process should end.
  // Simple logic: if qualificationSummary has data, assume subgraph has done its job, so terminate.
  // Otherwise, invoke the subgraph.
  if (state.qualificationSummary && state.qualificationSummary.length > 0) {
    return "terminate_process";
  } else {
    return "invoke_subgraph";
  }
}

const workflow = new StateGraph(ParentAppStateAnnotation, ConfigurationSchema)
  .addNode("callModel", callModel)
  .addNode("entityQualificationSubgraph", entityQualificationSubgraph as any) 
  .addNode("tools", new ToolNode(TOOLS))
  .addEdge("__start__", "callModel")

  // Conditional routing for the main callModel node
  .addConditionalEdges(
    "callModel",
    routeMainAgentDecision,
    {
      "invoke_tools": "tools",
      "invoke_subgraph": "entityQualificationSubgraph",
      "terminate_process": "__end__" // Actual graph termination
    }
  )
  
  // Conditional routing for the entityQualificationSubgraph
  .addConditionalEdges(
    "entityQualificationSubgraph", 
    routeModelOutput, // Subgraph uses the simpler 2-way router
    {
        "tools": "callModel",         // Subgraph needs tools (via parent) or is done, returns to callModel
        "__end__": "callModel"      // Subgraph is done with its part, returns to callModel
    }
  )
  .addEdge("tools", "callModel"); // Tools always return to the main callModel

export const graph = workflow.compile({
  interruptBefore: [], 
  interruptAfter: [],
});
