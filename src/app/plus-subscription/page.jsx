"use client";

import FeatureShowcaseCard from "@/components/app/FeatureShowcaseCard";
import StepPageShell from "@/components/app/StepPageShell";
import { appFetch } from "@/lib/api/internal";
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

export default function PlusSubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const [isPlansLoading, setIsPlansLoading] = useState(true);
  const [selectedPlanKey, setSelectedPlanKey] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSummary, setPurchaseSummary] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function loadSubscription() {
      try {
        const data = await appFetch("/api/settings/subscription", {
          cache: "no-store",
        });

        if (!isMounted) {
          return;
        }

        const nextPlans =
          Array.isArray(data) && data.length > 0
            ? data.map(enrichPlan)
            : PLANS.map(enrichPlan);

        setPlans(nextPlans);
        setSelectedPlanKey((currentSelectedPlanKey) =>
          nextPlans.some(
            (plan, index) => getPlanKey(plan, index) === currentSelectedPlanKey,
          )
            ? currentSelectedPlanKey
            : getDefaultSelectedPlanKey(nextPlans),
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error?.status === 401) {
          router.replace("/sign-in");
          return;
        }

        const fallbackPlans = PLANS.map(enrichPlan);
        setPlans(fallbackPlans);
        setSelectedPlanKey(getDefaultSelectedPlanKey(fallbackPlans));
        toast.error(
          error.message ||
            "Unable to load live plans. Showing demo plans instead.",
        );
      } finally {
        if (isMounted) {
          setIsPlansLoading(false);
        }
      }
    }

    loadSubscription();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const selectedPlan =
    plans.find((plan, index) => getPlanKey(plan, index) === selectedPlanKey) ??
    null;
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

    setIsPurchasing(true);
    setPurchaseSummary(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      const response = await appFetch("/api/settings/subscription/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selectedPlan,
        }),
      });

      setPurchaseSummary(response);
      toast.success(
        response.message || `${selectedPlan.name} activated successfully`,
      );
    } catch (error) {
      if (error?.status === 401) {
        router.replace("/sign-in");
        return;
      }

      toast.error(error.message || "Unable to complete purchase");
    } finally {
      setIsPurchasing(false);
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

      <div className="mb-6 rounded-[24px] bg-[#0F0F0F] px-5 py-5 text-white">
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
              className={`w-full rounded-[26px] border px-5 py-5 text-left shadow-[0_12px_30px_rgba(15,15,15,0.04)] transition-all ${
                isSelected
                  ? "border-[#00D061] bg-[linear-gradient(135deg,#F3FFF8_0%,#FFFFFF_100%)] shadow-[0_16px_36px_rgba(0,208,97,0.12)]"
                  : plan.highlighted
                    ? "border-[#D6F5E4] bg-[linear-gradient(135deg,#FCFFFD_0%,#FFFFFF_100%)]"
                    : "border-[#EEF6F1] bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[22px] font-semibold leading-8 text-[#0F0F0F]">
                      {plan.name}
                    </h3>
                    {plan.highlighted ? (
                      <span className="rounded-full bg-[#00D061] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                        Best Value
                      </span>
                    ) : null}
                    {isSelected ? (
                      <span className="rounded-full bg-[#0F0F0F] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                        Selected
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 font-satoshi text-[14px] leading-6 text-[#555]">
                    {plan.description}
                  </p>
                </div>
                <div className="rounded-[18px] bg-[#0F0F0F] px-4 py-3 text-center text-white">
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
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8FFF1] text-[#00A84D]">
                        <Check size={14} />
                      </div>
                      <span className="font-satoshi text-[15px] leading-6 text-[#0F0F0F]">
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
        <div className="mt-6 rounded-3xl border border-[#BDECCE] bg-[#F3FFF8] px-5 py-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#00A84D]">
            Dummy payment complete
          </p>
          <h3 className="mt-2 text-[22px] font-semibold leading-8 text-[#0F0F0F]">
            {purchaseSummary.plan_name} is active and credits were added.
          </h3>
          <p className="mt-3 font-satoshi text-[15px] leading-6 text-[#555]">
            Added {formatCreditAmount(purchaseSummary.credits_added)} credits to
            your account through the live increase endpoint.
          </p>
          <p className="mt-2 font-satoshi text-[15px] leading-6 text-[#555]">
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
          className="rounded-[14px] bg-[#F4F7F5] px-5 py-4 text-[16px] font-semibold text-[#0F0F0F]"
        >
          {secondaryButtonLabel}
        </button>
      </div>
    </StepPageShell>
  );
}
