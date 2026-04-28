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
  isUsingSystemTheme: boolean;
  setTheme: (theme: ThemeName) => void;
  theme: ThemeName;
  themePreference: ThemePreference;
  toggleTheme: () => void;
  useSystemTheme: () => void;
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

function readDocumentTheme(): ThemeName | null {
  if (typeof document === "undefined") {
    return null;
  }

  const currentTheme = document.documentElement.dataset.theme;
  return isThemeName(currentTheme) ? currentTheme : null;
}

function readSystemTheme(): ThemeName {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: ThemeName) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themePreference, setThemePreference] = useState<ThemePreference>(null);
  const [systemTheme, setSystemTheme] = useState<ThemeName>("light");

  const theme = themePreference ?? systemTheme;
  const syncSystemTheme = useEffectEvent((matches: boolean) => {
    setSystemTheme(matches ? "dark" : "light");
  });
  const syncThemeFromBrowser = useEffectEvent(() => {
    const storedTheme = readStoredTheme();
    const resolvedSystemTheme = readDocumentTheme() ?? readSystemTheme();

    setThemePreference(storedTheme);
    setSystemTheme(resolvedSystemTheme);
    applyTheme(storedTheme ?? resolvedSystemTheme);
  });

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    syncThemeFromBrowser();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event: MediaQueryListEvent) => {
      syncSystemTheme(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const setTheme = (nextTheme: ThemeName) => {
    setThemePreference(nextTheme);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {}
  };

  const useSystemTheme = () => {
    setThemePreference(null);

    try {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } catch {}
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const value = {
    isDark: theme === "dark",
    isUsingSystemTheme: themePreference === null,
    setTheme,
    theme,
    themePreference,
    toggleTheme,
    useSystemTheme,
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
