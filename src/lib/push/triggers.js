import { enqueuePushNotificationJob } from "./queue";
import { createNotificationForUser } from "@/lib/notifications/server";

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Send mood check-in confirmation notification
 */
// export async function notifyMoodCheckInSuccess(userId) {
//   try {
//     await enqueuePushNotificationJob({
//       users: [userId],
//       notification: {
//         title: "Mood Check-in Saved 😊",
//         body: "Thank you for sharing how you're feeling today!",
//         url: "/home",
//         priority: "normal",
//         data: { type: "mood_checkin_success" },
//       },
//     });
//     await createNotificationForUser({
//       user: userId,
//       type: "mood_checkin_success",
//       title: "Mood Check-in Saved 😊",
//       description: "Thank you for sharing how you're feeling today!",
//       priority: "normal",
//       metadata: { type: "mood_checkin_success" },
//     }).catch(console.error);
//   } catch (error) {
//     console.error("[push-triggers] failed to send mood check-in notification:", error);
//   }
// }

/**
 * Send mood check-in reminder for users who haven't checked in today
 */
// export async function notifyMoodCheckInReminder(userIds) {
//   if (!Array.isArray(userIds) || userIds.length === 0) {
//     return;
//   }

//   try {
//     await enqueuePushNotificationJob({
//       users: userIds,
//       notification: {
//         title: "Daily Mood Check-in 💭",
//         body: "How are you feeling today? Share your mood to track your wellness.",
//         url: "/home",
//         priority: "normal",
//         tag: "mood-checkin-reminder",
//         data: { type: "mood_checkin_reminder" },
//       },
//     });
//     await Promise.all(
//       userIds.map((userId) =>
//         createNotificationForUser({
//           user: userId,
//           type: "mood_checkin_reminder",
//           title: "Daily Mood Check-in 💭",
//           description: "How are you feeling today? Share your mood to track your wellness.",
//           priority: "normal",
//           metadata: { type: "mood_checkin_reminder" },
//         }).catch(console.error)
//       )
//     );
//   } catch (error) {
//     console.error("[push-triggers] failed to send mood reminder notification:", error);
//   }
// }

/**
 * Send credit added notification
 */
// export async function notifyCreditAdded(userId, amount) {
//   try {
//     await enqueuePushNotificationJob({
//       users: [userId],
//       notification: {
//         title: "Credits Added! 🎉",
//         body: `+${amount} credits added to your account`,
//         url: "/settings/credits",
//         priority: "high",
//         data: { type: "credit_added", amount },
//       },
//     });
//     await createNotificationForUser({
//       user: userId,
//       type: "credit_added",
//       title: "Credits Added! 🎉",
//       description: `+${amount} credits added to your account`,
//       actionHref: "/settings/credits",
//       priority: "high",
//       metadata: { type: "credit_added", amount },
//     }).catch(console.error);
//   } catch (error) {
//     console.error("[push-triggers] failed to send credit added notification:", error);
//   }
// }

/**
 * Send credit used notification (for significant usage)
 */
// export async function notifyCreditUsed(userId, tokensUsed, remainingBalance) {
//   try {
//     await enqueuePushNotificationJob({
//       users: [userId],
//       notification: {
//         title: "Credits Used",
//         body: `${tokensUsed} tokens used. ${remainingBalance} remaining.`,
//         url: "/settings/credits",
//         priority: "normal",
//         data: { type: "credit_used", tokensUsed, remainingBalance },
//       },
//     });
//     await createNotificationForUser({
//       user: userId,
//       type: "credit_used",
//       title: "Credits Used",
//       description: `${tokensUsed} tokens used. ${remainingBalance} remaining.`,
//       actionHref: "/settings/credits",
//       priority: "normal",
//       metadata: { type: "credit_used", tokensUsed, remainingBalance },
//     }).catch(console.error);
//   } catch (error) {
//     console.error("[push-triggers] failed to send credit used notification:", error);
//   }
// }

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
