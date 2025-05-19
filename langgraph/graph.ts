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
import { AIMessage, ToolMessage, HumanMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";

// Define the structure for an entity by extending the imported one
interface Entity extends ListGenEntityInterface {}

// Alias for imported qualification item type
type QualificationItem = EQQualificationItem;

// Define the parent graph's state structure
const ParentAppStateAnnotation = Annotation.Root({
  parentMessages: Annotation<BaseMessage[]>({
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
  // Add annotations for subgraph messages
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

// Wrapper for the parent graph's ToolNode
async function parentAgentToolsNode(state: ParentAppState, config?: RunnableConfig): Promise<Partial<ParentAppStateUpdate>> {
  const lastMessage = state.parentMessages[state.parentMessages.length - 1];
  let messageForToolNode: AIMessage;

  if (!lastMessage) {
    console.error("parentAgentToolsNode: No last message found in parentMessages.");
    throw new Error("parentAgentToolsNode: No last message found.");
  }

  if (lastMessage instanceof AIMessage) {
    if (!lastMessage.tool_calls || lastMessage.tool_calls.length === 0) {
      console.error("parentAgentToolsNode: AIMessage received, but no tool_calls found.", lastMessage);
      throw new Error("parentAgentToolsNode: AIMessage received, but no tool_calls found.");
    }
    messageForToolNode = lastMessage;
  } else if (typeof lastMessage === 'object' && lastMessage !== null && 'tool_calls' in lastMessage && Array.isArray((lastMessage as any).tool_calls) && (lastMessage as any).tool_calls.length > 0) {
    // This is likely an AIMessageChunk or a similar structure with tool_calls.
    console.log("parentAgentToolsNode: Detected AIMessageChunk-like object with tool_calls. Converting to AIMessage for ToolNode.");
    let extractedTextContent = "";
    if (typeof lastMessage.content === 'string') {
      extractedTextContent = lastMessage.content;
    } else if (Array.isArray(lastMessage.content)) {
      for (const part of lastMessage.content) {
        if (typeof part === 'object' && part !== null && part.type === 'text' && typeof (part as any).text === 'string') {
          extractedTextContent += (part as any).text + "\n";
        }
      }
      extractedTextContent = extractedTextContent.trim();
    }
    const chunk = lastMessage as any;
    messageForToolNode = new AIMessage({
      content: extractedTextContent || "",
      tool_calls: chunk.tool_calls,
      ...(chunk.invalid_tool_calls && { invalid_tool_calls: chunk.invalid_tool_calls }),
      ...(chunk.id && { id: chunk.id }),
      ...(chunk.additional_kwargs && { additional_kwargs: chunk.additional_kwargs }),
      ...(chunk.response_metadata && { response_metadata: chunk.response_metadata }),
      ...(chunk.usage_metadata && { usage_metadata: chunk.usage_metadata }),
    });
  } else {
    console.error("parentAgentToolsNode: Last message is not an AIMessage or a compatible AIMessageChunk with tool_calls.", lastMessage);
    throw new Error("parentAgentToolsNode: Last message is not an AIMessage or a compatible AIMessageChunk with tool_calls.");
  }

  const toolExecutor = new ToolNode(TOOLS);
  const toolExecutorOutput = await toolExecutor.invoke({ messages: [messageForToolNode] }, config);

  const toolMessages = toolExecutorOutput.messages as ToolMessage[];
  let newQualificationCriteria: string | undefined = undefined;

  for (const toolMessage of toolMessages) {
    if (toolMessage.name === "update_qualification_criteria") {
      if (typeof toolMessage.content === 'string') {
        try {
          const toolOutput = JSON.parse(toolMessage.content);
          if (toolOutput.qualificationCriteria && typeof toolOutput.qualificationCriteria === 'string') {
            newQualificationCriteria = toolOutput.qualificationCriteria;
          }
        } catch (e) {
          console.error("Failed to parse qualificationCriteria from update_qualification_criteria tool message in parentAgentToolsNode:", toolMessage.content, e);
        }
      }
    }
  }

  const update: Partial<ParentAppStateUpdate> = { parentMessages: toolMessages };
  if (newQualificationCriteria !== undefined) {
    update.qualificationCriteria = newQualificationCriteria;
  }
  return update;
}

// Define the function that calls the agent model
async function callAgentModel(state: ParentAppState, config: RunnableConfig): Promise<ParentAppStateUpdate> {
  const configuration = ensureConfiguration(config);
  const model = (await loadChatModel(configuration.model)).bindTools(TOOLS);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const systemPromptPath = path.join(__dirname, "system_prompt.md");
  const systemPrompt = fs.readFileSync(systemPromptPath, "utf-8");

  const response = await model.invoke([
    { role: "system", content: systemPrompt.replace("{system_time}", new Date().toISOString()) },
    ...state.parentMessages,
  ]);

  const update: Partial<ParentAppStateUpdate> = { parentMessages: [response] };

  // Check if this response will lead to a subgraph directly (e.g., listGeneration)
  const hasToolCalls = ((response as AIMessage)?.tool_calls?.length || 0) ||
                       ((response as any)?.tool_call_chunks?.length || 0);

  if (!hasToolCalls) {
    let initialContentForListGen = "";
    if (typeof response.content === 'string') {
      initialContentForListGen = response.content;
    } else if (Array.isArray(response.content)) {
      for (const part of response.content) {
        if (typeof part === 'object' && part !== null && part.type === 'text' && typeof (part as any).text === 'string') {
          initialContentForListGen += (part as any).text + "\n";
        }
      }
      initialContentForListGen = initialContentForListGen.trim();
    }
    const humanMessageContent = initialContentForListGen || "Please proceed based on the previous instruction from the parent agent.";
    update.listGenMessages = [new HumanMessage({ content: humanMessageContent })];
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

// New node function for entity processing
async function entityProcessingNode(state: ParentAppState, _config?: RunnableConfig): Promise<Partial<ParentAppStateUpdate>> {
  const { entities, processedEntityCount = 0, qualificationCriteria } = state;
  const batchSize = 25;

  let newParentMessages: BaseMessage[] = []; // Messages for parentMessages history

  if (!entities || entities.length === 0) {
    newParentMessages.push(new AIMessage("No entities were generated to qualify. Skipping qualification."));
    return {
        entitiesToQualify: [],
        processedEntityCount: 0,
        parentMessages: newParentMessages,
        qualMessages: [], // Clear/initialize qualMessages
    };
  }

  if (processedEntityCount >= entities.length) {
    newParentMessages.push(new AIMessage("All entities have been processed for qualification."));
    return {
        entitiesToQualify: [],
        parentMessages: newParentMessages,
        qualMessages: [], // Clear/initialize qualMessages
        // processedEntityCount remains at entities.length
    };
  }

  const nextBatchEndIndex = Math.min(processedEntityCount + batchSize, entities.length);
  const batchToQualifyObjects = entities.slice(processedEntityCount, nextBatchEndIndex);
  const batchEntityNamesToQualify = batchToQualifyObjects.map((entity: Entity) => entity.name);

  newParentMessages.push(new AIMessage(
    `Preparing batch of ${batchEntityNamesToQualify.length} entity names for qualification (processing ${processedEntityCount + 1}-${nextBatchEndIndex} of ${entities.length} total).`
  ));

  const update: Partial<ParentAppStateUpdate> = {
    entitiesToQualify: batchEntityNamesToQualify,
    processedEntityCount: nextBatchEndIndex,
    parentMessages: newParentMessages,
  };

  if (batchEntityNamesToQualify.length > 0) {
    const qualInstruction = `Please qualify the following entities: ${batchEntityNamesToQualify.join(", ")}. The qualification criteria are: ${qualificationCriteria}`;
    update.qualMessages = [new HumanMessage({ content: qualInstruction })];
  } else {
    update.qualMessages = []; // Should not happen if entities exist, but good for consistency
  }

  return update;
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
parentWorkflow.addNode("agentTools", parentAgentToolsNode);

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
