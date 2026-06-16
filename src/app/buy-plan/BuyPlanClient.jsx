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
  findPlanByPurchaseReference,
  getPlanCheckoutUrl,
  getPlanLevel,
  getPlanName,
  getPlanPurchaseBlockReason,
  getPlanPrice,
  isSamePlan,
} from "@/lib/utills/subscription";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function roundIfGreaterThanHalf(num) {
  const decimal = num % 1;

  if (decimal > 0.5) {
    return Math.ceil(num).toFixed(2);
  }

  return num.toFixed(2);
}

function getDefaultPlan(plans) {
  return (
    plans.find((plan) => getPlanPrice(plan) > 0 && plan.highlighted) ||
    plans.find((plan) => getPlanPrice(plan) > 0) ||
    plans[0] ||
    null
  );
}

function formatPrice(plan) {
  const price = getPlanPrice(plan);

  if (price === 0) {
    return "Free Trial";
  }

  return `R${price}pm`;
}

function getPricePillClasses(isDark) {
  return isDark
    ? "border border-[#2F3A34] bg-[#0B1210] text-white"
    : "bg-[#0F0F0F] text-white";
}

function getCheckoutActionLabel(plan, activePlanLevel) {
  if (!plan) {
    return "Buy This Plan";
  }

  const selectedPlanLevel = getPlanLevel(plan);
  const displayName = getPlanName(plan) || "Plan";

  if (selectedPlanLevel === "premium" && activePlanLevel === "standard") {
    return "Upgrade to Premium";
  }

  if (selectedPlanLevel === "standard" && activePlanLevel === "premium") {
    return "Switch to Standard";
  }

  if (selectedPlanLevel === "standard" || selectedPlanLevel === "premium") {
    return `Buy ${displayName}`;
  }

  return "Buy This Plan";
}

