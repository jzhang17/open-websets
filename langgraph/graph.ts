import { BaseMessage } from "@langchain/core/messages";
import { Annotation, StateGraph, START, Send } from "@langchain/langgraph";
import {
  graph as listGenerationGraph,
  EntityType as ListGenEntityType,
  type Entity as ListGenEntityInterface,
} from "./list_gen_agent_js/graph.js";
import {
  graph as entityQualificationGraph,
  type QualificationItem as EQQualificationItem,
} from "./entity_qualification_agent_js/graph.js";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ConfigurationSchema, ensureConfiguration } from "./configuration.js";
import { TOOLS } from "./tools.js";
import { loadChatModelWithRetry as loadChatModel } from "./chatModelWithRetry.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { AIMessage, ToolMessage, HumanMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import {
  typedUi,
  uiMessageReducer,
} from "@langchain/langgraph-sdk/react-ui/server";

// Entities and qualification items mirror the types used in the subgraphs
interface Entity extends ListGenEntityInterface {}
type QualificationItem = EQQualificationItem;

// Define the parent graph's state structure
const ParentAppStateAnnotation = Annotation.Root({
  parentMessages: Annotation<BaseMessage[]>({
    reducer: (currentState, updateValue) => currentState.concat(updateValue),
    default: () => [],
  }),
  ui: Annotation<any[]>({ reducer: uiMessageReducer, default: () => [] }),
  entities: Annotation<Entity[]>({
    reducer: (_currentState, updateValue) => updateValue,
    default: () => [],
  }),
  qualificationCriteria: Annotation<string>({
    reducer: (_currentState, updateValue) => updateValue,
    default: () => "",
  }),
  entityTypes: Annotation<ListGenEntityType[]>({
    reducer: (_currentState, updateValue) => updateValue,
    default: () => [],
  }),
  qualificationSummary: Annotation<QualificationItem[]>({
    reducer: (currentState, updateValue) => {
      // Ensure both are arrays before concatenating
      const current = Array.isArray(currentState) ? currentState : [];
      const update = Array.isArray(updateValue) ? updateValue : [];
      return current.concat(update);
    },
    default: () => [],
  }),
  entitiesToQualify: Annotation<Entity[]>({
    reducer: (_currentState, updateValue) => updateValue,
    default: () => [],
  }),
  processedEntityCount: Annotation<number>({
    reducer: (currentState, updateValue) => {
      const current = typeof currentState === "number" ? currentState : 0;
      const update = typeof updateValue === "number" ? updateValue : 0;
      return Math.max(current, update);
    },
    default: () => 0,
  }),
  finishedBatches: Annotation<number>({
    reducer: (currentState, updateValue) => {
      const current = typeof currentState === "number" ? currentState : 0;
      const update = typeof updateValue === "number" ? updateValue : 0;
      return current + update;
    },
    default: () => 0,
  }),
  listGenMessages: Annotation<BaseMessage[]>({
    reducer: (_currentState, updateValue) => updateValue,
    default: () => [],
  }),
  qualMessages: Annotation<BaseMessage[]>({
    reducer: (_currentState, updateValue) => updateValue,
    default: () => [],
  }),
});

// Define types for state and update based on the annotation
type ParentAppState = typeof ParentAppStateAnnotation.State;
type ParentAppStateUpdate = typeof ParentAppStateAnnotation.Update;

