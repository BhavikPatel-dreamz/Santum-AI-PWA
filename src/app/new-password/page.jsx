"use client";

import StepPageShell from "@/components/app/StepPageShell";
import { getClientErrorMessage } from "@/lib/api/error";
import {
  useForgetPasswordMutation,
  useResetPasswordMutation,
} from "@/lib/store";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  PASSWORD_RESET_EMAIL_STORAGE_KEY,
  PASSWORD_RESET_OTP_STORAGE_KEY,
} from "../../lib/utills/phone";

function PasswordField({ id, label, value, onChange, show, onToggle }) {
  return (
    <div className="theme-card rounded-[24px] border p-4">
      <label
        htmlFor={id}
        className="theme-text-muted mb-3 block text-[13px] font-semibold uppercase tracking-[0.16em]"
      >
        {label}
      </label>
      <div className="theme-input-group flex items-center gap-3 rounded-[18px] px-4 py-3.5">
        <Lock size={18} className="text-[#00A84D]" />
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="theme-input-field flex-1 text-[15px] outline-none"
          placeholder={label}
        />
        <button
          type="button"
          onClick={onToggle}
          className="theme-text-secondary"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function CreateNewPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);

  const [resetOtp, setResetOtp] = useState("");
  const inputRefs = useRef([]);
  const [resetPassword, { isLoading: isResettingPassword }] =
    useResetPasswordMutation();

  const [forgetpassword, { isLoading: isResendingOtp }] =
    useForgetPasswordMutation();

  const isComplete = password.trim() !== "" && confirmPassword.trim() !== "";
  const isMatch = password === confirmPassword;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const email =
        sessionStorage.getItem(PASSWORD_RESET_EMAIL_STORAGE_KEY) || "";

      if (!email || !otp) {
        router.replace("/forgot-password");
        return;
      }

      setResetEmail(email);
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

  const handleChangePassword = async () => {
    if (!isComplete || !isMatch || isResettingPassword) {
      return;
    }

    try {
      await resetPassword({
        email: resetEmail,
        otp: otp.join(""),
        password,
      }).unwrap();

      sessionStorage.removeItem(PASSWORD_RESET_EMAIL_STORAGE_KEY);
      sessionStorage.removeItem(PASSWORD_RESET_OTP_STORAGE_KEY);
      toast.success("Password changed successfully.");
      router.replace("/sign-in");
    } catch (error) {
      toast.error(getClientErrorMessage(error, "Unable to change password"));
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

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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
  const isOTPComplete = otp.every((digit) => digit !== "");

  const handleResendOtp = async () => {
    if (!resetEmail || resendTimer > 0 || isResendingOtp) {
      return;
    }

    try {
      await forgetpassword({ email: resetEmail }).unwrap();
      setOtp(["", "", "", ""]);
      setResendTimer(60);
      toast.success("OTP sent again.");
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(getClientErrorMessage(error, "Unable to resend OTP"));
    }
  };

  return (
    <StepPageShell
      title="Create New Password"
      contentClassName="overflow-y-auto"
    >
      <p className="theme-text-secondary mb-6 text-center font-satoshi text-[18px] leading-6">
        4-digit OTP was sent to{" "}
        <span className="theme-text-primary font-semibold text-[14px]">
          {resetEmail}
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
      <div className="space-y-4 py-4">
        <PasswordField
          id="new-password"
          label="New password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          show={showPassword}
          onToggle={() => setShowPassword((currentValue) => !currentValue)}
        />
        <PasswordField
          id="confirm-password"
          label="Confirm password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          show={showConfirmPassword}
          onToggle={() =>
            setShowConfirmPassword((currentValue) => !currentValue)
          }
        />
      </div>

      {!isMatch && confirmPassword ? (
        <p className="theme-danger-title mt-3 font-satoshi text-[14px] leading-6">
          Passwords do not match yet.
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleChangePassword}
        disabled={
          !isComplete || !isMatch || isResettingPassword || !isOTPComplete
        }
        className={`mt-auto rounded-[14px] px-5 py-4 text-[18px] font-semibold text-white transition-all duration-200 ${
          isComplete && isMatch && !isResettingPassword
            ? "bg-[#00D061] shadow-[0_10px_24px_rgba(0,208,97,0.22)]"
            : "bg-[#A8F0CB]"
        }`}
      >
        {isResettingPassword ? "Changing..." : "Change Password"}
      </button>
    </StepPageShell>
  );
}
