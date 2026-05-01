import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationStateSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    scope: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

notificationStateSchema.index(
  { user: 1, scope: 1 },
  {
    unique: true,
    name: "unique_notification_state_scope_per_user",
  },
);

export const NotificationState =
  mongoose.models.NotificationState ||
  mongoose.model("NotificationState", notificationStateSchema);