// Executes any tools requested by the parent agent
async function parentAgentToolsNode(
  state: ParentAppState,
  config?: RunnableConfig,
): Promise<Partial<ParentAppStateUpdate>> {
  const lastMessage = state.parentMessages[state.parentMessages.length - 1];
  let messageForToolNode: AIMessage;

  if (!lastMessage) {
    console.error(
      "parentAgentToolsNode: No last message found in parentMessages.",
    );
    throw new Error("parentAgentToolsNode: No last message found.");
  }

  if (lastMessage instanceof AIMessage) {
    if (!lastMessage.tool_calls || lastMessage.tool_calls.length === 0) {
      console.error(
        "parentAgentToolsNode: AIMessage received, but no tool_calls found.",
        lastMessage,
      );
      throw new Error(
        "parentAgentToolsNode: AIMessage received, but no tool_calls found.",
      );
    }
    messageForToolNode = lastMessage;
  } else if (
    typeof lastMessage === "object" &&
    lastMessage !== null &&
    "tool_calls" in lastMessage &&
    Array.isArray((lastMessage as any).tool_calls) &&
    (lastMessage as any).tool_calls.length > 0
  ) {
    // This is likely an AIMessageChunk or a similar structure with tool_calls.
    console.log(
      "parentAgentToolsNode: Detected AIMessageChunk-like object with tool_calls. Converting to AIMessage for ToolNode.",
    );
    let extractedTextContent = "";
    if (typeof lastMessage.content === "string") {
      extractedTextContent = lastMessage.content;
    } else if (Array.isArray(lastMessage.content)) {
      for (const part of lastMessage.content) {
        if (
          typeof part === "object" &&
          part !== null &&
          part.type === "text" &&
          typeof (part as any).text === "string"
        ) {
          extractedTextContent += (part as any).text + "\n";
        }
      }
      extractedTextContent = extractedTextContent.trim();
    }
    const chunk = lastMessage as any;
    messageForToolNode = new AIMessage({
      content: extractedTextContent || "",
      tool_calls: chunk.tool_calls,
      ...(chunk.invalid_tool_calls && {
        invalid_tool_calls: chunk.invalid_tool_calls,
      }),
      ...(chunk.id && { id: chunk.id }),
      ...(chunk.additional_kwargs && {
        additional_kwargs: chunk.additional_kwargs,
      }),
      ...(chunk.response_metadata && {
        response_metadata: chunk.response_metadata,
      }),
      ...(chunk.usage_metadata && { usage_metadata: chunk.usage_metadata }),
    });
  } else {
    console.error(
      "parentAgentToolsNode: Last message is not an AIMessage or a compatible AIMessageChunk with tool_calls.",
      lastMessage,
    );
    throw new Error(
      "parentAgentToolsNode: Last message is not an AIMessage or a compatible AIMessageChunk with tool_calls.",
    );
  }

  const toolExecutor = new ToolNode(TOOLS);
  const toolExecutorOutput = await toolExecutor.invoke(
    { messages: [messageForToolNode] },
    config,
  );

  const toolMessages = toolExecutorOutput.messages as ToolMessage[];
  let newQualificationCriteria: string | undefined = undefined;

  for (const toolMessage of toolMessages) {
    if (toolMessage.name === "update_qualification_criteria") {
      if (typeof toolMessage.content === "string") {
        try {
          const toolOutput = JSON.parse(toolMessage.content);
          if (
            toolOutput.qualificationCriteria &&
            typeof toolOutput.qualificationCriteria === "string"
          ) {
            newQualificationCriteria = toolOutput.qualificationCriteria;
          }
        } catch (e) {
          console.error(
            "Failed to parse qualificationCriteria from update_qualification_criteria tool message in parentAgentToolsNode:",
            toolMessage.content,
            e,
          );
        }
      }
    }
  }

  const update: Partial<ParentAppStateUpdate> = {
    parentMessages: toolMessages,
  };
  if (newQualificationCriteria !== undefined) {
    update.qualificationCriteria = newQualificationCriteria;
  }
  return update;
}

// Define the function that calls the agent model
async function callAgentModel(
  state: ParentAppState,
  config: RunnableConfig,
): Promise<ParentAppStateUpdate> {
  const configuration = ensureConfiguration(config);
  const model = (await loadChatModel(configuration.model)).bindTools(TOOLS);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const systemPromptPath = path.join(__dirname, "system_prompt.md");
  const systemPrompt = fs.readFileSync(systemPromptPath, "utf-8");

  const response = await model.invoke([
    {
      role: "system",
      content: systemPrompt.replace("{system_time}", new Date().toISOString()),
    },
    ...state.parentMessages,
  ]);

  const update: Partial<ParentAppStateUpdate> = { parentMessages: [response] };

  // If the model did not request a tool, feed the output into the list generation graph
  const hasToolCalls =
    (response as AIMessage)?.tool_calls?.length ||
    0 ||
    (response as any)?.tool_call_chunks?.length ||
    0;

  if (!hasToolCalls) {
    let initialContentForListGen = "";
    if (typeof response.content === "string") {
      initialContentForListGen = response.content;
    } else if (Array.isArray(response.content)) {
      for (const part of response.content) {
        if (
          typeof part === "object" &&
          part !== null &&
          part.type === "text" &&
          typeof (part as any).text === "string"
        ) {
          initialContentForListGen += (part as any).text + "\n";
        }
      }
      initialContentForListGen = initialContentForListGen.trim();
    }
    const humanMessageContent =
      initialContentForListGen ||
      "Please proceed based on the previous instruction from the parent agent.";
    update.listGenMessages = [
      new HumanMessage({ content: humanMessageContent }),
    ];
  }
  return update as ParentAppStateUpdate;
}

