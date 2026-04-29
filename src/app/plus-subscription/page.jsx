"use client";

import FeatureShowcaseCard from "@/components/app/FeatureShowcaseCard";
import StepPageShell from "@/components/app/StepPageShell";
import { useTheme } from "@/components/providers/ThemeProvider";
import { getClientErrorMessage, isUnauthorizedError } from "@/lib/api/error";
import {
  useGetSubscriptionPlansQuery,
  usePurchaseSubscriptionMutation,
} from "@/lib/store";
import { formatCreditAmount } from "@/lib/utills/credit";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PLANS = [
  {
    name: "Starter",
    billing_amount: 0,
    description:
      "A friendly everyday chat companion with the core Amigo experience.",
    features: ["Basic chat", "Saved preferences", "Profile setup"],
    highlighted: false,
  },
  {
    name: "Plus",
    billing_amount: 9,
    description:
      "The best fit for power users who want faster replies and more workspace control.",
    features: [
      "Priority responses",
      "Longer chat memory",
      "Premium prompt packs",
    ],
    highlighted: true,
  },
  {
    name: "Team",
    billing_amount: 24,
    description:
      "A simple shared setup for collaborative work, approvals, and support.",
    features: ["Shared spaces", "Team prompt presets", "Priority support"],
    highlighted: false,
  },
];

function normalizePlanName(name) {
  return typeof name === "string" ? name.trim().toLowerCase() : "";
}

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
  if (plan?.id !== undefined && plan?.id !== null) {
    return String(plan.id);
  }

  if (typeof plan?.slug === "string" && plan.slug.trim()) {
    return plan.slug.trim();
  }

  if (typeof plan?.name === "string" && plan.name.trim()) {
    return plan.name.trim().toLowerCase();
  }

  return `plan-${index}`;
}

function getBillingAmount(plan) {
  const parsedAmount = Number(plan?.billing_amount ?? plan?.price ?? 0);
  return Number.isFinite(parsedAmount) ? parsedAmount : 0;
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
    name: plan?.name || fallbackPlan?.name || `Plan ${index + 1}`,
    description:
      plan?.description ||
      fallbackPlan?.description ||
      "Premium access with additional Amigo credits.",
    features: planFeatures,
    highlighted: hasHighlightedFlag
      ? normalizeHighlightedFlag(plan.highlighted)
      : Boolean(fallbackPlan?.highlighted),
    billing_amount:
      plan?.billing_amount ??
      fallbackPlan?.billing_amount ??
      getBillingAmount(plan),
  };
}

