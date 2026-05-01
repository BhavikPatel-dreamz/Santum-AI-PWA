import { extractPlanCreditAmount } from "./credit";

const TRUE_VALUES = new Set([
  "1",
  "true",
  "yes",
  "active",
  "current",
  "selected",
  "subscribed",
]);

const FALSE_VALUES = new Set([
  "0",
  "false",
  "no",
  "inactive",
  "expired",
  "cancelled",
  "canceled",
]);

const PLAN_RECORD_KEYS = [
  "membership",
  "current_membership",
  "active_membership",
  "subscription",
  "current_subscription",
  "active_subscription",
  "plan",
  "current_plan",
  "active_plan",
];

const PLAN_LIST_KEYS = ["memberships", "subscriptions", "plans"];

const PLAN_ID_KEYS = [
  "membership_id",
  "membershipId",
  "subscription_id",
  "subscriptionId",
  "plan_id",
  "planId",
  "membership_plan_id",
  "membershipPlanId",
  "level_id",
  "levelId",
  "level",
  "plan",
  "id",
];

const PLAN_NAME_KEYS = [
  "membership_name",
  "membershipName",
  "subscription_name",
  "subscriptionName",
  "plan_name",
  "planName",
  "title",
  "name",
  "slug",
];

const PLAN_LEVEL_KEYS = [
  "plan_level",
  "planLevel",
  "membership_level",
  "membershipLevel",
  "plan_type",
  "planType",
];

const SUBSCRIPTION_STATUS_KEYS = [
  "membership_status",
  "membershipStatus",
  "subscription_status",
  "subscriptionStatus",
  "plan_status",
  "planStatus",
  "status",
  "state",
];

const PAYMENT_STATUS_KEYS = [
  "payment_status",
  "paymentStatus",
  "billing_status",
  "billingStatus",
  "invoice_status",
  "invoiceStatus",
  "renewal_status",
  "renewalStatus",
];

const RENEWAL_DATE_KEYS = [
  "next_billing_date",
  "nextBillingDate",
  "renewal_date",
  "renewalDate",
  "renewed_at",
  "renewedAt",
  "billing_date",
  "billingDate",
];

const EXPIRY_DATE_KEYS = [
  "expires_at",
  "expiresAt",
  "expiry_date",
  "expiryDate",
  "expiration_date",
  "expirationDate",
  "end_date",
  "endDate",
];

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

function normalizeNumericValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value.replace(/,/g, "").trim());
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  return null;
}

function normalizeFlagValue(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();

    if (TRUE_VALUES.has(normalizedValue)) {
      return true;
    }

    if (FALSE_VALUES.has(normalizedValue)) {
      return false;
    }
  }

  return null;
}

function normalizeStatusToken(value) {
  return normalizeTextValue(value)
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function dedupe(values) {
  return [...new Set(values.filter(Boolean))];
}

function getObjectValue(record, key) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return undefined;
  }

  return record[key];
}

