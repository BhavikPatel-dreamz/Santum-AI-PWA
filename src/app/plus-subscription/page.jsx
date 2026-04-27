"use client";

import FeatureShowcaseCard from "@/components/app/FeatureShowcaseCard";
import StepPageShell from "@/components/app/StepPageShell";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { appFetch } from "../../lib/api/internal";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    description:
      "A friendly everyday chat companion with the core Amigo experience.",
    features: ["Basic chat", "Saved preferences", "Profile setup"],
    highlighted: false,
  },
  {
    name: "Plus",
    price: "$9/mo",
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
    price: "$24/mo",
    description:
      "A simple shared setup for collaborative work, approvals, and support.",
    features: ["Shared spaces", "Team prompt presets", "Priority support"],
    highlighted: false,
  },
];

export default function PlusSubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function loadSubscription() {
      try {
        const data = await appFetch("/api/settings/subscription", {
          cache: "no-store",
        });
        console.log(data, "data");
        setPlans(data);
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Something went wrong");
      }
    }
    loadSubscription();
  }, [router]);

  return (
    <StepPageShell title="Amigo GPT Plus" contentClassName="overflow-y-auto">
      <FeatureShowcaseCard
        badge="Upgrade"
        title="Unlock the premium layer without losing the warmth of the base app"
        description="This dummy plan page turns the current promo card into a full subscription experience with clear benefits and pricing tiers."
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
        {plans?.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-[26px] border px-5 py-5 shadow-[0_12px_30px_rgba(15,15,15,0.04)] ${
              plan.highlighted
                ? "border-[#00D061] bg-[linear-gradient(135deg,#F3FFF8_0%,#FFFFFF_100%)]"
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
                </div>
                <p className="mt-1 font-satoshi text-[14px] leading-6 text-[#555]">
                  {plan.description}
                </p>
              </div>
              <div className="rounded-[18px] bg-[#0F0F0F] px-4 py-3 text-center text-white">
                <p className="text-[20px] font-semibold leading-7">
                  {plan.billing_amount == 0 ? "Free" : `$${plan.billing_amount}/mo`}
                </p>
              </div>
            </div>

            {/* <div className="mt-4 space-y-3">
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
            </div> */}
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => toast.success("Plus checkout is mocked for now.")}
          className="rounded-[14px] bg-[#00D061] px-5 py-4 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(0,208,97,0.22)]"
        >
          Continue With Plus
        </button>
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="rounded-[14px] bg-[#F4F7F5] px-5 py-4 text-[16px] font-semibold text-[#0F0F0F]"
        >
          Maybe Later
        </button>
      </div>
    </StepPageShell>
  );
}
