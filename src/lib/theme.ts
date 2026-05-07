export const THEME_STORAGE_KEY = "theme";

export const THEME_OPTIONS = ["light", "dark"] as const;

export type ThemeName = (typeof THEME_OPTIONS)[number];
export type ThemePreference = ThemeName | null;

export function isThemeName(value: string | null | undefined): value is ThemeName {
  return value === "light" || value === "dark";
}