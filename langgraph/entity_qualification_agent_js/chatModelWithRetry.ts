import { loadChatModel } from "./utils.js";

export async function loadChatModelWithRetry(modelName: string) {
  return await loadChatModel(modelName);
}
