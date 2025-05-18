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
  entitiesToQualify: Annotation<string[]>({ // Current batch for subgraph
    reducer: (_currentState: string[] | undefined, updateValue: string[] | undefined): string[] => {
      return Array.isArray(updateValue) ? updateValue : (_currentState ?? []);
    },
    default: () => [],
  }),
  pendingQualificationBatches: Annotation<string[][]>({ // Queue of batches from exa_search
    reducer: (_currentState, updateValue) => Array.isArray(updateValue) ? updateValue : (_currentState ?? []),
    default: () => [],
  }),
  qualificationSummary: Annotation<QualificationItem[]>({ // Accumulates results from subgraph
    reducer: (
      currentState: QualificationItem[] = [],
      updateValue: QualificationItem | QualificationItem[] | undefined
    ): QualificationItem[] => {
      if (updateValue === undefined) return currentState;

      // Explicit reset signal: if updateValue is an empty array.
      if (Array.isArray(updateValue) && updateValue.length === 0) {
          return []; // Reset the summary
      }

      const itemsToAdd: QualificationItem[] = Array.isArray(updateValue) ? updateValue : [updateValue];
      // Ensure not to concat undefined items from a single item update
      return currentState.concat(itemsToAdd.filter(item => item !== undefined && item !== null));
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

// Node to extract entities from exa_search tool calls and queue them
async function extractAndQueueQualificationBatchesNode(
  state: ParentAppState,
): Promise<ParentAppStateUpdate> {
  const messages = state.messages ?? [];
  const newBatches: string[][] = [];
  let aiMessageIndex = -1;

  // Find the last AIMessage that might have triggered tool calls
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]._getType() === "ai") {
      aiMessageIndex = i;
      break;
    }
  }

  if (aiMessageIndex === -1) return { pendingQualificationBatches: [], qualificationSummary: [] };

  const lastAiMessage = messages[aiMessageIndex] as AIMessage;
  if (!lastAiMessage.tool_calls || lastAiMessage.tool_calls.length === 0) {
    return { pendingQualificationBatches: [], qualificationSummary: [] };
  }

  const processedToolCallIdsInThisTurn = new Set<string>();
  const toolCallMap = new Map(
    (lastAiMessage.tool_calls ?? []).map((tc) => [tc.id, tc])
  );

  for (let i = aiMessageIndex + 1; i < messages.length; i++) {
    const currentMessage = messages[i];
    // Only handle ToolMessages
    if (currentMessage._getType() === "tool") {
      const toolMessage = currentMessage as ToolMessage;
      const toolCall = toolCallMap.get(toolMessage.tool_call_id);

      if (toolCall?.name === "exa_search" && toolCall.id && !processedToolCallIdsInThisTurn.has(toolCall.id)) {
        try {
          const toolContent = JSON.parse(toolMessage.content as string);
          if (toolContent && Array.isArray(toolContent.entities_to_qualify) && toolContent.entities_to_qualify.length > 0) {
            newBatches.push(toolContent.entities_to_qualify);
            processedToolCallIdsInThisTurn.add(toolCall.id);
          }
        } catch (e) {
          console.warn("Could not parse exa_search tool content in extractAndQueueQualificationBatchesNode:", e);
        }
      }
    }
  }

  if (newBatches.length > 0) {
    // Reset the summary and queue any new batches
    return { pendingQualificationBatches: newBatches, qualificationSummary: [] };
  }
  // Nothing new found; clear the queue
  return { pendingQualificationBatches: [] };
}

// Node to prepare the next batch of entities for the qualification subgraph
async function prepareNextBatchForQualificationNode(
  state: ParentAppState,
): Promise<ParentAppStateUpdate> {
  const batches = state.pendingQualificationBatches ?? [];
  if (batches.length > 0) {
    const nextBatch = batches[0];
    const remainingBatches = batches.slice(1);
    return {
      entitiesToQualify: nextBatch,
      pendingQualificationBatches: remainingBatches,
    };
  }
  // No more batches
  return {
    entitiesToQualify: [], // Clear current batch
    pendingQualificationBatches: [], // Ensure queue is empty
  };
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
    // Include qualification summary if available, so the model is aware of previous qualifications
    ...(state.qualificationSummary && state.qualificationSummary.length > 0
      ? [{ role: "system", content: `Qualification Summary:
${JSON.stringify(state.qualificationSummary, null, 2)}` }]
      : []),
  ]);
  return { messages: [response] };
}

