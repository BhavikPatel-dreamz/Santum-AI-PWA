import { NextResponse } from "next/server";
import { createErrorResponse } from "@/lib/api/server";
import { clearAuthCookie, getAuthToken } from "@/lib/auth/session";
import {
  getNotificationFeedForUser,
  loadCurrentBillingSnapshot,
  markAllNotificationsAsRead,
  syncBillingNotifications,
} from "@/lib/notifications/server";
import {
  loadCurrentUserProfile,
  resolveUserKeyFromProfile,
} from "@/lib/user/server";

function createUnauthorizedResponse() {
  const response = NextResponse.json(
    { message: "Unauthorized" },
    { status: 401 },
  );

  return clearAuthCookie(response);
}

function normalizeLimit(value) {
  const parsedValue = Number.parseInt(String(value ?? ""), 10);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return 50;
  }

  return Math.min(parsedValue, 100);
}

export async function GET(request) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const profile = await loadCurrentUserProfile();
    const userKey = resolveUserKeyFromProfile(profile);

    try {
      const billingSnapshot = await loadCurrentBillingSnapshot({
        profile,
      });

      await syncBillingNotifications({
        user: userKey,
        snapshot: billingSnapshot,
      });
    } catch (notificationError) {
      console.error(
        "Unable to refresh billing notifications while loading the inbox:",
        notificationError,
      );
    }

    const { searchParams } = new URL(request.url);
    const feed = await getNotificationFeedForUser(userKey, {
      limit: normalizeLimit(searchParams.get("limit")),
    });

    return NextResponse.json({
      success: true,
      data: feed,
    });
  } catch (error) {
    if (error?.status === 401) {
      return createUnauthorizedResponse();
    }

    return createErrorResponse(error, "Unable to load notifications");
  }
}

export async function POST(request) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (body?.action !== "mark-all-read") {
      return NextResponse.json(
        { message: "Unsupported notification action" },
        { status: 400 },
      );
    }

    const profile = await loadCurrentUserProfile();
    const userKey = resolveUserKeyFromProfile(profile);

    await markAllNotificationsAsRead(userKey);

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
      data: await getNotificationFeedForUser(userKey),
    });
  } catch (error) {
    if (error?.status === 401) {
      return createUnauthorizedResponse();
    }

    return createErrorResponse(error, "Unable to update notifications");
  }
}