export default function BuyPlanClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDark } = useTheme();
  const requestedPlan = searchParams.get("plan") || "";
  const { data: profile } = useGetProfileQuery();
  const isAccountPaused = isProfilePaused(profile);
  const {
    data: plansData,
    error: plansError,
    isLoading: isPlansLoading,
    isFetching: isPlansFetching,
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

  const plans = Array.isArray(plansData)
    ? plansData.map(enrichSubscriptionPlan)
    : [];
  const selectedPlan =
    findPlanByPurchaseReference(plans, requestedPlan) || getDefaultPlan(plans);
  const checkoutUrl = getPlanCheckoutUrl(selectedPlan);
  const isSelectedPlanActive = Boolean(
    selectedPlan && isSamePlan(selectedPlan, subscriptionStatus),
  );
  const activePlanLevel =
    typeof subscriptionStatus?.active_plan_level === "string"
      ? subscriptionStatus.active_plan_level.toLowerCase()
      : "";
  const isSubscriptionStatusBusy =
    isSubscriptionStatusLoading || isSubscriptionStatusFetching;
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
  const isBusy = isPlansLoading || isPlansFetching;
  const isCheckoutActionDisabled =
    isBusy ||
    isSubscriptionStatusBusy ||
    !selectedPlan ||
    (!isSelectedPlanActive &&
      (!checkoutUrl || Boolean(purchaseRestrictionReason)));
  const featureList = selectedPlan?.features ?? [];
  const isPaidPlan = selectedPlan ? getPlanPrice(selectedPlan) > 0 : false;
  const dailyPrice =
    selectedPlan?.billing_amount && getPlanPrice(selectedPlan) > 0
      ? `R${roundIfGreaterThanHalf(selectedPlan.billing_amount / 30)}/day`
      : "Included";

  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (!plansError) {
      return;
    }

    if (isUnauthorizedError(plansError)) {
      router.replace("/sign-in");
      return;
    }

    toast.error(
      getClientErrorMessage(plansError, "Unable to load plan details."),
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

  function handleBuyNow() {
    if (isAccountPaused) {
      toast.error(PAUSED_ACCOUNT_MESSAGE);
      return;
    }

    if (isSelectedPlanActive) {
      router.push("/santumai-chat");
      return;
    }

    if (!selectedPlan) {
      toast.error("Plan details are still loading");
      return;
    }

    if (purchaseRestrictionReason) {
      toast.error(purchaseRestrictionReason);
      return;
    }

    if (!checkoutUrl) {
      toast.error("Checkout URL is not available for this plan yet");
      return;
    }
    setIsRedirecting(true)
    window.location.assign(checkoutUrl);
    setTimeout(() => {
      setIsRedirecting(false)
    }, 3000);

  }

  return (
    <StepPageShell
      title="Plan Purchase"
      contentClassName={`overflow-y-auto ${isDark ? "theme-surface" : "bg-[#f2f2f2]"}`}
    >
      {!isBusy && plans.length === 0 ? (
        <div className="theme-card rounded-[22px] border px-5 py-5 text-center">
          <p className="theme-text-primary text-[16px] font-semibold">
            No plans are available right now.
          </p>
          <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-6">
            Please try again in a moment.
          </p>
        </div>
      ) : null}

      <div
        className={`rounded-[26px] border px-4 py-5 sm:rounded-[28px] sm:px-5 ${isDark
          ? "border-[#294536] bg-[linear-gradient(135deg,#15261d_0%,#101915_100%)]"
          : "border-[#D6F5E4] bg-[linear-gradient(135deg,#F2FFF7_0%,#FFFFFF_100%)]"
          }`}
      >
        <div className="flex flex-col gap-4 min-[520px]:flex-row min-[520px]:items-start min-[520px]:justify-between">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#00A84D]">
              Membership checkout
            </p>
            <h2 className="theme-text-primary mt-2 break-words text-[26px] font-semibold leading-8 sm:text-[30px] sm:leading-9">
              {selectedPlan?.name || "Loading plan"}
            </h2>
            <p className="theme-text-secondary mt-3 font-satoshi text-[15px] leading-6">
              {selectedPlan?.description ||
                "Fetching the latest details for this membership."}
            </p>
          </div>

          <div
            role="button"
            // aria-disabled={isCheckoutActionDisabled}
            onClick={() => {
              if (!isCheckoutActionDisabled) {
                handleBuyNow();
              }
            }}
            className={`w-full shrink-0 rounded-[18px] bg-orange-400 px-7 pb-4 pt-3 text-center min-[520px]:w-auto ${isCheckoutActionDisabled
              ? "cursor-not-allowed opacity-60"
              : "hover:cursor-pointer"
              } ${getPricePillClasses(
                isDark,
              )}`}
          >
            {!isRedirecting ? <div>
              <p className="text-[20px] font-semibold leading-7">
                {selectedPlan ? formatPrice(selectedPlan) : "Loading"}
              </p>
              <p className="-m-1 text-[12px] font-semibold text-white/70">
                {isPaidPlan ? `(${dailyPrice})` : "No monthly charge"}
              </p>
            </div>
              : <div>
                <p className="text-[20px] font-semibold leading-7">Redirecting...</p>
              </div>}
          </div>
        </div>

        {selectedPlan?.token_info ? (
          <div className="theme-card mt-5 rounded-[20px] border px-4 py-4">
            <p className="theme-text-primary break-words text-[15px] font-semibold leading-6">
              {selectedPlan.token_info}
            </p>
          </div>
        ) : null}
      </div>

      {/* <div className="mt-4 grid grid-cols-1 gap-3 min-[520px]:grid-cols-3">
        <PlanMetric
          icon={MessageCircle}
          label="Access"
          value={selectedPlan?.token_info || "Monthly support"}
        />
        <PlanMetric icon={CreditCard} label="Billing" value="Monthly" />
        <PlanMetric icon={ShieldCheck} label="Checkout" value="Santum.net" />
      </div> */}

      <div className="mt-5 theme-card rounded-[24px] border px-5 py-5">
        {/* <div className="flex items-start gap-3 sm:items-center">
          <div className="theme-pill flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
            <Sparkles size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="theme-text-primary text-[20px] font-semibold leading-7">
              What is included
            </h3>
            <p className="theme-text-secondary font-satoshi text-[14px] leading-6">
              Key benefits available with this membership.
            </p>
          </div>
        </div> */}

        {featureList.length > 0 ? (
          <div className=" space-y-3">
            {featureList.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <div className="theme-pill mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                  <Check size={14} />
                </div>
                <p className="theme-text-primary font-satoshi text-[15px] leading-6">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="theme-warning-card mt-5 rounded-[18px] border px-4 py-4">
            <p className="theme-warning-copy text-[14px] font-medium leading-6">
              Detailed features will appear once the plans API returns them for
              this membership.
            </p>
          </div>
        )}
      </div>

      {isPaidPlan ? (
        <p className="theme-text-secondary mt-4 font-satoshi text-[12px] leading-5">
          *Monthly talk time is approximate.
        </p>
      ) : null}

      {purchaseRestrictionReason ? (
        <p className="theme-text-secondary mt-4 font-satoshi text-[13px] leading-5">
          {purchaseRestrictionReason}
        </p>
      ) : null}

      <div className="mt-auto grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isCheckoutActionDisabled}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#00D061] px-5 py-4 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(0,208,97,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRedirecting
            ? "Redirecting..."
            : isSelectedPlanActive
              ? "Open Chat"
              : purchaseRestrictionReason
                ? "Purchase Locked"
                : getCheckoutActionLabel(selectedPlan, activePlanLevel)}
        </button>
        <button
          type="button"
          onClick={() => router.push("/plus-subscription")}
          className="theme-secondary-button theme-border w-full rounded-[14px] border px-5 py-4 text-[16px] font-semibold transition-opacity duration-200 hover:opacity-90"
        >
          Change Plan
        </button>
      </div>
    </StepPageShell>
  );
}
