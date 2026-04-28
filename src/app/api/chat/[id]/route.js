import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { createErrorResponse } from "../../../../lib/api/server";
import { Chat } from "../../../../models/chat.model";

// GET SINGLE CHAT
export async function GET(req, { params }) {
  try {
    await connectDB();

    const chat = await Chat.findById(params.id);

    if (!chat) return createErrorResponse("Chat not found", 404);

    return NextResponse.json({
      success: true,
      message: "Conversation update successfully",
      chat,
    });
  } catch (err) {
    return createErrorResponse(err, "Updation failed");
  }
}

// UPDATE CHAT
export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const body = await req.json();

    const chat = await Chat.findByIdAndUpdate(params.id, body, { new: true });

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
    await connectDB();

    const chat = await Chat.findByIdAndDelete(params.id);

    if (!chat) return createErrorResponse({ status: 404 }, "Chat not found");

    return NextResponse.json({
      success: true,
      message: "Conversation deleted",
    });
  } catch (err) {
    return createErrorResponse(err);
  }
}
