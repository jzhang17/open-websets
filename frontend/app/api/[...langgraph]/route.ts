import { NextRequest, NextResponse } from "next/server";

async function forwardRequest(req: NextRequest, method: string) {
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
  };

  // Only include body for POST/PUT/PATCH requests
  if (method === "POST" || method === "PUT" || method === "PATCH") {
    requestInit.body = req.body;
    (requestInit as any).duplex = "half";
  }

  const resp = await fetch(targetUrl, requestInit);

  // Stream the response back to the client
  if (resp.body) {
    return new NextResponse(resp.body, {
      status: resp.status,
      headers: resp.headers, // Forward headers from the target service
    });
  }

  return new NextResponse(null, { status: resp.status });
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
