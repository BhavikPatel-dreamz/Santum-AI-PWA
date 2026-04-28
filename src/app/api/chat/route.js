import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { createErrorResponse } from "../../../lib/api/server";
import { Chat } from "../../../models/chat.model";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const chat = await Chat.create({
      user: body.user,
    });

    return NextResponse.json({
      success: true,
      message: "Conversation create successfully",
      chat,
    });
  } catch (err) {
    return createErrorResponse(err, "Creation failed");
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const user = searchParams.get("user");

    if (!user) return createErrorResponse({status:404},"User required");

    const chats = await Chat.find({ user }).lean().sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      message: "Fetch all conversation successfully",
      chats,
    });
  } catch (err) {
    return createErrorResponse(err, "Fetch failed");
  }
}
