"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, ChevronRight, Copy } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import StepPageShell from "./StepPageShell";
import { getClientErrorMessage, isUnauthorizedError } from "@/lib/api/error";
import {
  useGetProfileQuery,
  useGetSubscriptionStatusQuery,
  useLogoutMutation,
  useUpdateBasicProfileMutation,
} from "@/lib/store";
import { PAUSED_ACCOUNT_MESSAGE, isProfilePaused } from "@/lib/utills/profile";
import {
  getPlanPurchaseBlockReason,
  getPlanPurchaseHrefByLevel,
} from "@/lib/utills/subscription";

function SectionHeading({ title, description }) {
  if (!title && !description) {
    return null;
  }

  return (
    <div className="mb-4">
      {title ? (
        <h3 className="theme-text-primary text-[20px] font-semibold leading-7">
          {title}
        </h3>
      ) : null}
      {description ? (
        <p className="theme-text-secondary mt-1 font-satoshi text-[15px] leading-6">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function Toggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative h-[30px] w-[54px] shrink-0 rounded-full transition-all duration-300 ${enabled ? "bg-[#00D061]" : "theme-surface-secondary"
        }`}
    >
      <span
        className={`theme-surface absolute top-[3px] h-6 w-6 rounded-full shadow-sm transition-all duration-300 ${enabled ? "left-[26px]" : "left-[3px]"
          }`}
      />
    </button>
  );
}

function ActionButton({ action, onClick, fullWidth = false }) {
  const baseClassName =
    "flex w-full items-center justify-center rounded-[14px] px-5 py-4 text-[16px] font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60";
  const variantClassName =
    action.variant === "secondary"
      ? "theme-secondary-button hover:opacity-90"
      : "bg-[#00D061] text-white shadow-[0_10px_24px_rgba(0,208,97,0.22)] hover:bg-[#00b856]";
  return (
    <div className={fullWidth ? "w-full" : ""}>
      <button
        type="button"
        disabled={action.disabled}
        onClick={() => onClick(action)}
        className={`${baseClassName} ${variantClassName}`}
      >
        {action.disabledLabel && action.disabled
          ? action.disabledLabel
          : action.label}
      </button>
      {action.disabledReason ? (
        <p className="theme-text-secondary mt-2 font-satoshi text-[12px] leading-5">
          {action.disabledReason}
        </p>
      ) : null}
    </div>
  );
}

function formatStatusValue(value, fallback = "Not available") {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  return value
    .trim()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");
}

function formatCyclePeriod(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "Monthly";
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "month") {
    return "Monthly";
  }

  if (normalizedValue === "year") {
    return "Yearly";
  }

  if (normalizedValue === "week") {
    return "Weekly";
  }

  return formatStatusValue(value, "Monthly");
}

function buildSubscriptionStats(subscriptionStatus, isLoading) {
  if (isLoading) {
    return [
      { label: "Plan", value: "Loading" },
      { label: "Renewal", value: "Loading" },
      { label: "Check-ins", value: "Daily" },
    ];
  }

  return [
    {
      label: "Plan",
      value: subscriptionStatus?.active_plan_name || "No active plan",
    },
    {
      label: "Renewal",
      value: formatCyclePeriod(subscriptionStatus?.cycle_period),
    },
    {
      label: "Check-ins",
      value: "Daily",
    },
  ];
}

function buildSubscriptionFeatureItems(subscriptionStatus) {
  const planFeatures = Array.isArray(subscriptionStatus?.active_plan_features)
    ? subscriptionStatus.active_plan_features
    : [];

  return planFeatures.map((feature) => ({
    title: feature,
    description: "",
  }));
}

function getUpgradePlanKey(value) {
  if (typeof value !== "string") {
    return "";
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue.includes("standard")) {
    return "standard";
  }

  if (normalizedValue.includes("premium")) {
    return "premium";
  }

  return "";
}

function setUpgradePlanItems(nextPlan, items) {
  const nextPlanKey = getUpgradePlanKey(nextPlan);
  const itemsMap = {
    "Longer talk time": {
      standard: {
        title: "Longer talk time",
        description:
          "Enjoy 8-10 hours of talk time, refreshed at the start of each monthly billing cycle.",
      },
      premium: {
        title: "Longer talk time",
        description:
          "Enjoy 18-20 hours of talk time, refreshed at the start of each monthly billing cycle.",
      },
    },
    "Advanced techniques": {
      standard: {
        title: "Emotional Context",
        description:
          "Understand emotional context behind thoughts and behaviours that can unlock meaningful insight and personal growth.",
      },
      premium: {
        title: "Advanced techniques",
        description:
          "Empower yourself with deeper self-understanding and stronger coping strategies through evidence-based therapeutic support.",
      },
    },
    "Practical strategies": {
      standard: {
        title: "Complex Reasoning",
        description:
          "Develop deeper understanding and discover practical pathways to emotional relief and positive change.",
      },
      premium: {
        title: "Practical strategies",
        description:
          "Strengthen your mindset, focus, and emotional regulation through cognitive training and behavioral management.",
      },
    },
  };

  return items.map((item) => itemsMap[item.title][nextPlanKey]);
}

function buildPlanUpgradeGetYouItems(subscriptionStatus, sections) {
  const upgradeSection = sections.find(
    (section) =>
      section.type === "list" && section.title === "Plan Upgrade Gets You:",
  );

  if (!upgradeSection) {
    return [];
  }

  return setUpgradePlanItems(
    subscriptionStatus.next_plan_name,
    upgradeSection.items,
  );
}

export default function SettingsDetailPage({ content }) {
  const router = useRouter();
  const pathname = usePathname();
  const isSubscriptionsPage = pathname === "/settings/subscriptions";
  const { data: profile } = useGetProfileQuery();
  const {
    data: subscriptionStatus,
    error: subscriptionStatusError,
    isFetching: isSubscriptionStatusFetching,
    isLoading: isSubscriptionStatusLoading,
  } = useGetSubscriptionStatusQuery(undefined, {
    skip: !isSubscriptionsPage,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });
  const [updateBasicProfile, { isLoading: isUpdatingBasicProfile }] =
    useUpdateBasicProfileMutation();

  const [logout] = useLogoutMutation();
  const isAccountPaused = isProfilePaused(profile);
  const isPausedFeatureLocked =
    isAccountPaused &&
    pathname !== "/settings/security" &&
    pathname !== "/settings/account-management";
  const [toggles, setToggles] = useState(() => {
    const initialState = {};

    content.sections.forEach((section) => {
      if (section.type === "toggles") {
        section.items.forEach((item) => {
          initialState[item.key] = item.enabled;
        });
      }
    });

    return initialState;
  });
  const [activeAction, setActiveAction] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [choices, setChoices] = useState(() => {
    const initialState = {};

    content.sections.forEach((section) => {
      if (section.type === "choices") {
        initialState[section.key] = section.selected;
      }
    });

    return initialState;
  });
  const hasUpgradePlan = Boolean(
    getUpgradePlanKey(subscriptionStatus?.next_plan_name),
  );
  const listActions = hasUpgradePlan
    ? buildPlanUpgradeGetYouItems(subscriptionStatus, content.sections)
    : content.sections;
  const footerActions = (content.footerActions ?? []).map((action, index) => {
    if (index !== 0 || !subscriptionStatus?.next_plan_name) {
      return action;
    }

    const upgradePlanKey = getUpgradePlanKey(subscriptionStatus.next_plan_name);
    const purchaseBlockReason = getPlanPurchaseBlockReason(
      upgradePlanKey
        ? {
          name: upgradePlanKey,
          billing_amount: 1,
        }
        : null,
      subscriptionStatus,
    );

    return {
      ...action,
      label: subscriptionStatus.next_plan_name,
      disabled: Boolean(purchaseBlockReason),
      disabledLabel: "Purchase Locked",
      disabledReason: purchaseBlockReason,
      href: upgradePlanKey
        ? getPlanPurchaseHrefByLevel(upgradePlanKey)
        : action.href,
    };
  });

  const [faqOpen, setFaqOpen] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("");
  const [activeLegalDocument, setActiveLegalDocument] = useState(() => {
    const legalSection = content.sections.find(
      (section) => section.type === "legal-content",
    );

    return legalSection?.documents?.[0]?.key || "";
  });

  const isDisable = feedbackText.trim().length < 1;

  useEffect(() => {
    if (!subscriptionStatusError) {
      return;
    }

    if (isUnauthorizedError(subscriptionStatusError)) {
      router.replace("/sign-in");
      return;
    }

    toast.error(
      getClientErrorMessage(
        subscriptionStatusError,
        "Unable to load subscription status",
      ),
    );
  }, [router, subscriptionStatusError]);

  const saveBasicProfilePatch = async (patch, fallbackMessage) => {
    try {
      const response = await updateBasicProfile(patch).unwrap();
      return response;
    } catch (error) {
      if (isUnauthorizedError(error)) {
        router.replace("/sign-in");
        return null;
      }

      toast.error(getClientErrorMessage(error, fallbackMessage));
      return null;
    }
  };

  const handleAction = async (action) => {
    if (action.href) {
      router.push(action.href);
      return;
    }

    if (action.copyText) {
      try {
        await navigator.clipboard.writeText(action.copyText);
        toast.success(action.toast || "Copied to clipboard");
      } catch {
        toast.error("Unable to copy right now");
      }

      return;
    }

    if (isPausedFeatureLocked) {
      toast.error(PAUSED_ACCOUNT_MESSAGE);
      return;
    }

    toast.success(action.toast || `${action.label} saved in this session.`);
  };
  const handlePermanentDelete = async () => {
    if (confirmText !== "DELETE") {
      toast.error('Type "DELETE" to confirm');
      return;
    }

    setActiveAction("delete");

    const response = await saveBasicProfilePatch(
      {
        delete: true,
      },
      "Unable to delete account",
    );

    setActiveAction(null);

    if (response) {
      toast.success("Account Deleted Successfully");

      setShowDeleteConfirm(false);

      await logout().unwrap();

      router.replace("/");
    }
  };

  const renderSection = (section, sectionIndex) => {
    if (section.type === "stats") {
      const items =
        isSubscriptionsPage && section.title === "Plan Snapshot"
          ? buildSubscriptionStats(
            subscriptionStatus,
            isSubscriptionStatusLoading || isSubscriptionStatusFetching,
          )
          : section.items;

      return (
        <div key={`${section.type}-${sectionIndex}`} className="mb-6">
          <SectionHeading
            title={section.title}
            description={section.description}
          />

          <div className="grid grid-cols-3 gap-3">
            {items.map((item) => (
              <div
                key={item.label}
                className="theme-card-muted rounded-[20px] border px-3 py-4 text-center"
              >
                <p className="theme-text-primary text-[16px] font-semibold leading-7">
                  {item.label == "Renewal" && item.value == "0"
                    ? "No"
                    : item.value}
                </p>
                <p className="theme-text-secondary mt-1 font-satoshi text-[12px] leading-5">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (section.type === "list") {
      const isSubscriptionFeatureSection =
        isSubscriptionsPage && section.title === "Plan Upgrade Gets You:";
      const isSubscriptionStatusBusy =
        isSubscriptionStatusLoading || isSubscriptionStatusFetching;
      const items =
        isSubscriptionFeatureSection && !isSubscriptionStatusBusy
          ? buildSubscriptionFeatureItems(subscriptionStatus)
          : section.items;
      const title = isSubscriptionFeatureSection
        ? "Unique Plan Features"
        : section.title;

      return (
        <div key={`${section.type}-${sectionIndex}`} className="mb-6">
          {isSubscriptionsPage && (
            <SectionHeading title={title} description={section.description} />
          )}

          <div className="space-y-3">
            {isSubscriptionFeatureSection && isSubscriptionStatusBusy ? (
              <div className="theme-card rounded-[22px] border px-4 py-4">
                <p className="theme-text-primary text-[16px] font-semibold leading-6">
                  Loading plan features
                </p>
                <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-6">
                  Fetching your plan from Santum.
                </p>
              </div>
            ) : null}

            {items.length === 0 &&
              isSubscriptionFeatureSection &&
              !isSubscriptionStatusBusy ? (
              <div className="theme-card rounded-[22px] border px-4 py-4">
                <p className="theme-text-primary text-[16px] font-semibold leading-6">
                  No plan features available yet.
                </p>
                <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-6">
                  Features will appear here once the available plans API returns
                  them for your plan.
                </p>
              </div>
            ) : null}

            {!isSubscriptionStatusBusy && isSubscriptionsPage && (
              <div className="theme-card rounded-[22px] border">
                {items.map((item) => (
                  <div
                    key={`${item.title}-${item.meta || ""}`}
                    className="px-4 py-1"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-2 h-2.5 w-2.5 rounded-full bg-[#00D061]" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="theme-text-primary text-[16px] font-semibold leading-6">
                            {item.title}
                          </h4>
                          {item.badge ? (
                            <span className="rounded-full bg-[#E8FFF1] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#00A84D]">
                              {item.badge}
                            </span>
                          ) : null}
                        </div>
                        {item.description ? (
                          <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-6">
                            {item.description}
                          </p>
                        ) : null}
                        {item.meta ? (
                          <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.14em] text-[#7E8A83]">
                            {item.meta}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {hasUpgradePlan && isSubscriptionsPage && (
              <>
                <SectionHeading
                  title={`${subscriptionStatus?.next_plan_name} & Get:`}
                  description={section.description}
                />
                {listActions.map((item) => (
                  <div
                    key={`${item.title}-${item.meta || ""}`}
                    className="theme-card rounded-[22px] border px-4 py-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-2 h-2.5 w-2.5 rounded-full bg-[#00D061]" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="theme-text-primary text-[16px] font-semibold leading-6">
                            {item.title}
                          </h4>
                          {item.badge ? (
                            <span className="rounded-full bg-[#E8FFF1] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#00A84D]">
                              {item.badge}
                            </span>
                          ) : null}
                        </div>
                        {item.description ? (
                          <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-6">
                            {item.description}
                          </p>
                        ) : null}
                        {item.meta ? (
                          <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.14em] text-[#7E8A83]">
                            {item.meta}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {!isSubscriptionsPage && (
              <SectionHeading
                title={section.title}
                description={section.description}
              />
            )}
            {!isSubscriptionsPage &&
              section.items.map((item) => (
                <div
                  key={`${item.title}-${item.meta || ""}`}
                  className="theme-card rounded-[22px] border px-4 py-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-2 h-2.5 w-2.5 rounded-full bg-[#00D061]" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="theme-text-primary text-[16px] font-semibold leading-6">
                          {item.title}
                        </h4>
                        {item.badge ? (
                          <span className="rounded-full bg-[#E8FFF1] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#00A84D]">
                            {item.badge}
                          </span>
                        ) : null}
                      </div>
                      {item.description ? (
                        <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-6">
                          {item.description}
                        </p>
                      ) : null}
                      {item.meta ? (
                        <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.14em] text-[#7E8A83]">
                          {item.meta}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      );
    }

    if (section.type === "toggles") {
      return (
        <div key={`${section.type}-${sectionIndex}`} className="mb-6">
          <SectionHeading
            title={section.title}
            description={section.description}
          />

          <div className="space-y-3">
            {section.items.map((item) => (
              <div
                key={item.key}
                className="theme-card flex items-start justify-between gap-4 rounded-[22px] border px-4 py-4"
              >
                <div>
                  <h4 className="theme-text-primary text-[16px] font-semibold leading-6">
                    {item.label}
                  </h4>
                  <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-6">
                    {item.description}
                  </p>
                </div>
                <Toggle
                  enabled={
                    item.key === "biometricPrompt"
                      ? profile?.fingerprint_enabled === true
                      : !!toggles[item.key]
                  }
                  onToggle={async () => {
                    if (isUpdatingBasicProfile) {
                      return;
                    }

                    let togglevalue;

                    if (item.key === "biometricPrompt") {
                      const finger = localStorage.getItem("passkeyId");
                      const isEnabled = profile?.fingerprint_enabled === true;

                      if (!finger) {
                        toast.error(
                          "Scan your finger to enable Fingerprint lock",
                        );
                        return;
                      }

                      togglevalue = !isEnabled;
                      const response = await saveBasicProfilePatch(
                        {
                          fingerprint_enabled: togglevalue,
                          passkey_id: finger,
                        },
                        "Unable to update fingerprint lock",
                      );

                      if (!response) {
                        return;
                      }
                    } else {
                      togglevalue = !toggles[item.key];
                    }

                    setToggles((currentToggles) => ({
                      ...currentToggles,
                      [item.key]: togglevalue,
                    }));
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (section.type === "choices") {
      return (
        <div key={`${section.type}-${sectionIndex}`} className="mb-6">
          <SectionHeading
            title={section.title}
            description={section.description}
          />

          <div className="space-y-3">
            {section.items.map((item) => {
              const isSelected = choices[section.key] === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    setChoices((currentChoices) => ({
                      ...currentChoices,
                      [section.key]: item.label,
                    }))
                  }
                  className={`w-full rounded-[22px] border px-4 py-4 text-left transition-all duration-200 ${isSelected
                    ? "border-[#00D061] bg-[#F2FFF7] shadow-[0_12px_30px_rgba(0,208,97,0.12)]"
                    : "theme-card"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border ${isSelected
                        ? "border-[#00D061] bg-[#00D061] text-white"
                        : "theme-surface theme-border border text-transparent"
                        }`}
                    >
                      <Check size={14} />
                    </div>
                    <div>
                      <h4 className="theme-text-primary text-[16px] font-semibold leading-6">
                        {item.label}
                      </h4>
                      <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-6">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (section.type === "faq") {
      return (
        <div key={`${section.type}-${sectionIndex}`} className="mb-6">
          <div className="space-y-3">
            {section.items.map((item, itemIndex) => {
              const isOpen = faqOpen === itemIndex;

              return (
                <div
                  key={item.question}
                  className="theme-card overflow-hidden rounded-[22px] border"
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpen(isOpen ? -1 : itemIndex)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                  >
                    <span className="theme-text-primary text-[16px] font-semibold leading-6">
                      {item.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-[#00D061] transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {isOpen ? (
                    <p className="theme-border theme-text-secondary border-t px-4 py-4 font-satoshi text-[14px] leading-6">
                      {item.answer}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (section.type === "steps") {
      return (
        <div key={`${section.type}-${sectionIndex}`} className="mb-6">
          <SectionHeading
            title={section.title}
            description={section.description}
          />

          <div className="space-y-3">
            {section.items.map((item, itemIndex) => (
              <div
                key={item}
                className="theme-card flex gap-4 rounded-[22px] border px-4 py-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8FFF1] text-[15px] font-semibold text-[#00A84D]">
                  {itemIndex + 1}
                </div>
                <p className="theme-text-primary pt-1 font-satoshi text-[15px] leading-6">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (section.type === "text") {
      return (
        <div key={`${section.type}-${sectionIndex}`} className="mb-6">
          <SectionHeading
            title={section.title}
            description={section.description}
          />

          <div className="space-y-3">
            {section.items.map((item) => (
              <div
                key={item.heading}
                className="theme-card-muted rounded-[22px] border px-4 py-4"
              >
                <h4 className="theme-text-primary text-[16px] font-semibold leading-6">
                  {item.heading}
                </h4>
                <p className="theme-text-secondary mt-2 font-satoshi text-[14px] leading-6">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (section.type === "legal-content") {
      const activeDocument =
        section.documents.find(
          (document) => document.key === activeLegalDocument,
        ) || section.documents[0];

      return (
        <div key={`${section.type}-${sectionIndex}`} className="mb-6">
          <SectionHeading
            title={section.title}
            description={section.description}
          />

          <div className="theme-card-muted sticky top-0 z-10 mb-5 grid grid-cols-2 gap-2 rounded-[16px] border p-1">
            {section.documents.map((document) => {
              const isActive = activeDocument.key === document.key;

              return (
                <button
                  key={document.key}
                  type="button"
                  onClick={() => setActiveLegalDocument(document.key)}
                  className={`rounded-[12px] px-3 py-3 text-[13px] font-semibold transition-all sm:text-[14px] ${isActive
                    ? "bg-[#00D061] text-white shadow-[0_10px_20px_rgba(0,208,97,0.2)]"
                    : "theme-text-secondary"
                    }`}
                >
                  {document.label}
                </button>
              );
            })}
          </div>

          <article className="theme-card rounded-[22px] border px-4 py-5 sm:px-6 sm:py-6 lg:px-7">
            <div className="theme-border border-b pb-5">
              <h4 className="theme-text-primary text-[22px] font-semibold leading-8 sm:text-[26px] sm:leading-9">
                {activeDocument.title}
              </h4>
              {activeDocument.description ? (
                <p className="theme-text-secondary mt-2 max-w-[760px] font-satoshi text-[14px] leading-6 sm:text-[15px]">
                  {activeDocument.description}
                </p>
              ) : null}
            </div>

            <div className="divide-y theme-border">
              {activeDocument.sections.map((documentSection, itemIndex) => (
                <section
                  key={`${activeDocument.key}-${documentSection.heading}`}
                  className={`${itemIndex === 0 ? "pt-5" : "py-5"} last:pb-0`}
                >
                  <h5 className="theme-text-primary text-[17px] font-semibold leading-7 sm:text-[19px]">
                    {documentSection.heading}
                  </h5>

                  <div className="mt-3 space-y-3">
                    {documentSection.paragraphs?.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="theme-text-secondary font-satoshi text-[14px] leading-7 sm:text-[15px]"
                      >
                        {paragraph}
                      </p>
                    ))}

                    {documentSection.items?.length ? (
                      <ul className="space-y-2">
                        {documentSection.items.map((item) => (
                          <li
                            key={item}
                            className="theme-text-secondary flex gap-3 font-satoshi text-[14px] leading-7 sm:text-[15px]"
                          >
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#00D061]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      );
    }

    if (section.type === "form") {
      return (
        <div key={`${section.type}-${sectionIndex}`} className="mb-6">
          <SectionHeading
            title={section.title}
            description={section.description}
          />

          {section.categories?.length ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {section.categories.map((category) => {
                const isSelected = feedbackCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setFeedbackCategory(category)}
                    className={`rounded-full px-3 py-2 text-[13px] font-semibold transition-all ${isSelected
                      ? "bg-[#00D061] text-white"
                      : "theme-secondary-button"
                      }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="theme-card rounded-[24px] border p-4">
            <textarea
              rows={6}
              value={feedbackText}
              onChange={(event) => setFeedbackText(event.target.value)}
              placeholder={section.placeholder}
              className="theme-input-surface w-full resize-none rounded-[18px] px-4 py-4 font-satoshi text-[15px] leading-6 outline-none"
            />

            <button
              type="button"
              disabled={isDisable}
              onClick={() => {
                if (isPausedFeatureLocked) {
                  toast.error(PAUSED_ACCOUNT_MESSAGE);
                  return;
                }

                if (!feedbackText.trim()) {
                  toast.error("Please add a little feedback first.");
                  return;
                }

                toast.success(section.submitToast || "Saved");
                setFeedbackText("");
              }}
              className={`mt-4 w-full ${isDisable ? "cursor-not-allowed bg-gray-300 text-gray-500" : "bg-[#00D061] text-white"} rounded-[14px]  px-4 py-4 text-[16px] font-semibold  shadow-[0_10px_24px_rgba(0,208,97,0.22)]`}
            >
              {section.submitLabel}
            </button>
          </div>
        </div>
      );
    }

    if (section.type === "referral") {
      return (
        <div key={`${section.type}-${sectionIndex}`} className="mb-6">
          <SectionHeading
            title={section.title}
            description={section.description}
          />

          <div className="rounded-[26px] bg-[linear-gradient(135deg,#E9FFF3_0%,#FFFFFF_100%)] p-5 shadow-[0_12px_30px_rgba(15,15,15,0.04)]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#00A84D]">
              Referral code
            </p>
            <div className="mt-3 flex items-center justify-between gap-3 rounded-[20px] bg-[#0F0F0F] px-4 py-4 text-white">
              <div>
                <p className="text-[22px] font-semibold leading-7">
                  {section.code}
                </p>
                <p className="mt-1 font-satoshi text-[13px] leading-5 text-white/70">
                  {section.reward}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleAction({
                    copyText: section.code,
                    toast: "Invite code copied.",
                  })
                }
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (section.type === "destructive") {
      return (
        <div key={`${section.type}-${sectionIndex}`} className="mb-6">
          <SectionHeading
            title={section.title}
            description={section.description}
          />

          <div className="space-y-3">
            {section.items.map((item) => {
              const isPauseAction = item.title.toLowerCase().includes("pause");
              const isDeleteAction = item.title
                .toLowerCase()
                .includes("delete");
              const pauseActionLabel = isAccountPaused ? "Resume" : "Pause";
              const buttonLabel = isPauseAction
                ? pauseActionLabel
                : item.buttonLabel;
              const loadingLabel = isAccountPaused
                ? "Resuming..."
                : "Pausing...";

              let buttonText = buttonLabel;

              if (isUpdatingBasicProfile) {
                if (activeAction === "pause" && isPauseAction) {
                  buttonText = loadingLabel;
                }

                if (activeAction === "delete" && isDeleteAction) {
                  buttonText = "Deleting...";
                }
              }
              return (
                <div
                  key={item.title}
                  className="theme-danger-card rounded-[22px] border px-4 py-4"
                >
                  <h4 className="theme-danger-title text-[16px] font-semibold leading-6">
                    {isPauseAction && isAccountPaused
                      ? "Resume account"
                      : item.title}
                  </h4>
                  <p className="theme-danger-copy mt-2 font-satoshi text-[14px] leading-6">
                    {isPauseAction && isAccountPaused
                      ? "Turn your Santum AI account back on and restore normal access."
                      : item.description}
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      if (isDeleteAction) {
                        setShowDeleteConfirm(true);
                        return;
                      }
                      if (isPauseAction) {
                        setActiveAction("pause");

                        const nextPaused = !isAccountPaused;

                        const response = await saveBasicProfilePatch(
                          { paused: nextPaused },
                          nextPaused
                            ? "Unable to pause account"
                            : "Unable to resume account",
                        );

                        setActiveAction(null);

                        if (response) {
                          toast.success(
                            response.message ||
                            (nextPaused
                              ? "Account paused"
                              : "Account resumed"),
                          );
                        }

                        return;
                      }
                    }}
                    disabled={isUpdatingBasicProfile}
                    className="theme-surface theme-danger-title mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {buttonText}
                    <ChevronRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <StepPageShell title={content.title} contentClassName="overflow-y-auto">
      {content.sections.map((section, sectionIndex) =>
        renderSection(section, sectionIndex),
      )}

      {content.footerActions?.length ? (
        <div
          className={`mt-auto pt-4 ${content.footerActions.length > 1 ? "grid grid-cols-1 gap-3 sm:grid-cols-2" : ""}`}
        >
          {footerActions.map((action) => (
            <ActionButton
              key={action.label}
              action={action}
              onClick={handleAction}
              fullWidth={footerActions.length === 1}
            />
          ))}
        </div>
      ) : null}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="theme-card w-full max-w-md rounded-[28px] border p-6">
            <h2 className="theme-text-primary text-[22px] font-semibold">
              Delete Account
            </h2>

            <p className="theme-text-secondary mt-3 text-[15px] leading-6">
              This action cannot be undone. All your chats, subscription data,
              and account information will be permanently deleted.
            </p>

            <div className="mt-5 rounded-[16px] bg-red-500/10 p-4">
              <p className="text-sm font-medium text-red-500">
                Type DELETE below to confirm permanent deletion.
              </p>
            </div>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder='Type "DELETE"'
              className="theme-input-surface mt-5 w-full rounded-[16px] px-4 py-3 outline-none"
            />

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setConfirmText("");
                }}
                className="theme-secondary-button flex-1 rounded-[14px] px-4 py-3 font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePermanentDelete}
                disabled={isUpdatingBasicProfile}
                className="flex-1 rounded-[14px] bg-red-500 px-4 py-3 font-semibold text-white disabled:opacity-60"
              >
                {isUpdatingBasicProfile ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </StepPageShell>
  );
}