// Simplified router for the main callModel node
function routeMainAgentDecision(state: ParentAppState): "invoke_tools" | "__end__" {
  const messages = state.messages ?? [];
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  if (lastMessage && (lastMessage as AIMessage).tool_calls && (lastMessage as AIMessage).tool_calls!.length > 0) {
    return "invoke_tools";
  }
  return "__end__"; // Agent has finished or provided a final response to the user
}

// Router for preparing the next qualification batch or returning to the main model
function routeForNextQualificationBatch(state: ParentAppState): "entityQualificationSubgraph" | "callModel" {
  if (state.entitiesToQualify && state.entitiesToQualify.length > 0) {
    return "entityQualificationSubgraph"; // Has a batch, go to subgraph
  }
  // No more batches in pendingQualificationBatches or entitiesToQualify is cleared.
  // Qualification cycle for this tool invocation is complete.
  // Go back to main model, which will now have the accumulated qualificationSummary.
  return "callModel";
}

const workflow = new StateGraph(ParentAppStateAnnotation, ConfigurationSchema)
  .addNode("callModel", callModel)
  .addNode("entityQualificationSubgraph", entityQualificationSubgraph as any)
  .addNode("tools", new ToolNode(TOOLS))
  .addNode("extractAndQueueQualificationBatches", extractAndQueueQualificationBatchesNode)
  .addNode("prepareNextBatchForQualification", prepareNextBatchForQualificationNode)

  .addEdge("__start__", "callModel")

  // Conditional routing for the main callModel node
  .addConditionalEdges(
    "callModel",
    routeMainAgentDecision,
    {
      "invoke_tools": "tools",
      "__end__": "__end__" // Actual graph termination or final response
    }
  )

  .addEdge("tools", "extractAndQueueQualificationBatches")
  .addEdge("extractAndQueueQualificationBatches", "prepareNextBatchForQualification")

  // Conditional routing after trying to prepare the next batch
  .addConditionalEdges(
    "prepareNextBatchForQualification",
    routeForNextQualificationBatch,
    {
      "entityQualificationSubgraph": "entityQualificationSubgraph",
      "callModel": "callModel" // All batches processed, back to main model
    }
  )

  // After entityQualificationSubgraph runs, always go back to prepare the next batch
  // The prepareNextBatchForQualification node's router will decide if there are more batches
  // or if it's time to return to the main callModel.
  // The subgraph's internal routing (routeSubgraphOutput) is for its own conditional logic,
  // but its exit from the parent graph's perspective is now singular.
  // If the subgraph itself calls tools (via parent graph's 'tools' node), that's a separate concern.
  // For simplicity, assuming subgraph completes its current batch and returns.
  // We need to ensure the subgraph, when it "ends" or needs tools, correctly transitions.
  // The original subgraph routing was:
  // "tools": "callModel", "__end__": "callModel"
  // This needs careful thought. If subgraph calls tools, it would go through the parent's 'tools' node.
  // For now, let's assume the subgraph completes its processing for the batch and returns.
  // The simplest way is a direct edge.
  .addEdge("entityQualificationSubgraph", "prepareNextBatchForQualification")
  // If the subgraph itself uses tools (and is configured to use the parent's tool node),
  // the ToolNode's output would typically go back to the subgraph's entry or a re-evaluation point.
  // This part of the interaction depends on how `entityQualificationSubgraph` is structured
  // and how it's registered in the parent graph regarding tool usage.
  // The provided `routeModelOutput` (renamed to `routeSubgraphOutput`) was for the subgraph's
  // own decision making if it were a top-level graph. Here, it's a node.
  // If the subgraph needs to use parent tools, its AIMessage with tool_calls would appear in `state.messages`.
  // Then `prepareNextBatchForQualification` would try to prepare a batch (likely finding none if the subgraph just called a tool),
  // then `routeForNextQualificationBatch` would send to `callModel`.
  // `callModel` would see the subgraph's AIMessage with tool_calls and route to `tools`. This seems to handle it.

export const graph = workflow.compile({
  interruptBefore: [], 
  interruptAfter: [],
});
