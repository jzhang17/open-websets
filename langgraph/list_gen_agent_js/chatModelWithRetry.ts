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

function logModelLoadRetryAttempt(attempt: number, modelName: string): void {
  console.warn(`[Gemini-ModelLoad-Retry] attempt ${attempt} to load model '${modelName}' failed, retrying...`);
}

function logGenerateContentRetryAttempt(attempt: number): void {
  console.warn(`[Gemini-GenerateContent-Retry] attempt ${attempt} failed, retrying...`);
}

export async function loadChatModelWithRetry(modelName: string) {
  let modelLoadAttempt = 1;
  while (true) {
    try {
      const realModel: any = await loadChatModel(modelName); // Attempt to load the model

      // If model loading is successful, proceed to set up the proxy with retry for generateContent
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
          // If the signal is already aborted, pass through to the real model without retry logic
          return realModel.generateContent(input, options);
        }

        try {
          // Wrap the entire call in a more comprehensive error boundary
          const result = await Promise.resolve(realModel.generateContent(input, {
            ...options,
            signal,
            __retryAttempt: undefined, // Clear our internal retry attempt for the actual call
          }));
          return result;
        } catch (error: any) {
          // Log the caught error for debugging
          console.log(`[Gemini-GenerateContent-Retry] Caught error on attempt ${__retryAttempt}:`, error.message || error);
          
          if (__retryAttempt >= MAX_RETRY_ATTEMPTS) {
            console.error(`[Gemini-GenerateContent-Retry] Max retry attempts (${MAX_RETRY_ATTEMPTS}) reached. Throwing error.`);
            throw error;
          }
          
          // Check if this is a retryable error
          const isRetryableError = shouldRetryError(error);
          if (!isRetryableError) {
            console.warn(`[Gemini-GenerateContent-Retry] Non-retryable error detected. Throwing immediately.`);
            throw error;
          }
          
          logGenerateContentRetryAttempt(__retryAttempt);
          await wait(calculateBackoffMs(__retryAttempt));
          return generateContentWithRetry(input, {
            ...options, // Pass original options
            signal,     // Pass original signal
            __retryAttempt: __retryAttempt + 1, // Increment our retry attempt counter
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

    } catch (error: any) { // Catch errors specifically from loadChatModel
      console.log(`[Gemini-ModelLoad-Retry] Error on attempt ${modelLoadAttempt} loading model '${modelName}':`, error.message || error);
      
      if (modelLoadAttempt >= MAX_RETRY_ATTEMPTS) {
        console.error(`[Gemini-ModelLoad-Retry] Max retry attempts (${MAX_RETRY_ATTEMPTS}) reached for loading model '${modelName}'. Throwing error.`);
        throw error;
      }
      
      // Check if this is a retryable error using the shared shouldRetryError function
      const isRetryable = shouldRetryError(error);
      if (!isRetryable) {
        console.warn(`[Gemini-ModelLoad-Retry] Non-retryable error detected loading model '${modelName}'. Throwing immediately.`);
        throw error;
      }
      
      logModelLoadRetryAttempt(modelLoadAttempt, modelName);
      await wait(calculateBackoffMs(modelLoadAttempt));
      modelLoadAttempt++;
    }
  }
}

// shouldRetryError function is defined here in the module scope
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
