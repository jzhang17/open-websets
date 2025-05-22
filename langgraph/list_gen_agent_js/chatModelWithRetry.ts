import { loadChatModel } from "./utils.js";
import { GoogleGenerativeAIError } from "@google/generative-ai";

const MAX_ATTEMPTS = 3;

function isParseError(err: unknown): err is GoogleGenerativeAIError {
  return (
    err instanceof GoogleGenerativeAIError &&
    err.message.includes("Failed to parse stream")
  );
}

function backoffMs(attempt: number) {
  const base = 500 * Math.pow(2, attempt - 1);
  const jitter = base * (Math.random() - 0.5);
  return base + jitter;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loadChatModelWithRetry(modelName: string) {
  const realModel: any = await loadChatModel(modelName);

  async function generateContentStreamWithRetry(...args: any[]): Promise<any> {
    const options = args[1] as { signal?: AbortSignal } | undefined;
    if (options?.signal?.aborted) {
      return realModel.generateContentStream(...args);
    }
    try {
      return await realModel.generateContentStream(...args);
    } catch (err) {
      const attempt = (options as any)?.__retryAttempt || 1;
      const shouldRetry = isParseError(err) && attempt < MAX_ATTEMPTS;
      if (!shouldRetry) throw err;
      console.warn("[Gemini-retry] attempt", attempt + 1, "…");
      await wait(backoffMs(attempt));
      return generateContentStreamWithRetry(
        args[0],
        Object.assign({}, options, { __retryAttempt: attempt + 1 }) as any,
      );
    }
  }

  return new Proxy(realModel, {
    get(target, prop, receiver) {
      if (prop === "generateContentStream") {
        return generateContentStreamWithRetry;
      }
      const value = Reflect.get(target, prop, receiver);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}
