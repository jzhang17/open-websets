// Vercel timeout configuration
export const maxDuration = 300; // 5 minutes (Pro plan limit)
export const runtime = 'nodejs'; // Keep on Node.js runtime

import { NextRequest, NextResponse } from "next/server";

async function forwardRequest(req: NextRequest, method: string) {
  try {
    // Forward the request to the LangGraph service
    const slug = req.nextUrl.pathname.replace(/^\/api\/langgraph/, "");
    const searchParams = req.nextUrl.searchParams.toString();
    const targetUrl = `${process.env.LANGGRAPH_API_URL}${slug}${searchParams ? `?${searchParams}` : ''}`;

    const requestInit: RequestInit = {
      method,
      headers: {
        ...req.headers,
        "X-Api-Key": process.env.LANGSMITH_API_KEY!,
      },
      // Add timeout to the fetch request itself (slightly less than Vercel's limit)
      signal: AbortSignal.timeout(290000), // 290 seconds
    };

    // Only include body for POST/PUT/PATCH requests
    if (method === "POST" || method === "PUT" || method === "PATCH") {
      requestInit.body = req.body;
      (requestInit as any).duplex = "half";
    }

    const resp = await fetch(targetUrl, requestInit);

    // Handle streaming responses
    if (resp.body) {
      const headers = new Headers(resp.headers);
      
      // Ensure proper streaming headers
      headers.set('Cache-Control', 'no-cache');
      headers.set('Connection', 'keep-alive');
      
      return new NextResponse(resp.body, {
        status: resp.status,
        headers,
      });
    }

    return new NextResponse(null, { status: resp.status });
  } catch (error) {
    console.error('LangGraph API proxy error:', error);
    
    // Handle timeout errors specifically
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { 
          error: 'Request timeout', 
          message: 'The operation took too long to complete. Please try again or contact support if this persists.',
          code: 'TIMEOUT'
        },
        { status: 408 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: 'An unexpected error occurred while processing your request.',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return forwardRequest(req, "GET");
}

export async function POST(req: NextRequest) {
  return forwardRequest(req, "POST");
}

export async function PUT(req: NextRequest) {
  return forwardRequest(req, "PUT");
}

export async function PATCH(req: NextRequest) {
  return forwardRequest(req, "PATCH");
}

export async function DELETE(req: NextRequest) {
  return forwardRequest(req, "DELETE");
}
