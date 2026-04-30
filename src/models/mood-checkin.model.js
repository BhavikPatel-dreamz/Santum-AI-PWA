import mongoose from "mongoose";

const { Schema } = mongoose;

const moodCheckInSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    dateKey: {
      type: String,
      required: true,
      trim: true,
    },
    happiness: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    stress: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    energy: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
  },
  { timestamps: true },
);

moodCheckInSchema.index(
  { user: 1, dateKey: 1 },
  {
    unique: true,
    name: "unique_daily_mood_check_in_per_user",
  },
);

export const MoodCheckIn =
  mongoose.models.MoodCheckIn ||
  mongoose.model("MoodCheckIn", moodCheckInSchema);
