"use client";

import FeatureShowcaseCard from "@/components/app/FeatureShowcaseCard";
import StepPageShell from "@/components/app/StepPageShell";
import { Mail, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RECOVERY_OPTIONS = [
  {
    id: "sms",
    title: "Recover with SMS",
    description: "Send a short code to your verified mobile number.",
    value: "+91 ****** 65",
    icon: MessageSquare,
  },
  {
    id: "email",
    title: "Recover with Email",
    description: "Use your email inbox when you cannot access your phone.",
    value: "je*****@mail.com",
    icon: Mail,
  },
];


export default function ForgetPasswordPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("sms");

  return (
    <StepPageShell title="Reset Password" contentClassName="overflow-y-auto">
      <FeatureShowcaseCard
        badge="Recovery"
        title="Choose the quickest way to recover your account"
        description="This screen uses dummy contact methods for now, but the flow is ready to match the rest of your app."
        imageSrc="/icons/robot-slider-img2.png"
        imageAlt="Recovery assistant"
        className="mb-6"
      />

      <div className="mb-4">
        <h2 className="theme-text-primary text-[20px] font-semibold leading-7">
          Pick a recovery path
        </h2>
        <p className="theme-text-secondary mt-1 font-satoshi text-[15px] leading-6">
          We&apos;ll use this to send your verification code.
        </p>
      </div>

      <div className="space-y-3">
        {RECOVERY_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedOption === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedOption(option.id)}
              className={`w-full rounded-[26px] border px-4 py-4 text-left transition-all duration-200 ${
                isSelected
                  ? "theme-card-soft border-[#00D061] shadow-[0_12px_30px_rgba(0,208,97,0.12)]"
                  : "theme-card"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                    isSelected
                      ? "bg-[#00D061] text-white"
                      : "theme-surface-secondary theme-text-primary"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="theme-text-primary text-[18px] font-semibold leading-7">
                      {option.title}
                    </h3>
                    {isSelected ? (
                      <span className="rounded-full bg-[#00D061] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                        Selected
                      </span>
                    ) : null}
                  </div>
                  <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-6">
                    {option.description}
                  </p>
                  <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#00A84D]">
                    {option.value}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => router.push("/confirm-otp")}
        className="mt-auto rounded-[14px] bg-[#00D061] px-5 py-4 text-[18px] font-semibold text-white shadow-[0_10px_24px_rgba(0,208,97,0.22)]"
      >
        Continue
      </button>
    </StepPageShell>
  );
}
