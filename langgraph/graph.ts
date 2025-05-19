import { BaseMessage } from "@langchain/core/messages";
import { Annotation, StateGraph, START } from "@langchain/langgraph";
import { graph as listGenerationGraph, EntityType as ListGenEntityType, type Entity as ListGenEntityInterface } from "./list_gen_agent_js/graph.js";
import { graph as entityQualificationGraph, type QualificationItem as EQQualificationItem } from "./entity_qualification_agent_js/graph.js";

// New imports for the root agent
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ConfigurationSchema, ensureConfiguration } from "./configuration.js";
import { TOOLS } from "./tools.js";
import { loadChatModel } from "./utils.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { AIMessage, ToolMessage } from "@langchain/core/messages";

// Define the structure for an entity by extending the imported one
interface Entity extends ListGenEntityInterface {}

// Alias for imported qualification item type
type QualificationItem = EQQualificationItem;

// Define the parent graph's state structure
const ParentAppStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (currentState, updateValue) => currentState.concat(updateValue),
    default: () => [],
  }),
  entities: Annotation<Entity[]>({
    reducer: (_currentState, updateValue) => updateValue,
    default: () => [],
  }),
  qualificationCriteria: Annotation<string>({
    reducer: (_currentState, updateValue) => updateValue,
    default: () => "",
  }),
  // Use the imported ListGenEntityType
  entityTypes: Annotation<ListGenEntityType[]>({
    reducer: (_currentState, updateValue) => updateValue,
    default: () => [],
  }),
  // This now uses the aliased QualificationItem type from EQQualificationItem
  qualificationSummary: Annotation<QualificationItem[]>({
    reducer: (currentState, updateValue) => {
      // Ensure both are arrays before concatenating
      const current = Array.isArray(currentState) ? currentState : [];
      const update = Array.isArray(updateValue) ? updateValue : [];
      return current.concat(update);
    },
    default: () => [],
  }),
  entitiesToQualify: Annotation<string[]>({
    reducer: (_currentState, updateValue) => updateValue,
    default: () => [],
  }),
  processedEntityCount: Annotation<number>({
    reducer: (_currentState, updateValue) => updateValue,
    default: () => 0,
  }),
});

// Define the function that calls the agent model
async function callAgentModel(state: any, config: any) {
  const configuration = ensureConfiguration(config);
  const model = (await loadChatModel(configuration.model)).bindTools(TOOLS);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const systemPromptPath = path.join(__dirname, "system_prompt.md");
  const systemPrompt = fs.readFileSync(systemPromptPath, "utf-8");

  let parsedQualificationCriteria: string | undefined = undefined;
  if (state.messages.length > 0) {
    const lastMessageFromState = state.messages[state.messages.length - 1];
    if (lastMessageFromState && lastMessageFromState.constructor.name === "ToolMessage") {
      const toolMessage = lastMessageFromState as ToolMessage;
      if (toolMessage.name === "update_qualification_criteria") {
        if (typeof toolMessage.content === 'string') {
          try {
            const toolOutput = JSON.parse(toolMessage.content);
            if (toolOutput.qualificationCriteria && typeof toolOutput.qualificationCriteria === 'string') {
              parsedQualificationCriteria = toolOutput.qualificationCriteria;
            }
          } catch (e) {
            console.error(
              "Failed to parse qualificationCriteria from update_qualification_criteria tool message content:",
              toolMessage.content,
              e,
            );
          }
        } else {
          console.warn(
            "update_qualification_criteria tool message content was not a string:",
            toolMessage.content,
          );
        }
      }
    }
  }

  const response = await model.invoke([
    { role: "system", content: systemPrompt.replace("{system_time}", new Date().toISOString()) },
    ...state.messages,
  ]);

  const update: any = { messages: [response] };
  if (parsedQualificationCriteria !== undefined) {
    update.qualificationCriteria = parsedQualificationCriteria;
  }
  return update;
}

// Define routing logic for the agent node
function routeAgentModelOutput(state: any) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1];
  if (((lastMessage as AIMessage)?.tool_calls?.length || 0) > 0) {
    return "agentTools";
  }
  return "listGeneration";
}

// New node function for entity processing
async function entityProcessingNode(state: any) {
  const { entities, processedEntityCount = 0 } = state;
  const batchSize = 25;

  let newMessages: BaseMessage[] = [];

  if (!entities || entities.length === 0) {
    newMessages.push(new AIMessage("No entities were generated to qualify. Skipping qualification."));
    return {
        entitiesToQualify: [], // No batch to qualify
        processedEntityCount: 0,
        messages: newMessages,
    };
  }

  if (processedEntityCount >= entities.length) {
    newMessages.push(new AIMessage("All entities have been processed for qualification."));
    return {
        entitiesToQualify: [], // No more entities in this batch to qualify
        messages: newMessages,
        // processedEntityCount remains at entities.length, or could be reset if graph ends immediately
    };
  }

  const nextBatchEndIndex = Math.min(processedEntityCount + batchSize, entities.length);
  const batchToQualifyObjects = entities.slice(processedEntityCount, nextBatchEndIndex); // This is Entity[]
  const batchEntityNamesToQualify = batchToQualifyObjects.map((entity: Entity) => entity.name); // Extract names

  newMessages.push(new AIMessage(
    `Preparing batch of ${batchEntityNamesToQualify.length} entity names for qualification (processing ${processedEntityCount + 1}-${nextBatchEndIndex} of ${entities.length} total).`
  ));

  return {
    entitiesToQualify: batchEntityNamesToQualify, // Pass only names
    processedEntityCount: nextBatchEndIndex, // Update to the count of entities processed so far
    messages: newMessages,
  };
}

// New conditional routing function after entityProcessingNode
function routeAfterEntityProcessing(state: any) {
  if (state.entitiesToQualify && state.entitiesToQualify.length > 0) {
    // There's a batch prepared by entityProcessingNode
    return "entityQualification";
  }
  // No more batches to process, or no entities to begin with
  return "__end__";
}

// Build parent workflow
const parentWorkflow = new StateGraph(ParentAppStateAnnotation, ConfigurationSchema);

// Add the root agent nodes
parentWorkflow.addNode("agent", callAgentModel);
parentWorkflow.addNode("agentTools", new ToolNode(TOOLS));

// Add subgraph nodes
parentWorkflow.addNode("listGeneration", listGenerationGraph);
parentWorkflow.addNode("entityProcessing", entityProcessingNode);
parentWorkflow.addNode("entityQualification", entityQualificationGraph as any);

// Define workflow edges
parentWorkflow.addEdge(START, "agent" as any);
parentWorkflow.addConditionalEdges("agent" as any, routeAgentModelOutput);
parentWorkflow.addEdge("agentTools" as any, "agent" as any);

// Modified and new edges for entity processing loop
parentWorkflow.addEdge("listGeneration" as any, "entityProcessing" as any);

parentWorkflow.addConditionalEdges(
  "entityProcessing" as any,
  routeAfterEntityProcessing
);

parentWorkflow.addEdge("entityQualification" as any, "entityProcessing" as any);

// Compile and export the workflow
export const graph = parentWorkflow.compile();

// End of parent graph definition
