import { connectDB } from "@/lib/db";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { createErrorResponse } from "../../../../lib/api/server";
import { Chat } from "../../../../models/chat.model";
import { Message } from "../../../../models/message.model";

// GET SINGLE CHAT
export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return createErrorResponse({ status: 404 }, "Chat not found");
    }

    await connectDB();

    const chat = await Chat.findById(id).lean();

    if (!chat) return createErrorResponse({ status: 404 }, "Chat not found");

    return NextResponse.json({
      success: true,
      message: "Conversation fetched successfully",
      chat,
    });
  } catch (err) {
    return createErrorResponse(err, "Fetch failed");
  }
}

// UPDATE CHAT
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return createErrorResponse({ status: 404 }, "Chat not found");
    }

    await connectDB();

    const body = await req.json();

    const chat = await Chat.findByIdAndUpdate(id, body, { new: true }).lean();

    if (!chat) return createErrorResponse({ status: 404 }, "Chat not found");

    return NextResponse.json({
      success: true,
      message: "Conversation update successfully",
      chat,
    });
  } catch (err) {
    return createErrorResponse(err);
  }
}

// DELETE CHAT
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return createErrorResponse({ status: 404 }, "Chat not found");
    }

    await connectDB();

    const chat = await Chat.findByIdAndDelete(id);

    if (!chat) return createErrorResponse({ status: 404 }, "Chat not found");

    await Message.deleteMany({ chatId: id });

    return NextResponse.json({
      success: true,
      message: "Conversation deleted",
    });
  } catch (err) {
    return createErrorResponse(err);
  }
}
