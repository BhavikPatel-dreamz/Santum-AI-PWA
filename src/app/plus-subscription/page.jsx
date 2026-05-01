"use client";

import FeatureShowcaseCard from "@/components/app/FeatureShowcaseCard";
import StepPageShell from "@/components/app/StepPageShell";
import { useTheme } from "@/components/providers/ThemeProvider";
import { getClientErrorMessage, isUnauthorizedError } from "@/lib/api/error";
import {
  useGetCreditBalanceQuery,
  useGetSubscriptionPlansQuery,
  useGetSubscriptionStatusQuery,
} from "@/lib/store";
import { extractCreditBalance, formatCreditAmount } from "@/lib/utills/credit";
import {
  getPlanCheckoutUrl,
  getPlanId,
  getPlanName,
  getPlanPrice,
  getPlanTokenLimit,
  isSamePlan,
  normalizePlanName,
} from "@/lib/utills/subscription";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";
import toast from "react-hot-toast";

const CHECKOUT_SYNC_STORAGE_KEY = "santum-membership-checkout";
const SYNC_POLLING_INTERVAL = 10000;

const PLANS = [
  {
    name: "Free Membership",
    billing_amount: 0,
    description:
      "A supportive everyday chat space with the core Amigo wellbeing experience.",
    features: [
      "Text-based support chats",
      "Daily mood check-ins",
      "Saved conversation history",
    ],
    highlighted: false,
    tokens: 200,
  },
  {
    name: "Premium Membership",
    billing_amount: 100,
    description:
      "A stronger fit for members who want deeper support, more continuity, and faster replies.",
    features: [
      "Priority support responses",
      "Longer conversation memory",
      "Guided reflection tools",
    ],
    highlighted: true,
    tokens: 20000,
  },
];

function normalizeHighlightedFlag(value) {
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

function readCheckoutSyncState() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawState = window.localStorage.getItem(CHECKOUT_SYNC_STORAGE_KEY);

    if (!rawState) {
      return null;
    }

    const parsedState = JSON.parse(rawState);

    if (!parsedState || typeof parsedState !== "object") {
      return null;
    }

    return {
      checkoutUrl:
        typeof parsedState.checkoutUrl === "string"
          ? parsedState.checkoutUrl
          : "",
      expectedPlanId:
        typeof parsedState.expectedPlanId === "string"
          ? parsedState.expectedPlanId
          : "",
      expectedPlanName:
        typeof parsedState.expectedPlanName === "string"
          ? parsedState.expectedPlanName
          : "",
      previousPlanId:
        typeof parsedState.previousPlanId === "string"
          ? parsedState.previousPlanId
          : "",
      startedAt:
        typeof parsedState.startedAt === "number"
          ? parsedState.startedAt
          : Date.now(),
    };
  } catch {
    return null;
  }
}

function persistCheckoutSyncState(value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    CHECKOUT_SYNC_STORAGE_KEY,
    JSON.stringify(value),
  );
}

function clearCheckoutSyncState() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(CHECKOUT_SYNC_STORAGE_KEY);
}

