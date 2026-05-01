"use client";

import FeatureShowcaseCard from "@/components/app/FeatureShowcaseCard";
import StepPageShell from "@/components/app/StepPageShell";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendTimer === 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setResendTimer((currentValue) => currentValue - 1);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) {
      return;
    }

    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, otp.length);

    if (!pastedValue) {
      return;
    }

    const nextOtp = Array(otp.length).fill("");
    pastedValue.split("").forEach((character, index) => {
      nextOtp[index] = character;
    });

    setOtp(nextOtp);
    inputRefs.current[Math.min(pastedValue.length, otp.length - 1)]?.focus();
    event.preventDefault();
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <StepPageShell title="Confirm OTP" contentClassName="overflow-y-auto">
      <FeatureShowcaseCard
        badge="Verification"
        title="Enter the short code we just sent"
        description="Verify it is really you before we let you reset your password."
        imageSrc="/icons/robot-slider-img3.png"
        imageAlt="OTP confirmation"
        className="mb-6"
      />

      <p className="theme-text-secondary mb-6 text-center font-satoshi text-[16px] leading-6">
        The code was sent to{" "}
        <span className="theme-text-primary font-semibold">+91 ****** 65</span>
      </p>

      <div
        className="mb-6 flex items-center justify-center gap-[10px]"
        onPaste={handlePaste}
      >
        {otp.map((digit, index) => (
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
            aria-label={`OTP digit ${index + 1}`}
            className={`theme-otp-input h-[56px] w-[56px] rounded-full border text-center text-[22px] font-semibold outline-none transition-all duration-200 ${
              digit ? "theme-otp-input-filled" : "theme-otp-input-empty"
            }`}
          />
        ))}
      </div>

      <p className="theme-text-secondary text-center font-satoshi text-[15px] leading-6">
        {resendTimer > 0 ? (
          <>
            Code expires in{" "}
            <span className="theme-text-primary font-semibold">{resendTimer}s</span>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setResendTimer(30)}
            className="theme-text-primary font-semibold"
          >
            Resend code
          </button>
        )}
      </p>

      <button
        type="button"
        disabled={!isComplete}
        onClick={() => router.push("/new-password")}
        className={`mt-auto rounded-[14px] px-5 py-4 text-[18px] font-semibold text-white transition-all duration-200 ${
          isComplete
            ? "bg-[#00D061] shadow-[0_10px_24px_rgba(0,208,97,0.22)]"
            : "bg-[#A8F0CB]"
        }`}
      >
        Verify
      </button>
    </StepPageShell>
  );
}
