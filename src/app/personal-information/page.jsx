"use client";

import FeatureShowcaseCard from "@/components/app/FeatureShowcaseCard";
import StepPageShell from "@/components/app/StepPageShell";
import { getClientErrorMessage, isUnauthorizedError } from "@/lib/api/error";
import {
  PROFILE_INTERESTS,
  PROFILE_LANGUAGES,
} from "@/lib/content/profile-options";
import {
  useGetProfileQuery,
  useUpdateBasicProfileMutation,
  useUpdateInterestsMutation,
  useUpdatePreferredLanguageMutation,
} from "@/lib/store";
import {
  buildProfileInitials,
  getProfileDob,
  getProfileEmail,
  getProfileFirstName,
  getProfileFullName,
  getProfileInterests,
  getProfileLastName,
  getProfilePhone,
  getProfilePreferredLanguage,
} from "@/lib/utills/profile";
import { CheckCircle2, Mail, Phone } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EMPTY_PROFILE_FORM = {
  firstName: "",
  lastName: "",
  dob: "",
  preferredLanguage: PROFILE_LANGUAGES[0],
  interests: [],
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
        className={`theme-floating-input peer block h-[64px] w-full rounded-[18px] border px-4 pt-5 text-[17px] outline-none transition-all ${
          disabled ? "cursor-not-allowed theme-text-muted" : ""
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
    dob: getProfileDob(profile),
    preferredLanguage:
      getProfilePreferredLanguage(profile) || PROFILE_LANGUAGES[0],
    interests: getProfileInterests(profile),
  };
}

function normalizeInterests(values) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function normalizeFormState(form) {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    dob: form.dob,
    preferredLanguage: form.preferredLanguage.trim(),
    interests: normalizeInterests(form.interests).sort((left, right) =>
      left.localeCompare(right),
    ),
  };
}

function hasMatchingInterests(leftValues, rightValues) {
  if (leftValues.length !== rightValues.length) {
    return false;
  }

  return leftValues.every((value, index) => value === rightValues[index]);
}

function validateBasicProfile(form) {
  if (!form.firstName.trim()) {
    return "First name is required";
  }

  if (!form.lastName.trim()) {
    return "Last name is required";
  }

  if (!form.dob) {
    return "Date of birth is required";
  }

  const birthDate = new Date(form.dob);

  if (Number.isNaN(birthDate.getTime())) {
    return "Enter a valid date of birth";
  }

  const ageDifference = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifference);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);

  if (age < 13) {
    return "You must be at least 13 years old";
  }

  return null;
}

function SelectionChip({ label, isSelected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-[14px] font-medium transition-all ${
        isSelected
          ? "theme-choice-chip-selected"
          : "theme-choice-chip hover:opacity-90"
      }`}
    >
      {label}
    </button>
  );
}

