import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from "react";

const ThemeContext = createContext();

const PREFERENCE_KEY = "themePreference";

const getSystemTheme = () => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const resolveEffectiveTheme = (preference) => {
  if (preference === "system") return getSystemTheme();
  return preference === "dark" ? "dark" : "light";
};

const readInitialPreference = () => {
  if (typeof window === "undefined") return "system";

  const stored = localStorage.getItem(PREFERENCE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;

  const legacy = localStorage.getItem("theme");
  if (legacy === "light" || legacy === "dark") return legacy;

  return "system";
};

const applyThemeToDocument = (effectiveTheme) => {
  document.body.classList.toggle("dark", effectiveTheme === "dark");
  document.body.style.backgroundColor = effectiveTheme === "dark" ? "#1f1f1f" : "";
};

export const ThemeProvider = ({ children }) => {
  const [themePreference, setThemePreferenceState] = useState(readInitialPreference);
  const theme = useMemo(() => resolveEffectiveTheme(themePreference), [themePreference]);

  useEffect(() => {
    localStorage.setItem(PREFERENCE_KEY, themePreference);
    localStorage.setItem("theme", theme);
    applyThemeToDocument(theme);
  }, [theme, themePreference]);

  useEffect(() => {
    if (themePreference !== "system") return undefined;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyThemeToDocument(resolveEffectiveTheme("system"));

    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, [themePreference]);

  const setThemePreference = useCallback((next) => {
    if (next !== "light" && next !== "dark" && next !== "system") return;
    setThemePreferenceState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemePreferenceState((prev) => {
      const effective = resolveEffectiveTheme(prev);
      return effective === "dark" ? "light" : "dark";
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, themePreference, setThemePreference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