function getPlanKey(plan, index) {
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

function enrichPlan(plan, index) {
  const fallbackPlan =
    PLANS.find(
      (candidate) =>
        normalizePlanName(candidate.name) === normalizePlanName(plan?.name),
    ) ?? PLANS[index];

  const hasHighlightedFlag =
    plan && Object.prototype.hasOwnProperty.call(plan, "highlighted");
  const planFeatures =
    Array.isArray(plan?.features) && plan.features.length > 0
      ? plan.features
      : (fallbackPlan?.features ?? []);

  return {
    ...fallbackPlan,
    ...plan,
    name: getPlanName(plan) || fallbackPlan?.name || `Plan ${index + 1}`,
    description:
      plan?.description ||
      fallbackPlan?.description ||
      "Complete checkout on Santum.net, then return here to refresh access.",
    features: planFeatures,
    highlighted: hasHighlightedFlag
      ? normalizeHighlightedFlag(plan.highlighted)
      : Boolean(fallbackPlan?.highlighted),
    billing_amount:
      plan?.billing_amount ??
      fallbackPlan?.billing_amount ??
      getPlanPrice(plan),
    tokens: getPlanTokenLimit(plan) ?? fallbackPlan?.tokens ?? null,
  };
}

function findPlanByReference(plans, reference) {
  if (!reference || !Array.isArray(plans) || plans.length === 0) {
    return null;
  }

  return plans.find((plan) => isSamePlan(plan, reference)) ?? null;
}

function getDefaultSelectedPlanKey(plans, preferredReference) {
  const defaultPlan =
    findPlanByReference(plans, preferredReference) ||
    plans.find((plan) => Boolean(plan.highlighted)) ||
    plans.find((plan) => getPlanPrice(plan) > 0) ||
    plans[0] ||
    null;

  if (!defaultPlan) {
    return null;
  }

  return getPlanKey(defaultPlan, plans.indexOf(defaultPlan));
}

function getBenefitsPanelClasses(isDark) {
  return isDark
    ? "border border-[#27322d] bg-[linear-gradient(135deg,#17211c_0%,#101713_100%)] text-white shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
    : "bg-[#0F0F0F] text-white";
}

function getPlanCardClasses({ isDark, isSelected, isHighlighted }) {
  if (isSelected) {
    return isDark
      ? "border-[#2FD97C] bg-[linear-gradient(135deg,#183324_0%,#112119_55%,#1a2a21_100%)] shadow-[0_16px_36px_rgba(0,0,0,0.28)]"
      : "border-[#00D061] bg-[linear-gradient(135deg,#F3FFF8_0%,#FFFFFF_100%)] shadow-[0_16px_36px_rgba(0,208,97,0.12)]";
  }

  if (isHighlighted) {
    return isDark
      ? "border-[#294536] bg-[linear-gradient(135deg,#151d19_0%,#112018_100%)] shadow-[0_14px_32px_rgba(0,0,0,0.2)]"
      : "border-[#D6F5E4] bg-[linear-gradient(135deg,#FCFFFD_0%,#FFFFFF_100%)]";
  }

  return isDark
    ? "theme-card border shadow-[0_14px_32px_rgba(0,0,0,0.2)]"
    : "border-[#EEF6F1] bg-white shadow-[0_12px_30px_rgba(15,15,15,0.04)]";
}

function getPricePillClasses(isDark) {
  return isDark
    ? "border border-[#2F3A34] bg-[#0B1210] text-white"
    : "bg-[#0F0F0F] text-white";
}

function getSelectedBadgeClasses(isDark) {
  return isDark ? "bg-white text-[#07110D]" : "bg-[#0F0F0F] text-white";
}

function getPurchaseSummaryClasses(isDark) {
  return isDark
    ? "border-[#28523B] bg-[linear-gradient(135deg,#102118_0%,#17251D_100%)]"
    : "border-[#BDECCE] bg-[#F3FFF8]";
}

function buildPurchaseSummary({
  balanceResponse,
  fallbackPlanName,
  subscriptionStatus,
}) {
  const updatedBalance = extractCreditBalance(balanceResponse);

  return {
    plan_name:
      subscriptionStatus?.active_plan_name || fallbackPlanName || "Membership",
    plan_tokens: Number.isFinite(subscriptionStatus?.active_plan_tokens)
      ? subscriptionStatus.active_plan_tokens
      : null,
    updated_balance: updatedBalance,
  };
}

function didActivateExpectedPlan(checkoutState, subscriptionStatus) {
  if (!checkoutState || !subscriptionStatus) {
    return false;
  }

  const activePlanId =
    typeof subscriptionStatus?.active_plan_id === "string"
      ? subscriptionStatus.active_plan_id.trim()
      : "";

  if (checkoutState.expectedPlanId && activePlanId) {
    return checkoutState.expectedPlanId === activePlanId;
  }

  return (
    normalizePlanName(subscriptionStatus?.active_plan_name) ===
    normalizePlanName(checkoutState.expectedPlanName)
  );
}

export default function PlusSubscriptionPage() {
  const [selectedPlanKey, setSelectedPlanKey] = useState(null);
  const [pendingCheckout, setPendingCheckout] = useState(null);
  const [purchaseSummary, setPurchaseSummary] = useState(null);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const router = useRouter();
  const { isDark } = useTheme();
  const {
    data: plansData,
    error: plansError,
    isLoading: isPlansLoading,
    isFetching: isPlansFetching,
    refetch: refetchPlans,
  } = useGetSubscriptionPlansQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const {
    data: subscriptionStatus,
    error: subscriptionStatusError,
    isFetching: isStatusFetching,
    refetch: refetchSubscriptionStatus,
  } = useGetSubscriptionStatusQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    pollingInterval: pendingCheckout ? SYNC_POLLING_INTERVAL : 0,
    skipPollingIfUnfocused: true,
  });
  const {
    error: balanceError,
    isFetching: isBalanceFetching,
    refetch: refetchBalance,
  } = useGetCreditBalanceQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    pollingInterval: pendingCheckout ? SYNC_POLLING_INTERVAL : 0,
    skipPollingIfUnfocused: true,
  });

  const hasLivePlans = Array.isArray(plansData) && plansData.length > 0;
  const shouldUseFallbackPlans =
    !hasLivePlans && !isPlansLoading && !isUnauthorizedError(plansError);
  const plans = hasLivePlans
    ? plansData.map(enrichPlan)
    : shouldUseFallbackPlans
      ? PLANS.map(enrichPlan)
      : [];

  useEffect(() => {
    setPendingCheckout(readCheckoutSyncState());
  }, []);

  useEffect(() => {
    if (!plansError) {
      return;
    }

    if (isUnauthorizedError(plansError)) {
      router.replace("/sign-in");
      return;
    }

    toast.error(
      getClientErrorMessage(
        plansError,
        "Unable to load live plans. Showing fallback plans instead.",
      ),
    );
  }, [plansError, router]);

  useEffect(() => {
    if (!subscriptionStatusError) {
      return;
    }

    if (isUnauthorizedError(subscriptionStatusError)) {
      router.replace("/sign-in");
      return;
    }

    toast.error(
      getClientErrorMessage(
        subscriptionStatusError,
        "Unable to load subscription status",
      ),
    );
  }, [router, subscriptionStatusError]);

  useEffect(() => {
    if (!balanceError) {
      return;
    }

    if (isUnauthorizedError(balanceError)) {
      router.replace("/sign-in");
      return;
    }

    toast.error(
      getClientErrorMessage(balanceError, "Unable to refresh credit balance"),
    );
  }, [balanceError, router]);

  const activePlanReference = subscriptionStatus ?? null;
  const preferredReference = pendingCheckout
    ? {
        active_plan_id: pendingCheckout.expectedPlanId,
        active_plan_name: pendingCheckout.expectedPlanName,
      }
    : activePlanReference;
  const resolvedSelectedPlanKey = plans.some(
    (plan, index) => getPlanKey(plan, index) === selectedPlanKey,
  )
    ? selectedPlanKey
    : getDefaultSelectedPlanKey(plans, preferredReference);

  const selectedPlan =
    plans.find(
      (plan, index) => getPlanKey(plan, index) === resolvedSelectedPlanKey,
    ) ?? null;
  const selectedPlanCheckoutUrl = getPlanCheckoutUrl(selectedPlan);
  const selectedPlanTokenLimit = selectedPlan
    ? getPlanTokenLimit(selectedPlan)
    : null;
  const isSelectedPlanActive = Boolean(
    selectedPlan && isSamePlan(selectedPlan, activePlanReference),
  );
  const isSyncingCheckout =
    isManualSyncing ||
    (Boolean(pendingCheckout) &&
      (isPlansFetching || isStatusFetching || isBalanceFetching));

  async function syncMembership({ silent = false } = {}) {
    const checkoutState = pendingCheckout ?? readCheckoutSyncState();

    if (!checkoutState) {
      return false;
    }

    setIsManualSyncing(true);

    try {
      const [, statusResult, balanceResult] = await Promise.allSettled([
        refetchPlans().unwrap(),
        refetchSubscriptionStatus().unwrap(),
        refetchBalance().unwrap(),
      ]);

      if (statusResult.status === "rejected") {
        throw statusResult.reason;
      }

      const nextStatus = statusResult.value;
      const nextBalance =
        balanceResult.status === "fulfilled" ? balanceResult.value : null;

      if (!didActivateExpectedPlan(checkoutState, nextStatus)) {
        if (!silent) {
          toast("Membership status refreshed. Complete checkout on Santum.net, then return here.");
        }

        return false;
      }

      clearCheckoutSyncState();
      setPendingCheckout(null);

      const nextSummary = buildPurchaseSummary({
        balanceResponse: nextBalance,
        fallbackPlanName: checkoutState.expectedPlanName,
        subscriptionStatus: nextStatus,
      });

      setPurchaseSummary(nextSummary);
      toast.success(`${nextSummary.plan_name} membership is now active`);
      return true;
    } catch (error) {
      if (isUnauthorizedError(error)) {
        router.replace("/sign-in");
        return false;
      }

      if (!silent) {
        toast.error(
          getClientErrorMessage(error, "Unable to sync membership status"),
        );
      }

      return false;
    } finally {
      setIsManualSyncing(false);
    }
  }

  const pollMembershipSync = useEffectEvent(() => {
    void syncMembership({ silent: true });
  });

  useEffect(() => {
    if (!pendingCheckout) {
      return;
    }

    pollMembershipSync();

    const intervalId = window.setInterval(() => {
      pollMembershipSync();
    }, SYNC_POLLING_INTERVAL);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [pendingCheckout]);

  function handleCheckoutRedirect() {
    if (!selectedPlan) {
      toast.error("Select a plan to continue");
      return;
    }

    if (!selectedPlanCheckoutUrl) {
      toast.error("Checkout URL is not available for this plan yet");
      return;
    }

    const checkoutState = {
      checkoutUrl: selectedPlanCheckoutUrl,
      expectedPlanId: getPlanId(selectedPlan),
      expectedPlanName: getPlanName(selectedPlan),
      previousPlanId:
        typeof subscriptionStatus?.active_plan_id === "string"
          ? subscriptionStatus.active_plan_id
          : "",
      startedAt: Date.now(),
    };

    persistCheckoutSyncState(checkoutState);
    setPendingCheckout(checkoutState);
    setPurchaseSummary(null);
    window.location.assign(selectedPlanCheckoutUrl);
  }

  async function handlePrimaryAction() {
    if (purchaseSummary || isSelectedPlanActive) {
      router.push("/amigo-chat");
      return;
    }

    if (pendingCheckout) {
      await syncMembership();
      return;
    }

    handleCheckoutRedirect();
  }

  function handleSecondaryAction() {
    if (pendingCheckout) {
      const checkoutUrl =
        pendingCheckout.checkoutUrl || selectedPlanCheckoutUrl || null;

      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
        return;
      }

      router.push("/home");
      return;
    }

    if (purchaseSummary || isSelectedPlanActive) {
      router.push("/settings/credits");
      return;
    }

    router.push("/home");
  }

  const primaryButtonLabel = purchaseSummary
    ? "Start Chatting"
    : pendingCheckout
      ? isSyncingCheckout
        ? "Syncing Membership..."
        : "Sync Membership"
      : isSelectedPlanActive
        ? "Start Chatting"
        : selectedPlan
          ? selectedPlanCheckoutUrl
            ? "Continue On Santum.net"
            : "Checkout Unavailable"
          : isPlansLoading
            ? "Loading Plans..."
            : "Select A Plan";

  const secondaryButtonLabel = pendingCheckout
    ? "Open Santum.net Again"
    : purchaseSummary || isSelectedPlanActive
      ? "View Updated Credits"
      : "Maybe Later";

  const isPrimaryButtonDisabled =
    !purchaseSummary &&
    !pendingCheckout &&
    (!selectedPlan ||
      (!isSelectedPlanActive && !selectedPlanCheckoutUrl) ||
      isPlansLoading);

  return (
    <StepPageShell title="Amigo GPT Plus" contentClassName="overflow-y-auto">
      <FeatureShowcaseCard
        badge="Upgrade"
        title="Choose your plan here, then finish membership on Santum.net"
        description="This PWA shows live plans and redirects to the Santum checkout URL. When you come back, membership status and token limits refresh automatically."
        imageSrc="/icons/plus-robort.png"
        imageAlt="Subscription robot"
        className="mb-6"
        compact
      />

      <div
        className={`mb-6 rounded-[24px] px-5 py-5 ${getBenefitsPanelClasses(
          isDark,
        )}`}
      >
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70">
          How membership works
        </p>
        <h2 className="mt-3 text-[24px] font-semibold leading-8">
          Pick a plan in the app, pay on the web, then sync back here.
        </h2>
        <p className="mt-3 font-satoshi text-[15px] leading-6 text-white/75">
          The active plan, token allowance, and support-chat balance are pulled
          from Santum after checkout so the PWA always reflects the latest
          membership state.
        </p>
      </div>

      <div className="space-y-4">
        {plans.map((plan, index) => {
          const planKey = getPlanKey(plan, index);
          const isSelected = planKey === resolvedSelectedPlanKey;
          const isActivePlan = isSamePlan(plan, activePlanReference);
          const planTokenLimit = getPlanTokenLimit(plan);

          return (
            <button
              key={planKey}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setSelectedPlanKey(planKey);
                setPurchaseSummary(null);
              }}
              className={`w-full rounded-[26px] border px-5 py-5 text-left transition-all ${getPlanCardClasses(
                {
                  isDark,
                  isSelected,
                  isHighlighted: plan.highlighted,
                },
              )}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="theme-text-primary text-[22px] font-semibold leading-8">
                      {plan.name}
                    </h3>
                    {plan.highlighted ? (
                      <span className="rounded-full bg-[#00D061] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                        Best Value
                      </span>
                    ) : null}
                    {isActivePlan ? (
                      <span className="rounded-full bg-[#0F0F0F] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                        Active
                      </span>
                    ) : null}
                    {isSelected ? (
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getSelectedBadgeClasses(
                          isDark,
                        )}`}
                      >
                        Selected
                      </span>
                    ) : null}
                  </div>
                  <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-6">
                    {plan.description}
                  </p>
                  <p className="theme-text-primary mt-3 text-[12px] font-semibold uppercase tracking-[0.16em]">
                    {planTokenLimit === null
                      ? "Token allowance syncs after checkout"
                      : `${formatCreditAmount(planTokenLimit)} tokens included`}
                  </p>
                </div>
                <div
                  className={`rounded-[18px] px-4 py-3 text-center ${getPricePillClasses(
                    isDark,
                  )}`}
                >
                  <p className="text-[20px] font-semibold leading-7">
                    {getPlanPrice(plan) === 0
                      ? "Free"
                      : `$${getPlanPrice(plan)}/mo`}
                  </p>
                </div>
              </div>

              {plan.features.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="theme-pill flex h-7 w-7 items-center justify-center rounded-full">
                        <Check size={14} />
                      </div>
                      <span className="theme-text-primary font-satoshi text-[15px] leading-6">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      {pendingCheckout && !purchaseSummary ? (
        <div
          className={`mt-6 rounded-3xl border px-5 py-5 ${getPurchaseSummaryClasses(
            isDark,
          )}`}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#00A84D]">
            Checkout in progress
          </p>
          <h3 className="theme-text-primary mt-2 text-[22px] font-semibold leading-8">
            Complete payment on Santum.net, then return here.
          </h3>
          <p className="theme-text-secondary mt-3 font-satoshi text-[15px] leading-6">
            The PWA is polling for your updated membership and token balance.
            You can also tap Sync Membership at any time after checkout.
          </p>
        </div>
      ) : null}

      {purchaseSummary ? (
        <div
          className={`mt-6 rounded-3xl border px-5 py-5 ${getPurchaseSummaryClasses(
            isDark,
          )}`}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#00A84D]">
            Membership synced
          </p>
          <h3 className="theme-text-primary mt-2 text-[22px] font-semibold leading-8">
            {purchaseSummary.plan_name} is now active.
          </h3>
          <p className="theme-text-secondary mt-3 font-satoshi text-[15px] leading-6">
            Subscription status was refreshed from Santum and the PWA picked up
            your latest access automatically.
          </p>
          {Number.isFinite(purchaseSummary.plan_tokens) ? (
            <p className="theme-text-secondary mt-2 font-satoshi text-[15px] leading-6">
              Plan tokens: {formatCreditAmount(purchaseSummary.plan_tokens)}
            </p>
          ) : null}
          <p className="theme-text-secondary mt-2 font-satoshi text-[15px] leading-6">
            Updated balance:{" "}
            {Number.isFinite(purchaseSummary.updated_balance)
              ? formatCreditAmount(purchaseSummary.updated_balance)
              : "Refreshing"}
          </p>
        </div>
      ) : null}

      {!pendingCheckout && !purchaseSummary && isSelectedPlanActive ? (
        <div
          className={`mt-6 rounded-3xl border px-5 py-5 ${getPurchaseSummaryClasses(
            isDark,
          )}`}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#00A84D]">
            Current membership
          </p>
          <h3 className="theme-text-primary mt-2 text-[22px] font-semibold leading-8">
            {selectedPlan?.name || "Selected plan"} is already active.
          </h3>
          <p className="theme-text-secondary mt-3 font-satoshi text-[15px] leading-6">
            {Number.isFinite(selectedPlanTokenLimit)
              ? `${formatCreditAmount(selectedPlanTokenLimit)} tokens are assigned to this plan.`
              : "Your current plan details are already synced in the PWA."}
          </p>
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handlePrimaryAction}
          disabled={isPrimaryButtonDisabled || isSyncingCheckout}
          className="rounded-[14px] bg-[#00D061] px-5 py-4 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(0,208,97,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {primaryButtonLabel}
        </button>
        <button
          type="button"
          onClick={handleSecondaryAction}
          className="theme-secondary-button rounded-[14px] px-5 py-4 text-[16px] font-semibold"
        >
          {secondaryButtonLabel}
        </button>
      </div>
    </StepPageShell>
  );
}
