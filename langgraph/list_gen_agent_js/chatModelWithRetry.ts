import { loadChatModel } from "./utils.js";
import { GoogleGenerativeAIError } from "@google/generative-ai";

// Configuration constants
const MAX_RETRY_ATTEMPTS = 5;
const BASE_DELAY_MS = 500;
const MAX_DELAY_MS = 10000;
const STREAMING_FALLBACK_THRESHOLD = 3; // Fallback to non-streaming after this many streaming failures

// Enhanced error detection for various manifestations of Google AI streaming errors
function isStreamingParseError(err: unknown): boolean {
  // Direct GoogleGenerativeAIError with streaming parse message
  if (err instanceof GoogleGenerativeAIError) {
    const message = err.message.toLowerCase();
    return message.includes("failed to parse stream") ||
           message.includes("stream parsing") ||
           message.includes("json parse") ||
           message.includes("unexpected token") ||
           message.includes("invalid character") ||
           message.includes("sse parse") ||
           message.includes("server-sent events");
  }

  // Extract error message from various error formats
  let errorMessage = "";
  if (typeof err === "string") {
    errorMessage = err.toLowerCase();
  } else if (err && typeof err === "object") {
    if ("message" in err) {
      errorMessage = String(err.message).toLowerCase();
    }
    // Check nested cause/error properties
    const nestedError = (err as any)?.cause || (err as any)?.error;
    if (nestedError && typeof nestedError === "object" && "message" in nestedError) {
      errorMessage += " " + String(nestedError.message).toLowerCase();
    }
  }

  // Comprehensive pattern matching for streaming/parsing errors
  const streamingErrorPatterns = [
    "failed to parse stream",
    "stream parsing",
    "json parse",
    "unexpected token",
    "invalid character",
    "sse parse",
    "server-sent events",
    "malformed json",
    "unexpected end of json",
    "syntax error",
    "invalid json",
    "parse error",
    "chunk parsing",
    "stream chunk",
    "connection closed",
    "incomplete response",
    "response truncated"
  ];

  return streamingErrorPatterns.some(pattern => errorMessage.includes(pattern));
}

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

// Enhanced logging for better debugging
function logRetryAttempt(
  attempt: number, 
  error: unknown, 
  willRetry: boolean, 
  useFallback: boolean = false
): void {
  const errorType = isStreamingParseError(error) ? "STREAMING_PARSE" : 
                   isRetryableNetworkError(error) ? "NETWORK" : "OTHER";
  
  const action = useFallback ? "fallback to non-streaming" : 
                willRetry ? `retry attempt ${attempt + 1}` : "giving up";
  
  console.warn(
    `[Gemini-Retry] ${errorType} error on attempt ${attempt}: ${action}`,
    { 
      error: error instanceof Error ? error.message : String(error),
      errorType,
      attempt,
      willRetry,
      useFallback 
    }
  );
}

export async function loadChatModelWithRetry(modelName: string) {
  const realModel: any = await loadChatModel(modelName);

  // Disable streaming globally – force the underlying ChatGoogleGenerativeAI instance
  // to use the non-streaming REST endpoint no matter how it was constructed.
  if ("stream" in realModel) {
    (realModel as any).stream = false;
  }

  // Enhanced retry wrapper for generateContentStream
  async function generateContentStreamWithRetry(...args: any[]): Promise<any> {
    const [input, options = {}] = args;
    const { signal, __retryAttempt = 1, __streamingFailures = 0 } = options;

    // --- Hard-disable streaming: immediately redirect to the non-streaming helper ---
    return generateContentWithRetry(...args);

    // Check for abort signal
    if (signal?.aborted) {
      return realModel.generateContentStream(input, options);
    }

    // Decide whether to use streaming or fallback to non-streaming
    const shouldUseNonStreaming = __streamingFailures >= STREAMING_FALLBACK_THRESHOLD;
    
    if (shouldUseNonStreaming) {
      console.warn(
        `[Gemini-Retry] Using non-streaming fallback due to repeated streaming failures (${__streamingFailures})`
      );
      try {
        // Fallback to regular generateContent (non-streaming)
        const result = await realModel.generateContent(input, { 
          ...options, 
          signal,
          // Remove retry-specific properties
          __retryAttempt: undefined,
          __streamingFailures: undefined
        });
        
        // Convert to async generator to match streaming interface
        return {
          async *[Symbol.asyncIterator]() {
            yield result;
          },
          response: result.response
        };
      } catch (fallbackError) {
        // If non-streaming also fails, check if we should retry
        const shouldRetryFallback = 
          (__retryAttempt < MAX_RETRY_ATTEMPTS) &&
          (isRetryableNetworkError(fallbackError) || isStreamingParseError(fallbackError));

        if (shouldRetryFallback) {
          logRetryAttempt(__retryAttempt, fallbackError, true, false);
          await wait(calculateBackoffMs(__retryAttempt));
          return generateContentStreamWithRetry(input, {
            ...options,
            __retryAttempt: __retryAttempt + 1,
            __streamingFailures
          });
        }
        throw fallbackError;
      }
    }

    // Try streaming approach
    try {
      return await realModel.generateContentStream(input, { 
        ...options, 
        signal,
        // Remove retry-specific properties from the actual call
        __retryAttempt: undefined,
        __streamingFailures: undefined
      });
    } catch (error) {
      const isStreamError = isStreamingParseError(error);
      const isNetworkError = isRetryableNetworkError(error);
      const shouldRetry = 
        (__retryAttempt < MAX_RETRY_ATTEMPTS) && 
        (isStreamError || isNetworkError);

      if (!shouldRetry) {
        logRetryAttempt(__retryAttempt, error, false);
        throw error;
      }

      // Increment streaming failure count if it's a streaming-specific error
      const newStreamingFailures = isStreamError ? __streamingFailures + 1 : __streamingFailures;
      const useFallback = newStreamingFailures >= STREAMING_FALLBACK_THRESHOLD;
      
      logRetryAttempt(__retryAttempt, error, true, useFallback);
      
      await wait(calculateBackoffMs(__retryAttempt));
      
      return generateContentStreamWithRetry(input, {
        ...options,
        __retryAttempt: __retryAttempt + 1,
        __streamingFailures: newStreamingFailures
      });
    }
  }

  // Enhanced retry wrapper for regular generateContent (for consistency)
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
        (isRetryableNetworkError(error) || isStreamingParseError(error));

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

  // Return a proxy that wraps both streaming and non-streaming methods
  return new Proxy(realModel, {
    get(target, prop, receiver) {
      if (prop === "generateContentStream") {
        return generateContentStreamWithRetry;
      }
      if (prop === "generateContent") {
        return generateContentWithRetry;
      }
      
      const value = Reflect.get(target, prop, receiver);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}
