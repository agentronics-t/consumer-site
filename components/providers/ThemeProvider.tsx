"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type ThemeChoice = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type Ctx = {
  theme: ThemeChoice;
  resolved: ResolvedTheme;
  setTheme: (t: ThemeChoice) => void;
};

const ThemeCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "agentronics-theme";

function systemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  const wantDark = choice === "dark" || (choice === "system" && systemPrefersDark());
  root.classList.toggle("dark", wantDark);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeChoice>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeChoice | null) ?? "system";
    setThemeState(stored);
    applyTheme(stored);
    setResolved(document.documentElement.classList.contains("dark") ? "dark" : "light");

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const t = (localStorage.getItem(STORAGE_KEY) as ThemeChoice | null) ?? "system";
      if (t !== "system") return;
      applyTheme("system");
      setResolved(document.documentElement.classList.contains("dark") ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((t: ThemeChoice) => {
    localStorage.setItem(STORAGE_KEY, t);
    document.documentElement.classList.add("theme-transition");
    applyTheme(t);
    setThemeState(t);
    setResolved(document.documentElement.classList.contains("dark") ? "dark" : "light");
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 200);
  }, []);

  return (
    <ThemeCtx.Provider value={{ theme, resolved, setTheme }}>{children}</ThemeCtx.Provider>
  );
}

export function useTheme(): Ctx {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

// Inline script runs before hydration to avoid a flash of wrong theme.
export const themeInitScript = `
(function () {
  try {
    var k = '${STORAGE_KEY}';
    var t = localStorage.getItem(k) || 'system';
    var dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  } catch (_) {}
})();
`;
