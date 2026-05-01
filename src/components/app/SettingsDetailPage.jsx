"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronRight, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import FeatureShowcaseCard from "./FeatureShowcaseCard";
import StepPageShell from "./StepPageShell";

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
      className={`relative h-[30px] w-[54px] rounded-full transition-all duration-300 ${
        enabled ? "bg-[#00D061]" : "theme-surface-secondary"
      }`}
    >
      <span
        className={`theme-surface absolute top-[3px] h-6 w-6 rounded-full shadow-sm transition-all duration-300 ${
          enabled ? "left-[26px]" : "left-[3px]"
        }`}
      />
    </button>
  );
}

function ActionButton({ action, onClick, fullWidth = false }) {
  const baseClassName =
    "flex items-center justify-center rounded-[14px] px-5 py-4 text-[16px] font-semibold transition-all duration-200";
  const variantClassName =
    action.variant === "secondary"
      ? "theme-secondary-button hover:opacity-90"
      : "bg-[#00D061] text-white shadow-[0_10px_24px_rgba(0,208,97,0.22)] hover:bg-[#00b856]";

  return (
    <button
      type="button"
      onClick={() => onClick(action)}
      className={`${baseClassName} ${variantClassName} ${fullWidth ? "w-full" : "flex-1"}`}
    >
      {action.label}
    </button>
  );
}

export default function SettingsDetailPage({ content }) {
  const router = useRouter();
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
  const [choices, setChoices] = useState(() => {
    const initialState = {};

    content.sections.forEach((section) => {
      if (section.type === "choices") {
        initialState[section.key] = section.selected;
      }
    });

    return initialState;
  });
  const [faqOpen, setFaqOpen] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("");

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

    toast.success(action.toast || `${action.label} saved in this session.`);
  };

  const renderSection = (section, sectionIndex) => {
    if (section.type === "stats") {
      return (
        <div key={`${section.type}-${sectionIndex}`} className="mb-6">
          <SectionHeading title={section.title} description={section.description} />

          <div className="grid grid-cols-3 gap-3">
            {section.items.map((item) => (
              <div
                key={item.label}
                className="theme-card-muted rounded-[20px] border px-3 py-4 text-center"
              >
                <p className="theme-text-primary text-[20px] font-semibold leading-7">
                  {item.value}
                </p>
                <p className="theme-text-secondary mt-1 font-satoshi text-[13px] leading-5">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (section.type === "list") {
      return (
        <div key={`${section.type}-${sectionIndex}`} className="mb-6">
          <SectionHeading title={section.title} description={section.description} />

          <div className="space-y-3">
            {section.items.map((item) => (
              <div
                key={`${item.title}-${item.meta || ""}`}
                className="theme-card rounded-[22px] border px-4 py-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#00D061]" />
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
                    <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-6">
                      {item.description}
                    </p>
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
          <SectionHeading title={section.title} description={section.description} />

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
                  enabled={!!toggles[item.key]}
                  onToggle={() =>
                    setToggles((currentToggles) => ({
                      ...currentToggles,
                      [item.key]: !currentToggles[item.key],
                    }))
                  }
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
          <SectionHeading title={section.title} description={section.description} />

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
                  className={`w-full rounded-[22px] border px-4 py-4 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-[#00D061] bg-[#F2FFF7] shadow-[0_12px_30px_rgba(0,208,97,0.12)]"
                      : "theme-card"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border ${
                        isSelected
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
                      className={`shrink-0 text-[#00D061] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
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
          <SectionHeading title={section.title} description={section.description} />

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
          <SectionHeading title={section.title} description={section.description} />

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

    if (section.type === "form") {
      return (
        <div key={`${section.type}-${sectionIndex}`} className="mb-6">
          <SectionHeading title={section.title} description={section.description} />

          {section.categories?.length ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {section.categories.map((category) => {
                const isSelected = feedbackCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setFeedbackCategory(category)}
                    className={`rounded-full px-3 py-2 text-[13px] font-semibold transition-all ${
                      isSelected
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
              onClick={() => {
                if (!feedbackText.trim()) {
                  toast.error("Please add a little feedback first.");
                  return;
                }

                toast.success(section.submitToast || "Saved");
                setFeedbackText("");
              }}
              className="mt-4 w-full rounded-[14px] bg-[#00D061] px-4 py-4 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(0,208,97,0.22)]"
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
          <SectionHeading title={section.title} description={section.description} />

          <div className="rounded-[26px] bg-[linear-gradient(135deg,#E9FFF3_0%,#FFFFFF_100%)] p-5 shadow-[0_12px_30px_rgba(15,15,15,0.04)]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#00A84D]">
              Referral code
            </p>
            <div className="mt-3 flex items-center justify-between gap-3 rounded-[20px] bg-[#0F0F0F] px-4 py-4 text-white">
              <div>
                <p className="text-[22px] font-semibold leading-7">{section.code}</p>
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
          <SectionHeading title={section.title} description={section.description} />

          <div className="space-y-3">
            {section.items.map((item) => (
              <div
                key={item.title}
                className="theme-danger-card rounded-[22px] border px-4 py-4"
              >
                <h4 className="theme-danger-title text-[16px] font-semibold leading-6">
                  {item.title}
                </h4>
                <p className="theme-danger-copy mt-2 font-satoshi text-[14px] leading-6">
                  {item.description}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    toast.success(
                      `${item.buttonLabel} request captured in this session.`,
                    )
                  }
                  className="theme-surface theme-danger-title mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold"
                >
                  {item.buttonLabel}
                  <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <StepPageShell title={content.title} contentClassName="overflow-y-auto">
      <FeatureShowcaseCard
        badge={content.badge}
        title={content.heroTitle}
        description={content.description}
        imageSrc={content.imageSrc}
        imageAlt={content.imageAlt}
        className="mb-6"
      />

      {content.sections.map((section, sectionIndex) =>
        renderSection(section, sectionIndex),
      )}

      {content.footerActions?.length ? (
        <div
          className={`mt-auto pt-4 ${content.footerActions.length > 1 ? "grid grid-cols-1 gap-3 sm:grid-cols-2" : ""}`}
        >
          {content.footerActions.map((action) => (
            <ActionButton
              key={action.label}
              action={action}
              onClick={handleAction}
              fullWidth={content.footerActions.length === 1}
            />
          ))}
        </div>
      ) : null}
    </StepPageShell>
  );
}
