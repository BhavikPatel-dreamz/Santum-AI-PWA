import mongoose from "mongoose";

const { Schema } = mongoose;
const messageSchema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      index: true,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
