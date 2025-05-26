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
      // Wrap the entire call in a more comprehensive error boundary
      const result = await Promise.resolve(realModel.generateContent(input, {
        ...options,
        signal,
        __retryAttempt: undefined,
      }));
      return result;
    } catch (error: any) {
      // Log the caught error for debugging
      console.log(`[Gemini-Retry] Caught error on attempt ${__retryAttempt}:`, error.message || error);
      
      if (__retryAttempt >= MAX_RETRY_ATTEMPTS) {
        console.error(`[Gemini-Retry] Max retry attempts (${MAX_RETRY_ATTEMPTS}) reached. Throwing error.`);
        throw error;
      }
      
      // Check if this is a retryable error
      const isRetryableError = shouldRetryError(error);
      if (!isRetryableError) {
        console.warn(`[Gemini-Retry] Non-retryable error detected. Throwing immediately.`);
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

  // Added: Retry wrapper for `invoke` calls which are widely used by LangChain graphs.
  async function invokeWithRetry(...args: any[]): Promise<any> {
    const [input, options = {}] = args;
    // LangChain RunnableConfig is typically passed as the second arg, so we treat it generically.
    const { signal, __retryAttempt = 1 } = (options as any) ?? {};

    if (signal?.aborted) {
      return (realModel as any).invoke(input, options);
    }

    try {
      const result = await Promise.resolve((realModel as any).invoke(input, {
        ...options,
        signal,
        __retryAttempt: undefined,
      }));
      return result;
    } catch (error: any) {
      console.log(`[Gemini-Retry] Caught error in invoke() on attempt ${__retryAttempt}:`, error.message || error);

      if (__retryAttempt >= MAX_RETRY_ATTEMPTS) {
        console.error(`[Gemini-Retry] Max retry attempts (${MAX_RETRY_ATTEMPTS}) reached during invoke(). Throwing error.`);
        throw error;
      }

      const isRetryableError = shouldRetryError(error);
      if (!isRetryableError) {
        console.warn(`[Gemini-Retry] Non-retryable error detected during invoke(). Throwing immediately.`);
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

  function shouldRetryError(error: any): boolean {
    // Check for Google 500 errors specifically
    if (error.message && error.message.includes('status code 500')) {
      return true;
    }
    
    // Check for internal errors
    if (error.message && error.message.includes('INTERNAL')) {
      return true;
    }
    
    // Check for rate limiting
    if (error.message && error.message.includes('429')) {
      return true;
    }
    
    // Check for timeout errors
    if (error.message && (error.message.includes('timeout') || error.message.includes('TIMEOUT'))) {
      return true;
    }
    
    // Check for network errors
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      return true;
    }
    
    // Default to retrying for any error (can be made more restrictive)
    return true;
  }

  return new Proxy(realModel, {
    get(target, prop, receiver) {
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
