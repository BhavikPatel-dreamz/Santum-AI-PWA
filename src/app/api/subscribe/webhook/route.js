import { NextResponse } from "next/server";
import { notifySubscriptionChanged, notifySubscriptionCanceled } from "@/lib/push/triggers";

export const runtime = "nodejs";

/**
 * Webhook endpoint for subscription changes
 * Called by WordPress when user subscribes/upgrades/cancels
 * Requires PUSH_INTERNAL_TOKEN header for security
 */
export async function POST(req) {
  try {
    const expectedToken = process.env.PUSH_INTERNAL_TOKEN?.trim();

    if (!expectedToken) {
      return NextResponse.json(
        { message: "Webhook service not configured" },
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

    const body = await req.json();

    // Expected payload format from WordPress webhook
    const eventType = body?.event_type; // "subscription_activated", "subscription_upgraded", "subscription_canceled"
    const userId = body?.id ?? body?.user;
    const planName = body?.plan_name ?? body?.plan ?? "Premium";
    const planId = body?.plan_id;

    if (!userId) {
      return NextResponse.json(
        { message: "user_id or user is required" },
        { status: 400 }
      );
    }

    // Convert numeric user_id to user key format if needed
    let userKey = `${userId}`;

    if (eventType === "subscription_canceled") {
      await notifySubscriptionCanceled(userKey);
    } else if (
      eventType === "subscription_activated" ||
      eventType === "subscription_upgraded" ||
      eventType === "subscription_changed"
    ) {
      await notifySubscriptionChanged(userKey, planName);
    }

    return NextResponse.json({
      success: true,
      message: `Subscription notification sent for ${eventType}`,
      event: eventType,
      userId: userKey,
      planId,
    });
  } catch (error) {
    console.error("[subscription-webhook] error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process subscription webhook",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
