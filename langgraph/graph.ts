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
      
      // Find the highest existing index to ensure continuous indexing
      let nextIndex = 0;
      if (current.length > 0) {
        const maxIndex = Math.max(...current.map(entity => entity.index));
        nextIndex = maxIndex + 1;
      }

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
        console.log(`Parent entities reducer: Added ${newEntities.length} new unique entities. Next index will be ${nextIndex}.`);
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

  listGenMessages: Annotation<BaseMessage[]>({
    reducer: (_currentState, updateValue) => updateValue,
    default: () => [],
  }),
  qualMessages: Annotation<BaseMessage[]>({
    reducer: (_currentState, updateValue) => updateValue,
    default: () => [],
  }),
  entitiesSent: Annotation<boolean>({
    reducer: (currentState, updateValue) => {
      const current = typeof currentState === "boolean" ? currentState : false;
      const update = typeof updateValue === "boolean" ? updateValue : false;
      return current || update;
    },
    default: () => false,
  }),
  lastSentSummaryCount: Annotation<number>({
    reducer: (currentState, updateValue) => {
      const current = typeof currentState === "number" ? currentState : 0;
      const update = typeof updateValue === "number" ? updateValue : 0;
      return Math.max(current, update);
    },
    default: () => 0,
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
  const model = (await loadChatModel(configuration.model)).bindTools(TOOLS).withRetry({ stopAfterAttempt: 3 }).withConfig({ tags: ["nostream"] });
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
    qualificationSummary = [],
  } = state;
  const batchSize = 5;
  const maxWorkers = 10;
  const totalEntities = entities?.length ?? 0;

  if (totalEntities === 0) {
    console.log("assignQualificationWorkers: No entities to process. Signaling __end__.");
    return "__end__";
  }

  // Create a set of qualified entity indices to determine what's already processed
  const qualifiedIndices = new Set(qualificationSummary.map(item => item.index));
  
  // Find all unprocessed entities up to the processedEntityCount target
  const unprocessedEntities: Entity[] = [];
  for (const entity of entities) {
    if (entity.index < processedEntityCount && !qualifiedIndices.has(entity.index)) {
      unprocessedEntities.push(entity);
    }
  }

  // If no unprocessed entities within our target range, check if we're completely done
  if (unprocessedEntities.length === 0) {
    // Check if ALL entities are processed (not just up to processedEntityCount)
    const allEntitiesProcessed = entities.every(entity => qualifiedIndices.has(entity.index));
    if (allEntitiesProcessed) {
      console.log("assignQualificationWorkers: All entities are qualified. Signaling __end__.");
      return "__end__";
    } else {
      console.log("assignQualificationWorkers: No unprocessed entities in current target range. Continuing without sends.");
      return [];
    }
  }

  // Sort unprocessed entities by index to process them in order
  unprocessedEntities.sort((a, b) => a.index - b.index);

  const sends: Send[] = [];
  let batchesSentInThisCall = 0;
  let currentBatchStart = 0;

  // Group unprocessed entities into batches
  while (currentBatchStart < unprocessedEntities.length && batchesSentInThisCall < maxWorkers) {
    const batchEnd = Math.min(currentBatchStart + batchSize, unprocessedEntities.length);
    const batchEntities = unprocessedEntities.slice(currentBatchStart, batchEnd).map((e) => ({
      index: e.index,
      name: e.name,
      url: e.url,
    }));

    if (batchEntities.length === 0) {
      break;
    }
    
    const batchNames = batchEntities.map((e) => e.name);
    const batchIndices = batchEntities.map((e) => e.index);
    const qualInstruction = `Please qualify the following entities: ${batchNames.join(", ")}. The qualification criteria are: ${qualificationCriteria}`;
    
    console.log(`assignQualificationWorkers: Dispatching batch for entity indices ${batchIndices.join(", ")}. Count: ${batchEntities.length}. Batches sent this call: ${batchesSentInThisCall + 1}`);
    sends.push(
      new Send("entityQualification", {
        entitiesToQualify: batchEntities,
        qualMessages: [new HumanMessage({ content: qualInstruction })],
        qualificationCriteria,
      }),
    );
    
    currentBatchStart = batchEnd;
    batchesSentInThisCall++;
  }
  
  if (sends.length === 0) {
    console.log(`assignQualificationWorkers: No sends made this cycle. Unprocessed entities: ${unprocessedEntities.length}, maxWorkers: ${maxWorkers}, batchesSentInThisCall: ${batchesSentInThisCall}`);
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
  async (state: ParentAppState, config: RunnableConfig, writer?: any) => {
    const update: Partial<ParentAppStateUpdate> = {};

    // 1. Emit full entity list once
    if (!state.entitiesSent && state.entities?.length && writer) {
      writer({ type: "gridUpdate", entities: state.entities });
      update.entitiesSent = true;
    }

    // 2. Emit incremental qualification summary updates
    const currentSummaryCount = state.qualificationSummary?.length ?? 0;
    const alreadySentCount = state.lastSentSummaryCount ?? 0;
    if (currentSummaryCount > alreadySentCount && writer) {
      const newQuals = state.qualificationSummary.slice(alreadySentCount);
      if (newQuals.length > 0) {
        writer({ type: "gridUpdate", qualificationSummary: newQuals });
        update.lastSentSummaryCount = currentSummaryCount;
      }
    }

    const batchSize = 5;
    const totalEntities = state.entities?.length ?? 0;
    const currentProcessedCount = state.processedEntityCount ?? 0;
    const qualificationSummary = state.qualificationSummary ?? [];

    // Debug logging to track state
    console.log('QualificationRouter state:', {
      entitiesCount: totalEntities,
      qualificationSummaryCount: qualificationSummary.length,
      processedEntityCount: currentProcessedCount,
      firstFewEntities: state.entities?.slice(0, 3).map(e => ({name: e.name, index: e.index, url: e.url})) ?? [],
      qualificationCriteria: state.qualificationCriteria,
    });
    
    // Create a set of qualified entity indices to check completion
    const qualifiedIndices = new Set(qualificationSummary.map(item => item.index));
    
    // Check if all entities are processed
    const allEntitiesQualified = state.entities?.every(entity => qualifiedIndices.has(entity.index)) ?? false;

    if (allEntitiesQualified && totalEntities > 0) {
      console.log("QualificationRouter: All entities are qualified. Signaling completion.");
      const doneMsg = new AIMessage({ content: "The search and qualification process is complete." });
      return { 
        parentMessages: [doneMsg],
      };
    }
    
    // Calculate the next processedEntityCount: how many entities *should* be processed
    // considering maxWorkers and batchSize. This is the upper limit for assignQualificationWorkers.
    const maxWorkers = 10;
    
    // Count how many entities are currently unqualified within our current target
    const unqualifiedInRange = state.entities?.filter(entity => 
      entity.index < currentProcessedCount && !qualifiedIndices.has(entity.index)
    ).length ?? 0;
    
    // Estimate active batches based on unqualified entities
    const estimatedActiveBatches = Math.ceil(unqualifiedInRange / batchSize);
    const availableCapacityForBatches = Math.max(0, maxWorkers - estimatedActiveBatches);
    
    let newProcessedEntityCount = currentProcessedCount;
    if (availableCapacityForBatches > 0 && currentProcessedCount < totalEntities) {
      // How many more entities can we aim to process with the available capacity?
      const entitiesToProcessWithCapacity = availableCapacityForBatches * batchSize;
      newProcessedEntityCount = Math.min(totalEntities, currentProcessedCount + entitiesToProcessWithCapacity);
    }
    
    if (newProcessedEntityCount > currentProcessedCount) {
      update.processedEntityCount = newProcessedEntityCount;
      console.log(`QualificationRouter: Updating processedEntityCount from ${currentProcessedCount} to ${newProcessedEntityCount}. Unqualified in current range: ${unqualifiedInRange}`);
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