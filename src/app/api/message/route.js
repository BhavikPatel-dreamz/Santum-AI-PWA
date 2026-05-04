import { connectDB } from "@/lib/db";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { createErrorResponse } from "../../../lib/api/server";
import { Message } from "../../../models/message.model";
import { Chat } from "../../../models/chat.model";

function buildChatTitle(content) {
  if (typeof content !== "string" || !content.trim()) {
    return "New conversation";
  }

  return content.trim().replace(/\s+/g, " ").slice(0, 60);
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body?.chatId || !body?.role || !body?.content?.trim()) {
      return NextResponse.json(
        { message: "chatId, role, and content are required" },
        { status: 400 },
      );
    }

    if (!isValidObjectId(body.chatId)) {
      return createErrorResponse({ status: 404 }, "Chat not found");
    }

    const existingChat = await Chat.findById(body.chatId).select("title");

    if (!existingChat) {
      return createErrorResponse({ status: 404 }, "Chat not found");
    }

    const message = await Message.create({
      chatId: body.chatId,
      role: body.role,
      content: body.content.trim(),
    });

    await Chat.findByIdAndUpdate(body.chatId, {
      isEmpty: false,
      lastMessage: body.content.trim(),
      lastMessageRole: body.role,
      ...(existingChat?.title
        ? {}
        : body.role === "user"
          ? { title: buildChatTitle(body.content) }
          : {}),
      $unset: { expireAt: "" },
    });

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
    if (!isValidObjectId(chatId)) {
      return createErrorResponse({ status: 404 }, "Chat not found");
    }

    const messages = await Message.find({ chatId })
      .lean()
      .sort({ createdAt: 1, _id: 1 });

    return NextResponse.json({
      success: true,
      message: "Fetch all message successfully",
      messages,
    });
  } catch (err) {
    return createErrorResponse(err, "Fetch failed");
  }
}
