"use client";

import StepPageShell from "@/components/app/StepPageShell";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PASSWORD_RESET_EMAIL_STORAGE_KEY,
  PASSWORD_RESET_OTP_STORAGE_KEY,
} from "../../lib/utills/phone";
import { useForgetPasswordMutation } from "@/lib/store";
import toast from "react-hot-toast";
import { getClientErrorMessage } from "@/lib/api/error";

export default function ConfirmOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [storedEmail, setStoredEmail] = useState("");
  const [forgetpassword, { isLoading: isResendingOtp }] =
    useForgetPasswordMutation();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const email =
        sessionStorage.getItem(PASSWORD_RESET_EMAIL_STORAGE_KEY) || "";
      if (!email) {
        router.replace("/forgot-password");
        return;
      }

      setStoredEmail(email);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [router]);

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

  const handleResendOtp = async () => {
    if (!storedEmail || resendTimer > 0 || isResendingOtp) {
      return;
    }

    try {
      await forgetpassword({ email: storedEmail }).unwrap();
      setOtp(["", "", "", ""]);
      setResendTimer(60);
      toast.success("OTP sent again.");
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(getClientErrorMessage(error, "Unable to resend OTP"));
    }
  };

  const handleVerifyOtp = () => {
    setLoading(true);

    const storedOTP = sessionStorage.getItem(PASSWORD_RESET_OTP_STORAGE_KEY);
    const isMatched = storedOTP === otp.join("");
    if (isMatched) {
      toast.success("OTP verified successfully");
      router.replace("/new-password");
      setLoading(false);
    } else {
      toast.error("Invalid OTP");
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <StepPageShell title="Confirm OTP" contentClassName="overflow-y-auto">
      <p className="theme-text-secondary mb-6 text-center font-satoshi text-[18px] leading-6">
        4-digit OTP was sent to{" "}
        <span className="theme-text-primary font-semibold text-[14px]">
          {storedEmail}
        </span>
      </p>

      <div
        className="mb-6 flex items-center justify-center gap-[7px]"
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
            className={`theme-otp-input h-[48px] w-[48px] rounded-full border text-center text-[20px] font-semibold outline-none transition-all duration-200 ${
              digit ? "theme-otp-input-filled" : "theme-otp-input-empty"
            }`}
          />
        ))}
      </div>

      <p className="theme-text-secondary text-center font-satoshi text-[15px] leading-6">
        {resendTimer > 0 ? (
          <>
            Code expires in{" "}
            <span className="theme-text-primary font-semibold">
              {resendTimer}s
            </span>
          </>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResendingOtp}
            className="theme-text-primary font-semibold"
          >
            {isResendingOtp ? "Sending..." : "Resend code"}
          </button>
        )}
      </p>

      <button
        type="button"
        disabled={!isComplete || loading}
        onClick={handleVerifyOtp}
        className={`mt-auto rounded-[14px] px-5 py-4 text-[18px] font-semibold text-white transition-all duration-200 ${
          isComplete || loading
            ? "bg-[#00D061] shadow-[0_10px_24px_rgba(0,208,97,0.22)]"
            : "bg-[#A8F0CB]"
        }`}
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
    </StepPageShell>
  );
}
