import { loadChatModel } from "./utils.js";

const MAX_RETRY_ATTEMPTS = 5;
const BASE_DELAY_MS = 500;
const MAX_DELAY_MS = 10000;

function calculateBackoffMs(attempt: number): number {
  const exponentialDelay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
  const clampedDelay = Math.min(exponentialDelay, MAX_DELAY_MS);
  const jitter = clampedDelay * 0.1 * (Math.random() - 0.5);
  return Math.max(0, clampedDelay + jitter);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function logRetryAttempt(attempt: number): void {
  console.warn(`[Gemini-Retry] attempt ${attempt} failed, retrying...`);
}

export async function loadChatModelWithRetry(modelName: string) {
  const realModel: any = await loadChatModel(modelName);

  // Ensure streaming is completely disabled
  if ("disableStreaming" in realModel) {
    (realModel as any).disableStreaming = true;
  }
  if ("streaming" in realModel) {
    (realModel as any).streaming = false;
  }
  // Also set on the binding configuration if it exists
  if (realModel.config) {
    realModel.config.disableStreaming = true;
    realModel.config.streaming = false;
  }

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
        __retryAttempt: undefined,
      });
    } catch (error) {
      if (__retryAttempt >= MAX_RETRY_ATTEMPTS) {
        throw error;
      }
      logRetryAttempt(__retryAttempt);
      await wait(calculateBackoffMs(__retryAttempt));
      return generateContentWithRetry(input, {
        ...options,
        __retryAttempt: __retryAttempt + 1,
      });
    }
  }

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
