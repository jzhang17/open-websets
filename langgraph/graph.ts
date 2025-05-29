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

// Parent graph's Entity interface includes an index
interface Entity extends ListGenEntityInterface { 
  index: number; 
}

type QualificationItem = EQQualificationItem;

// Define the parent graph's state structure
const ParentAppStateAnnotation = Annotation.Root({
  parentMessages: Annotation<BaseMessage[]>({
    reducer: (currentState, updateValue) => currentState.concat(updateValue),
    default: () => [],
  }),
  entities: Annotation<Entity[]>({
    reducer: (currentState, updateValue: ListGenEntityInterface[]) => {
      // Ensure both are arrays before processing
      let current = Array.isArray(currentState) ? currentState : [];
      const update = Array.isArray(updateValue) ? updateValue : [];

      // Create a map of existing entities by URL to check for duplicates
      const existingUrls = new Set(current.map(entity => entity.url));
      let nextIndex = current.length;

      const newEntities: Entity[] = [];
      update.forEach(rawEntity => {
        if (!rawEntity || typeof rawEntity.url !== 'string' || typeof rawEntity.name !== 'string') {
          console.log("Parent entities reducer: Skipping invalid raw entity", rawEntity);
          return;
        }
        if (!existingUrls.has(rawEntity.url)) {
          newEntities.push({
            name: rawEntity.name,
            url: rawEntity.url,
            index: nextIndex,
          });
          existingUrls.add(rawEntity.url);
          nextIndex++;
        } else {
          console.log(`Parent entities reducer: Preventing duplicate entity with URL ${rawEntity.url}: ${rawEntity.name}`);
        }
      });

      if (newEntities.length > 0) {
        console.log(`Parent entities reducer: Added ${newEntities.length} new unique entities.`);
      }
      
      return current.concat(newEntities);
    },
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
      // Ensure both are arrays before processing
      const current = Array.isArray(currentState) ? currentState : [];
      const update = Array.isArray(updateValue) ? updateValue : [];
      
      // Create a map of existing qualification items by index to check for duplicates
      const existingQualificationMap = new Map();
      current.forEach(item => {
        if (item && typeof item.index === 'number') {
          existingQualificationMap.set(item.index, item);
        }
      });
      
      // Filter out duplicates from the update based on index, but allow updates to existing items
      const newItems: QualificationItem[] = [];
      update.forEach(item => {
        if (item && typeof item.index === 'number') {
          // Always add the item (this allows updating existing qualifications)
          // Remove the existing item first if it exists
          if (existingQualificationMap.has(item.index)) {
            // We'll handle the replacement by filtering current items
            existingQualificationMap.set(item.index, item);
          } else {
            newItems.push(item);
          }
        }
      });
      
      // Filter current items to remove those that are being updated
      const updatedIndexes = new Set(update.filter(item => item && typeof item.index === 'number').map(item => item.index));
      const filteredCurrent = current.filter(item => !updatedIndexes.has(item.index));
      
      return filteredCurrent.concat(update);
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
  const model = (await loadChatModel(configuration.model)).bindTools(TOOLS).withRetry({ stopAfterAttempt: 3 });
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
function assignQualificationWorkers(state: ParentAppState): Send[] | "__end__" {
  const {
    entities,
    processedEntityCount = 0, // Target up to which entities should be processed (set by router)
    qualificationCriteria,
    finishedBatches = 0,
  } = state;
  const batchSize = 15;
  const maxWorkers = 4; // Max concurrent subgraphs we want to dispatch from this node in one go
  const totalEntities = entities?.length ?? 0;

  // If all entities are genuinely finished, signal end. This is a primary termination path.
  if (finishedBatches * batchSize >= totalEntities && totalEntities > 0) {
    console.log("assignQualificationWorkers: All entities covered by finished batches. Signaling __end__.");
    return "__end__";
  }
  if (totalEntities === 0) {
    console.log("assignQualificationWorkers: No entities to process. Signaling __end__.");
    return "__end__";
  }

  const sends: Send[] = [];
  let currentStartIndexForBatch = finishedBatches * batchSize;
  let batchesSentInThisCall = 0;

  // Loop while:
  // 1. The start of our next potential batch is less than the total entities.
  // 2. The start of our next potential batch is less than the target 'processedEntityCount'.
  // 3. We haven't sent 'maxWorkers' batches in this current invocation.
  while (
    currentStartIndexForBatch < totalEntities &&
    currentStartIndexForBatch < processedEntityCount &&
    batchesSentInThisCall < maxWorkers
  ) {
    const start = currentStartIndexForBatch;
    // Batch should not go beyond totalEntities or the processedEntityCount target
    const end = Math.min(start + batchSize, totalEntities, processedEntityCount);

    if (start >= end) { 
      console.log(`assignQualificationWorkers: Breaking loop due to start (${start}) >= end (${end}). This might occur if processedEntityCount aligns with a batch boundary already covered by finishedBatches, or if processedEntityCount is less than currentStartIndexForBatch.`);
      break;
    }

    const batchEntities = entities.slice(start, end).map((e) => ({
      index: e.index,
      name: e.name,
      url: e.url,
    }));

    if (batchEntities.length === 0) {
      console.log(`assignQualificationWorkers: Empty batch slice from ${start} to ${end}. Advancing start index.`);
      currentStartIndexForBatch = end; // Ensure progress past this empty segment
      continue;
    }
    
    const batchNames = batchEntities.map((e) => e.name);
    const qualInstruction = `Please qualify the following entities: ${batchNames.join(", ")}. The qualification criteria are: ${qualificationCriteria}`;
    
    console.log(`assignQualificationWorkers: Dispatching batch for entities from index ${start} to ${end-1}. Count: ${batchEntities.length}. Batches sent this call: ${batchesSentInThisCall + 1}`);
    sends.push(
      new Send("entityQualification", {
        entitiesToQualify: batchEntities,
        qualMessages: [new HumanMessage({ content: qualInstruction })],
        qualificationCriteria,
      }),
    );
    currentStartIndexForBatch = end; // Move to the start of the next potential batch
    batchesSentInThisCall++;
  }
  
  if (sends.length === 0) {
      console.log(`assignQualificationWorkers: No sends made this cycle. Conditions: currentStartIndexForBatch=${currentStartIndexForBatch}, processedEntityCount=${processedEntityCount}, totalEntities=${totalEntities}, batchesSentInThisCall (target was < maxWorkers)=${batchesSentInThisCall}`);
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
parentWorkflow.addNode("listGeneration", listGenerationGraph as any);
parentWorkflow.addNode(
  "qualificationRouter",
  async (state: ParentAppState, config: RunnableConfig) => {
    const batchSize = 15; // Ensure this is consistent
    const totalEntities = state.entities?.length ?? 0;
    const currentProcessedCount = state.processedEntityCount ?? 0;
    const finishedBatchesCount = state.finishedBatches ?? 0;

    // Debug logging to track state
    console.log('QualificationRouter state:', {
      entitiesCount: totalEntities,
      qualificationSummaryCount: state.qualificationSummary?.length ?? 0,
      processedEntityCount: currentProcessedCount,
      finishedBatches: finishedBatchesCount,
      firstFewEntities: state.entities?.slice(0, 3).map(e => ({name: e.name, index: e.index, url: e.url})) ?? [],
      qualificationCriteria: state.qualificationCriteria,
    });
    
    // Check if all entities are processed and all dispatched batches are finished
    const allDispatchedBatchesFinished = finishedBatchesCount * batchSize >= currentProcessedCount;
    const allEntitiesAccountedFor = currentProcessedCount >= totalEntities;

    if (allEntitiesAccountedFor && allDispatchedBatchesFinished) {
      console.log("QualificationRouter: All entities processed and batches finished. Signaling completion.");
      const doneMsg = new AIMessage({ content: "The search and qualification process is complete." });
      return { 
        parentMessages: [doneMsg],
        // No change to processedEntityCount needed here, it's already >= totalEntities
      };
    }
    
    // Calculate the next processedEntityCount: how many entities *should* be processed
    // considering maxWorkers and batchSize. This is the upper limit for assignQualificationWorkers.
    const maxWorkers = 4;
    const activeBatches = Math.ceil(currentProcessedCount / batchSize) - finishedBatchesCount;
    const availableCapacityForBatches = Math.max(0, maxWorkers - activeBatches);
    
    let newProcessedEntityCount = currentProcessedCount;
    if (availableCapacityForBatches > 0 && currentProcessedCount < totalEntities) {
      // How many more entities can we aim to process with the available capacity?
      const entitiesToProcessWithCapacity = availableCapacityForBatches * batchSize;
      newProcessedEntityCount = Math.min(totalEntities, currentProcessedCount + entitiesToProcessWithCapacity);
    }
    
    const update: Partial<ParentAppStateUpdate> = {};
    if (newProcessedEntityCount > currentProcessedCount) {
      update.processedEntityCount = newProcessedEntityCount;
      console.log(`QualificationRouter: Updating processedEntityCount from ${currentProcessedCount} to ${newProcessedEntityCount}`);
    }

    return update; // Return potential update to processedEntityCount
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
  "qualificationRouter" as any,
);

// Compile and export the workflow
export const graph = parentWorkflow.compile();