// Define routing logic for the agent node
function routeAgentModelOutput(state: any) {
  const messages = state.parentMessages;
  const lastMessage = messages[messages.length - 1];
  if (((lastMessage as AIMessage)?.tool_calls?.length || 0) > 0) {
    return "agentTools";
  }
  return "listGeneration";
}

// Split the entity list into batches and issue Send instructions for each batch.
// Returning multiple Send objects makes LangGraph run those subgraphs concurrently.
function assignQualificationWorkers(state: ParentAppState) {
  const {
    entities,
    processedEntityCount = 0,
    qualificationCriteria,
    finishedBatches = 0,
  } = state;
  const batchSize = 15;
  const maxWorkers = 4;

  const totalEntities = entities?.length ?? 0;

  if (finishedBatches * batchSize >= totalEntities) {
    return "__end__";
  }

  const dispatchedBatches = Math.ceil(processedEntityCount / batchSize);
  const activeBatches = dispatchedBatches - finishedBatches;
  const capacity = maxWorkers - activeBatches;

  if (capacity <= 0) {
    return [];
  }

  const sends: Send[] = [];
  let nextIndex = processedEntityCount;

  for (let i = 0; i < capacity && nextIndex < totalEntities; i++) {
    const start = nextIndex;
    const end = Math.min(start + batchSize, totalEntities);
    const batchEntities = entities.slice(start, end).map((e) => ({
      index: e.index,
      name: e.name,
      url: e.url,
    }));
    const batchNames = batchEntities.map((e) => e.name);
    const qualInstruction = `Please qualify the following entities: ${batchNames.join(", ")}. The qualification criteria are: ${qualificationCriteria}`;
    nextIndex = end;
    sends.push(
      new Send("entityQualification", {
        entitiesToQualify: batchEntities,
        qualMessages: [new HumanMessage({ content: qualInstruction })],
        qualificationCriteria,
        processedEntityCount: nextIndex,
      }),
    );
  }
  return sends; // Return Send[] (can be empty) or "__end__"
}

// Build parent workflow
const parentWorkflow = new StateGraph(
  ParentAppStateAnnotation,
  ConfigurationSchema,
);

// Add the root agent nodes
parentWorkflow.addNode("agent", callAgentModel);
parentWorkflow.addNode("agentTools", parentAgentToolsNode);

// Subgraphs handle list generation and entity qualification
parentWorkflow.addNode("listGeneration", listGenerationGraph);
parentWorkflow.addNode(
  "qualificationRouter",
  async (state: ParentAppState, _config: RunnableConfig) => {
    // Check if all entities are processed and emit a completion message
    const batchSize = 15;
    const totalEntities = state.entities?.length ?? 0;
    const finished = state.finishedBatches * batchSize >= totalEntities;
    
    if (finished) {
      const doneMsg = new AIMessage({ content: "The search and qualification process is complete." });
      return { 
        parentMessages: [doneMsg]
      };
    }
    
    // For intermediate updates, don't return UI in state - the ui.push() already emitted the event
    return {};
  }
);
parentWorkflow.addNode(
  "qualificationUiUpdate",
  async (state: ParentAppState, config: RunnableConfig) => {
    const ui = typedUi(config);

    ui.push(
      {
        id: "agGridTableMessage",
        name: "agGridTable",
        props: {
          entities: state.entities,
          qualificationSummary: state.qualificationSummary,
        },
      },
      { merge: true }
    );

    return {};
  }
);
parentWorkflow.addNode("entityQualification", entityQualificationGraph as any);

// Workflow edges
parentWorkflow.addEdge(START, "agent" as any);
parentWorkflow.addConditionalEdges("agent" as any, routeAgentModelOutput);
parentWorkflow.addEdge("agentTools" as any, "agent" as any);
// Qualification loop
parentWorkflow.addEdge("listGeneration" as any, "qualificationRouter" as any);

parentWorkflow.addConditionalEdges(
  "qualificationRouter" as any,
  assignQualificationWorkers,
  {
    __end__: "__end__",
  },
);

parentWorkflow.addEdge(
  "entityQualification" as any,
  "qualificationUiUpdate" as any,
);

parentWorkflow.addEdge(
  "qualificationUiUpdate" as any,
  "qualificationRouter" as any,
);

// Compile and export the workflow
export const graph = parentWorkflow.compile();
