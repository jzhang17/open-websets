# Deployment Guide - Handling Vercel Timeouts

## Overview

This project uses LangGraph AI operations that can take significant time to complete. To handle this properly on Vercel, we've implemented several timeout strategies.

## Current Configuration

### API Route Timeouts
- **Location**: `app/api/[...langgraph]/route.ts`
- **maxDuration**: 300 seconds (5 minutes)
- **Runtime**: Node.js
- **Memory**: 2048 MB (configured in vercel.json)

### Vercel Plan Requirements

| Plan | Default Timeout | Max with Fluid Compute | Max with maxDuration |
|------|----------------|----------------------|---------------------|
| Hobby | 10s | 60s | 60s |
| Pro | 60s | 60s | 300s (5 min) |
| Enterprise | 60s | 60s | 900s (15 min) |

## Deployment Steps

### 1. Enable Fluid Compute (Recommended)
1. Go to your Vercel project dashboard
2. Navigate to **Settings → Functions**
3. Enable **Fluid Compute** (one-click for Hobby plan users)
4. This extends Hobby plan timeout from 10s to 60s

### 2. Configure Environment Variables
Ensure these are set in your Vercel project:
```bash
LANGGRAPH_API_URL=your_langgraph_service_url
LANGSMITH_API_KEY=your_langsmith_api_key
```

### 3. Deploy
```bash
npm run build
vercel --prod
```

## Timeout Handling Strategy

### Current Implementation
1. **Vercel Function Timeout**: 300s (Pro plan)
2. **Fetch Timeout**: 290s (slightly less than function timeout)
3. **Streaming**: Enabled for long-running operations
4. **Error Handling**: Specific timeout error responses

### Fallback Strategies (if timeouts persist)

#### Option 1: Background Processing
If operations need > 5 minutes, consider:
- Queue jobs using Upstash Redis or similar
- Return immediate response with job ID
- Poll for completion or use webhooks

#### Option 2: Streaming with Progress
- Start streaming response immediately
- Send progress updates while processing
- Keep connection alive within timeout limits

#### Option 3: External Workers
- Use services like Railway, Fly.io, or AWS Lambda
- Keep Vercel for fast API responses
- Delegate heavy processing to persistent workers

## Monitoring

### Vercel Function Logs
Monitor timeout issues in Vercel dashboard:
1. Go to **Functions** tab
2. Check **Invocations** for timeout errors
3. Review **Logs** for detailed error messages

### Error Codes
- `408 TIMEOUT`: Request exceeded timeout limit
- `500 INTERNAL_ERROR`: Other server errors

## Troubleshooting

### Common Issues
1. **Still hitting 60s limit**: Enable Fluid Compute
2. **Hitting 300s limit**: Consider background processing
3. **Memory issues**: Increase memory in vercel.json
4. **Network timeouts**: Check LangGraph service health

### Debug Commands
```bash
# Check current deployment
vercel ls

# View function logs
vercel logs

# Test locally with timeout simulation
npm run dev
```

## Performance Optimization

1. **Parallel Requests**: Process multiple operations simultaneously
2. **Caching**: Cache frequent responses using Vercel KV
3. **Streaming**: Use ReadableStream for large responses
4. **Connection Pooling**: Reuse connections to LangGraph service

## Next Steps

If you continue experiencing timeouts after these optimizations:
1. Profile your LangGraph operations
2. Consider implementing queue-based processing
3. Evaluate upgrading to Pro/Enterprise plan
4. Implement client-side polling for long operations 