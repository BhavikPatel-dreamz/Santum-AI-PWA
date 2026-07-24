import { enqueuePushNotificationJob } from "./queue";
import { createNotificationForUser } from "@/lib/notifications/server";

/**
 * Send low credit warning
 */
export async function notifyLowCredits(userId, remainingBalance) {
  try {
    await enqueuePushNotificationJob({
      users: [userId],
      notification: {
        title: "Low Credits ⚠️",
        body: `You have only ${remainingBalance} credits remaining. Upgrade your plan to continue.`,
        url: "/plus-subscription",
        priority: "high",
        tag: "low-credits-warning",
        data: { type: "low_credits", remainingBalance },
      },
    });
    await createNotificationForUser({
      user: userId,
      type: "low_credits",
      title: "Low Credits ⚠️",
      description: `You have only ${remainingBalance} credits remaining. Upgrade your plan to continue.`,
      actionHref: "/plus-subscription",
      priority: "high",
      metadata: { type: "low_credits", remainingBalance },
    }).catch(console.error);
  } catch (error) {
    console.error("[push-triggers] failed to send low credits notification:", error);
  }
}

/**
 * Send out of credit notification
 */
export async function notifyOutOfCredits(userId) {
  try {
    await enqueuePushNotificationJob({
      users: [userId],
      notification: {
        title: "Out of Credits 😢",
        body: "You've run out of credits. Purchase a plan to continue chatting.",
        url: "/plus-subscription",
        priority: "high",
        tag: "out-of-credits",
        data: { type: "out_of_credits" },
      },
    });
    await createNotificationForUser({
      user: userId,
      type: "out_of_credits",
      title: "Out of Credits 😢",
      description: "You've run out of credits. Purchase a plan to continue chatting.",
      actionHref: "/plus-subscription",
      priority: "high",
      metadata: { type: "out_of_credits" },
    }).catch(console.error);
  } catch (error) {
    console.error("[push-triggers] failed to send out of credits notification:", error);
  }
}

/**
 * Send subscription plan changed notification
 */
export async function notifySubscriptionChanged(userId, newPlanName) {
  try {
    await enqueuePushNotificationJob({
      users: [userId],
      notification: {
        title: "Subscription Updated! 🎉",
        body: `You're now on the ${newPlanName} plan`,
        url: "/plus-subscription",
        priority: "high",
        data: { type: "subscription_changed", planName: newPlanName },
      },
    });
    await createNotificationForUser({
      user: userId,
      type: "subscription_changed",
      title: "Subscription Updated! 🎉",
      description: `You're now on the ${newPlanName} plan`,
      actionHref: "/plus-subscription",
      priority: "high",
      metadata: { type: "subscription_changed", planName: newPlanName },
    }).catch(console.error);
  } catch (error) {
    console.error("[push-triggers] failed to send subscription notification:", error);
  }
}

/**
 * Send subscription canceled notification
 */
export async function notifySubscriptionCanceled(userId) {
  try {
    await enqueuePushNotificationJob({
      users: [userId],
      notification: {
        title: "Subscription Canceled",
        body: "Your subscription has been canceled. You can re-subscribe anytime.",
        url: "/plus-subscription",
        priority: "normal",
        data: { type: "subscription_canceled" },
      },
    });
    await createNotificationForUser({
      user: userId,
      type: "subscription_canceled",
      title: "Subscription Canceled",
      description: "Your subscription has been canceled. You can re-subscribe anytime.",
      actionHref: "/plus-subscription",
      priority: "normal",
      metadata: { type: "subscription_canceled" },
    }).catch(console.error);
  } catch (error) {
    console.error("[push-triggers] failed to send subscription cancel notification:", error);
  }
}
