export const MOOD_SCORE_MIN = 0;
export const MOOD_SCORE_MAX = 10;

export const DEFAULT_MOOD_VALUES = {
  happiness: 5,
  stress: 5,
  energy: 5,
};

export const MOOD_METRICS = [
  {
    key: "happiness",
    label: "Happiness",
    accentColor: "#00B15D",
    helperText: "How light or positive do things feel right now?",
  },
  {
    key: "stress",
    label: "Stress",
    accentColor: "#FF8A3D",
    helperText: "How pressured or overwhelmed does today feel?",
  },
  {
    key: "energy",
    label: "Energy",
    accentColor: "#1D9BF0",
    helperText: "How much fuel do you have for focus and momentum?",
  },
];

const MOOD_DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function normalizeDatePart(value) {
  return String(value).padStart(2, "0");
}

export function getTodayMoodDateKey(date = new Date()) {
  return `${date.getFullYear()}-${normalizeDatePart(date.getMonth() + 1)}-${normalizeDatePart(
    date.getDate(),
  )}`;
}

export function isValidMoodDateKey(value) {
  return (
    typeof value === "string" &&
    MOOD_DATE_KEY_PATTERN.test(value.trim())
  );
}

export function clampMoodScore(value) {
  const parsedValue =
    typeof value === "string" && value.trim() !== ""
      ? Number(value)
      : typeof value === "number"
        ? value
        : Number.NaN;

  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  const normalizedValue = Math.round(parsedValue);

  if (
    normalizedValue < MOOD_SCORE_MIN ||
    normalizedValue > MOOD_SCORE_MAX
  ) {
    return null;
  }

  return normalizedValue;
}

export function buildMoodFormValues(entry) {
  return {
    happiness: clampMoodScore(entry?.happiness) ?? DEFAULT_MOOD_VALUES.happiness,
    stress: clampMoodScore(entry?.stress) ?? DEFAULT_MOOD_VALUES.stress,
    energy: clampMoodScore(entry?.energy) ?? DEFAULT_MOOD_VALUES.energy,
  };
}

export function sanitizeMoodCheckInEntry(entry, fallbackDateKey = "") {
  const rawDateKey =
    typeof entry?.dateKey === "string"
      ? entry.dateKey.trim()
      : typeof entry?.date === "string"
        ? entry.date.trim()
        : fallbackDateKey;
  const normalizedEntry = {
    dateKey: rawDateKey,
    happiness: clampMoodScore(entry?.happiness),
    stress: clampMoodScore(entry?.stress),
    energy: clampMoodScore(entry?.energy),
  };

  if (!isValidMoodDateKey(rawDateKey)) {
    return { error: "A valid mood check-in date is required." };
  }

  if (
    normalizedEntry.happiness === null ||
    normalizedEntry.stress === null ||
    normalizedEntry.energy === null
  ) {
    return {
      error: "Mood sliders must use whole numbers between 0 and 10.",
    };
  }

  return { data: normalizedEntry };
}

export function serializeMoodCheckIn(entry) {
  const normalizedEntry = sanitizeMoodCheckInEntry(
    entry,
    typeof entry?.dateKey === "string" ? entry.dateKey : "",
  );

  if (!normalizedEntry.data) {
    return null;
  }

  return {
    id: String(entry?._id ?? entry?.id ?? ""),
    dateKey: normalizedEntry.data.dateKey,
    happiness: normalizedEntry.data.happiness,
    stress: normalizedEntry.data.stress,
    energy: normalizedEntry.data.energy,
    createdAt: entry?.createdAt ?? null,
    updatedAt: entry?.updatedAt ?? null,
  };
}

export function buildMoodAssistantContext(entry) {
  const normalizedEntry = sanitizeMoodCheckInEntry(
    entry,
    typeof entry?.dateKey === "string" ? entry.dateKey : "",
  );

  if (!normalizedEntry.data) {
    return "";
  }

  const { dateKey, energy, happiness, stress } = normalizedEntry.data;

  return [
    `Today's mood check-in (${dateKey}) is available as supportive context.`,
    `Happiness: ${happiness}/10.`,
    `Stress: ${stress}/10.`,
    `Energy: ${energy}/10.`,
    "Use it to gently adapt tone, pacing, and encouragement.",
    "Do not overstate the mood scores or repeatedly mention them unless it helps the user.",
  ].join(" ");
}

export function formatMoodSnapshot(entry) {
  const normalizedEntry = sanitizeMoodCheckInEntry(
    entry,
    typeof entry?.dateKey === "string" ? entry.dateKey : "",
  );

  if (!normalizedEntry.data) {
    return "";
  }

  const { happiness, stress, energy } = normalizedEntry.data;

  return `Happiness ${happiness}/10, Stress ${stress}/10, Energy ${energy}/10`;
}
