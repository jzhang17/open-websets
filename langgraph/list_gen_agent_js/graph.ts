import { AIMessage, BaseMessage, ToolMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { Annotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { RunnableLambda } from "@langchain/core/runnables";

import { ConfigurationSchema, ensureConfiguration } from "./configuration.js";
import { TOOLS } from "./tools.js";
import { loadChatModelWithRetry as loadChatModel } from "./chatModelWithRetry.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Define the structure for an entity (now raw, without index)
export interface Entity {
  name: string;
  url: string;
}

// Define the EntityType enum
export enum EntityType {
  PEOPLE = "people",
  COMPANIES = "companies",
  ACADEMIC_PAPERS = "academic papers",
  NEWS = "news",
}

// Define the new state structure including entities
const AppStateAnnotation = Annotation.Root({
  listGenMessages: Annotation<BaseMessage[]>({
    reducer: (currentState, updateValue) => currentState.concat(updateValue),
    default: () => [],
  }),
  entities: Annotation<Entity[]>({
    reducer: (currentState, updateValue) => {
      const current = Array.isArray(currentState) ? currentState : [];
      const update = Array.isArray(updateValue) ? updateValue : [];
      
      // Create a set of existing entity URLs to check for duplicates
      const existingUrls = new Set(current.map(entity => entity.url));
      
      // Filter out duplicates from the update based on URL
      const newEntities = update.filter(entity => {
        if (!entity || typeof entity.url !== 'string') {
          return false; // Skip invalid entities
        }
        const isDuplicate = existingUrls.has(entity.url);
        if (isDuplicate) {
          console.log(`List gen subgraph: Preventing duplicate entity with URL ${entity.url}: ${entity.name}`);
        }
        return !isDuplicate;
      });
      
      return current.concat(newEntities);
    },
    default: () => [],
  }),
  qualificationCriteria: Annotation<string>({
    reducer: (_currentState, updateValue) => updateValue,
    default: () => "",
  }),
  entityTypes: Annotation<EntityType[]>({
    reducer: (currentState, updateValue) => currentState.concat(updateValue),
    default: () => [],
  }),
});

type AppState = typeof AppStateAnnotation.State;
type AppStateUpdate = typeof AppStateAnnotation.Update;

// Load the system prompt from the markdown file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const systemPromptPath = path.join(__dirname, "system_prompt.md");
const systemPrompt = fs.readFileSync(systemPromptPath, "utf-8");

// Wrapper for this subgraph's ToolNode
async function listGenToolsNode(
  state: AppState,
  config?: RunnableConfig,
): Promise<Partial<AppStateUpdate>> {
  const lastMessage = state.listGenMessages[state.listGenMessages.length - 1];
  let messageForToolNode: AIMessage;

  if (!lastMessage) {
    throw new Error("listGenToolsNode: No last message found.");
  }

  if (lastMessage instanceof AIMessage) {
    if (!lastMessage.tool_calls || lastMessage.tool_calls.length === 0) {
      throw new Error(
        "listGenToolsNode: AIMessage received, but no tool_calls found.",
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
    // AIMessageChunk-like object
    const chunk = lastMessage as any;
    let extractedTextContent = "";
    if (typeof chunk.content === "string") {
      extractedTextContent = chunk.content;
    } else if (Array.isArray(chunk.content)) {
      for (const part of chunk.content) {
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
    throw new Error(
      "listGenToolsNode: Last message is not an AIMessage or a compatible AIMessageChunk with tool_calls.",
    );
  }

  const toolExecutor = new ToolNode(TOOLS);
  const toolExecutorOutput = await toolExecutor.invoke(
    { messages: [messageForToolNode] },
    config,
  );
  const toolMessages = toolExecutorOutput.messages as ToolMessage[];
  let newEntities: { name: string; url: string }[] | undefined = undefined;

  for (const toolMessage of toolMessages) {
    if (toolMessage.name === "extract_entities") {
      if (typeof toolMessage.content === "string") {
        try {
          const toolOutput = JSON.parse(toolMessage.content);
          if (toolOutput.entities && Array.isArray(toolOutput.entities)) {
            newEntities = toolOutput.entities.filter(
              (e: any) =>
                typeof e === "object" &&
                e !== null &&
                typeof e.name === "string" &&
                typeof e.url === "string",
            );
          }
        } catch (e) {
          console.error(
            "Failed to parse entities from extract_entities tool message content:",
            toolMessage.content,
            e,
          );
        }
      }
    }
  }

  const update: Partial<AppStateUpdate> = {
    listGenMessages: toolMessages,
  };

  if (newEntities && newEntities.length > 0) {
    update.entities = newEntities;
  }

  return update;
}

// Define the function that calls the model
async function callModel(
  state: AppState,
  config: RunnableConfig,
): Promise<AppStateUpdate> {
  /** Call the LLM powering our agent. **/
  const configuration = ensureConfiguration(config);

  const model = (await loadChatModel(configuration.model)).bindTools(TOOLS).withRetry({ stopAfterAttempt: 3 }).withConfig({ tags: ["nostream"] });

  const response = await model.invoke([
    {
      role: "system",
      content: systemPrompt.replace("{system_time}", new Date().toISOString()),
    },
    ...state.listGenMessages,
  ]);

  return { listGenMessages: [response] };
}

// Define the function that determines whether to continue or not
function routeModelOutput(state: AppState): string {
  const messages = state.listGenMessages;
  const lastMessage = messages[messages.length - 1];
  // If the LLM is invoking tools, route there.
  if (((lastMessage as AIMessage)?.tool_calls?.length || 0) > 0) {
    return "tools";
  }
  // Otherwise end the graph.
  else {
    return "__end__";
  }
}

// Define a new graph. We use the prebuilt MessagesAnnotation to define state:
// https://langchain-ai.github.io/langgraphjs/concepts/low_level/#messagesannotation
const workflow = new StateGraph(AppStateAnnotation, ConfigurationSchema)
  // Define the two nodes we will cycle between
  .addNode("callModel", RunnableLambda.from(callModel))
  .addNode("tools", RunnableLambda.from(listGenToolsNode))
  // Set the entrypoint as `callModel`
  // This means that this node is the first one called
  .addEdge("__start__", "callModel")
  .addConditionalEdges(
    // First, we define the edges' source node. We use `callModel`.
    // This means these are the edges taken after the `callModel` node is called.
    "callModel",
    // Next, we pass in the function that will determine the sink node(s), which
    // will be called after the source node is called.
    routeModelOutput,
  )
  // This means that after `tools` is called, `callModel` node is called next.
  .addEdge("tools", "callModel");

// Finally, we compile it!
// This compiles it into a graph you can invoke and deploy.
export const graph = workflow.compile({
  interruptBefore: [], // if you want to update the state before calling the tools
  interruptAfter: [],
});