export default function PersonalInformationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("source") === "onboarding";
  const [draftForm, setDraftForm] = useState(null);
  const [savedBaseline, setSavedBaseline] = useState(null);

  const {
    data: profile,
    error: profileError,
    isLoading: isProfileLoading,
  } = useGetProfileQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [updateBasicProfile, { isLoading: isSavingBasic }] =
    useUpdateBasicProfileMutation();
  const [updatePreferredLanguage, { isLoading: isSavingLanguage }] =
    useUpdatePreferredLanguageMutation();
  const [updateInterests, { isLoading: isSavingInterests }] =
    useUpdateInterestsMutation();
  const profileForm = buildProfileForm(profile);
  const form = draftForm ?? profileForm;
  const baseline = savedBaseline ?? profileForm;
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

  const normalizedCurrent = normalizeFormState(form);
  const normalizedBaseline = normalizeFormState(baseline);
  const isBasicChanged =
    normalizedCurrent.firstName !== normalizedBaseline.firstName ||
    normalizedCurrent.lastName !== normalizedBaseline.lastName ||
    normalizedCurrent.dob !== normalizedBaseline.dob;
  const isLanguageChanged =
    normalizedCurrent.preferredLanguage !== normalizedBaseline.preferredLanguage;
  const isInterestsChanged = !hasMatchingInterests(
    normalizedCurrent.interests,
    normalizedBaseline.interests,
  );
  const hasProfileChanges =
    isBasicChanged || isLanguageChanged || isInterestsChanged;
  const isSavingProfile =
    isSavingBasic || isSavingLanguage || isSavingInterests;

  const profileName =
    [normalizedCurrent.firstName, normalizedCurrent.lastName]
      .filter(Boolean)
      .join(" ") ||
    getProfileFullName(profile) ||
    "Your Santum profile";
  const emailAddress = getProfileEmail(profile);
  const phoneNumber = getProfilePhone(profile);
  const profileInitials = buildProfileInitials(
    normalizedCurrent.firstName,
    normalizedCurrent.lastName,
  );
  const completionScore = [
    Boolean(normalizedCurrent.firstName && normalizedCurrent.lastName),
    Boolean(normalizedCurrent.dob),
    Boolean(normalizedCurrent.preferredLanguage),
    normalizedCurrent.interests.length > 0,
  ].filter(Boolean).length;

  const updateField = (field, value) => {
    setDraftForm((currentForm) => ({
      ...(currentForm ?? profileForm ?? EMPTY_PROFILE_FORM),
      [field]: value,
    }));
  };

  const toggleInterest = (interest) => {
    setDraftForm((currentForm) => {
      const nextForm = currentForm ?? profileForm ?? EMPTY_PROFILE_FORM;
      const isSelected = nextForm.interests.includes(interest);

      return {
        ...nextForm,
        interests: isSelected
          ? nextForm.interests.filter((value) => value !== interest)
          : [...nextForm.interests, interest],
      };
    });
  };

  const finishProfileFlow = () => {
    if (isOnboarding) {
      router.replace("/reasons");
    }
  };

  const handleSaveProfile = async () => {
    const basicValidationMessage = validateBasicProfile(normalizedCurrent);

    if (isOnboarding && basicValidationMessage) {
      toast.error(basicValidationMessage);
      return;
    }

    if (!hasProfileChanges) {
      if (isOnboarding) {
        finishProfileFlow();
        return;
      }

      toast.success("Your profile is already up to date");
      return;
    }

    if (isBasicChanged && basicValidationMessage) {
      toast.error(basicValidationMessage);
      return;
    }

    if (isInterestsChanged && normalizedCurrent.interests.length === 0) {
      toast.error("Choose at least one interest before saving this section");
      return;
    }

    try {
      if (isBasicChanged) {
        await updateBasicProfile({
          firstName: normalizedCurrent.firstName,
          lastName: normalizedCurrent.lastName,
          dob: normalizedCurrent.dob,
        }).unwrap();
      }

      if (isLanguageChanged) {
        await updatePreferredLanguage({
          preferredLanguage: normalizedCurrent.preferredLanguage,
        }).unwrap();
      }

      if (isInterestsChanged) {
        await updateInterests({
          interests: normalizedCurrent.interests,
        }).unwrap();
      }

      setSavedBaseline(normalizedCurrent);
      setDraftForm(normalizedCurrent);

      if (isOnboarding) {
        toast.success("Profile completed");
      } else {
        toast.success("Profile changes saved");
      }

      finishProfileFlow();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        router.replace("/sign-in");
        return;
      }

      toast.error(getClientErrorMessage(error, "Unable to save profile"));
    }
  };

  return (
    <StepPageShell
      title={isOnboarding ? "Complete Profile" : "My Profile"}
      contentClassName="overflow-y-auto pb-24"
    >
      <FeatureShowcaseCard
        badge={isOnboarding ? "Welcome" : "Account"}
        title={
          isOnboarding
            ? "Finish one clean profile setup before your first full session"
            : "Keep your Santum profile complete, readable, and ready"
        }
        description={
          isOnboarding
            ? "Basic details, language, and interests now live in one place instead of three separate steps."
            : "This profile module loads your saved data first, then lets you update the fields the current API supports."
        }
        imageSrc="/icons/logo.png"
        imageAlt="Profile overview"
        className="mb-6"
        compact
      />

      <div className="theme-card mb-6 rounded-[26px] border px-5 py-5">
        <div className="flex items-center gap-4">
          <div className="theme-pill flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full text-[24px] font-semibold">
            {profileInitials}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#00A84D]">
              Profile Overview
            </p>
            <h2 className="theme-text-primary mt-2 truncate text-[24px] font-semibold leading-8">
              {profileName}
            </h2>
            <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-6">
              {emailAddress ||
                phoneNumber ||
                "Contact details are managed from your Santum account"}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="theme-static-panel rounded-[20px] border px-3 py-4 text-center">
            <p className="theme-text-primary text-[20px] font-semibold leading-7">
              {completionScore}/4
            </p>
            <p className="theme-text-secondary mt-1 font-satoshi text-[12px] leading-5">
              Complete
            </p>
          </div>
          <div className="theme-static-panel rounded-[20px] border px-3 py-4 text-center">
            <p className="theme-text-primary text-[20px] font-semibold leading-7">
              {normalizedCurrent.preferredLanguage || "--"}
            </p>
            <p className="theme-text-secondary mt-1 font-satoshi text-[12px] leading-5">
              Language
            </p>
          </div>
          <div className="theme-static-panel rounded-[20px] border px-3 py-4 text-center">
            <p className="theme-text-primary text-[20px] font-semibold leading-7">
              {normalizedCurrent.interests.length}
            </p>
            <p className="theme-text-secondary mt-1 font-satoshi text-[12px] leading-5">
              Interests
            </p>
          </div>
        </div>
      </div>

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
                Basic Details
              </p>
              <h3 className="theme-text-primary mt-2 text-[22px] font-semibold leading-8">
                Name and date of birth
              </h3>
              <p className="theme-text-secondary mt-2 font-satoshi text-[14px] leading-6">
                These fields are fully editable with the current Santum profile
                API.
              </p>
            </div>

            <div className="space-y-4">
              <FloatingInput
                id="first-name"
                label="First Name"
                value={form.firstName}
                onChange={(event) =>
                  updateField("firstName", event.target.value)
                }
              />
              <FloatingInput
                id="last-name"
                label="Last Name"
                value={form.lastName}
                onChange={(event) => updateField("lastName", event.target.value)}
              />
              <FloatingInput
                id="dob"
                label="Date of Birth"
                type="date"
                value={form.dob}
                onChange={(event) => updateField("dob", event.target.value)}
              />
            </div>
          </div>

          <div className="theme-card mb-5 rounded-[26px] border px-5 py-5">
            <div className="mb-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#00A84D]">
                Contact Details
              </p>
              <h3 className="theme-text-primary mt-2 text-[22px] font-semibold leading-8">
                Visible here, managed from your account source
              </h3>
              <p className="theme-text-secondary mt-2 font-satoshi text-[14px] leading-6">
                Email and mobile currently come from your signed-in Santum
                account. This module shows them clearly but does not overwrite
                them locally without a dedicated backend update route.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="theme-static-panel rounded-[22px] border px-4 py-4">
                <div className="theme-text-secondary mb-3 flex items-center gap-2">
                  <Mail size={16} />
                  <span className="text-[12px] font-semibold uppercase tracking-[0.16em]">
                    Email
                  </span>
                </div>
                <p className="theme-text-primary text-[15px] font-medium leading-6">
                  {emailAddress || "No email returned by the current profile API"}
                </p>
              </div>
              <div className="theme-static-panel rounded-[22px] border px-4 py-4">
                <div className="theme-text-secondary mb-3 flex items-center gap-2">
                  <Phone size={16} />
                  <span className="text-[12px] font-semibold uppercase tracking-[0.16em]">
                    Mobile
                  </span>
                </div>
                <p className="theme-text-primary text-[15px] font-medium leading-6">
                  {phoneNumber || "No mobile number returned by the current profile API"}
                </p>
              </div>
            </div>
          </div>

          <div className="theme-card mb-5 rounded-[26px] border px-5 py-5">
            <div className="mb-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#00A84D]">
                Preferred Language
              </p>
              <h3 className="theme-text-primary mt-2 text-[22px] font-semibold leading-8">
                Save the language you want to use most
              </h3>
            </div>

            <div className="flex flex-wrap gap-3">
              {PROFILE_LANGUAGES.map((language) => (
                <SelectionChip
                  key={language}
                  label={language}
                  isSelected={form.preferredLanguage === language}
                  onClick={() => updateField("preferredLanguage", language)}
                />
              ))}
            </div>
          </div>

          <div className="theme-card rounded-[26px] border px-5 py-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#00A84D]">
                  Interests
                </p>
                <h3 className="theme-text-primary mt-2 text-[22px] font-semibold leading-8">
                  Keep your preference set relevant
                </h3>
              </div>
              <span className="theme-pill rounded-full px-3 py-1 text-[12px] font-semibold">
                {normalizedCurrent.interests.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {PROFILE_INTERESTS.map((interest) => (
                <SelectionChip
                  key={interest}
                  label={interest}
                  isSelected={form.interests.includes(interest)}
                  onClick={() => toggleInterest(interest)}
                />
              ))}
            </div>

            <div className="theme-static-panel mt-4 rounded-[20px] border px-4 py-4">
              <p className="theme-text-secondary font-satoshi text-[14px] leading-6">
                Select at least one interest if you want this section updated.
                If you are returning from onboarding, saving here will replace
                the old separate language and interest steps.
              </p>
            </div>
          </div>
        </>
      )}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {!isOnboarding ? (
          <button
            type="button"
            onClick={() => router.push("/home")}
            className="theme-secondary-button rounded-[14px] px-5 py-4 text-[16px] font-semibold"
          >
            Back To Home
          </button>
        ) : null}

        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={!didInitialize || isSavingProfile}
          className={`rounded-[14px] px-5 py-4 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(0,208,97,0.22)] ${
            isSavingProfile || !didInitialize
              ? "bg-[#A8F0CB]"
              : "bg-[#00D061]"
          } ${isOnboarding ? "sm:col-span-2" : ""}`}
        >
          {isSavingProfile ? (
            <span className="inline-flex items-center gap-3">
              <span className="h-5 w-5 rounded-full border-[3px] border-white border-t-transparent animate-spin" />
              Saving profile...
            </span>
          ) : isOnboarding ? (
            "Finish Profile Setup"
          ) : hasProfileChanges ? (
            "Save Profile Changes"
          ) : (
            "Profile Is Up To Date"
          )}
        </button>
      </div>

      {!isOnboarding ? (
        <div className="theme-card-soft theme-border mt-4 rounded-[22px] border px-4 py-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 text-[#00A84D]" size={18} />
            <p className="theme-text-secondary font-satoshi text-[14px] leading-6">
              This page now acts as the main profile module for the PWA. Basic
              details, language, and interests are editable here, while email
              and phone stay visible until the backend exposes dedicated update
              endpoints for them.
            </p>
          </div>
        </div>
      ) : null}
    </StepPageShell>
  );
}
