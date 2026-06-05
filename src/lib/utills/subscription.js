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
  "active_plan_id",
  "activePlanId",
  "current_plan_id",
  "currentPlanId",
  "active_membership_id",
  "activeMembershipId",
  "current_membership_id",
  "currentMembershipId",
  "active_subscription_id",
  "activeSubscriptionId",
  "current_subscription_id",
  "currentSubscriptionId",
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
  "active_plan_name",
  "activePlanName",
  "current_plan_name",
  "currentPlanName",
  "active_membership_name",
  "activeMembershipName",
  "current_membership_name",
  "currentMembershipName",
  "active_subscription_name",
  "activeSubscriptionName",
  "current_subscription_name",
  "currentSubscriptionName",
  "membership_name",
  "membershipName",
  "membership_title",
  "membershipTitle",
  "subscription_name",
  "subscriptionName",
  "plan_name",
  "planName",
  "title",
  "name",
  "slug",
];

const PLAN_LEVEL_KEYS = [
  "active_plan_level",
  "activePlanLevel",
  "current_plan_level",
  "currentPlanLevel",
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

const START_DATE_KEYS = ["start_date", "startDate", "started_at", "startedAt"];

const CYCLE_PERIOD_KEYS = [
  "cycle_period",
  "cyclePeriod",
  "billing_cycle",
  "billingCycle",
  "renewal_cycle",
  "renewalCycle",
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

const DESCRIPTION_KEYS = [
  "membership_description",
  "membershipDescription",
  "description",
  "summary",
];

const FEATURE_KEYS = ["features", "benefits", "included_features"];

const PAID_PLAN_PURCHASE_BLOCK_MESSAGE =
  "Cancel auto-pay for your current plan and wait until it ends before buying another plan.";

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

function normalizeDateValue(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
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
  const rawUrl = normalizeTextValue(
    plan?.url ?? plan?.checkout_url ?? plan?.href,
  );
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
  return normalizeTextValue(
    plan?.name ?? plan?.title ?? plan?.plan_name ?? plan?.membership_title,
  );
}

export function getPlanPrice(plan) {
  const price =
    normalizeNumericValue(
      plan?.billing_amount ??
        plan?.price ??
        plan?.amount ??
        plan?.initial_payment,
    ) ?? 0;

  return price > 0 ? price : 0;
}

export function getPlanTokenLimit(plan) {
  const tokenAmount = extractPlanCreditAmount(plan);
  return Number.isFinite(tokenAmount) ? tokenAmount : null;
}

export function normalizeHighlightedFlag(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    return ["1", "true", "yes"].includes(value.trim().toLowerCase());
  }

  return false;
}

export function getPlanKey(plan, index = 0) {
  const planId = getPlanId(plan);

  if (planId) {
    return planId;
  }

  if (typeof plan?.slug === "string" && plan.slug.trim()) {
    return plan.slug.trim();
  }

  if (typeof plan?.name === "string" && plan.name.trim()) {
    return plan.name.trim().toLowerCase();
  }

  return `plan-${index}`;
}

export function enrichSubscriptionPlan(plan, index = 0) {
  const hasHighlightedFlag =
    plan && Object.prototype.hasOwnProperty.call(plan, "highlighted");
  const planFeatures = getPlanFeatures(plan);

  return {
    ...plan,
    name: getPlanName(plan) || `Plan ${index + 1}`,
    description:
      getPlanDescription(plan) ||
      "Review your membership details, then continue to Santum.net to complete checkout.",
    features: planFeatures,
    highlighted: hasHighlightedFlag
      ? normalizeHighlightedFlag(plan.highlighted)
      : false,
    billing_amount: plan?.billing_amount ?? getPlanPrice(plan),
    tokens: getPlanTokenLimit(plan),
  };
}

export function getPlanPurchaseHref(plan, source = "plans") {
  if (!plan) {
    return "/buy-plan";
  }

  const params = new URLSearchParams();
  params.set("plan", getPlanKey(plan));

  if (source) {
    params.set("source", source);
  }

  return `/buy-plan?${params.toString()}`;
}

export function getPlanPurchaseHrefByLevel(level, source = "current-plan") {
  const normalizedLevel = normalizeTextValue(level).toLowerCase();
  const params = new URLSearchParams();

  if (normalizedLevel) {
    params.set("plan", normalizedLevel);
  }

  if (source) {
    params.set("source", source);
  }

  const queryString = params.toString();
  return queryString ? `/buy-plan?${queryString}` : "/buy-plan";
}

export function findPlanByPurchaseReference(plans, reference) {
  const normalizedReference = normalizeTextValue(reference).toLowerCase();

  if (!normalizedReference || !Array.isArray(plans) || plans.length === 0) {
    return null;
  }

  return (
    plans.find((plan, index) => {
      const planKey = normalizeTextValue(getPlanKey(plan, index)).toLowerCase();
      const planId = normalizeTextValue(getPlanId(plan)).toLowerCase();
      const planName = normalizePlanName(getPlanName(plan));
      const planSlug = normalizeTextValue(plan?.slug).toLowerCase();
      const planLevel = normalizeTextValue(getPlanLevel(plan)).toLowerCase();

      return [
        planKey,
        planId,
        planName,
        planSlug,
        planLevel,
      ].includes(normalizedReference);
    }) ?? null
  );
}

function getPlanDescription(plan) {
  for (const key of DESCRIPTION_KEYS) {
    const candidate = normalizeTextValue(plan?.[key]);

    if (candidate) {
      return candidate;
    }
  }

  return "";
}

function getPlanCyclePeriod(planRecords) {
  return getFirstRecordValue(planRecords, CYCLE_PERIOD_KEYS);
}

function getPlanFeatures(plan) {
  if (!plan || typeof plan !== "object" || Array.isArray(plan)) {
    return [];
  }

  for (const key of FEATURE_KEYS) {
    const value = plan[key];

    if (Array.isArray(value)) {
      return value
        .map((feature) => {
          if (typeof feature === "string") {
            return feature.trim();
          }

          if (
            feature &&
            typeof feature === "object" &&
            !Array.isArray(feature)
          ) {
            return normalizeTextValue(
              feature.title ??
                feature.label ??
                feature.name ??
                feature.description,
            );
          }

          return "";
        })
        .filter(Boolean);
    }
  }

  return [];
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

export function getPlanPurchaseBlockReason(plan, subscriptionStatus) {
  if (!plan || getPlanPrice(plan) <= 0) {
    return "";
  }

  const activePlanLevel = normalizeTextValue(
    subscriptionStatus?.active_plan_level,
  ).toLowerCase();
  const activePlanBillingAmount = normalizeNumericValue(
    subscriptionStatus?.active_plan_billing_amount,
  );
  const isPaidPlanActive =
    subscriptionStatus?.is_paid_active === true ||
    activePlanLevel === "standard" ||
    activePlanLevel === "premium" ||
    (activePlanBillingAmount !== null && activePlanBillingAmount > 0);
  const expiryDate = normalizeDateValue(subscriptionStatus?.expiry_date);
  const hasEnded = expiryDate ? expiryDate.getTime() <= Date.now() : false;

  if (isPaidPlanActive && !hasEnded) {
    return PAID_PLAN_PURCHASE_BLOCK_MESSAGE;
  }

  return "";
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

function isPlanMarkedCurrent(plan) {
  if (!plan || typeof plan !== "object") {
    return false;
  }

  const currentKeys = [
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
  ];

  return currentKeys.some((key) => normalizeFlagValue(plan[key]) === true);
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

  const profileReferences = extractProfilePlanReferences(profile);

  if (profileReferences.ids.length > 0) {
    let nextindex;
    const matchedPlanById = plans.find((plan, index) => {
      nextindex = plans.length - 1 != index ? index + 1 : null;
      const planId = getPlanId(plan);
      return planId ? profileReferences.ids.includes(planId) : false;
    });

    if (matchedPlanById) {
      return {
        ...matchedPlanById,
        nextplan:
          nextindex != null
            ? `Upgrade to ${plans[nextindex].name}`
            : "View Plans",
      };
    }
  }

  if (profileReferences.names.length > 0) {
    let nextindex;
    const matchedPlanByName = plans.find((plan, index) => {
      nextindex = plans.length - 1 != index ? index + 1 : null;
      return profileReferences.names.includes(
        normalizePlanName(getPlanName(plan)),
      );
    });

    if (matchedPlanByName) {
      return {
        ...matchedPlanByName,
        nextplan:
          nextindex != null
            ? `Upgrade to ${plans[nextindex].name}`
            : "View Plans",
      };
    }
  }

  if (profileReferences.levels.length > 0) {
    let nextindex;
    const matchedPlanByLevel = plans.find((plan, index) => {
      nextindex = plans.length - 1 != index ? index + 1 : null;
      return profileReferences.levels.includes(
        normalizePlanName(getPlanLevel(plan)),
      );
    });

    if (matchedPlanByLevel) {
      return {
        ...matchedPlanByLevel,
        nextplan:
          nextindex != null
            ? `Upgrade to ${plans[nextindex].name}`
            : "View Plans",
      };
    }
  }

  return plans.find((plan) => isPlanMarkedCurrent(plan)) ?? null;
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
  const activePlanCheckoutUrl = activePlan
    ? getPlanCheckoutUrl(activePlan)
    : null;
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
  const startDate = getFirstRecordValue(planRecords, START_DATE_KEYS);
  const expiryDate = getFirstRecordValue(planRecords, EXPIRY_DATE_KEYS);
  const cyclePeriod = getPlanCyclePeriod(planRecords);
  const activePlanDescription = activePlan
    ? getPlanDescription(activePlan) ||
      getFirstRecordValue(planRecords, DESCRIPTION_KEYS)
    : getFirstRecordValue(planRecords, DESCRIPTION_KEYS);
  const activePlanFeatures = activePlan ? getPlanFeatures(activePlan) : [];

  return {
    has_active_plan: Boolean(activePlan),
    active_plan_id: activePlanId || null,
    active_plan_name: activePlanName || null,
    active_plan_level: activePlanLevel,
    active_plan_tokens: Number.isFinite(activePlanTokens)
      ? activePlanTokens
      : null,
    active_plan_checkout_url: activePlanCheckoutUrl,
    active_plan_description: activePlanDescription || null,
    active_plan_features: activePlanFeatures,
    active_plan_billing_amount: activePlan ? getPlanPrice(activePlan) : null,
    is_paid_active: isPaidActive,
    next_plan_name: activePlan?.nextplan,
    subscription_status: subscriptionStatus || null,
    payment_status: paymentStatus || null,
    start_date: startDate || null,
    renewal_date: renewalDate || null,
    expiry_date: expiryDate || null,
    cycle_period: cyclePeriod || null,
  };
}

export function buildSubscriptionStatus({ plans, profile }) {
  return buildSubscriptionSnapshot({ plans, profile });
}
