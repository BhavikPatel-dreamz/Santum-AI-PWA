"use client";

import StepPageShell from "@/components/app/StepPageShell";
import { getClientErrorMessage, isUnauthorizedError } from "@/lib/api/error";
import { useGetProfileQuery } from "@/lib/store";
import {
  buildProfileInitials,
  getProfileEmail,
  getProfileFirstName,
  getProfileLastName,
} from "@/lib/utills/profile";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { PASSWORD_RESET_EMAIL_STORAGE_KEY } from "../../lib/utills/phone";

const EMPTY_PROFILE_FORM = {
  firstName: "Anonymous",
  lastName: "Anonymous",
  email: "",
};

function FloatingInput({
  id,
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        disabled={disabled}
        className={`theme-floating-input peer block h-[64px] w-full rounded-[18px] border px-4 pt-5 text-[17px] outline-none transition-all ${disabled ? "cursor-not-allowed theme-text-muted" : ""
          }`}
      />
      <label
        htmlFor={id}
        className="theme-text-muted pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] transition-all peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[12px] peer-focus:text-[#00A84D] peer-[&:not(:placeholder-shown)]:top-3 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-[12px]"
      >
        {label}
      </label>
    </div>
  );
}

function buildProfileForm(profile) {
  return {
    firstName: getProfileFirstName(profile),
    lastName: getProfileLastName(profile),
    email: getProfileEmail(profile),
  };
}


export default function PersonalInformationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("source") === "onboarding";
  const {
    data: profile,
    error: profileError,
    isLoading: isProfileLoading,
  } = useGetProfileQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const profileForm = buildProfileForm(profile);
  const form = profileForm;
  const didInitialize = !isProfileLoading;

  useEffect(() => {
    if (!profileError) {
      return;
    }

    if (isUnauthorizedError(profileError)) {
      router.replace("/sign-in");
      return;
    }

    toast.error(getClientErrorMessage(profileError, "Unable to load profile"));
  }, [profileError, router]);
  const emailAddress = getProfileEmail(profile);
  const profileInitials = buildProfileInitials(
    EMPTY_PROFILE_FORM.firstName,
    EMPTY_PROFILE_FORM.lastName,
  );

  const handleChangePassword = () => {
    sessionStorage.setItem(PASSWORD_RESET_EMAIL_STORAGE_KEY, form.email.trim());
    router.push("/forgot-password");
  };

  return (
    <StepPageShell
      title={isOnboarding ? "Complete Profile" : "Profile Info"}
      contentClassName="overflow-y-auto pb-24"
    >
      {!isOnboarding && (
        <div className="theme-card mb-6 rounded-[26px] border px-5 py-5">
          <div className="flex items-center gap-4">
            <div className="theme-pill flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full text-[24px] font-semibold">
              {profileInitials}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#00A84D]">
                Overview
              </p>
              <h2 className="theme-text-primary mt-2 truncate text-[24px] font-semibold leading-8">
                Anonymous
              </h2>
              <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-6 truncate">
                {emailAddress ||
                  "Contact details are managed from your Santum account"}
              </p>
            </div>
          </div>
        </div>
      )}

      {isProfileLoading && !didInitialize ? (
        <div className="theme-card rounded-[26px] border px-5 py-8 text-center">
          <p className="theme-text-secondary font-satoshi text-[15px] leading-6">
            Loading your saved profile details...
          </p>
        </div>
      ) : (
        <>
          <div className="theme-card mb-5 rounded-[26px] border px-5 py-5">
            <div className="mb-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#00A84D]">
                Logged Details
              </p>
            </div>

            <div className="space-y-4">
              <FloatingInput
                disabled={true}
                id="first-name"
                label="Username"
                value={EMPTY_PROFILE_FORM.firstName}
              />
              <FloatingInput
                disabled={true}
                id="email"
                label="Email"
                value={form.email}
              />
            </div>
          </div>
        </>
      )}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {!isOnboarding ? (
          <button
            type="button"
            onClick={handleChangePassword}
            className="theme-danger-card theme-danger-title rounded-[14px] px-5 py-4 text-[16px] font-semibold"
          >
            Change Password
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => {
            router.push("/home");
          }}
          disabled={!didInitialize}
          className={`rounded-[14px] px-5 py-4 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(0,208,97,0.22)] ${!didInitialize ? "bg-[#A8F0CB]" : "bg-[#00D061]"
            } ${isOnboarding ? "sm:col-span-2" : ""}`}
        >
          Back Home
        </button>
      </div>
    </StepPageShell>
  );
}
