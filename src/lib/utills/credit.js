const CREDIT_BALANCE_PATHS = [
  ["balance"],
  ["credit_balance"],
  ["available_balance"],
  ["current_balance"],
  ["wallet_balance"],
  ["credits"],
  ["remaining_credits"],
  ["data", "balance"],
  ["data", "credit_balance"],
  ["data", "available_balance"],
  ["data", "current_balance"],
  ["data", "wallet_balance"],
  ["data", "credits"],
  ["data", "remaining_credits"],
  ["data", "data", "balance"],
  ["data", "data", "credit_balance"],
  ["data", "data", "available_balance"],
  ["data", "data", "current_balance"],
  ["data", "data", "wallet_balance"],
  ["data", "data", "credits"],
  ["data", "data", "remaining_credits"],
];

const CREDIT_USAGE_PATHS = [
  ["tokens_used"],
  ["used_tokens"],
  ["token_used"],
  ["total_tokens"],
  ["completion_tokens"],
  ["usage", "total_tokens"],
  ["usage", "used_tokens"],
  ["usage", "tokens_used"],
  ["usage", "completion_tokens"],
  ["token_usage", "total_tokens"],
  ["token_usage", "used_tokens"],
  ["token_usage", "tokens_used"],
  ["data", "tokens_used"],
  ["data", "used_tokens"],
  ["data", "total_tokens"],
  ["data", "usage", "total_tokens"],
  ["metadata", "tokens_used"],
  ["metadata", "used_tokens"],
  ["metadata", "total_tokens"],
];

const REMAINING_TOKEN_PATHS = [
  ["remaining_tokens"],
  ["tokens_remaining"],
  ["remaining_balance"],
  ["data", "remaining_tokens"],
  ["data", "tokens_remaining"],
  ["metadata", "remaining_tokens"],
  ["metadata", "tokens_remaining"],
];

const PLAN_CREDIT_PATHS = [
  ["credits"],
  ["credit_amount"],
  ["credit_balance"],
  ["included_credits"],
  ["monthly_credits"],
  ["token_allowance"],
  ["tokens"],
  ["topup_amount"],
  ["data", "credits"],
  ["data", "credit_amount"],
  ["data", "included_credits"],
  ["data", "monthly_credits"],
  ["metadata", "credits"],
  ["metadata", "credit_amount"],
];

const DEFAULT_PLAN_CREDIT_AMOUNTS = {
  plus: 100,
  team: 300,
};

function getValueAtPath(payload, path) {
  return path.reduce(
    (currentValue, key) =>
      currentValue && typeof currentValue === "object"
        ? currentValue[key]
        : undefined,
    payload,
  );
}

function normalizeCreditValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalizedValue = Number(value.replace(/,/g, "").trim());
    return Number.isFinite(normalizedValue) ? normalizedValue : null;
  }

  return null;
}

function getFirstNumericValue(payload, paths) {
  const directValue = normalizeCreditValue(payload);

  if (directValue !== null) {
    return directValue;
  }

  for (const path of paths) {
    const candidate = normalizeCreditValue(getValueAtPath(payload, path));

    if (candidate !== null) {
      return candidate;
    }
  }

  return null;
}

export function extractCreditBalance(payload) {
  return getFirstNumericValue(payload, CREDIT_BALANCE_PATHS);
}

export function extractUsedTokens(payload) {
  return getFirstNumericValue(payload, CREDIT_USAGE_PATHS);
}

export function extractRemainingTokens(payload) {
  return getFirstNumericValue(payload, REMAINING_TOKEN_PATHS);
}

export function extractPlanCreditAmount(payload) {
  return getFirstNumericValue(payload, PLAN_CREDIT_PATHS);
}

export function resolvePurchaseCreditAmount(plan) {
  const explicitCreditAmount = extractPlanCreditAmount(plan);

  if (explicitCreditAmount !== null) {
    return explicitCreditAmount;
  }

  const normalizedName =
    typeof plan?.name === "string" ? plan.name.trim().toLowerCase() : "";

  if (
    normalizedName.includes("free") ||
    normalizedName.includes("starter") ||
    normalizedName.includes("basic")
  ) {
    return 0;
  }

  for (const [planName, amount] of Object.entries(DEFAULT_PLAN_CREDIT_AMOUNTS)) {
    if (normalizedName.includes(planName)) {
      return amount;
    }
  }

  const billingAmount = normalizeCreditValue(
    plan?.billing_amount ?? plan?.price ?? plan?.amount,
  );

  if (billingAmount === null || billingAmount <= 0) {
    return 0;
  }

  return Math.max(Math.round(billingAmount * 10), 50);
}

export function extractChatCreditDebit(payload, openingBalance = null) {
  const usedTokens = extractUsedTokens(payload);

  if (usedTokens !== null) {
    return usedTokens;
  }

  const remainingTokens = extractRemainingTokens(payload);

  if (
    remainingTokens !== null &&
    typeof openingBalance === "number" &&
    Number.isFinite(openingBalance)
  ) {
    const computedDebit = openingBalance - remainingTokens;
    return computedDebit > 0 ? computedDebit : 0;
  }

  return null;
}

export function formatCreditAmount(value, { compact = false } = {}) {
  if (!Number.isFinite(value)) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: compact ? 1 : Number.isInteger(value) ? 0 : 2,
    notation: compact ? "compact" : "standard",
  }).format(value);
}

export function buildChatCreditReference() {
  return `chat_${Date.now()}`;
}

export function buildPlanPurchaseReference(planName) {
  const normalizedName =
    typeof planName === "string" && planName.trim()
      ? planName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_")
      : "plan";

  return `subscription_${normalizedName}_${Date.now()}`;
}
