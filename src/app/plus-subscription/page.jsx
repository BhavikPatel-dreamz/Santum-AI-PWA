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
  enrichSubscriptionPlan,
  getPlanCheckoutUrl,
  getPlanKey,
  getPlanPurchaseBlockReason,
  getPlanPurchaseHref,
  getPlanPrice,
  isSamePlan,
} from "@/lib/utills/subscription";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
      ? "border-[#2FD97C] bg-[#e4ffee]"
      : "border-[#00D061] bg-[#e4ffee]";
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
    isFetching: isSubscriptionStatusFetching,
    isLoading: isSubscriptionStatusLoading,
  } = useGetSubscriptionStatusQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const hasLivePlans = Array.isArray(plansData) && plansData.length > 0;
  const plans = hasLivePlans ? plansData.map(enrichSubscriptionPlan) : [];

  useEffect(() => {
    if (!plansError) {
      return;
    }

    if (isUnauthorizedError(plansError)) {
      router.replace("/sign-in");
      return;
    }

    toast.error(
      getClientErrorMessage(plansError, "Unable to load live plans."),
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
  const subscriptionPurchaseBlockReason = !isSelectedPlanActive
    ? getPlanPurchaseBlockReason(selectedPlan, subscriptionStatus)
    : "";
  const subscriptionStatusUnavailableReason =
    !isSelectedPlanActive &&
      selectedPlan &&
      getPlanPrice(selectedPlan) > 0 &&
      subscriptionStatusError
      ? "Unable to confirm subscription status. Please try again."
      : "";
  const purchaseRestrictionReason =
    subscriptionPurchaseBlockReason || subscriptionStatusUnavailableReason;
  const isSubscriptionStatusBusy =
    isSubscriptionStatusLoading || isSubscriptionStatusFetching;

  function handlePlanPurchase() {
    if (isAccountPaused) {
      toast.error(PAUSED_ACCOUNT_MESSAGE);
      return;
    }

    if (!selectedPlan) {
      toast.error("Select a plan to continue");
      return;
    }

    if (purchaseRestrictionReason) {
      toast.error(purchaseRestrictionReason);
      return;
    }

    router.push(getPlanPurchaseHref(selectedPlan, "view-plans"));
  }

  function handlePrimaryAction() {
    if (isAccountPaused) {
      toast.error(PAUSED_ACCOUNT_MESSAGE);
      return;
    }

    if (isSelectedPlanActive || selectedPlanKey == "17") {
      router.push("/santumai-chat");
      return;
    }

    handlePlanPurchase();
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

  const primaryButtonLabel =
    isSelectedPlanActive || selectedPlanKey == "17"
      ? "Start Chatting"
      : purchaseRestrictionReason
        ? "Purchase Locked"
        : selectedPlan
          ? "Select This Plan"
          : "Checkout Unavailable"

  const isPrimaryButtonDisabled =
    !selectedPlan ||
    (!isSelectedPlanActive && !selectedPlanCheckoutUrl) ||
    Boolean(purchaseRestrictionReason) ||
    isPlansLoading ||
    isSubscriptionStatusBusy;

  return (
    <StepPageShell
      title="Santum AI Plans"
      contentClassName="overflow-y-auto bg-[#f2f2f2]"
    >
      <div className="space-y-4">
        {isPlansLoading ? (
          <div className="theme-card rounded-[22px] border px-5 py-5 text-center">
            <p className="theme-text-primary text-[16px] font-semibold">
              Loading Plans...
            </p>
            <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-6">
              Please wait a moment.
            </p>
          </div>
        ) : null}

        {plans.map((plan, index) => {
          const planKey = getPlanKey(plan, index);
          const isSelected = planKey === resolvedSelectedPlanKey;
          const isActivePlan = isSamePlan(plan, activePlanReference);

          return (
            <div
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
                  <p className="theme-text-primary mt-3 text-[15  px] font-semibold tracking-[0.16em]">
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
              <p className="theme-text-secondary mt-3 font-satoshi text-[11px] leading-6">
                {planKey != "17" &&
                  "*Monthly talk time depends on multiple factors and is approximate"}
              </p>
              <div className="flex justify-center">{isSelected && primaryButtonLabel != "Start Chatting" ? <button
                type="button"
                onClick={handlePrimaryAction}
                disabled={isPrimaryButtonDisabled}
                className="mt-6 w-full rounded-[14px] bg-[#00D061] px-5 py-4 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(0,208,97,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {primaryButtonLabel}
              </button> : null}</div>
              {purchaseRestrictionReason && isSelected ? (
                <p className="theme-text-secondary mt-3 font-satoshi text-[13px] leading-5">
                  {purchaseRestrictionReason}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* <button
        type="button"
        onClick={handlePrimaryAction}
        disabled={isPrimaryButtonDisabled}
        className="mt-6 rounded-[14px] bg-[#00D061] px-5 py-4 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(0,208,97,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {primaryButtonLabel}
      </button>
      {purchaseRestrictionReason ? (
        <p className="theme-text-secondary mt-3 font-satoshi text-[13px] leading-5">
          {purchaseRestrictionReason}
        </p>
      ) : null} */}
      {/* <button
          type="button"
          onClick={handleSecondaryAction}
          className="theme-secondary-button rounded-[14px] px-5 py-4 text-[16px] font-semibold"
        >
          {secondaryButtonLabel}
        </button> */}
    </StepPageShell>
  );
}
