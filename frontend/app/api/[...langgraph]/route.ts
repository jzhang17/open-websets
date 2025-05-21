import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Construct the target URL by appending the dynamic path from the request
  // to the base LANGGRAPH_API_URL.
  // req.nextUrl.pathname will be like '/api/langgraph/v1/threads/...'
  // We need to strip the '/api/langgraph' part before appending to LANGGRAPH_API_URL
  const slug = req.nextUrl.pathname.replace(/^\/api\/langgraph/, "");
  const targetUrl = `${process.env.LANGGRAPH_API_URL}${slug}`;

  const resp = await fetch(
    targetUrl,
    {
      method : "POST",
      headers: {
        ...req.headers,                    // forward originals
        "X-Api-Key": process.env.LANGSMITH_API_KEY!, // inject secret
      },
      body   : req.body,
      // duplex: "half" // Required for streaming Request body in Node.js 18+ / Next.js Edge Functions
    });
    
  // Ensure you handle the response body correctly for streaming
  // If the response is streamed, you need to pipe it through
  if (resp.body) {
    return new NextResponse(resp.body, {
      status: resp.status,
      headers: resp.headers, // Forward headers from the target service
    });
  }

  return new NextResponse(null, { status: resp.status });
}

// Optional: Handle other HTTP methods if your LangGraph service needs them
// export async function GET(req: NextRequest) { ... }
// export async function PUT(req: NextRequest) { ... }
// export async function DELETE(req: NextRequest) { ... } 