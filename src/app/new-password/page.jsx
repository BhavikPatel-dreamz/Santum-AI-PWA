"use client";

import FeatureShowcaseCard from "@/components/app/FeatureShowcaseCard";
import StepPageShell from "@/components/app/StepPageShell";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
}) {
  return (
    <div className="rounded-[24px] border border-[#EEF6F1] bg-white p-4 shadow-[0_12px_30px_rgba(15,15,15,0.04)]">
      <label
        htmlFor={id}
        className="mb-3 block text-[13px] font-semibold uppercase tracking-[0.16em] text-[#7E8A83]"
      >
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-[18px] bg-[#F6FBF8] px-4 py-3.5">
        <Lock size={18} className="text-[#00A84D]" />
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent text-[15px] text-[#0F0F0F] outline-none"
          placeholder={label}
        />
        <button type="button" onClick={onToggle} className="text-[#555]">
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

  const isComplete = password.trim() !== "" && confirmPassword.trim() !== "";
  const isMatch = password === confirmPassword;

  return (
    <StepPageShell title="Create New Password" contentClassName="overflow-y-auto">
      <FeatureShowcaseCard
        badge="Security Reset"
        title="Set a fresh password that feels easy to remember"
        description="The UI is now aligned with your main visual system while still using dummy completion logic for now."
        imageSrc="/icons/finger-print-img-green.png"
        imageAlt="Security reset"
        className="mb-6"
      />

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
        <p className="mt-3 font-satoshi text-[14px] leading-6 text-[#D92D20]">
          Passwords do not match yet.
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => {
          if (!isComplete || !isMatch) {
            return;
          }

          toast.success("Password updated in demo mode.");
          router.replace("/sign-in");
        }}
        disabled={!isComplete || !isMatch}
        className={`mt-auto rounded-[14px] px-5 py-4 text-[18px] font-semibold text-white transition-all duration-200 ${
          isComplete && isMatch
            ? "bg-[#00D061] shadow-[0_10px_24px_rgba(0,208,97,0.22)]"
            : "bg-[#A8F0CB]"
        }`}
      >
        Change Password
      </button>
    </StepPageShell>
  );
}
