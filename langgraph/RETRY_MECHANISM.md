# Enhanced Google Generative AI Retry Mechanism

## Overview

This enhanced retry mechanism addresses the "Failed to parse stream" errors commonly encountered with the Google Generative AI SDK. Based on extensive research of community issues (LibreChat #5954, SDK issue #303), this implementation provides robust error handling for various manifestations of streaming parse errors.

## Key Improvements

### 1. **Comprehensive Error Detection**
- **Broader Pattern Matching**: Detects various error message patterns beyond just "Failed to parse stream"
- **Multiple Error Sources**: Handles errors from GoogleGenerativeAIError, nested causes, and generic Error objects
- **Case-Insensitive Matching**: Ensures errors are caught regardless of message casing

### 2. **Smart Fallback Strategy**
- **Automatic Non-Streaming Fallback**: After 3 consecutive streaming failures, automatically switches to non-streaming mode
- **Interface Compatibility**: Fallback maintains streaming interface compatibility using async generators
- **Transparent Operation**: Fallback is transparent to calling code

### 3. **Enhanced Error Classification**
- **Streaming Parse Errors**: JSON parsing, SSE parsing, malformed chunks, truncated responses
- **Network Errors**: 503 errors, timeouts, connection issues, rate limits
- **Non-Retryable Errors**: Authentication errors, permanent failures

### 4. **Improved Retry Logic**
- **Configurable Thresholds**: Easy-to-adjust retry limits and fallback thresholds
- **Better Backoff**: Exponential backoff with jitter and maximum delay capping
- **Detailed Logging**: Enhanced logging with error classification and retry context

### 5. **Dual Method Support**
- **Streaming**: Enhanced `generateContentStream` with fallback capability
- **Non-Streaming**: Consistent retry logic for `generateContent`
- **Signal Handling**: Proper AbortSignal support throughout

## Configuration

```typescript
// Configuration constants (adjustable per your needs)
const MAX_RETRY_ATTEMPTS = 5;
const BASE_DELAY_MS = 500;
const MAX_DELAY_MS = 10000;
const STREAMING_FALLBACK_THRESHOLD = 3;
```

## Error Patterns Detected

### Streaming Parse Errors
- `"failed to parse stream"`
- `"json parse"`
- `"unexpected token"`
- `"malformed json"`
- `"sse parse"`
- `"server-sent events"`
- `"chunk parsing"`
- `"connection closed"`
- `"response truncated"`

### Network Errors
- `"503"` / `"service unavailable"`
- `"overload"`
- `"rate limit"`
- `"timeout"`
- `"connection reset"`
- `"network error"`
- `"fetch failed"`

## Usage

```typescript
import { loadChatModelWithRetry } from "./chatModelWithRetry.js";

// Load model with enhanced retry capability
const model = await loadChatModelWithRetry("gemini-1.5-flash");

// Use normally - retries happen automatically
try {
  const stream = await model.generateContentStream("Your prompt here");
  for await (const chunk of stream) {
    console.log(chunk.text());
  }
} catch (error) {
  // Only non-retryable errors reach here
  console.error("Permanent failure:", error);
}
```

## Retry Flow

1. **Initial Attempt**: Try streaming request
2. **Error Analysis**: Classify error type (streaming, network, other)
3. **Retry Decision**: Check if error is retryable and within attempt limits
4. **Fallback Check**: After 3 streaming failures, switch to non-streaming
5. **Backoff**: Apply exponential backoff with jitter
6. **Retry**: Attempt again with updated parameters

## Logging

The enhanced mechanism provides detailed logging:

```
[Gemini-Retry] STREAMING_PARSE error on attempt 1: retry attempt 2
[Gemini-Retry] STREAMING_PARSE error on attempt 2: retry attempt 3
[Gemini-Retry] Using non-streaming fallback due to repeated streaming failures (3)
[Gemini-Retry] NETWORK error on attempt 3: retry attempt 4
```

## Testing

Run the test suite to verify functionality:

```bash
cd langgraph
npx tsx test-retry.ts
```

## Common Scenarios Handled

### 1. **Intermittent Parse Errors**
- Retries streaming up to 3 times
- Falls back to non-streaming if streaming consistently fails
- Maintains response interface compatibility

### 2. **Network Congestion**
- Detects 503/overload responses
- Applies backoff to reduce server load
- Retries with exponential delay

### 3. **Connection Issues**
- Handles connection drops mid-stream
- Retries with fresh connections
- Proper timeout handling

### 4. **Large Response Handling**
- Falls back to non-streaming for problematic large responses
- Avoids UTF-8 multi-byte character issues in streaming
- Maintains functionality when streaming parser fails

## Migration from Original

The enhanced version is a drop-in replacement for the original retry mechanism:

- ✅ Same function signature and usage
- ✅ Backward compatible
- ✅ Enhanced error detection
- ✅ Better reliability
- ✅ Improved logging

## Performance Impact

- **Minimal Overhead**: Error detection adds negligible latency
- **Smart Fallback**: Only switches to non-streaming when necessary
- **Efficient Backoff**: Prevents excessive retry storms
- **Resource Friendly**: Proper cleanup and signal handling

## Troubleshooting

### High Retry Rates
- Check network connectivity
- Verify API key and quotas
- Consider reducing maxOutputTokens
- Check for proxy issues

### Consistent Fallback to Non-Streaming
- May indicate persistent streaming issues
- Check for proxy interference with SSE
- Verify newline handling in network path
- Consider alternative network route

### Authentication Errors
- These are not retried (by design)
- Check API key validity and permissions
- Verify project configuration

## Future Enhancements

Potential areas for future improvement:
- Dynamic threshold adjustment based on error patterns
- Circuit breaker pattern for persistent failures
- Metrics collection for error analysis
- Integration with monitoring systems 