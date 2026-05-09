"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeChoice = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type Ctx = {
  theme: ThemeChoice;
  resolved: ResolvedTheme;
  setTheme: (t: ThemeChoice) => void;
};

const ThemeCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "agentronics:theme";

function systemPrefersLight(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: light)").matches;
}

function resolve(choice: ThemeChoice): ResolvedTheme {
  if (choice === "light") return "light";
  if (choice === "dark") return "dark";
  return systemPrefersLight() ? "light" : "dark";
}

function applyTheme(choice: ThemeChoice) {
  document.documentElement.classList.toggle("light", resolve(choice) === "light");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeChoice>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("dark");

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeChoice | null) ?? "system";
    setThemeState(stored);
    applyTheme(stored);
    setResolved(resolve(stored));

    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      const t = (localStorage.getItem(STORAGE_KEY) as ThemeChoice | null) ?? "system";
      if (t !== "system") return;
      applyTheme("system");
      setResolved(resolve("system"));
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((t: ThemeChoice) => {
    localStorage.setItem(STORAGE_KEY, t);
    document.documentElement.classList.add("theme-transition");
    applyTheme(t);
    setThemeState(t);
    setResolved(resolve(t));
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 200);
  }, []);

  return <ThemeCtx.Provider value={{ theme, resolved, setTheme }}>{children}</ThemeCtx.Provider>;
}

export function useTheme(): Ctx {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

/* Inline script string — runs before hydration to avoid a flash of wrong theme.
 * Dark is the default (no class); light-mode users get `html.light`. */
export const themeInitScript = `
(function () {
  try {
    var k = '${STORAGE_KEY}';
    var t = localStorage.getItem(k) || 'system';
    var light =
      t === 'light' ||
      (t === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches);
    if (light) document.documentElement.classList.add('light');
  } catch (_) {}
})();
`;
