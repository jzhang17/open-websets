import { initChatModel } from "langchain/chat_models/universal";
import { ChatGoogle } from "@langchain/google-webauth";

/**
 * Load a chat model from a fully specified name.
 * @param fullySpecifiedName - String in the format 'provider/model' or 'provider/account/provider/model' or just model name for gemini.
 * @returns A Promise that resolves to a BaseChatModel instance.
 */
export async function loadChatModel(fullySpecifiedName: string) {
  if (fullySpecifiedName.startsWith("gemini")) {
    return new ChatGoogle({
      model: fullySpecifiedName,
      apiVersion: "v1beta",
      platformType: "gai",
      maxReasoningTokens: 0,
      disableStreaming: true,
    });
  }
  const index = fullySpecifiedName.indexOf("/");
  if (index === -1) {
    // If there's no "/", assume it's just the model
    return await initChatModel(fullySpecifiedName);
  } else {
    const provider = fullySpecifiedName.slice(0, index);
    const model = fullySpecifiedName.slice(index + 1);
    return await initChatModel(model, { modelProvider: provider });
  }
}
