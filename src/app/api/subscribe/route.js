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
    const subscription = await req.json();

    if (!isValidSubscription(subscription)) {
      return Response.json(
        { error: "Invalid subscription payload" },
        { status: 400 },
      );
    }

    // console.log("Received subscription:", subscription.endpoint);

    return Response.json({ success: true, subscription });
  } catch (error) {
    console.error("Failed to process subscription:", error);

    return Response.json(
      { error: "Failed to process subscription" },
      { status: 500 },
    );
  }
}
