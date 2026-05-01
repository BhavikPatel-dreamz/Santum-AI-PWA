"use client";

import FeatureShowcaseCard from "@/components/app/FeatureShowcaseCard";
import StepPageShell from "@/components/app/StepPageShell";
import { useRouter } from "next/navigation";
import { useState } from "react";

const REASONS = [
  { id: 1, label: "Generate creative text formats" },
  { id: 2, label: "Access smarter everyday answers" },
  { id: 3, label: "Use a calmer, friendlier AI layout" },
  { id: 4, label: "Explore productivity workflows" },
  { id: 5, label: "Try premium-style assistant features" },
  { id: 6, label: "Just curious and testing things out" },
];

export default function ReasonScreen() {
  const router = useRouter();
  const [checked, setChecked] = useState({ 1: true, 4: true });

  const toggle = (id) =>
    setChecked((currentChecked) => ({
      ...currentChecked,
      [id]: !currentChecked[id],
    }));

  const anyChecked = Object.values(checked).some(Boolean);

  return (
    <StepPageShell title="Why Amigo?" contentClassName="overflow-y-auto">
      <FeatureShowcaseCard
        badge="Personalization"
        title="Tell us what brought you here so the product can feel smarter"
        description="These selections are still dummy, but the step now fits neatly into your onboarding journey."
        imageSrc="/icons/robot-slider-img2.png"
        imageAlt="Onboarding personalization"
        className="mb-6"
      />

      <div className="mb-4">
        <h2 className="theme-text-primary text-[20px] font-semibold leading-7">
          Pick what matters most
        </h2>
        <p className="theme-text-secondary mt-1 font-satoshi text-[15px] leading-6">
          This helps shape the tone of suggestions and starter prompts later on.
        </p>
      </div>

      <div className="space-y-3">
        {REASONS.map((item) => {
          const isChecked = !!checked[item.id];

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              className={`flex w-full items-center justify-between rounded-[22px] border px-4 py-4 text-left transition-all duration-200 ${
                isChecked
                  ? "theme-card-soft border-[#00D061] shadow-[0_12px_30px_rgba(0,208,97,0.12)]"
                  : "theme-card"
              }`}
            >
              <span className="theme-text-primary pr-4 text-[15px] font-medium leading-6">
                {item.label}
              </span>

              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] border-2 transition-all duration-150 ${
                  isChecked
                    ? "border-[#00D061] bg-[#00D061] text-white"
                    : "theme-surface theme-border text-transparent"
                }`}
              >
                ✓
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
          disabled={!anyChecked}
          onClick={() => router.push("/create-pin")}
          className={`rounded-[14px] px-5 py-4 text-[16px] font-semibold text-white ${
            anyChecked ? "bg-[#00D061]" : "bg-[#A8F0CB]"
          }`}
        >
          Continue
        </button>
      </div>
    </StepPageShell>
  );
}
