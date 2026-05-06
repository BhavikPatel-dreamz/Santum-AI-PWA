import mongoose from "mongoose";

const { Schema } = mongoose;

const pushSubscriptionSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    endpoint: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    expirationTime: {
      type: Number,
      default: null,
    },
    keys: {
      p256dh: {
        type: String,
        required: true,
        trim: true,
      },
      auth: {
        type: String,
        required: true,
        trim: true,
      },
    },
    deviceId: {
      type: String,
      default: "",
      trim: true,
    },
    platform: {
      type: String,
      default: "",
      trim: true,
    },
    language: {
      type: String,
      default: "",
      trim: true,
    },
    userAgent: {
      type: String,
      default: "",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastError: {
      type: String,
      default: "",
      trim: true,
    },
    lastSentAt: {
      type: Date,
      default: null,
    },
    deactivatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "push_subscriptions",
  },
);

pushSubscriptionSchema.index(
  { user: 1, isActive: 1, updatedAt: -1 },
  { name: "push_subscriptions_by_user_active" },
);

export const PushSubscriptionRecord =
  mongoose.models.PushSubscriptionRecord ||
  mongoose.model("PushSubscriptionRecord", pushSubscriptionSchema);
