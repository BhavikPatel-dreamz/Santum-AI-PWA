"use client";

import { useState } from "react";
import {
  buildMoodFormValues,
  formatMoodSnapshot,
  MOOD_METRICS,
  MOOD_SCORE_MAX,
  MOOD_SCORE_MIN,
} from "@/lib/utills/mood";

function MoodSlider({ helperText, label, name, value, accentColor, onChange }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="theme-text-primary text-[15px] font-semibold">{label}</p>
          <p className="theme-text-secondary mt-1 font-satoshi text-[12px] leading-5">
            {helperText}
          </p>
        </div>
        <span
          className="inline-flex min-w-10 justify-center rounded-full px-3 py-1 text-[13px] font-semibold text-white"
          style={{ backgroundColor: accentColor }}
        >
          {value}
        </span>
      </div>
      <input
        type="range"
        min={MOOD_SCORE_MIN}
        max={MOOD_SCORE_MAX}
        step="1"
        value={value}
        onChange={(event) => onChange(name, Number(event.target.value))}
        className="theme-surface-secondary mt-3 h-2 w-full cursor-pointer rounded-full"
        style={{ accentColor }}
      />
      <div className="theme-text-muted mt-2 flex items-center justify-between text-[11px] font-medium">
        <span>{MOOD_SCORE_MIN}</span>
        <span>{MOOD_SCORE_MAX}</span>
      </div>
    </label>
  );
}

export default function MoodCheckInCard({
  entry,
  isSaving = false,
  onSubmit,
  className = "",
  title = "How are you feeling today?",
  description = "A quick check-in helps Amigo adapt its tone before you chat.",
  submitLabel = "Save today's check-in",
  successTitle = "You've checked in today ✅",
  successDescription = "Thanks for sharing how you feel. Amigo can use this when it responds today.",
  showUpdateAction = true,
}) {
  const [isEditing, setIsEditing] = useState(!entry);
  const [formValues, setFormValues] = useState(buildMoodFormValues(entry));

  const updateValue = (name, nextValue) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: nextValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    await onSubmit(formValues);
  };

  if (entry && !isEditing) {
    return (
      <div
        className={`theme-card-muted rounded-[24px] border px-4 py-4 shadow-[0_12px_30px_rgba(15,15,15,0.04)] ${className}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#00A84D]">
              Mood Check-In
            </p>
            <h3 className="theme-text-primary mt-2 text-[20px] font-semibold leading-7">
              {successTitle}
            </h3>
            <p className="theme-text-secondary mt-2 font-satoshi text-[14px] leading-6">
              {successDescription}
            </p>
            <p className="theme-text-primary mt-3 text-[13px] font-medium">
              {formatMoodSnapshot(entry)}
            </p>
          </div>
          {showUpdateAction ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="theme-pill rounded-full px-3 py-2 text-[12px] font-semibold"
            >
              Update
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`theme-card rounded-[24px] border px-4 py-4 shadow-[0_12px_30px_rgba(15,15,15,0.04)] ${className}`}
    >
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#00A84D]">
        Mood Check-In
      </p>
      <h3 className="theme-text-primary mt-2 text-[20px] font-semibold leading-7">
        {title}
      </h3>
      <p className="theme-text-secondary mt-2 font-satoshi text-[14px] leading-6">
        {description}
      </p>

      <div className="mt-5 space-y-5">
        {MOOD_METRICS.map((metric) => (
          <MoodSlider
            key={metric.key}
            name={metric.key}
            label={metric.label}
            helperText={metric.helperText}
            accentColor={metric.accentColor}
            value={formValues[metric.key]}
            onChange={updateValue}
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className={`mt-5 inline-flex w-full items-center justify-center rounded-[16px] px-4 py-3 text-[15px] font-semibold transition-all ${
          isSaving
            ? "theme-secondary-button theme-text-secondary"
            : "bg-[#00D061] text-white shadow-[0_10px_24px_rgba(0,208,97,0.22)] hover:opacity-95 active:scale-[0.99]"
        }`}
      >
        {isSaving ? "Saving check-in..." : submitLabel}
      </button>
    </form>
  );
}