function getDefaultSelectedPlanKey(plans) {
  const defaultPlan =
    plans.find((plan) => plan.highlighted && getBillingAmount(plan) > 0) ||
    plans.find((plan) => getBillingAmount(plan) > 0) ||
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

export default function PlusSubscriptionPage() {
  const [selectedPlanKey, setSelectedPlanKey] = useState(null);
  const [purchaseSummary, setPurchaseSummary] = useState(null);
  const router = useRouter();
  const { isDark } = useTheme();
  const {
    data: plansData,
    error: plansError,
    isLoading: isPlansLoading,
  } = useGetSubscriptionPlansQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [purchaseSubscription, { isLoading: isPurchasing }] =
    usePurchaseSubscriptionMutation();

  const hasLivePlans = Array.isArray(plansData) && plansData.length > 0;
  const shouldUseFallbackPlans =
    !hasLivePlans && !isPlansLoading && !isUnauthorizedError(plansError);
  const plans = hasLivePlans
    ? plansData.map(enrichPlan)
    : shouldUseFallbackPlans
      ? PLANS.map(enrichPlan)
      : [];

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
        "Unable to load live plans. Showing demo plans instead.",
      ),
    );
  }, [plansError, router]);
  const resolvedSelectedPlanKey = plans.some(
    (plan, index) => getPlanKey(plan, index) === selectedPlanKey,
  )
    ? selectedPlanKey
    : getDefaultSelectedPlanKey(plans);

  const selectedPlan =
    plans.find(
      (plan, index) => getPlanKey(plan, index) === resolvedSelectedPlanKey,
    ) ?? null;
  const selectedPlanPrice = getBillingAmount(selectedPlan);
  const isSelectedPlanPaid = selectedPlanPrice > 0;

  async function handlePurchase() {
    if (!selectedPlan) {
      toast.error("Select a plan to continue");
      return;
    }

    if (!isSelectedPlanPaid) {
      toast.error(`${selectedPlan.name} is already included`);
      return;
    }

    setPurchaseSummary(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      const response = await purchaseSubscription({
        plan: selectedPlan,
      }).unwrap();

      setPurchaseSummary(response);
      toast.success(
        response.message || `${selectedPlan.name} activated successfully`,
      );
    } catch (error) {
      if (isUnauthorizedError(error)) {
        router.replace("/sign-in");
        return;
      }

      toast.error(getClientErrorMessage(error, "Unable to complete purchase"));
    }
  }

  const primaryButtonLabel = purchaseSummary
    ? "Start Chatting"
    : isPurchasing
      ? "Processing dummy payment..."
      : selectedPlan
        ? isSelectedPlanPaid
          ? `Purchase ${selectedPlan.name}`
          : `${selectedPlan.name} Is Included`
        : isPlansLoading
          ? "Loading Plans..."
          : "Select A Plan";

  const secondaryButtonLabel = purchaseSummary
    ? "View Updated Credits"
    : "Maybe Later";

  return (
    <StepPageShell title="Amigo GPT Plus" contentClassName="overflow-y-auto">
      <FeatureShowcaseCard
        badge="Upgrade"
        title="Unlock the premium layer without losing the warmth of the base app"
        description="This dummy plan page now runs a mocked checkout step and then tops up live credits through the authenticated purchase flow."
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
          What changes with Plus
        </p>
        <h2 className="mt-3 text-[24px] font-semibold leading-8">
          Faster help, deeper conversations, and cleaner control.
        </h2>
        <p className="mt-3 font-satoshi text-[15px] leading-6 text-white/75">
          Ideal for users who want Amigo to feel more like a daily workspace and
          less like a casual one-off assistant.
        </p>
      </div>

      <div className="space-y-4">
        {plans?.map((plan, index) => {
          const planKey = getPlanKey(plan, index);
          const isSelected = planKey === selectedPlanKey;

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
                </div>
                <div
                  className={`rounded-[18px] px-4 py-3 text-center ${getPricePillClasses(
                    isDark,
                  )}`}
                >
                  <p className="text-[20px] font-semibold leading-7">
                    {getBillingAmount(plan) === 0
                      ? "Free"
                      : `$${getBillingAmount(plan)}/mo`}
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

      {purchaseSummary ? (
        <div
          className={`mt-6 rounded-3xl border px-5 py-5 ${getPurchaseSummaryClasses(
            isDark,
          )}`}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#00A84D]">
            Dummy payment complete
          </p>
          <h3 className="theme-text-primary mt-2 text-[22px] font-semibold leading-8">
            {purchaseSummary.plan_name} is active and credits were added.
          </h3>
          <p className="theme-text-secondary mt-3 font-satoshi text-[15px] leading-6">
            Added {formatCreditAmount(purchaseSummary.credits_added)} credits to
            your account through the live increase endpoint.
          </p>
          <p className="theme-text-secondary mt-2 font-satoshi text-[15px] leading-6">
            Updated balance:{" "}
            {Number.isFinite(purchaseSummary.updated_balance)
              ? formatCreditAmount(purchaseSummary.updated_balance)
              : "Refreshing"}
          </p>
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={
            purchaseSummary ? () => router.push("/amigo-chat") : handlePurchase
          }
          disabled={
            !purchaseSummary &&
            (!selectedPlan || !isSelectedPlanPaid || isPurchasing)
          }
          className="rounded-[14px] bg-[#00D061] px-5 py-4 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(0,208,97,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {primaryButtonLabel}
        </button>
        <button
          type="button"
          onClick={() =>
            purchaseSummary
              ? router.push("/settings/credits")
              : router.push("/home")
          }
          className="theme-secondary-button rounded-[14px] px-5 py-4 text-[16px] font-semibold"
        >
          {secondaryButtonLabel}
        </button>
      </div>
    </StepPageShell>
  );
}
