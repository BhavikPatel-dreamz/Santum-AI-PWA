import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { createErrorResponse } from "@/lib/api/server";
import { MoodCheckIn } from "@/models/mood-checkin.model";
import { notifyMoodCheckInReminder } from "@/lib/push/triggers";

export const runtime = "nodejs";

function getTodayDateKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Send mood check-in reminders to users who haven't checked in today
 * Can be called manually or by a cron job
 * Requires PUSH_INTERNAL_TOKEN header for security
 */
export async function POST(req) {
  try {
    const expectedToken = process.env.PUSH_INTERNAL_TOKEN?.trim();

    if (!expectedToken) {
      return NextResponse.json(
        { message: "Mood reminder service not configured" },
        { status: 503 }
      );
    }

    const incomingToken = req.headers.get("x-push-token")?.trim();

    if (incomingToken !== expectedToken) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const todayDateKey = getTodayDateKey();

    // Find all users who haven't checked in today
    const usersWhoCheckedInToday = await MoodCheckIn.find({
      dateKey: todayDateKey,
    })
      .select("user")
      .lean();

    const userIdsCheckedIn = usersWhoCheckedInToday.map((entry) => entry.user);

    // Get all users with push subscriptions
    const collection = await import("mongoose").then((m) =>
      m.default.connection.collection("push_subscriptions")
    );

    const allSubscribedUsers = await collection
      .aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$user" } },
        { $project: { _id: 1 } },
      ])
      .toArray();

    // Find users who have subscriptions but haven't checked in today
    const usersToRemind = allSubscribedUsers
      .map((entry) => entry._id)
      .filter((userId) => !userIdsCheckedIn.includes(userId));

    if (usersToRemind.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No users to remind",
        remindedCount: 0,
      });
    }

    // Send reminder notifications
    await notifyMoodCheckInReminder(usersToRemind);

    return NextResponse.json({
      success: true,
      message: `Mood reminders sent to ${usersToRemind.length} users`,
      remindedCount: usersToRemind.length,
      users: usersToRemind,
    });
  } catch (error) {
    console.error("[mood-reminder] error:", error);
    return createErrorResponse(error, "Unable to send mood reminders");
  }
}
