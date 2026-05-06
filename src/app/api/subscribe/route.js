import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { createErrorResponse } from "@/lib/api/server";
import { clearAuthCookie, getAuthToken } from "@/lib/auth/session";
import { PushSubscriptionRecord } from "@/models/push-subscription.model";
import { resolveCurrentUserKey } from "@/lib/user/server";

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePushSubscription(subscription) {
  if (!subscription || typeof subscription !== "object") {
    return null;
  }

  const endpoint = normalizeText(subscription.endpoint);
  const p256dh = normalizeText(subscription.keys?.p256dh);
  const auth = normalizeText(subscription.keys?.auth);

  if (!endpoint || !p256dh || !auth) {
    return null;
  }

  return {
    endpoint,
    expirationTime:
      typeof subscription.expirationTime === "number" &&
      Number.isFinite(subscription.expirationTime)
        ? subscription.expirationTime
        : null,
    keys: {
      p256dh,
      auth,
    },
  };
}

function normalizeDeviceInfo(deviceInfo, request) {
  const currentDeviceInfo =
    deviceInfo && typeof deviceInfo === "object" ? deviceInfo : {};

  return {
    deviceId: normalizeText(currentDeviceInfo.deviceId),
    platform: normalizeText(currentDeviceInfo.platform),
    language: normalizeText(currentDeviceInfo.language),
    userAgent:
      normalizeText(currentDeviceInfo.userAgent) ||
      normalizeText(request.headers.get("user-agent")),
  };
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
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const subscription = normalizePushSubscription(body?.subscription ?? body);

    if (!subscription) {
      return NextResponse.json(
        { message: "Invalid subscription payload" },
        { status: 400 },
      );
    }

    const user = await resolveCurrentUserKey();
    const deviceInfo = normalizeDeviceInfo(body?.deviceInfo, req);

    await connectDB();

    const record = await PushSubscriptionRecord.findOneAndUpdate(
      {
        endpoint: subscription.endpoint,
      },
      {
        $set: {
          user,
          endpoint: subscription.endpoint,
          expirationTime: subscription.expirationTime,
          keys: subscription.keys,
          deviceId: deviceInfo.deviceId,
          platform: deviceInfo.platform,
          language: deviceInfo.language,
          userAgent: deviceInfo.userAgent,
          isActive: true,
          lastError: "",
          deactivatedAt: null,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    ).lean();

    return NextResponse.json({
      success: true,
      data: {
        id:
          record?._id && typeof record._id.toString === "function"
            ? record._id.toString()
            : null,
        endpoint: record?.endpoint ?? subscription.endpoint,
      },
    });
  } catch (error) {
    if (error?.status === 401) {
      return createUnauthorizedResponse();
    }

    return createErrorResponse(error, "Failed to process subscription");
  }
}
