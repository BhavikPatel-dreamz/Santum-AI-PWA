import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { createErrorResponse } from "../../../lib/api/server";
import { Message } from "../../../models/message.model";
import { Chat } from "../../../models/chat.model";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const message = await Message.create({
      chatId: body.chatId,
      role: body.role,
      content: body.content,
    });

    await Chat.updateOne(
      { id: body.chatId },
      { isEmpty: false, $unset: { expireAt: "" } },
    );

    return NextResponse.json({
      success: true,
      message: "Message create successfully",
      message,
    });
  } catch (err) {
    return createErrorResponse(err, "Creation failed");
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) return createErrorResponse({ status: 404 }, "Chat required");

    const messages = await Message.find({ chatId })
      .lean()
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: "Fetch all message successfully",
      messages,
    });
  } catch (err) {
    return createErrorResponse(err, "Fetch failed");
  }
}
