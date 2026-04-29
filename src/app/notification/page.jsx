"use client";

import FeatureShowcaseCard from "@/components/app/FeatureShowcaseCard";
import StepPageShell from "@/components/app/StepPageShell";
import { Bell, Gift, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NOTIFICATION_OPTIONS = [
  {
    id: "replies",
    title: "Helpful reply alerts",
    description: "Stay updated when Amigo has something worth checking.",
    icon: MessageSquare,
  },
  {
    id: "offers",
    title: "Offers and plan updates",
    description: "See premium trials, plan changes, and limited-time perks.",
    icon: Gift,
  },
  {
    id: "product",
    title: "Product news",
    description: "Hear about new features, fixes, and polished upgrades.",
    icon: Bell,
  },
];

export default function NotificationSetupPage() {
  const router = useRouter();
  const [enabledOptions, setEnabledOptions] = useState({
    replies: true,
    offers: false,
    product: true,
  });

  return (
    <StepPageShell title="Stay In The Loop" contentClassName="overflow-y-auto">
      <FeatureShowcaseCard
        badge="Notifications"
        title="Choose the updates that deserve your attention"
        description="This onboarding step now feels like part of the product, not a recycled placeholder screen."
        imageSrc="/icons/robot-slider-img3.png"
        imageAlt="Notification preferences"
        className="mb-6"
      />

      <div className="space-y-3">
        {NOTIFICATION_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isEnabled = enabledOptions[option.id];

          return (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                setEnabledOptions((currentOptions) => ({
                  ...currentOptions,
                  [option.id]: !currentOptions[option.id],
                }))
              }
              className={`flex w-full items-start justify-between gap-4 rounded-[24px] border px-4 py-4 text-left transition-all duration-200 ${
                isEnabled
                  ? "border-[#00D061] bg-[#F2FFF7] shadow-[0_12px_30px_rgba(0,208,97,0.12)]"
                  : "theme-card"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                    isEnabled ? "bg-[#00D061] text-white" : "bg-[#F4F7F5] text-[#0F0F0F]"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-[18px] font-semibold leading-7 text-[#0F0F0F]">
                    {option.title}
                  </h3>
                  <p className="mt-1 font-satoshi text-[14px] leading-6 text-[#555]">
                    {option.description}
                  </p>
                </div>
              </div>

              <div
                className={`relative h-[30px] w-[54px] rounded-full transition-all duration-300 ${
                  isEnabled ? "bg-[#00D061]" : "bg-[#E8E8E8]"
                }`}
              >
                <span
                  className={`absolute top-[3px] h-6 w-6 rounded-full bg-white shadow-sm transition-all duration-300 ${
                    isEnabled ? "left-[26px]" : "left-[3px]"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => router.push("/create-pin")}
          className="theme-secondary-button rounded-[14px] px-5 py-4 text-[16px] font-semibold"
        >
          Skip
        </button>
        <button
          type="button"
          onClick={() => router.push("/create-pin")}
          className="rounded-[14px] bg-[#00D061] px-5 py-4 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(0,208,97,0.22)]"
        >
          Continue
        </button>
      </div>
    </StepPageShell>
  );
}
