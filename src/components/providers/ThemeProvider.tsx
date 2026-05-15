"use client";

import {
  createContext,
  useContext,
  useEffectEvent,
  useLayoutEffect,
  useState,
} from "react";
import {
  isThemeName,
  THEME_STORAGE_KEY,
  type ThemeName,
  type ThemePreference,
} from "@/lib/theme";

type ThemeContextValue = {
  isDark: boolean;
  setTheme: (theme: ThemeName) => void;
  theme: ThemeName;
  themePreference: ThemePreference;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): ThemePreference {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeName(storedTheme) ? storedTheme : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: ThemeName) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themePreference, setThemePreference] =
    useState<ThemePreference>("light");

  const theme = themePreference ?? "light";
  const syncThemeFromBrowser = useEffectEvent(() => {
    const storedTheme = readStoredTheme() ?? "light";

    setThemePreference(storedTheme);
    applyTheme(storedTheme);
  });

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    syncThemeFromBrowser();
  }, []);

  const setTheme = (nextTheme: ThemeName) => {
    setThemePreference(nextTheme);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {}
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const value = {
    isDark: theme === "dark",
    setTheme,
    theme,
    themePreference,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
