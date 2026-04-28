import mongoose from "mongoose";

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(MONGODB_URI, {
    dbName: "AmigoChat",
  });
};
