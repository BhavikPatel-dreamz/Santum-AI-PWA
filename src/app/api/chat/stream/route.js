 import { NextResponse } from "next/server";
import { getAuthToken } from "../../../../lib/auth/session";
import { createErrorResponse } from "../../../../lib/api/server";

export async function POST(req) {
  try {
    const token = await getAuthToken();
    const body = await req.json();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const aiApiUrl = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000";
    const aiRes = await fetch(`${aiApiUrl}/api/v1/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!aiRes.ok) {
      let errorData = {};
      try {
        errorData = await aiRes.json();
      } catch {
        errorData = {};
      }
      throw {
        status: aiRes.status,
        message: errorData?.message || "AI Chat API failed",
        data: errorData,
      };
    }

    if (!aiRes.body) {
      return NextResponse.json(
        { message: "Chat stream body is missing" },
        { status: 502 },
      );
    }

    // Directly pipe the stream from the AI service back to the client
    return new Response(aiRes.body, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return createErrorResponse(error, "AI Chat API failed");
  }
}
