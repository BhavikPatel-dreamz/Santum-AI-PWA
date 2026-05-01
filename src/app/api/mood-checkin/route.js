import { after, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { createErrorResponse } from "@/lib/api/server";
import { resolveMoodUserKey } from "@/lib/mood/server";
import { createNotificationForCurrentUser } from "@/lib/notifications/server";
import { clearAuthCookie, getAuthToken } from "@/lib/auth/session";
import { MoodCheckIn } from "@/models/mood-checkin.model";
import {
  isValidMoodDateKey,
  sanitizeMoodCheckInEntry,
  serializeMoodCheckIn,
} from "@/lib/utills/mood";

function createUnauthorizedResponse() {
  const response = NextResponse.json(
    { message: "Unauthorized" },
    { status: 401 },
  );

  return clearAuthCookie(response);
}

export async function GET(request) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateKey = searchParams.get("date")?.trim() ?? "";

    if (!isValidMoodDateKey(dateKey)) {
      return NextResponse.json(
        { message: "A valid date is required." },
        { status: 400 },
      );
    }

    const userKey = await resolveMoodUserKey();

    await connectDB();

    const entry = await MoodCheckIn.findOne({
      user: userKey,
      dateKey,
    }).lean();

    return NextResponse.json({
      success: true,
      entry: serializeMoodCheckIn(entry),
    });
  } catch (error) {
    if (error?.status === 401) {
      return createUnauthorizedResponse();
    }

    return createErrorResponse(error, "Unable to load mood check-in");
  }
}

export async function POST(request) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const normalizedEntry = sanitizeMoodCheckInEntry(body);

    if (!normalizedEntry.data) {
      return NextResponse.json(
        { message: normalizedEntry.error },
        { status: 400 },
      );
    }

    const userKey = await resolveMoodUserKey();

    await connectDB();

    const entry = await MoodCheckIn.findOneAndUpdate(
      {
        user: userKey,
        dateKey: normalizedEntry.data.dateKey,
      },
      {
        $set: {
          happiness: normalizedEntry.data.happiness,
          stress: normalizedEntry.data.stress,
          energy: normalizedEntry.data.energy,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    ).lean();

    after(async () => {
      try {
        await createNotificationForCurrentUser({
          type: "mood_check_in_saved",
          category: "wellness",
          title: "Today's mood check-in is saved",
          description:
            "Amigo can use your latest mood context in future chats and check-ins.",
          actionHref: "/home",
          actionLabel: "Open home",
          priority: "low",
          dedupeKey: `mood-check-in:${normalizedEntry.data.dateKey}`,
          metadata: {
            dateKey: normalizedEntry.data.dateKey,
          },
        });
      } catch (notificationError) {
        console.error("Unable to create mood notification:", notificationError);
      }
    });

    return NextResponse.json({
      success: true,
      message: "Mood check-in saved successfully",
      entry: serializeMoodCheckIn(entry),
    });
  } catch (error) {
    if (error?.status === 401) {
      return createUnauthorizedResponse();
    }

    return createErrorResponse(error, "Unable to save mood check-in");
  }
}
