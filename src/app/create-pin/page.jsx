"use client";

import FeatureShowcaseCard from "@/components/app/FeatureShowcaseCard";
import StepPageShell from "@/components/app/StepPageShell";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePinPage() {
  const router = useRouter();
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) {
      return;
    }

    const nextPin = [...pin];
    nextPin[index] = value;
    setPin(nextPin);

    if (value && index < pin.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, pin.length);

    if (!pastedValue) {
      return;
    }

    const nextPin = Array(pin.length).fill("");
    pastedValue.split("").forEach((character, index) => {
      nextPin[index] = character;
    });

    setPin(nextPin);
    inputRefs.current[Math.min(pastedValue.length, pin.length - 1)]?.focus();
    event.preventDefault();
  };

  const isComplete = pin.every((digit) => digit !== "");

  return (
    <StepPageShell title="Create Security PIN" contentClassName="overflow-y-auto">
      <FeatureShowcaseCard
        badge="Secure Access"
        title="Add a quick PIN for sensitive parts of the app"
        description="A short PIN adds another layer of privacy before reopening sensitive conversations."
        imageSrc="/icons/finger-print-img-green.png"
        imageAlt="PIN setup"
        className="mb-6"
      />

      <p className="theme-text-secondary mb-6 text-center font-satoshi text-[16px] leading-6">
        Use a simple 4-digit PIN to protect your account when you reopen the app.
      </p>

      <div
        className="mb-6 flex items-center justify-center gap-[10px]"
        onPaste={handlePaste}
      >
        {pin.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            aria-label={`PIN digit ${index + 1}`}
            className={`theme-otp-input h-[56px] w-[56px] rounded-full border text-center text-[22px] font-semibold outline-none transition-all duration-200 ${
              digit ? "theme-otp-input-filled" : "theme-otp-input-empty"
            }`}
          />
        ))}
      </div>

      <p className="theme-text-secondary text-center font-satoshi text-[15px] leading-6">
        You can pair this with fingerprint unlock on supported devices.
      </p>

      <button
        type="button"
        disabled={!isComplete}
        onClick={() => router.push("/finger-scan")}
        className={`mt-auto rounded-[14px] px-5 py-4 text-[18px] font-semibold text-white transition-all duration-200 ${
          isComplete
            ? "bg-[#00D061] shadow-[0_10px_24px_rgba(0,208,97,0.22)]"
            : "bg-[#A8F0CB]"
        }`}
      >
        Continue
      </button>
    </StepPageShell>
  );
}
