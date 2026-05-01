"use client";

import { useEffect, useRef, useState } from "react";
import HeaderSection from "../../components/UI/HeaderSection";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getClientErrorMessage, isUnauthorizedError } from "@/lib/api/error";
import { useVerifyMobileMutation } from "@/lib/store";
import { maskPhoneNumber, OTP_PHONE_STORAGE_KEY } from "../../lib/utills/phone";
import Image from "next/image";

export default function OtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef([]);
  const [maskedPhone] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    try {
      const storedPhone = sessionStorage.getItem(OTP_PHONE_STORAGE_KEY);

      if (!storedPhone) {
        return "";
      }

      const { mobile, dialCode } = JSON.parse(storedPhone);
      return maskPhoneNumber(mobile, dialCode);
    } catch (error) {
      console.error("Unable to load pending OTP phone:", error);
      return "";
    }
  });
  const router = useRouter();
  const [verifyMobile, { isLoading }] = useVerifyMobileMutation();
  
  const canResend = resendTimer === 0;

  useEffect(() => {
    if (canResend) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setResendTimer((currentValue) => currentValue - 1);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [canResend, resendTimer]);

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

  const handleResend = () => {
    if (!canResend) {
      return;
    }

    setOtp(["", "", "", "", "", ""]);
    setResendTimer(30);
    inputRefs.current[0]?.focus();
  };

  const handleVerify = async () => {
    try {
      const otpValue = otp.join("");
      const data = await verifyMobile({
        otp: otpValue,
      }).unwrap();
      if (data.success) sessionStorage.removeItem(OTP_PHONE_STORAGE_KEY);

      toast.success(data.message || "OTP verified successfully");
      router.replace("/personal-information?source=onboarding");
    } catch (error) {
      console.error("Verify Error:", error);

      if (isUnauthorizedError(error)) {
        router.replace("/sign-in");
        return;
      }

      toast.error(getClientErrorMessage(error));
    }
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <div className="theme-shell min-h-dvh transition-colors duration-300">
      <div className="theme-surface mx-auto flex min-h-dvh w-full max-w-[600px] flex-col transition-colors duration-300">
        <HeaderSection title={"Verify Phone Number"} />

        <section className="theme-surface relative -mt-10 flex flex-1 flex-col rounded-t-[32px] pb-10 pt-3 transition-colors duration-300">
          <div className="flex flex-col items-center text-center">
            <div className="theme-static-panel mb-8 mt-2 flex aspect-square w-full max-w-[343px] items-center justify-center rounded-[24px] border">
              <Image
                src="/icons/artboard-2.jpg"
                alt="Verification illustration"
                width={343}
                height={343}
                className="h-auto w-full"
              />
            </div>

            <p className="theme-text-secondary mb-8 text-center font-satoshi text-[18px] leading-6">
              Please enter the verification code we sent to your mobile{" "}
              <span className="theme-text-primary font-semibold">{maskedPhone}</span>
            </p>

            <div
              className="mb-7 flex items-center justify-center gap-[10px]"
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
                  className={`theme-otp-input h-[52px] w-[52px] rounded-full border text-center text-[22px] font-semibold outline-none transition-all duration-200 ${
                    digit ? "theme-otp-input-filled" : "theme-otp-input-empty"
                  }`}
                />
              ))}
            </div>

            <p className="theme-text-secondary px-4 text-center font-satoshi text-[18px] leading-6">
              Not yet get?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                aria-label={
                  canResend
                    ? "Resend OTP"
                    : `Resend OTP available in ${resendTimer} seconds`
                }
                className="theme-text-primary font-semibold disabled:opacity-100"
              >
                Resend OTP
              </button>
            </p>
          </div>

          <div className="flex-1" />

          <button
            type="button"
            onClick={handleVerify}
            disabled={!isComplete || isLoading}
            className={`w-full max-w-[343px] flex items-center justify-center mx-auto py-4 rounded-[14px] text-white text-[18px] font-semibold tracking-wide transition-all duration-200
              ${
                isComplete
                  ? "bg-[#00D061] hover:bg-[#00b856] hover:shadow-[0_6px_20px_rgba(0,208,97,0.40)] hover:-translate-y-px active:translate-y-0"
                  : "bg-[#A8F0CB] cursor-not-allowed"
              }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify"
            )}
          </button>
        </section>
      </div>
    </div>
  );
}
