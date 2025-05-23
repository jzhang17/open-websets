import {
  AIMessage,
  BaseMessage,
  SystemMessage,
  HumanMessage,
} from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { RunnableLambda } from "@langchain/core/runnables";
import { Annotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

import { ConfigurationSchema, ensureConfiguration } from "./configuration.js";
import {
  AGENT_TOOLS,
  VERIFICATION_LLM_TOOLS,
  verifyQualificationConsistencyTool,
} from "./tools.js";
import { type Entity } from "../list_gen_agent_js/graph.js";
import { loadChatModelWithRetry as loadChatModel } from "./chatModelWithRetry.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Define the structure for an individual qualification item
export interface QualificationItem {
  index: number;
  entity_name: string;
  qualified: boolean;
  reasoning: string;
  [key: string]: any; // allow extra fields
}

// Define the EntityType enum (mirroring list_gen_agent_js)
export enum EntityType {
  PEOPLE = "people",
  COMPANIES = "companies",
  ACADEMIC_PAPERS = "academic papers",
  NEWS = "news",
}

// Define the new state structure including entities
const AppStateAnnotation = Annotation.Root({
  qualMessages: Annotation<BaseMessage[]>({
    reducer: (currentMessages, newMessages) =>
      currentMessages.concat(newMessages),
    default: () => [],
  }),
  entitiesToQualify: Annotation<Entity[]>({
    reducer: (currentState, updateValue) => {
      if (Array.isArray(updateValue)) {
        return currentState.concat(updateValue);
      }
      if (updateValue && typeof updateValue === "object") {
        return currentState.concat([updateValue as Entity]);
      }
      return currentState;
    },
    default: () => [],
  }),
  qualificationSummary: Annotation<QualificationItem[]>({
    reducer: (
      _currentState: QualificationItem[] | undefined,
      updateValue: QualificationItem | QualificationItem[] | undefined,
    ): QualificationItem[] => {
      // The tool is expected to return an array for 'qualificationSummary' key.
      if (Array.isArray(updateValue)) {
        return updateValue; // Replace with the new array
      }
      // If updateValue is not an array (e.g., undefined from other operations or a single item which is not expected from this tool for this key)
      // then return an empty array, effectively clearing or resetting if the update is invalid for replacement.
      return [];
    },
    default: () => [],
  }),
  verificationResults: Annotation<Record<string, any>>({
    reducer: (_currentState, updateValue) => updateValue, // Simple replace
    default: () => ({}),
  }),
  verificationLoopCount: Annotation<number>({
    reducer: (_currentState, updateValue) =>
      typeof updateValue === "number" ? updateValue : 0,
    default: () => 0,
  }),
  // Used to signal from verification back to main agent if entities are missing
  continueQualificationSignal: Annotation<boolean>({
    reducer: (_currentState, updateValue) =>
      typeof updateValue === "boolean" ? updateValue : false,
    default: () => false,
  }),
  // Add qualificationCriteria and entityTypes here
  qualificationCriteria: Annotation<string>({
    reducer: (_currentState, updateValue) => updateValue, // Replace strategy
    default: () => "",
  }),
  entityTypes: Annotation<EntityType[]>({
    // Use the newly defined enum
    reducer: (currentState, updateValue) => currentState.concat(updateValue), // Concat strategy
    default: () => [],
  }),
  processedEntityCount: Annotation<number>({
    reducer: (currentState, updateValue) =>
      typeof updateValue === "number" ? updateValue : currentState,
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
});

type AppState = typeof AppStateAnnotation.State;
type AppStateUpdate = typeof AppStateAnnotation.Update;

// Load prompts from markdown files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const systemPromptPath = path.join(__dirname, "system_prompt.md");
const systemPrompt = fs.readFileSync(systemPromptPath, "utf-8");
const verificationPromptPath = path.join(
  __dirname,
  "verification_prompt_template.md",
);
const verificationPromptTemplate = fs.readFileSync(
  verificationPromptPath,
  "utf-8",
);

const MAX_VERIFICATION_LOOPS = 5;

// Helper to create an AIMessage from a chunk or ensure it's a valid AIMessage for ToolNode
function prepareMessageForToolNode(
  lastMessage: BaseMessage | undefined,
  nodeName: string,
): AIMessage {
  if (!lastMessage) {
    throw new Error(`${nodeName}: No last message found.`);
  }

  if (lastMessage instanceof AIMessage) {
    if (!lastMessage.tool_calls || lastMessage.tool_calls.length === 0) {
      throw new Error(
        `${nodeName}: AIMessage received, but no tool_calls found.`,
      );
    }
    return lastMessage;
  } else if (
    typeof lastMessage === "object" &&
    lastMessage !== null &&
    "tool_calls" in lastMessage &&
    Array.isArray((lastMessage as any).tool_calls) &&
    (lastMessage as any).tool_calls.length > 0
  ) {
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
    return new AIMessage({
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
      `${nodeName}: Last message is not an AIMessage or a compatible AIMessageChunk with tool_calls.`,
    );
  }
}

// Wrapper for agentToolsNode
async function wrappedAgentToolsNode(
  state: AppState,
  config?: RunnableConfig,
): Promise<Partial<AppStateUpdate>> {
  const lastMessage = state.qualMessages[state.qualMessages.length - 1];
  const messageForToolNode = prepareMessageForToolNode(
    lastMessage,
    "wrappedAgentToolsNode",
  );
  const toolExecutor = new ToolNode(AGENT_TOOLS);
  const toolExecutorOutput = await toolExecutor.invoke(
    { messages: [messageForToolNode] },
    config,
  );
  return { qualMessages: toolExecutorOutput.messages };
}

// Wrapper for verificationToolsNode
async function wrappedVerificationToolsNode(
  state: AppState,
  config?: RunnableConfig,
): Promise<Partial<AppStateUpdate>> {
  const lastMessage = state.qualMessages[state.qualMessages.length - 1];
  const messageForToolNode = prepareMessageForToolNode(
    lastMessage,
    "wrappedVerificationToolsNode",
  );
  const toolExecutor = new ToolNode(VERIFICATION_LLM_TOOLS);
  const toolExecutorOutput = await toolExecutor.invoke(
    { messages: [messageForToolNode] },
    config,
  );
  return { qualMessages: toolExecutorOutput.messages };
}

// Renamed and refactored from original callModel
async function agentNode(
  state: AppState,
  config: RunnableConfig,
): Promise<AppStateUpdate> {
  const configuration = ensureConfiguration(config);
  const model = (await loadChatModel(configuration.model)).bindTools(
    AGENT_TOOLS,
  );

  // Prepare system message
  // The system prompt references state.entitiesToQualify and state.qualificationSummary
  // It also has a {system_time} placeholder.
  let formattedSystemPrompt = systemPrompt.replace(
    "{system_time}",
    new Date().toISOString(),
  );

  // Optionally, provide a snapshot of key state fields for easier access by LLM, though prompt guides it to use state.
  const entitiesListString =
    state.entitiesToQualify?.length > 0
      ? `Snapshot of entitiesToQualify:\n${state.entitiesToQualify
          .map((e) => `${e.index}: ${e.name}`)
          .join("\n")}`
      : "Snapshot: entitiesToQualify is empty.";

  const qualificationSummaryString =
    state.qualificationSummary?.length > 0
      ? `Snapshot of qualificationSummary:\n${JSON.stringify(state.qualificationSummary, null, 2)}`
      : "Snapshot: qualificationSummary is empty.";

  // Append snapshots to the main system prompt that already guides the LLM.
  const finalSystemContent = `${formattedSystemPrompt}\n\nSupplemental Context Snapshots (for your reference; primary data is in state):\n${entitiesListString}\n${qualificationSummaryString}`;

  // Filter out any prior messages that have empty content to prevent empty 'parts' in API requests
  const filteredHistory: BaseMessage[] = state.qualMessages.filter((m) => {
    const content = m.content;
    if (typeof content === "string") {
      return content.trim() !== "";
    }
    if (Array.isArray(content)) {
      return content.length > 0;
    }
    // Keep messages with non-string/array content
    return true;
  });

  const messagesForLlm: BaseMessage[] = [
    new SystemMessage(finalSystemContent),
    ...filteredHistory, // Use filtered history to avoid empty content messages
  ];

  const response = await model.invoke(messagesForLlm);

  // Start of new logic to handle potential state updates from tools
  let updateFromTool: Partial<AppStateUpdate> = {};
  const lastMessage = state.qualMessages[state.qualMessages.length - 1];

  // Check if the latest message in the input state to this node is a ToolMessage from qualify_entities
  // This means ToolNode ran before this current invocation of agentNode
  if (lastMessage && lastMessage.constructor.name === "ToolMessage") {
    const toolMessage = lastMessage as any; // Cast to any to access .name and .content
    if (toolMessage.name === "qualify_entities") {
      try {
        if (typeof toolMessage.content === "string") {
          const parsedContent = JSON.parse(toolMessage.content);
          if (
            parsedContent &&
            parsedContent.update &&
            Array.isArray(parsedContent.update.qualificationSummary)
          ) {
            updateFromTool.qualificationSummary = parsedContent.update
              .qualificationSummary as QualificationItem[];
          }
        }
      } catch (e) {
        console.error(
          "Error parsing qualificationSummary from qualify_entities tool message:",
          e,
        );
      }
    }
  }
  // End of new logic

  // Merge LLM response with updates from tool
  return { qualMessages: [response], ...updateFromTool };
}

async function programmaticVerificationNode(
  state: AppState,
  _config: RunnableConfig,
): Promise<Partial<AppState>> {
  let currentQualificationSummary = state.qualificationSummary; // Default to state
  let updateToReturn: Partial<AppState> = {};

  // Check for an update from the last tool call (e.g., from verificationToolsNode)
  const lastMessage = state.qualMessages[state.qualMessages.length - 1];
  if (lastMessage && lastMessage.constructor.name === "ToolMessage") {
    const toolMessage = lastMessage as any;
    // Safely check toolMessage and its properties
    if (
      toolMessage &&
      typeof toolMessage.name === "string" &&
      toolMessage.name === "qualify_entities" &&
      typeof toolMessage.content === "string"
    ) {
      try {
        const parsedContent = JSON.parse(toolMessage.content);
        if (
          parsedContent &&
          parsedContent.update &&
          Array.isArray(parsedContent.update.qualificationSummary)
        ) {
          currentQualificationSummary = parsedContent.update
            .qualificationSummary as QualificationItem[];
          updateToReturn.qualificationSummary = currentQualificationSummary;
        }
      } catch (e) {
        console.error(
          "Error parsing qualificationSummary from tool message in programmaticVerificationNode:",
          e,
        );
      }
    }
  }

  const { entitiesToQualify } = state;
  const toolInput = {
    entitiesToQualify,
    qualificationSummary: currentQualificationSummary,
  };

  try {
    const funcResult = await verifyQualificationConsistencyTool.func(toolInput);

    if (
      funcResult &&
      typeof funcResult === "object" &&
      "verificationResults" in funcResult
    ) {
      const verificationData = (funcResult as { verificationResults: unknown })
        .verificationResults;
      if (typeof verificationData === "object" && verificationData !== null) {
        updateToReturn.verificationResults = verificationData as Record<
          string,
          any
        >;
      } else {
        console.error(
          "Verification tool's 'verificationResults' property is not a valid object. Output:",
          funcResult,
        );
        updateToReturn.verificationResults = {
          error: "Verification tool's 'verificationResults' was not an object",
          final_consistency: false,
        };
      }
    } else {
      console.error(
        "Verification tool's func did not return the expected structure (e.g., missing 'verificationResults'). Output:",
        funcResult,
      );
      updateToReturn.verificationResults = {
        error:
          "Verification tool returned unexpected data format or was null/undefined during programmatic check",
        final_consistency: false,
      };
    }
  } catch (e: any) {
    console.error(
      "Error running programmaticVerificationNode's tool function (verifyQualificationConsistencyTool):",
      e,
    );
    updateToReturn.verificationResults = {
      error: `Verification tool execution failed during programmatic check: ${e.message}`,
      final_consistency: false,
    };
  }
  if (
    updateToReturn.verificationResults?.final_consistency === true ||
    (state.verificationLoopCount || 0) >= MAX_VERIFICATION_LOOPS
  ) {
    updateToReturn.finishedBatches = 1;
  }
  return updateToReturn;
}

async function verificationAgentNode(
  state: AppState,
  config: RunnableConfig,
): Promise<AppStateUpdate> {
  const configuration = ensureConfiguration(config);
  const model = (await loadChatModel(configuration.model)).bindTools(
    VERIFICATION_LLM_TOOLS,
  );

  const entitiesToQualifyString = JSON.stringify(
    state.entitiesToQualify,
    null,
    2,
  );
  const qualificationSummaryString = JSON.stringify(
    state.qualificationSummary,
    null,
    2,
  );
  const verificationIssuesString = JSON.stringify(
    state.verificationResults,
    null,
    2,
  );

  const populatedPrompt = verificationPromptTemplate
    .replace("{entitiesToQualifyString}", entitiesToQualifyString)
    .replace("{qualificationSummaryString}", qualificationSummaryString)
    .replace("{verificationIssuesString}", verificationIssuesString)
    .replace("{system_time}", new Date().toISOString());

  const messagesForLlm: BaseMessage[] = [
    new HumanMessage(populatedPrompt),
    // No prior messages for verification agent, it gets all context in the prompt.
  ];

  const response = await model.invoke(messagesForLlm);
  const newVerificationLoopCount = (state.verificationLoopCount || 0) + 1;

  let update: AppStateUpdate = {
    qualMessages: [response],
    verificationLoopCount: newVerificationLoopCount,
    continueQualificationSignal: false, // Default to false
  };

  if (
    response.content &&
    typeof response.content === "string" &&
    response.content.includes("<continue_qualification/>")
  ) {
    update.verificationLoopCount = 0;
    update.continueQualificationSignal = true;
  }

  return update;
}

// Routing functions
function shouldContinueMainWorkflowNode(state: AppState): string {
  const lastMessage = state.qualMessages[state.qualMessages.length - 1];

  if (lastMessage) {
    // Ensure there is a last message
    // More robust check for tool calls, similar to entity_extraction_agent_js
    // This relies on lastMessage being AIMessage-like or an actual AIMessage instance
    const toolCalls = (lastMessage as AIMessage)?.tool_calls;
    if (toolCalls && toolCalls.length > 0) {
      return "agentToolsNode";
    }

    // Check for qualification_complete signal in content
    // AIMessage.content can be string or BaseMessageContent[]
    const content = (lastMessage as AIMessage)?.content;
    let textForSignalCheck = "";

    if (typeof content === "string") {
      textForSignalCheck = content;
    } else if (Array.isArray(content)) {
      // Iterate through content blocks to find and concatenate text parts.
      for (const block of content) {
        // Ensure block has 'type' and 'text' properties before accessing
        if (
          block &&
          typeof block.type === "string" &&
          block.type === "text" &&
          typeof block.text === "string"
        ) {
          textForSignalCheck += block.text + "\n"; // Concatenate if there are multiple text blocks
        }
      }
      textForSignalCheck = textForSignalCheck.trim();
    }

    if (textForSignalCheck.includes("<qualification_complete/>")) {
      return "programmaticVerificationNode";
    }
  }
  // If no tool calls and no qualification_complete signal, loop back to agentNode
  return "agentNode";
}

function routeAfterProgrammaticVerificationNode(state: AppState): string {
  if (state.verificationResults?.final_consistency === true) {
    return "__end__";
  }
  if ((state.verificationLoopCount || 0) >= MAX_VERIFICATION_LOOPS) {
    // Ensure verificationLoopCount is not undefined
    console.warn("Max verification loops reached. Ending.");
    return "__end__";
  }
  return "verificationAgentNode";
}

function routeAfterVerificationAgentNode(state: AppState): string {
  const lastMessage = state.qualMessages[state.qualMessages.length - 1];

  // Check for tool calls first, regardless of exact message type, as long as it has tool_calls
  const toolCalls = (lastMessage as AIMessage)?.tool_calls;
  if (lastMessage && toolCalls && toolCalls.length > 0) {
    return "verificationToolsNode";
  }

  // If no tool calls, then check for signals in content if it's an AIMessage
  if (lastMessage && lastMessage.constructor.name === "AIMessage") {
    const aiMessage = lastMessage as AIMessage;
    // Check for qualification_complete signal in content
    // AIMessage.content can be string or BaseMessageContent[]
    const content = aiMessage.content;
    let textForSignalCheck = "";

    if (typeof content === "string") {
      textForSignalCheck = content;
    } else if (Array.isArray(content)) {
      // Iterate through content blocks to find and concatenate text parts.
      for (const block of content) {
        // Ensure block has 'type' and 'text' properties before accessing
        if (
          block &&
          typeof block.type === "string" &&
          block.type === "text" &&
          typeof block.text === "string"
        ) {
          textForSignalCheck += block.text + "\n"; // Concatenate if there are multiple text blocks
        }
      }
      textForSignalCheck = textForSignalCheck.trim();
    }

    if (textForSignalCheck.includes("<continue_qualification/>")) {
      return "agentNode";
    }
    if (textForSignalCheck.includes("<verification_complete/>")) {
      return "programmaticVerificationNode";
    }
  }

  console.warn(
    "Unexpected response or state from verification agent, re-routing to programmatic verification for re-assessment.",
  );
  return "programmaticVerificationNode";
}

// Add this new routing function
function routeAfterAgentToolsNode(state: AppState): string {
  const lastMessage = state.qualMessages[state.qualMessages.length - 1];

  // After ToolNode runs, it appends ToolMessage(s) to the state.
  // We check if the last message is a ToolMessage from 'qualify_entities'.
  if (lastMessage && lastMessage.constructor.name === "ToolMessage") {
    const toolMessage = lastMessage as any; // Cast to access 'name'
    if (toolMessage.name === "qualify_entities") {
      return "programmaticVerificationNode";
    }
  }
  // Default route back to agentNode for other tools or if no relevant tool message is found
  return "agentNode";
}

// Graph definition
const workflow = new StateGraph(AppStateAnnotation, ConfigurationSchema)
  .addNode("agentNode", RunnableLambda.from(agentNode).withConfig({ tags: ["nostream"] }))
  .addNode("agentToolsNode", RunnableLambda.from(wrappedAgentToolsNode).withConfig({ tags: ["nostream"] }))
  .addNode("programmaticVerificationNode", programmaticVerificationNode)
  .addNode("verificationAgentNode", RunnableLambda.from(verificationAgentNode).withConfig({ tags: ["nostream"] }))
  .addNode("verificationToolsNode", RunnableLambda.from(wrappedVerificationToolsNode).withConfig({ tags: ["nostream"] }));

// Define edges on the fully typed workflow object
workflow.addEdge("__start__", "agentNode");

workflow.addConditionalEdges("agentNode", shouldContinueMainWorkflowNode, {
  agentToolsNode: "agentToolsNode",
  programmaticVerificationNode: "programmaticVerificationNode",
  agentNode: "agentNode",
});

// Replace the above line with conditional routing for agentToolsNode
workflow.addConditionalEdges("agentToolsNode", routeAfterAgentToolsNode, {
  programmaticVerificationNode: "programmaticVerificationNode",
  agentNode: "agentNode", // Fallback to agentNode
});

workflow.addConditionalEdges(
  "programmaticVerificationNode",
  routeAfterProgrammaticVerificationNode,
  {
    verificationAgentNode: "verificationAgentNode",
    __end__: "__end__",
  },
);

workflow.addConditionalEdges(
  "verificationAgentNode",
  routeAfterVerificationAgentNode,
  {
    verificationToolsNode: "verificationToolsNode",
    agentNode: "agentNode",
    programmaticVerificationNode: "programmaticVerificationNode",
  },
);
workflow.addEdge("verificationToolsNode", "programmaticVerificationNode");

export const graph = workflow.compile();
