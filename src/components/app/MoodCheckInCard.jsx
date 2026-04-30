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
          <p className="text-[15px] font-semibold text-[#0F0F0F]">{label}</p>
          <p className="mt-1 font-satoshi text-[12px] leading-5 text-[#66756D]">
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
        className="mt-3 h-2 w-full cursor-pointer rounded-full bg-[#DCE8E1]"
        style={{ accentColor }}
      />
      <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-[#8A9890]">
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
            <h3 className="mt-2 text-[20px] font-semibold leading-7 text-[#0F0F0F]">
              {successTitle}
            </h3>
            <p className="mt-2 font-satoshi text-[14px] leading-6 text-[#55645C]">
              {successDescription}
            </p>
            <p className="mt-3 text-[13px] font-medium text-[#0F0F0F]">
              {formatMoodSnapshot(entry)}
            </p>
          </div>
          {showUpdateAction ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-full bg-[#E8FFF1] px-3 py-2 text-[12px] font-semibold text-[#087C3A]"
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
      <h3 className="mt-2 text-[20px] font-semibold leading-7 text-[#0F0F0F]">
        {title}
      </h3>
      <p className="mt-2 font-satoshi text-[14px] leading-6 text-[#55645C]">
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
            ? "bg-[#CFE8DA] text-[#5C6C63]"
            : "bg-[#0F0F0F] text-white hover:opacity-95 active:scale-[0.99]"
        }`}
      >
        {isSaving ? "Saving check-in..." : submitLabel}
      </button>
    </form>
  );
}
