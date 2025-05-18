import { AIMessage, BaseMessage, ToolMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { StateGraph, Annotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import { ConfigurationSchema, ensureConfiguration } from "./configuration.js";
import { TOOLS } from "./tools.js";
import { loadChatModel } from "./utils.js";
import { 
    graph as entityQualificationSubgraph, 
    QualificationItem 
} from "./entity_qualification_agent_js/graph.js";

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
    reducer: (_currentState: string[] | undefined, updateValue: string[] | undefined): string[] => {
      // If updateValue is an array, replace current state with it.
      // Otherwise, keep current state (or default to empty if current is undefined).
      return Array.isArray(updateValue) ? updateValue : (_currentState ?? []);
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

// Read the system prompt from the markdown file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const systemPromptPath = path.join(__dirname, "system_prompt.md");
const systemPrompt = fs.readFileSync(systemPromptPath, "utf-8");

// Node to prepare entities for the qualification subgraph
async function prepareForQualificationNode(
  state: ParentAppState, 
): Promise<ParentAppStateUpdate> {
  const messages = state.messages ?? [];
  let entitiesToSet: string[] = [];
  let aiMessageIndex = -1;

  // Find the last AIMessage that might have triggered tool calls
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i] instanceof AIMessage) {
      aiMessageIndex = i;
      break;
    }
  }

  if (aiMessageIndex === -1) return {}; // No AIMessage found

  const lastAiMessage = messages[aiMessageIndex] as AIMessage;
  if (!lastAiMessage.tool_calls || lastAiMessage.tool_calls.length === 0) {
    return {}; // Last AIMessage didn't make tool calls
  }

  // Collect entities from all exa_search tool calls made by the last AIMessage
  for (let i = aiMessageIndex + 1; i < messages.length; i++) {
    const currentMessage = messages[i];
    // Ensure ToolMessage is correctly identified (it's a class)
    if (currentMessage instanceof BaseMessage && currentMessage.constructor.name === "ToolMessage") {
      const toolMessage = currentMessage as ToolMessage; // Cast for property access
      const toolCall = lastAiMessage.tool_calls.find(tc => tc.id === toolMessage.tool_call_id);
      if (toolCall?.name === "exa_search") {
        try {
          const toolContent = JSON.parse(toolMessage.content as string);
          if (toolContent && Array.isArray(toolContent.entities_to_qualify)) {
            entitiesToSet = entitiesToSet.concat(toolContent.entities_to_qualify);
          }
        } catch (e) {
          console.warn("Could not parse exa_search tool content in prepareForQualificationNode:", e);
        }
      }
    }
  }

  if (entitiesToSet.length > 0) {
    const uniqueEntities = Array.from(new Set(entitiesToSet));
    return { entitiesToQualify: uniqueEntities };
  }

  return {}; // No entities found from exa_search calls, or no update needed
}

async function callModel(
  state: ParentAppState, 
  config: RunnableConfig,
): Promise<ParentAppStateUpdate> { 
  const configuration = ensureConfiguration(config);
  const model = (await loadChatModel(configuration.model)).bindTools(TOOLS);
  const response = await model.invoke([
    {
      role: "system",
      content: systemPrompt.replace(
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

// New router after tool processing
function routeAfterToolProcessing(state: ParentAppState): "entityQualificationSubgraph" | "callModel" {
  if (state.entitiesToQualify && state.entitiesToQualify.length > 0) {
    // If there are entities to qualify, and no summary yet for this batch (implicit)
    // This condition might need refinement if qualification can be partial
    // and we want to avoid re-sending to subgraph if it's already processing or done.
    // For now, if entities are present, try to qualify.
    return "entityQualificationSubgraph";
  } else {
    return "callModel"; // No entities to qualify, or other tools ran, let main model decide.
  }
}

const workflow = new StateGraph(ParentAppStateAnnotation, ConfigurationSchema)
  .addNode("callModel", callModel)
  .addNode("entityQualificationSubgraph", entityQualificationSubgraph as any) 
  .addNode("tools", new ToolNode(TOOLS))
  .addNode("prepareForQualification", prepareForQualificationNode)
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
  
  .addEdge("tools", "prepareForQualification")

  // Conditional routing after preparation node
  .addConditionalEdges(
    "prepareForQualification",
    routeAfterToolProcessing,
    {
      "entityQualificationSubgraph": "entityQualificationSubgraph",
      "callModel": "callModel"
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

export const graph = workflow.compile({
  interruptBefore: [], 
  interruptAfter: [],
});
