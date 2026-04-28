import mongoose from "mongoose";

const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
    },

    lastMessage: {
      type: String,
    },

    lastMessageRole: {
      type: String,
      enum: ["user", "assistant", "system"],
    },

    model: {
      type: String, // gpt-4.1 or gpt-4.1-mini
    },

    // Subscription Context
    planType: {
      type: String,
      enum: ["free", "standard", "premium"],
      default: "free",
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isEmpty: {
      type: Boolean,
      default: true,
      index: true,
    },

    // ⏱️ NEW: TTL field
    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
      index: { expires: 0 },
    },
  },
  { timestamps: true },
);
export const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
