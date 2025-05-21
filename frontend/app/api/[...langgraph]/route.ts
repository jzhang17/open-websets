import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Forward the request to the LangGraph service
  const slug = req.nextUrl.pathname.replace(/^\/api\/langgraph/, "");
  const targetUrl = `${process.env.LANGGRAPH_API_URL}${slug}`;

  const resp = await fetch(
    targetUrl,
    {
      method: "POST",
      headers: {
        ...req.headers,
        "X-Api-Key": process.env.LANGSMITH_API_KEY!,
      },
      body: req.body,
      duplex: "half",
    } as any,
  );

  // Stream the response back to the client
  if (resp.body) {
    return new NextResponse(resp.body, {
      status: resp.status,
      headers: resp.headers, // Forward headers from the target service
    });
  }

  return new NextResponse(null, { status: resp.status });
}
