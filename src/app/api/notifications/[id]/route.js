import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { createErrorResponse } from "@/lib/api/server";
import { clearAuthCookie, getAuthToken } from "@/lib/auth/session";
import {
  getNotificationFeedForUser,
  markNotificationAsRead,
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

export async function PATCH(_request, { params }) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 },
      );
    }

    const profile = await loadCurrentUserProfile();
    const userKey = resolveUserKeyFromProfile(profile);
    const notification = await markNotificationAsRead({
      notificationId: id,
      user: userKey,
    });

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
      data: await getNotificationFeedForUser(userKey),
    });
  } catch (error) {
    if (error?.status === 401) {
      return createUnauthorizedResponse();
    }

    return createErrorResponse(error, "Unable to update notification");
  }
}
