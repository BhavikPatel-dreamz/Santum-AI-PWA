export const THEME_STORAGE_KEY = "amigo-theme";

export const THEME_OPTIONS = ["light", "dark"] as const;

export type ThemeName = (typeof THEME_OPTIONS)[number];
export type ThemePreference = ThemeName | null;

export function isThemeName(value: string | null | undefined): value is ThemeName {
  return value === "light" || value === "dark";
}

export function getThemeInitScript() {
  return `
    (() => {
      const storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
      const root = document.documentElement;

      try {
        const storedTheme = window.localStorage.getItem(storageKey);
        const theme =
          storedTheme === "light" || storedTheme === "dark"
            ? storedTheme
            : window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light";

        root.dataset.theme = theme;
        root.style.colorScheme = theme;
      } catch {
        const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

        root.dataset.theme = theme;
        root.style.colorScheme = theme;
      }
    })();
  `;
}
