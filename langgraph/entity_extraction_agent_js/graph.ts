import { AIMessage, BaseMessage, ToolMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { Annotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

import { ConfigurationSchema, ensureConfiguration } from "./configuration.js";
import { TOOLS } from "./tools.js";
import { loadChatModel } from "./utils.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Define the structure for an entity
interface Entity {
  name: string;
  url: string;
}

// Define the new state structure including entities
const AppStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (currentState, updateValue) => currentState.concat(updateValue),
    default: () => [],
  }),
  entities: Annotation<Entity[]>({
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

// Define the function that calls the model
async function callModel(
  state: AppState,
  config: RunnableConfig,
): Promise<AppStateUpdate> {
  /** Call the LLM powering our agent. **/
  const configuration = ensureConfiguration(config);

  const model = (await loadChatModel(configuration.model)).bindTools(TOOLS);

  let parsedEntitiesFromTool: Entity[] | undefined = undefined;
  if (state.messages.length > 0) {
    const lastMessageFromState = state.messages[state.messages.length - 1];

    // Check if it's a ToolMessage from extract_entities
    if (lastMessageFromState && lastMessageFromState.constructor.name === "ToolMessage") {
      const toolMessage = lastMessageFromState as ToolMessage;
      if (toolMessage.name === "extract_entities") {
        if (typeof toolMessage.content === 'string') {
          try {
            const toolOutput = JSON.parse(toolMessage.content);
            if (toolOutput.entities && Array.isArray(toolOutput.entities)) {
              // Ensure all extracted entities are objects with name and url
              parsedEntitiesFromTool = toolOutput.entities.filter(
                (entity: any): entity is Entity => 
                  typeof entity === 'object' &&
                  entity !== null &&
                  typeof entity.name === 'string' &&
                  typeof entity.url === 'string'
              );
            }
          } catch (e) {
            console.error(
              "Failed to parse entities from extract_entities tool message content:",
              toolMessage.content,
              e,
            );
          }
        } else {
            console.warn(
                "extract_entities tool message content was not a string:",
                toolMessage.content,
            );
        }
      }
    }
  }

  const response = await model.invoke([
    {
      role: "system",
      content: systemPrompt.replace(
        "{system_time}",
        new Date().toISOString(),
      ),
    },
    ...state.messages,
  ]);

  const update: AppStateUpdate = { messages: [response] };
  if (parsedEntitiesFromTool && parsedEntitiesFromTool.length > 0) {
    // The reducer for 'entities' expects the new array of items to add/concat.
    update.entities = parsedEntitiesFromTool;
  }
  return update;
}

// Define the function that determines whether to continue or not
function routeModelOutput(state: AppState): string {
  const messages = state.messages;
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
  .addNode("callModel", callModel)
  .addNode("tools", new ToolNode(TOOLS))
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
