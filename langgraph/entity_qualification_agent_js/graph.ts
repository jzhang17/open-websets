import { AIMessage, BaseMessage, SystemMessage, HumanMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { Annotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

import { ConfigurationSchema, ensureConfiguration } from "./configuration.js";
import { 
  AGENT_TOOLS, 
  VERIFICATION_LLM_TOOLS, 
  verifyQualificationConsistencyTool 
} from "./tools.js";
import { VERIFICATION_PROMPT_TEMPLATE } from "./prompts.js";
import { loadChatModel } from "./utils.js";

// Define the structure for an individual qualification item
export interface QualificationItem {
  entity_name: string;
  qualified: boolean;
  reasoning: string;
  // Allow other properties as Python version uses Dict[str, Any]
  [key: string]: any;
}

// Define the new state structure including entities
const AppStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (currentMessages, newMessages) => currentMessages.concat(newMessages),
    default: () => [],
  }),
  // This corresponds to 'entities_to_qualify' from the Python agent
  entitiesToQualify: Annotation<string[]>({
    reducer: (currentState, updateValue) => {
      // The existing 'entities' reducer was a concat.
      if (Array.isArray(updateValue)) {
        return currentState.concat(updateValue);
      }
      // If it's a single string, wrap it in an array before concat
      if (typeof updateValue === 'string') {
        return currentState.concat([updateValue]);
      }
      return currentState; 
    },
    default: () => [],
  }),
  qualificationSummary: Annotation<QualificationItem[]>({
    reducer: (
      _currentState: QualificationItem[] | undefined, 
      updateValue: QualificationItem | QualificationItem[] | undefined
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
    reducer: (_currentState, updateValue) => typeof updateValue === 'number' ? updateValue : 0,
    default: () => 0,
  }),
  // Used to signal from verification back to main agent if entities are missing
  continueQualificationSignal: Annotation<boolean>({
    reducer: (_currentState, updateValue) => typeof updateValue === 'boolean' ? updateValue : false,
    default: () => false,
  }),
});

type AppState = typeof AppStateAnnotation.State;
type AppStateUpdate = typeof AppStateAnnotation.Update;

const MAX_VERIFICATION_LOOPS = 5;

// Renamed and refactored from original callModel
async function agentNode(
  state: AppState,
  config: RunnableConfig,
): Promise<AppStateUpdate> {
  const configuration = ensureConfiguration(config);
  const model = (await loadChatModel(configuration.model)).bindTools(AGENT_TOOLS);

  // Prepare system message
  const systemPromptTemplate = configuration.systemPromptTemplate; // This is SYSTEM_PROMPT from prompts.ts
  // The SYSTEM_PROMPT itself refers to state.entitiesToQualify and state.qualificationSummary
  // It also has a {system_time} placeholder.
  let formattedSystemPrompt = systemPromptTemplate.replace("{system_time}", new Date().toISOString());

  // Optionally, provide a snapshot of key state fields for easier access by LLM, though prompt guides it to use state.
  const entitiesListString = state.entitiesToQualify?.length > 0 
    ? `Snapshot of entitiesToQualify:\n${state.entitiesToQualify.join("\n")}` 
    : "Snapshot: entitiesToQualify is empty.";
  
  const qualificationSummaryString = state.qualificationSummary?.length > 0
    ? `Snapshot of qualificationSummary:\n${JSON.stringify(state.qualificationSummary, null, 2)}`
    : "Snapshot: qualificationSummary is empty.";

  // Append snapshots to the main system prompt that already guides the LLM.
  const finalSystemContent = `${formattedSystemPrompt}\n\nSupplemental Context Snapshots (for your reference; primary data is in state):\n${entitiesListString}\n${qualificationSummaryString}`;
  
  const messagesForLlm: BaseMessage[] = [
    new SystemMessage(finalSystemContent),
    ...state.messages, // Include prior conversation history
  ];

  const response = await model.invoke(messagesForLlm);
  
  // Start of new logic to handle potential state updates from tools
  let updateFromTool: Partial<AppStateUpdate> = {};
  const lastMessage = state.messages[state.messages.length - 1];

  // Check if the latest message in the input state to this node is a ToolMessage from qualify_entities
  // This means ToolNode ran before this current invocation of agentNode
  if (lastMessage && lastMessage.constructor.name === "ToolMessage") {
    const toolMessage = lastMessage as any; // Cast to any to access .name and .content
    if (toolMessage.name === "qualify_entities") {
      try {
        if (typeof toolMessage.content === 'string') {
          const parsedContent = JSON.parse(toolMessage.content);
          if (parsedContent && parsedContent.update && Array.isArray(parsedContent.update.qualificationSummary)) {
            updateFromTool.qualificationSummary = parsedContent.update.qualificationSummary as QualificationItem[];
          }
        }
      } catch (e) {
        console.error("Error parsing qualificationSummary from qualify_entities tool message:", e);
      }
    }
  }
  // End of new logic

  // Merge LLM response with updates from tool
  return { messages: [response], ...updateFromTool };
}

