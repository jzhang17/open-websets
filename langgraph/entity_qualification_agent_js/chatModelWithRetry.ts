import { loadChatModel } from "./utils.js";
import { GoogleGenerativeAIError } from "@google/generative-ai";

// Configuration constants
const MAX_RETRY_ATTEMPTS = 5;
const BASE_DELAY_MS = 500;
const MAX_DELAY_MS = 10000;

// Detect network/service errors that might benefit from retry
function isRetryableNetworkError(err: unknown): boolean {
  if (err instanceof GoogleGenerativeAIError) {
    const message = err.message.toLowerCase();
    return message.includes("503") ||
           message.includes("service unavailable") ||
           message.includes("overload") ||
           message.includes("rate limit") ||
           message.includes("timeout") ||
           message.includes("connection") ||
           message.includes("network");
  }

  const errorMessage = typeof err === "object" && err !== null && "message" in err 
    ? String((err as any).message).toLowerCase() 
    : String(err).toLowerCase();

  const networkErrorPatterns = [
    "503",
    "service unavailable",
    "overload", 
    "rate limit",
    "timeout",
    "connection reset",
    "connection refused",
    "network error",
    "fetch failed",
    "econnreset",
    "enotfound",
    "etimedout"
  ];

  return networkErrorPatterns.some(pattern => errorMessage.includes(pattern));
}

// Calculate backoff with exponential delay and jitter
function calculateBackoffMs(attempt: number): number {
  const exponentialDelay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
  const clampedDelay = Math.min(exponentialDelay, MAX_DELAY_MS);
  const jitter = clampedDelay * 0.1 * (Math.random() - 0.5); // ±5% jitter
  return Math.max(0, clampedDelay + jitter);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Simplified logging for retry attempts
function logRetryAttempt(attempt: number, error: unknown, willRetry: boolean): void {
  const errorType = isRetryableNetworkError(error) ? "NETWORK" : "OTHER";
  const action = willRetry ? `retry attempt ${attempt + 1}` : "giving up";
  
  console.warn(
    `[Gemini-Retry] ${errorType} error on attempt ${attempt}: ${action}`,
    { 
      error: error instanceof Error ? error.message : String(error),
      errorType,
      attempt,
      willRetry
    }
  );
}

export async function loadChatModelWithRetry(modelName: string) {
  const realModel: any = await loadChatModel(modelName);

  // Double-check that streaming is disabled (should already be set in utils.ts)
  if ("disableStreaming" in realModel && !realModel.disableStreaming) {
    (realModel as any).disableStreaming = true;
  }

  // Simplified retry wrapper for generateContent
  async function generateContentWithRetry(...args: any[]): Promise<any> {
    const [input, options = {}] = args;
    const { signal, __retryAttempt = 1 } = options;

    if (signal?.aborted) {
      return realModel.generateContent(input, options);
    }

    try {
      return await realModel.generateContent(input, { 
        ...options, 
        signal,
        __retryAttempt: undefined
      });
    } catch (error) {
      const shouldRetry = 
        (__retryAttempt < MAX_RETRY_ATTEMPTS) && 
        isRetryableNetworkError(error);

      if (!shouldRetry) {
        logRetryAttempt(__retryAttempt, error, false);
        throw error;
      }

      logRetryAttempt(__retryAttempt, error, true);
      await wait(calculateBackoffMs(__retryAttempt));
      
      return generateContentWithRetry(input, {
        ...options,
        __retryAttempt: __retryAttempt + 1
      });
    }
  }

  // Return a proxy that wraps the generateContent method with retry logic
  // Since streaming is disabled at model level, we only need to handle generateContent
  return new Proxy(realModel, {
    get(target, prop, receiver) {
      if (prop === "generateContent") {
        return generateContentWithRetry;
      }
      
      const value = Reflect.get(target, prop, receiver);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}
