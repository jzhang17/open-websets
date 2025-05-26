import { loadChatModel } from "./utils.js";

// Configuration constants
const MAX_RETRY_ATTEMPTS = 5;
const BASE_DELAY_MS = 500;
const MAX_DELAY_MS = 10000;
const STREAMING_FALLBACK_THRESHOLD = 3;

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

  async function generateContentStreamWithRetry(...args: any[]): Promise<any> {
    const [input, options = {}] = args;
    const { signal, __retryAttempt = 1, __streamingFailures = 0 } = options;

    if (signal?.aborted) {
      return realModel.generateContentStream(input, options);
    }

    const shouldUseNonStreaming = __streamingFailures >= STREAMING_FALLBACK_THRESHOLD;
    if (shouldUseNonStreaming) {
      try {
        const result = await realModel.generateContent(input, {
          ...options,
          signal,
          __retryAttempt: undefined,
          __streamingFailures: undefined,
        });
        return {
          async *[Symbol.asyncIterator]() {
            yield result;
          },
          response: result.response,
        };
      } catch (fallbackError) {
        if (__retryAttempt < MAX_RETRY_ATTEMPTS) {
          logRetryAttempt(__retryAttempt);
          await wait(calculateBackoffMs(__retryAttempt));
          return generateContentStreamWithRetry(input, {
            ...options,
            __retryAttempt: __retryAttempt + 1,
            __streamingFailures,
          });
        }
        throw fallbackError;
      }
    }

    try {
      return await realModel.generateContentStream(input, {
        ...options,
        signal,
        __retryAttempt: undefined,
        __streamingFailures: undefined,
      });
    } catch (error) {
      if (__retryAttempt >= MAX_RETRY_ATTEMPTS) {
        throw error;
      }
      logRetryAttempt(__retryAttempt);
      await wait(calculateBackoffMs(__retryAttempt));
      return generateContentStreamWithRetry(input, {
        ...options,
        __retryAttempt: __retryAttempt + 1,
        __streamingFailures: __streamingFailures + 1,
      });
    }
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

  // Added: Retry wrapper for invoke() calls used by LangChain.
  async function invokeWithRetry(...args: any[]): Promise<any> {
    const [input, options = {}] = args;
    const { signal, __retryAttempt = 1 } = (options as any) ?? {};

    if (signal?.aborted) {
      return (realModel as any).invoke(input, options);
    }

    try {
      return await (realModel as any).invoke(input, {
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
      return invokeWithRetry(input, {
        ...options,
        __retryAttempt: __retryAttempt + 1,
      });
    }
  }

  return new Proxy(realModel, {
    get(target, prop, receiver) {
      if (prop === "generateContentStream") {
        return generateContentStreamWithRetry;
      }
      if (prop === "generateContent") {
        return generateContentWithRetry;
      }
      if (prop === "invoke") {
        return invokeWithRetry;
      }
      const value = Reflect.get(target, prop, receiver);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}
