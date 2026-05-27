"use client";

import StepPageShell from "@/components/app/StepPageShell";
import { useTheme } from "@/components/providers/ThemeProvider";
import { getClientErrorMessage, isUnauthorizedError } from "@/lib/api/error";
import {
  useGetProfileQuery,
  useGetSubscriptionPlansQuery,
  useGetSubscriptionStatusQuery,
} from "@/lib/store";
import { PAUSED_ACCOUNT_MESSAGE, isProfilePaused } from "@/lib/utills/profile";
import {
  getPlanCheckoutUrl,
  getPlanId,
  getPlanName,
  getPlanPrice,
  getPlanTokenLimit,
  isSamePlan,
} from "@/lib/utills/subscription";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
  const hasHighlightedFlag =
    plan && Object.prototype.hasOwnProperty.call(plan, "highlighted");
  const planFeatures =
    Array.isArray(plan?.features) && plan.features.length > 0
      ? plan.features
      : [];

  return {
    ...plan,
    name: getPlanName(plan) || `Plan ${index + 1}`,
    description:
      plan?.description ||
      "Complete checkout on Santum.net. Santum.net will send you back to your current plan when payment is done.",
    features: planFeatures,
    highlighted: hasHighlightedFlag
      ? normalizeHighlightedFlag(plan.highlighted)
      : false,
    billing_amount: plan?.billing_amount ?? getPlanPrice(plan),
    tokens: getPlanTokenLimit(plan),
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

export default function PlusSubscriptionPage() {
  const [selectedPlanKey, setSelectedPlanKey] = useState(null);
  const router = useRouter();
  const { isDark } = useTheme();
  const { data: profile } = useGetProfileQuery();
  const isAccountPaused = isProfilePaused(profile);
  const {
    data: plansData,
    error: plansError,
    isLoading: isPlansLoading,
  } = useGetSubscriptionPlansQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });
  const {
    data: subscriptionStatus,
    error: subscriptionStatusError,
  } = useGetSubscriptionStatusQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const hasLivePlans = Array.isArray(plansData) && plansData.length > 0;
  const plans = hasLivePlans ? plansData.map(enrichPlan) : [];

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
        "Unable to load live plans.",
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

  const activePlanReference = subscriptionStatus ?? null;
  const resolvedSelectedPlanKey = plans.some(
    (plan, index) => getPlanKey(plan, index) === selectedPlanKey,
  )
    ? selectedPlanKey
    : getDefaultSelectedPlanKey(plans, activePlanReference);

  const selectedPlan =
    plans.find(
      (plan, index) => getPlanKey(plan, index) === resolvedSelectedPlanKey,
    ) ?? null;
  const selectedPlanCheckoutUrl = getPlanCheckoutUrl(selectedPlan);
  const isSelectedPlanActive = Boolean(
    selectedPlan && isSamePlan(selectedPlan, activePlanReference),
  );

  function handleCheckoutRedirect() {
    if (isAccountPaused) {
      toast.error(PAUSED_ACCOUNT_MESSAGE);
      return;
    }

    if (!selectedPlan) {
      toast.error("Select a plan to continue");
      return;
    }

    if (!selectedPlanCheckoutUrl) {
      toast.error("Checkout URL is not available for this plan yet");
      return;
    }

    window.location.assign(selectedPlanCheckoutUrl);
  }

  function handlePrimaryAction() {
    if (isAccountPaused) {
      toast.error(PAUSED_ACCOUNT_MESSAGE);
      return;
    }

    if (isSelectedPlanActive) {
      router.push("/santumai-chat");
      return;
    }

    handleCheckoutRedirect();
  }

  function roundIfGreaterThanHalf(num) {
    // Get just the decimal part of the number
    let decimal = num % 1;

    if (decimal > 0.5) {
      return Math.ceil(num).toFixed(2); // Round UP
    } else {
      return num.toFixed(2); // Round DOWN
    }
  }

  function handleSecondaryAction() {
    if (isSelectedPlanActive) {
      router.push("/settings/subscriptions");
      return;
    }

    router.push("/home");
  }

  const primaryButtonLabel = isSelectedPlanActive
    ? "Start Chatting"
    : selectedPlan
      ? selectedPlanCheckoutUrl
        ? "Continue On Santum.net"
        : "Checkout Unavailable"
      : isPlansLoading
        ? "Loading Plans..."
        : "Select A Plan";

  const secondaryButtonLabel = isSelectedPlanActive
    ? "My Current Plan"
    : "Maybe Later";

  const isPrimaryButtonDisabled =
    !selectedPlan ||
    (!isSelectedPlanActive && !selectedPlanCheckoutUrl) ||
    isPlansLoading;

  return (
    <StepPageShell
      title="Santum AI Plans"
      contentClassName="overflow-y-auto bg-[#f2f2f2]"
    >
      <div className="space-y-4">
        {!isPlansLoading && plans.length === 0 ? (
          <div className="theme-card rounded-[22px] border px-5 py-5 text-center">
            <p className="theme-text-primary text-[16px] font-semibold">
              No plans are available right now.
            </p>
            <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-6">
              Please try again in a moment.
            </p>
          </div>
        ) : null}

        {plans.map((plan, index) => {
          const planKey = getPlanKey(plan, index);
          const isSelected = planKey === resolvedSelectedPlanKey;
          const isActivePlan = isSamePlan(plan, activePlanReference);

          return (
            <button
              key={planKey}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setSelectedPlanKey(planKey);
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
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="theme-text-primary text-[24px] font-semibold">
                        {plan.name}
                      </h3>
                      {isActivePlan ? (
                        <span className="mt-2 inline-flex rounded-full bg-[#00D061] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                          Active
                        </span>
                      ) : null}
                    </div>
                    <div
                      className={`rounded-[18px] bg-orange-400 px-7 pt-3 pb-4 text-center ${getPricePillClasses(
                        isDark,
                      )}`}
                    >
                      <p className="text-[20px] font-semibold">
                        {getPlanPrice(plan) === 0
                          ? "Free Trial"
                          : `R${getPlanPrice(plan)}pm`}
                      </p>
                      <p className="text-[12px] font-semibold -m-1">
                        {getPlanPrice(plan) != 0 &&
                          `(R${roundIfGreaterThanHalf(plan.billing_amount / 30)}/day)`}
                      </p>
                    </div>
                  </div>
                  <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-6">
                    {plan.description}
                  </p>
                  <p className="theme-text-primary mt-3 text-[12px] font-semibold tracking-[0.16em]">
                    {plan.token_info}
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
              <p className="theme-text-secondary mt-3 font-satoshi text-[14px] leading-6">
                {plan.tip}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handlePrimaryAction}
          disabled={isPrimaryButtonDisabled}
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
