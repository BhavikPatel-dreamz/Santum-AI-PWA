import { connectDB } from "@/lib/db";
import { Notification } from "@/models/notification.model";
import { NotificationState } from "@/models/notification-state.model";
import {
  apiFetchWithAuth,
  assertApiSuccess,
} from "@/lib/api/server";
import {
  extractCreditBalance,
  formatCreditAmount,
} from "@/lib/utills/credit";
import { buildSubscriptionSnapshot } from "@/lib/utills/subscription";
import {
  loadCurrentUserProfile,
  resolveCurrentUserKey,
} from "@/lib/user/server";

const BILLING_NOTIFICATION_SCOPE = "billing";
const DEFAULT_NOTIFICATION_LIMIT = 50;

function normalizeTextValue(value) {
  if (typeof value === "string") {
    const trimmedValue = value.trim();
    return trimmedValue || "";
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return "";
}

function normalizeOptionalDate(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function serializeNotification(notification) {
  if (!notification || typeof notification !== "object") {
    return null;
  }

  const notificationId =
    notification._id && typeof notification._id.toString === "function"
      ? notification._id.toString()
      : normalizeTextValue(notification._id);

  return {
    id: notificationId,
    type: normalizeTextValue(notification.type),
    category: normalizeTextValue(notification.category) || "general",
    title: normalizeTextValue(notification.title),
    description: normalizeTextValue(notification.description),
    actionHref: normalizeTextValue(notification.actionHref),
    actionLabel: normalizeTextValue(notification.actionLabel),
    priority: normalizeTextValue(notification.priority) || "normal",
    unread: notification.unread !== false,
    readAt: normalizeOptionalDate(notification.readAt),
    createdAt: normalizeOptionalDate(notification.createdAt),
    updatedAt: normalizeOptionalDate(notification.updatedAt),
    metadata:
      notification.metadata && typeof notification.metadata === "object"
        ? notification.metadata
        : {},
  };
}

function calculateNotificationStats(notifications) {
  const total = notifications.length;
  const unread = notifications.filter((item) => item.unread).length;
  const priority = notifications.filter((item) => item.priority === "high").length;

  return {
    total,
    unread,
    priority,
  };
}

function extractPlans(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    if (Array.isArray(payload.data)) {
      return payload.data;
    }

    if (Array.isArray(payload.plans)) {
      return payload.plans;
    }
  }

  return [];
}

function normalizeStatusToken(value) {
  return normalizeTextValue(value)
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function hasStatusToken(value, expectedTokens) {
  const normalizedValue = normalizeStatusToken(value);

  if (!normalizedValue) {
    return false;
  }

  return expectedTokens.some((token) => normalizedValue.includes(token));
}

function isSamePlanState(left, right) {
  if (!left || !right) {
    return false;
  }

  const leftPlanId = normalizeTextValue(left.active_plan_id);
  const rightPlanId = normalizeTextValue(right.active_plan_id);

  if (leftPlanId && rightPlanId) {
    return leftPlanId === rightPlanId;
  }

  return (
    normalizeTextValue(left.active_plan_name).toLowerCase() ===
    normalizeTextValue(right.active_plan_name).toLowerCase()
  );
}

function getPlanReferenceLabel(snapshot, fallback = "your membership") {
  return normalizeTextValue(snapshot?.active_plan_name) || fallback;
}

function shouldCreateTokenReset(previousState, nextState) {
  if (
    !previousState?.is_paid_active ||
    !nextState?.is_paid_active ||
    !isSamePlanState(previousState, nextState)
  ) {
    return false;
  }

  if (
    !Number.isFinite(previousState.credit_balance) ||
    !Number.isFinite(nextState.credit_balance)
  ) {
    return false;
  }

  if (nextState.credit_balance <= previousState.credit_balance) {
    return false;
  }

  const expectedPlanTokens = Number.isFinite(nextState.active_plan_tokens)
    ? nextState.active_plan_tokens
    : null;
  const minimumIncrease = expectedPlanTokens
    ? Math.max(10, Math.floor(expectedPlanTokens * 0.25))
    : 20;

  if (nextState.credit_balance - previousState.credit_balance < minimumIncrease) {
    return false;
  }

  if (!expectedPlanTokens) {
    return true;
  }

  return nextState.credit_balance >= expectedPlanTokens * 0.8;
}

function isPaymentFailedState(snapshot) {
  return (
    hasStatusToken(snapshot?.payment_status, [
      "payment_failed",
      "failed",
      "declined",
      "past_due",
      "unpaid",
    ]) ||
    hasStatusToken(snapshot?.subscription_status, [
      "payment_failed",
      "past_due",
      "unpaid",
    ])
  );
}

function isPausedState(snapshot) {
  return (
    hasStatusToken(snapshot?.subscription_status, [
      "paused",
      "pause",
      "on_hold",
      "suspended",
      "inactive",
      "cancelled",
      "canceled",
      "expired",
    ]) ||
    hasStatusToken(snapshot?.payment_status, [
      "paused",
      "on_hold",
      "suspended",
      "inactive",
    ])
  );
}

function buildBillingStateSnapshot(snapshot) {
  return {
    active_plan_id: normalizeTextValue(snapshot?.active_plan_id) || null,
    active_plan_name: normalizeTextValue(snapshot?.active_plan_name) || null,
    active_plan_level: normalizeTextValue(snapshot?.active_plan_level) || "free",
    active_plan_tokens: Number.isFinite(snapshot?.active_plan_tokens)
      ? snapshot.active_plan_tokens
      : null,
    is_paid_active: snapshot?.is_paid_active === true,
    subscription_status: normalizeStatusToken(snapshot?.subscription_status) || null,
    payment_status: normalizeStatusToken(snapshot?.payment_status) || null,
    renewal_date: normalizeTextValue(snapshot?.renewal_date) || null,
    expiry_date: normalizeTextValue(snapshot?.expiry_date) || null,
    credit_balance: Number.isFinite(snapshot?.credit_balance)
      ? snapshot.credit_balance
      : null,
  };
}

export function buildBillingSnapshot({ creditBalance, plans, profile }) {
  const subscriptionSnapshot = buildSubscriptionSnapshot({ plans, profile });

  return {
    ...subscriptionSnapshot,
    credit_balance: Number.isFinite(creditBalance) ? creditBalance : null,
  };
}

export async function loadCurrentBillingSnapshot({ profile } = {}) {
  const currentProfile = profile ?? (await loadCurrentUserProfile());
  const [plansResponse, creditBalanceResponse] = await Promise.all([
    apiFetchWithAuth("/v1/membership/plans", {
      method: "GET",
      cache: "no-store",
    }),
    apiFetchWithAuth("/v1/credit/balance", {
      method: "GET",
      cache: "no-store",
    }),
  ]);

  const plansPayload = assertApiSuccess(
    plansResponse,
    "Unable to load subscription plans",
  );
  const balancePayload = assertApiSuccess(
    creditBalanceResponse,
    "Unable to load credit balance",
  );
  const plans = extractPlans(plansPayload?.data ?? plansPayload);
  const creditBalance = extractCreditBalance(
    balancePayload?.data ?? balancePayload,
  );

  return buildBillingSnapshot({
    creditBalance,
    plans,
    profile: currentProfile,
  });
}

export async function createNotificationForUser({
  actionHref = "",
  actionLabel = "",
  category = "general",
  dedupeKey,
  description,
  metadata = {},
  priority = "normal",
  title,
  type,
  user,
}) {
  if (!user || !type || !title || !description) {
    return null;
  }

  await connectDB();

  const payload = {
    user,
    type,
    category,
    title,
    description,
    actionHref,
    actionLabel,
    priority,
    metadata,
  };

  if (dedupeKey) {
    const notification = await Notification.findOneAndUpdate(
      { dedupeKey, user },
      {
        $setOnInsert: {
          ...payload,
          dedupeKey,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    ).lean();

    return serializeNotification(notification);
  }

  const notification = await Notification.create(payload);
  return serializeNotification(notification.toObject());
}

export async function createNotificationForCurrentUser(payload) {
  return createNotificationForUser({
    ...payload,
    user: await resolveCurrentUserKey(),
  });
}

export async function getNotificationFeedForUser(
  user,
  { limit = DEFAULT_NOTIFICATION_LIMIT } = {},
) {
  await connectDB();

  const notifications = await Notification.find({ user })
    .lean()
    .sort({ createdAt: -1 })
    .limit(limit);
  const serializedNotifications = notifications
    .map(serializeNotification)
    .filter(Boolean);

  return {
    notifications: serializedNotifications,
    stats: calculateNotificationStats(serializedNotifications),
  };
}

export async function markAllNotificationsAsRead(user) {
  await connectDB();

  const result = await Notification.updateMany(
    {
      unread: true,
      user,
    },
    {
      $set: {
        unread: false,
        readAt: new Date(),
      },
    },
  );

  return result.modifiedCount ?? 0;
}

export async function markNotificationAsRead({ notificationId, user }) {
  await connectDB();

  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      user,
    },
    {
      $set: {
        unread: false,
        readAt: new Date(),
      },
    },
    {
      new: true,
    },
  ).lean();

  return serializeNotification(notification);
}

export async function syncBillingNotifications({ snapshot, user }) {
  if (!user || !snapshot) {
    return [];
  }

  await connectDB();

  const previousStateRecord = await NotificationState.findOne({
    scope: BILLING_NOTIFICATION_SCOPE,
    user,
  }).lean();
  const previousState = previousStateRecord?.data
    ? buildBillingStateSnapshot(previousStateRecord.data)
    : null;
  const nextState = buildBillingStateSnapshot(snapshot);

  await NotificationState.findOneAndUpdate(
    {
      scope: BILLING_NOTIFICATION_SCOPE,
      user,
    },
    {
      $set: {
        data: nextState,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  if (!previousState) {
    return [];
  }

  const createdNotifications = [];
  const didActivatePaidPlan =
    previousState.is_paid_active !== true && nextState.is_paid_active === true;
  const didChangePaidPlan =
    previousState.is_paid_active === true &&
    nextState.is_paid_active === true &&
    !isSamePlanState(previousState, nextState);
  const didLosePaidPlan =
    previousState.is_paid_active === true && nextState.is_paid_active !== true;
  const didTokenReset = shouldCreateTokenReset(previousState, nextState);
  const didRenewSubscription =
    previousState.is_paid_active === true &&
    nextState.is_paid_active === true &&
    isSamePlanState(previousState, nextState) &&
    (didTokenReset ||
      (normalizeTextValue(previousState.renewal_date) &&
        normalizeTextValue(nextState.renewal_date) &&
        previousState.renewal_date !== nextState.renewal_date));
  const paymentFailedNow = isPaymentFailedState(nextState);
  const paymentFailedBefore = isPaymentFailedState(previousState);
  const pausedNow = isPausedState(nextState);
  const pausedBefore = isPausedState(previousState);
  const currentPlanLabel = getPlanReferenceLabel(nextState);
  const previousPlanLabel = getPlanReferenceLabel(previousState, currentPlanLabel);

  if (didActivatePaidPlan) {
    createdNotifications.push(
      await createNotificationForUser({
        user,
        type: "subscription_activated",
        category: "billing",
        title: `${currentPlanLabel} is now active`,
        description:
          "Your membership sync completed successfully and premium access is ready in the app.",
        actionHref: "/plus-subscription",
        actionLabel: "View membership",
        priority: "normal",
        metadata: {
          active_plan_id: nextState.active_plan_id,
        },
      }),
    );
  } else if (didChangePaidPlan) {
    createdNotifications.push(
      await createNotificationForUser({
        user,
        type: "subscription_changed",
        category: "billing",
        title: "Subscription updated",
        description: `${previousPlanLabel} changed to ${currentPlanLabel}.`,
        actionHref: "/plus-subscription",
        actionLabel: "Review membership",
        priority: "normal",
        metadata: {
          active_plan_id: nextState.active_plan_id,
          previous_plan_id: previousState.active_plan_id,
        },
      }),
    );
  }

  if (paymentFailedNow && !paymentFailedBefore) {
    createdNotifications.push(
      await createNotificationForUser({
        user,
        type: "payment_failed",
        category: "billing",
        title: "Payment failed",
        description: `We could not renew ${currentPlanLabel}. Review your billing details to keep premium access uninterrupted.`,
        actionHref: "/settings/payment-methods",
        actionLabel: "Review billing",
        priority: "high",
        metadata: {
          active_plan_id: nextState.active_plan_id,
          payment_status: nextState.payment_status,
        },
      }),
    );
  } else if ((pausedNow && !pausedBefore) || didLosePaidPlan) {
    createdNotifications.push(
      await createNotificationForUser({
        user,
        type: "subscription_paused",
        category: "billing",
        title: "Subscription paused",
        description: `${previousPlanLabel} is no longer active in the app. Resume or update billing to restore premium access.`,
        actionHref: "/plus-subscription",
        actionLabel: "Open membership",
        priority: "high",
        metadata: {
          active_plan_id: nextState.active_plan_id || previousState.active_plan_id,
          subscription_status: nextState.subscription_status,
        },
      }),
    );
  }

  if (didRenewSubscription) {
    createdNotifications.push(
      await createNotificationForUser({
        user,
        type: "subscription_renewed",
        category: "billing",
        title: "Subscription renewed",
        description: `${currentPlanLabel} renewed successfully and your premium access remains active.`,
        actionHref: "/plus-subscription",
        actionLabel: "View membership",
        priority: "normal",
        metadata: {
          active_plan_id: nextState.active_plan_id,
          renewal_date: nextState.renewal_date,
        },
      }),
    );
  }

  if (didTokenReset) {
    createdNotifications.push(
      await createNotificationForUser({
        user,
        type: "token_cycle_reset",
        category: "credits",
        title: "Token cycle reset",
        description: Number.isFinite(nextState.credit_balance)
          ? `Your token balance was refreshed to ${formatCreditAmount(nextState.credit_balance)}.`
          : "Your token balance was refreshed for the new billing cycle.",
        actionHref: "/settings/credits",
        actionLabel: "View credits",
        priority: "normal",
        metadata: {
          active_plan_id: nextState.active_plan_id,
          credit_balance: nextState.credit_balance,
        },
      }),
    );
  }

  return createdNotifications.filter(Boolean);
}
