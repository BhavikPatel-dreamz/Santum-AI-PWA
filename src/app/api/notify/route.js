import { NextResponse } from "next/server";
import { createErrorResponse } from "@/lib/api/server";
import { clearAuthCookie, getAuthToken } from "@/lib/auth/session";
import { enqueuePushNotificationJob } from "@/lib/push/queue";
import { resolveCurrentUserKey } from "@/lib/user/server";

export const runtime = "nodejs";

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUsers(body) {
  const candidates = [
    ...(Array.isArray(body?.users) ? body.users : []),
    body?.user,
  ];

  return [...new Set(candidates.map(normalizeText).filter(Boolean))];
}

function normalizePriority(value) {
  return ["low", "normal", "high"].includes(value) ? value : "normal";
}

function normalizeNotificationPayload(body) {
  const title = normalizeText(body?.title);
  const messageBody = normalizeText(
    body?.body ?? body?.message ?? body?.description,
  );

  if (!title || !messageBody) {
    return null;
  }

  return {
    title,
    body: messageBody,
    url: normalizeText(body?.url ?? body?.actionHref) || "/notifications",
    icon:
      normalizeText(body?.icon) ||
      "/Logo Source files 21-4/Icon/0.5x/Artboard1.png",
    badge:
      normalizeText(body?.badge) ||
      "/Logo Source files 21-4/Icon/0.5x/Artboard1.png",
    tag: normalizeText(body?.tag),
    priority: normalizePriority(body?.priority),
    data:
      body?.data && typeof body.data === "object" && !Array.isArray(body.data)
        ? body.data
        : {},
  };
}

function hasInternalPushAccess(request) {
  const expectedToken = normalizeText(process.env.PUSH_INTERNAL_TOKEN);

  if (!expectedToken) {
    return false;
  }

  return normalizeText(request.headers.get("x-push-token")) === expectedToken;
}

function createUnauthorizedResponse() {
  const response = NextResponse.json(
    { message: "Unauthorized" },
    { status: 401 },
  );

  return clearAuthCookie(response);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const token = await getAuthToken();
    const hasInternalAccess = hasInternalPushAccess(req);

    if (!token && !hasInternalAccess) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const notification = normalizeNotificationPayload(body);

    if (!notification) {
      return NextResponse.json(
        { message: "title and body are required" },
        { status: 400 },
      );
    }

    const requestedUsers = normalizeUsers(body);
    const users =
      requestedUsers.length > 0
        ? requestedUsers
        : token
          ? [await resolveCurrentUserKey()]
          : [];

    if (users.length === 0) {
      return NextResponse.json(
        { message: "A target user is required for this notification job." },
        { status: 400 },
      );
    }

    const job = await enqueuePushNotificationJob({
      users,
      notification,
    });

    return NextResponse.json({
      success: true,
      data: {
        jobId: job.id,
        users,
      },
    });
  } catch (error) {
    if (error?.status === 401) {
      return createUnauthorizedResponse();
    }

    return createErrorResponse(error, "Failed to enqueue push notification");
  }
}
