"use client";

import StepPageShell from "@/components/app/StepPageShell";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PASSWORD_RESET_EMAIL_STORAGE_KEY } from "../../lib/utills/phone";
import toast from "react-hot-toast";
import { useForgetPasswordMutation } from "@/lib/store";
import { getClientErrorMessage } from "@/lib/api/error";

export default function ForgetPasswordPage() {
  const [storedEmail, setStoredEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [emailEntered, setEmailEntered] = useState(false);
  const [forgetpassword, { isLoading: isSendingOtp }] =
    useForgetPasswordMutation();

  const validateEmailAddress = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const stored = sessionStorage.getItem(PASSWORD_RESET_EMAIL_STORAGE_KEY);
      if (stored) {
        setStoredEmail(stored);
        setEmailEntered(true);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const RECOVERY_OPTIONS = [
    {
      id: "email",
      title: "Recover with Email",
      description: "Receive a verification code in your email inbox.",
      value: storedEmail,
      icon: Mail,
    },
  ];
  const router = useRouter();

  const handleSubmit = async () => {
    const email = (userEmail || storedEmail).trim();

    if (!email) {
      return toast.error("Email is required");
    }

    if (!validateEmailAddress(email)) {
      return toast.error("Enter a valid email address");
    }

    try {
      await forgetpassword({
        email,
      }).unwrap();
      sessionStorage.setItem(PASSWORD_RESET_EMAIL_STORAGE_KEY, email);
      setStoredEmail(email);
      toast.success("OTP sent to your email.");
      router.replace("/confirm-otp");
    } catch (error) {
      toast.error(getClientErrorMessage(error, "Unable to send OTP"));
    }
  };

  return (
    <StepPageShell title="Reset Password" contentClassName="overflow-y-auto">
      {/* <div className="mb-4">
        <h2 className="theme-text-primary text-[20px] font-semibold leading-7">
          Pick a recovery path
        </h2>
        <p className="theme-text-secondary mt-1 font-satoshi text-[15px] leading-6">
          We&apos;ll use this to send your verification code.
        </p>
      </div> */}

      {!emailEntered ? (
        <>
          <div className="mb-6">
            <label className="theme-text-primary mb-3 block font-satoshi text-[16px] font-semibold leading-6">
              Enter Your Email Address
            </label>

            <div className="theme-input-group flex items-center gap-3 rounded-[14px] px-4 py-3.5">
              <Mail className="theme-text-secondary shrink-0" size={22} />
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="your.email@example.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="theme-input-field min-w-0 flex-1 text-[16px] outline-none"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          {RECOVERY_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = true;

            return (
              <button
                key={option.id}
                type="button"
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
                    <p className="mt-3 text-[13px] font-semibold text-[#00A84D]">
                      {option.value}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => handleSubmit()}
        disabled={isSendingOtp}
        className={`mt-auto rounded-[14px] px-5 py-4 text-[18px] font-semibold text-white transition-all ${
          isSendingOtp
            ? "bg-[#A8F0CB]"
            : "bg-[#00D061] shadow-[0_10px_24px_rgba(0,208,97,0.22)]"
        }`}
      >
        {isSendingOtp ? "Sending..." : "Continue"}
      </button>
    </StepPageShell>
  );
}