async function programmaticVerificationNode(
  state: AppState,
  _config: RunnableConfig,
): Promise<Partial<AppState>> { 
  const { entitiesToQualify, qualificationSummary } = state;
  const toolInput = { entitiesToQualify, qualificationSummary };
  
  try {
    // verifyQualificationConsistencyTool.func should return the raw verification issues object
    // based on its definition where it returns { verificationResults: issues }
    // So funcResult is effectively the `issues` object itself.
    const funcResult = await verifyQualificationConsistencyTool.func(toolInput);
    // The tool's func was defined to return { verificationResults: issues }, so funcResult is this object.
    if (funcResult && typeof funcResult === 'object' && 'verificationResults' in funcResult && typeof (funcResult as any).verificationResults === 'object') {
         // Ensure the state update matches the reducer for verificationResults
        return { verificationResults: (funcResult as any).verificationResults };
    } else {
        console.error("Verification tool's func did not return the expected structure directly containing issues for verificationResults field. Output:", funcResult);
        // If the tool returns just the issues, not wrapped in {verificationResults: issues}
        // then we should wrap it here: return { verificationResults: funcResult };
        // Based on tools.ts, verifyQualificationConsistencyTool.func will return { verificationResults: issues }
        // So this path should ideally not be hit if tool is correct.
        // For safety, if it's just the issues object: 
        if (typeof funcResult === 'object' && funcResult !== null) {
            return { verificationResults: funcResult }; // Assuming funcResult is the issues object itself
        } 
        return { verificationResults: { error: "Verification tool returned unexpected data format", final_consistency: false } };
    }
  } catch (e: any) {
    console.error("Error running programmaticVerificationNode tool function:", e);
    return { verificationResults: { error: `Verification tool execution failed: ${e.message}`, final_consistency: false } };
  }
}

async function verificationAgentNode(
  state: AppState,
  config: RunnableConfig,
): Promise<AppStateUpdate> {
  const configuration = ensureConfiguration(config);
  const model = (await loadChatModel(configuration.model)).bindTools(VERIFICATION_LLM_TOOLS);

  const entitiesToQualifyString = JSON.stringify(state.entitiesToQualify, null, 2);
  const qualificationSummaryString = JSON.stringify(state.qualificationSummary, null, 2);
  const verificationIssuesString = JSON.stringify(state.verificationResults, null, 2);

  const populatedPrompt = VERIFICATION_PROMPT_TEMPLATE
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
    messages: [response], 
    verificationLoopCount: newVerificationLoopCount,
    continueQualificationSignal: false // Default to false
  };

  if (response.content && typeof response.content === 'string' && response.content.includes("<continue_qualification/>")) {
    update.verificationLoopCount = 0; 
    update.continueQualificationSignal = true; 
  }

  return update;
}

// Routing functions
function shouldContinueMainWorkflowNode(state: AppState): string {
  const lastMessage = state.messages[state.messages.length - 1];

  if (lastMessage) { // Ensure there is a last message
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

    if (typeof content === 'string') {
      textForSignalCheck = content;
    } else if (Array.isArray(content)) {
      // Iterate through content blocks to find and concatenate text parts.
      for (const block of content) {
        // Ensure block has 'type' and 'text' properties before accessing
        if (block && typeof block.type === 'string' && block.type === "text" && typeof block.text === 'string') {
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
  if ((state.verificationLoopCount || 0) >= MAX_VERIFICATION_LOOPS) { // Ensure verificationLoopCount is not undefined
    console.warn("Max verification loops reached. Ending.");
    return "__end__"; 
  }
  return "verificationAgentNode";
}

function routeAfterVerificationAgentNode(state: AppState): string {
  const lastMessage = state.messages[state.messages.length - 1];
  if (lastMessage && lastMessage.constructor.name === "AIMessage") {
    const aiMessage = lastMessage as AIMessage;
    if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
      return "verificationToolsNode";
    }
    if (typeof aiMessage.content === 'string') {
      if (aiMessage.content.includes("<continue_qualification/>")) {
        return "agentNode"; 
      }
      if (aiMessage.content.includes("<verification_complete/>")) {
        return "programmaticVerificationNode";
      }
    }
  }
  console.warn("Unexpected response from verification agent, re-routing to programmatic verification for re-assessment.");
  return "programmaticVerificationNode";
}

// Graph definition
const workflow = new StateGraph(AppStateAnnotation, ConfigurationSchema)
  .addNode("agentNode", agentNode)
  .addNode("agentToolsNode", new ToolNode(AGENT_TOOLS))
  .addNode("programmaticVerificationNode", programmaticVerificationNode)
  .addNode("verificationAgentNode", verificationAgentNode)
  .addNode("verificationToolsNode", new ToolNode(VERIFICATION_LLM_TOOLS));

// Define edges on the fully typed workflow object
workflow.addEdge("__start__", "agentNode");

workflow.addConditionalEdges(
  "agentNode",
  shouldContinueMainWorkflowNode,
  {
    "agentToolsNode": "agentToolsNode",
    "programmaticVerificationNode": "programmaticVerificationNode",
    "agentNode": "agentNode",
  }
);
workflow.addEdge("agentToolsNode", "agentNode");

workflow.addConditionalEdges(
  "programmaticVerificationNode",
  routeAfterProgrammaticVerificationNode,
  {
    "verificationAgentNode": "verificationAgentNode",
    "__end__": "__end__",
  }
);

workflow.addConditionalEdges(
  "verificationAgentNode",
  routeAfterVerificationAgentNode,
  {
    "verificationToolsNode": "verificationToolsNode",
    "agentNode": "agentNode", 
    "programmaticVerificationNode": "programmaticVerificationNode",
  }
);
workflow.addEdge("verificationToolsNode", "programmaticVerificationNode"); 

export const graph = workflow.compile();