function isAbsoluteHttpUrl(value) {
  const normalizedValue = normalizeTextValue(value);

  if (!normalizedValue) {
    return false;
  }

  try {
    const parsedUrl = new URL(normalizedValue);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

function getCheckoutUrlLevel(value) {
  if (!isAbsoluteHttpUrl(value)) {
    return "";
  }

  try {
    return normalizeTextValue(new URL(value).searchParams.get("level"));
  } catch {
    return "";
  }
}

function collectActiveRecord(records) {
  if (!Array.isArray(records)) {
    return null;
  }

  return (
    records.find((record) => isPlanExplicitlyActive(record)) ??
    records.find((record) => record && typeof record === "object") ??
    null
  );
}

function collectPlanRecords(profile) {
  const records = [];

  if (profile && typeof profile === "object" && !Array.isArray(profile)) {
    records.push(profile);

    for (const key of PLAN_RECORD_KEYS) {
      const value = getObjectValue(profile, key);

      if (value && typeof value === "object" && !Array.isArray(value)) {
        records.push(value);
      }
    }

    for (const key of PLAN_LIST_KEYS) {
      const activeRecord = collectActiveRecord(getObjectValue(profile, key));

      if (activeRecord) {
        records.push(activeRecord);
      }
    }
  }

  return records;
}

function collectScalarValues(record, keys) {
  const values = [];

  for (const key of keys) {
    const rawValue = getObjectValue(record, key);

    if (Array.isArray(rawValue)) {
      rawValue.forEach((value) => {
        const normalizedValue = normalizeTextValue(value);

        if (normalizedValue) {
          values.push(normalizedValue);
        }
      });
      continue;
    }

    const normalizedValue = normalizeTextValue(rawValue);

    if (normalizedValue) {
      values.push(normalizedValue);
    }
  }

  return values;
}

function getFirstRecordValue(records, keys, normalizer = normalizeTextValue) {
  for (const record of records) {
    const value = collectScalarValues(record, keys)
      .map((candidate) => normalizer(candidate))
      .find(Boolean);

    if (value) {
      return value;
    }
  }

  return "";
}

export function normalizePlanName(value) {
  return normalizeTextValue(value).toLowerCase();
}

export function getPlanCheckoutUrl(plan) {
  const rawUrl = normalizeTextValue(plan?.url ?? plan?.checkout_url ?? plan?.href);
  return isAbsoluteHttpUrl(rawUrl) ? rawUrl : null;
}

export function getPlanId(plan) {
  for (const key of PLAN_ID_KEYS) {
    const candidate = normalizeTextValue(plan?.[key]);

    if (candidate) {
      return candidate;
    }
  }

  return getCheckoutUrlLevel(getPlanCheckoutUrl(plan));
}

export function getPlanName(plan) {
  return normalizeTextValue(plan?.name ?? plan?.title ?? plan?.plan_name);
}

export function getPlanPrice(plan) {
  const price =
    normalizeNumericValue(
      plan?.billing_amount ?? plan?.price ?? plan?.amount ?? plan?.initial_payment,
    ) ?? 0;

  return price > 0 ? price : 0;
}

export function getPlanTokenLimit(plan) {
  const tokenAmount = extractPlanCreditAmount(plan);
  return Number.isFinite(tokenAmount) ? tokenAmount : null;
}

export function getPlanLevel(plan) {
  const explicitLevel = [
    ...collectScalarValues(plan, PLAN_LEVEL_KEYS),
    normalizeTextValue(plan?.slug),
    getPlanName(plan),
  ]
    .map(normalizePlanName)
    .find(Boolean);

  if (explicitLevel) {
    if (
      explicitLevel.includes("premium") ||
      explicitLevel.includes("plus") ||
      explicitLevel.includes("pro")
    ) {
      return "premium";
    }

    if (
      explicitLevel.includes("free") ||
      explicitLevel.includes("starter") ||
      explicitLevel.includes("basic")
    ) {
      return "free";
    }

    if (explicitLevel.includes("standard")) {
      return "standard";
    }
  }

  return getPlanPrice(plan) > 0 ? "premium" : "free";
}

export function isPlanExplicitlyActive(plan) {
  if (!plan || typeof plan !== "object") {
    return false;
  }

  const activeKeys = [
    "active",
    "is_active",
    "isActive",
    "current",
    "is_current",
    "isCurrent",
    "selected",
    "is_selected",
    "isSelected",
    "subscribed",
    "is_subscribed",
    "isSubscribed",
    "status",
  ];

  return activeKeys.some((key) => normalizeFlagValue(plan[key]) === true);
}

export function extractProfilePlanReferences(profile) {
  const records = collectPlanRecords(profile);
  const ids = [];
  const names = [];
  const levels = [];

  for (const record of records) {
    ids.push(...collectScalarValues(record, PLAN_ID_KEYS));
    names.push(...collectScalarValues(record, PLAN_NAME_KEYS));
    levels.push(...collectScalarValues(record, PLAN_LEVEL_KEYS));
  }

  return {
    ids: dedupe(ids),
    names: dedupe(names.map(normalizePlanName)),
    levels: dedupe(levels.map(normalizePlanName)),
  };
}

export function resolveActiveSubscriptionPlan({ plans, profile }) {
  if (!Array.isArray(plans) || plans.length === 0) {
    return null;
  }

  const explicitlyActivePlan = plans.find((plan) => isPlanExplicitlyActive(plan));

  if (explicitlyActivePlan) {
    return explicitlyActivePlan;
  }

  const profileReferences = extractProfilePlanReferences(profile);

  if (profileReferences.ids.length > 0) {
    const matchedPlanById = plans.find((plan) => {
      const planId = getPlanId(plan);
      return planId ? profileReferences.ids.includes(planId) : false;
    });

    if (matchedPlanById) {
      return matchedPlanById;
    }
  }

  if (profileReferences.names.length > 0) {
    const matchedPlanByName = plans.find((plan) =>
      profileReferences.names.includes(normalizePlanName(getPlanName(plan))),
    );

    if (matchedPlanByName) {
      return matchedPlanByName;
    }
  }

  if (profileReferences.levels.length > 0) {
    const matchedPlanByLevel = plans.find((plan) =>
      profileReferences.levels.includes(normalizePlanName(getPlanLevel(plan))),
    );

    if (matchedPlanByLevel) {
      return matchedPlanByLevel;
    }
  }

  return (
    plans.find((plan) => getPlanLevel(plan) === "free") ??
    plans.find((plan) => getPlanPrice(plan) <= 0) ??
    plans[0]
  );
}

export function isSamePlan(plan, reference = {}) {
  const planId = normalizeTextValue(getPlanId(plan));
  const referenceId = normalizeTextValue(
    reference?.active_plan_id ?? reference?.plan_id ?? reference?.id,
  );

  if (planId && referenceId) {
    return planId === referenceId;
  }

  const planName = normalizePlanName(getPlanName(plan));
  const referenceName = normalizePlanName(
    reference?.active_plan_name ?? reference?.plan_name ?? reference?.name,
  );

  return Boolean(planName && referenceName && planName === referenceName);
}

export function buildSubscriptionSnapshot({ plans, profile }) {
  const activePlan = resolveActiveSubscriptionPlan({ plans, profile });
  const planRecords = activePlan
    ? [activePlan, ...collectPlanRecords(profile)]
    : collectPlanRecords(profile);
  const activePlanId = activePlan ? getPlanId(activePlan) : null;
  const activePlanName = activePlan ? getPlanName(activePlan) : null;
  const activePlanLevel = activePlan ? getPlanLevel(activePlan) : "free";
  const activePlanTokens = activePlan ? getPlanTokenLimit(activePlan) : null;
  const activePlanCheckoutUrl = activePlan ? getPlanCheckoutUrl(activePlan) : null;
  const isPaidActive = activePlan ? getPlanPrice(activePlan) > 0 : false;
  const subscriptionStatus = getFirstRecordValue(
    planRecords,
    SUBSCRIPTION_STATUS_KEYS,
    normalizeStatusToken,
  );
  const paymentStatus = getFirstRecordValue(
    planRecords,
    PAYMENT_STATUS_KEYS,
    normalizeStatusToken,
  );
  const renewalDate = getFirstRecordValue(planRecords, RENEWAL_DATE_KEYS);
  const expiryDate = getFirstRecordValue(planRecords, EXPIRY_DATE_KEYS);

  return {
    has_active_plan: Boolean(activePlan),
    active_plan_id: activePlanId || null,
    active_plan_name: activePlanName || null,
    active_plan_level: activePlanLevel,
    active_plan_tokens: Number.isFinite(activePlanTokens) ? activePlanTokens : null,
    active_plan_checkout_url: activePlanCheckoutUrl,
    is_paid_active: isPaidActive,
    subscription_status: subscriptionStatus || null,
    payment_status: paymentStatus || null,
    renewal_date: renewalDate || null,
    expiry_date: expiryDate || null,
  };
}

export function buildSubscriptionStatus({ plans, profile }) {
  return buildSubscriptionSnapshot({ plans, profile });
}
