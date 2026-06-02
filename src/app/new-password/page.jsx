"use client";

import StepPageShell from "@/components/app/StepPageShell";
import { getClientErrorMessage } from "@/lib/api/error";
import { useResetPasswordMutation } from "@/lib/store";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  PASSWORD_RESET_EMAIL_STORAGE_KEY,
  PASSWORD_RESET_OTP_STORAGE_KEY,
} from "../../lib/utills/phone";
import { validatePassword } from "@/lib/utills/profile";

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [resetPassword, { isLoading: isResettingPassword }] =
    useResetPasswordMutation();

  const isComplete = password.trim() !== "" && confirmPassword.trim() !== "";
  const isMatch = password === confirmPassword;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const email =
        sessionStorage.getItem(PASSWORD_RESET_EMAIL_STORAGE_KEY) || "";
      const otp = sessionStorage.getItem(PASSWORD_RESET_OTP_STORAGE_KEY) || "";

      if (!email || !otp) {
        router.replace("/forgot-password");
        return;
      }

      setResetEmail(email);
      setResetOtp(otp);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [router]);

  const handleChangePassword = async () => {
    if (!isComplete || !isMatch || isResettingPassword) {
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) return toast.error(passwordError);

    try {
      await resetPassword({
        email: resetEmail,
        otp: resetOtp,
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

  return (
    <StepPageShell
      title="Create New Password"
      contentClassName="overflow-y-auto"
    >
      <div className="space-y-4">
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
        disabled={!isComplete || !isMatch || isResettingPassword}
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
