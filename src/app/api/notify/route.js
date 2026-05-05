import webpush from "web-push";

export const runtime = "nodejs";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    "mailto:test@test.com",
    vapidPublicKey,
    vapidPrivateKey,
  );
}

function isValidSubscription(subscription) {
  return Boolean(
    subscription &&
    typeof subscription === "object" &&
    typeof subscription.endpoint === "string" &&
    subscription.keys &&
    typeof subscription.keys.p256dh === "string" &&
    typeof subscription.keys.auth === "string",
  );
}

export async function POST(req) {
  try {
    if (!vapidPublicKey || !vapidPrivateKey) {
      return Response.json({ error: "Missing VAPID keys" }, { status: 500 });
    }

    const body = await req.json();
    const subscription = body?.subscription ?? body;

    if (!isValidSubscription(subscription)) {
      return Response.json(
        { error: "Invalid subscription payload" },
        { status: 400 },
      );
    }

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: body?.title ?? "Hello",
        body: body?.body ?? "Minimal web push working!",
        icon: "/Logo Source files 21-4/Icon/SVG/Artboard1.svg",
      }),
      {
        TTL: 60,
        urgency: "high", // faster delivery
      },
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to send push notification:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to send push notification",
      },
      { status: 500 },
    );
  }
}
