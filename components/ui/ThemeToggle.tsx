"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme, type ThemeChoice } from "@/components/providers/ThemeProvider";

const OPTIONS: Array<{ id: ThemeChoice; label: string; icon: React.ReactNode }> = [
  {
    id: "light",
    label: "Light",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    id: "dark",
    label: "Dark",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    id: "system",
    label: "System",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
  },
];

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = OPTIONS.find((o) => o.id === theme) ?? OPTIONS[2];

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Theme"
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card text-ink-soft transition-colors hover:bg-paper-soft hover:text-ink"
      >
        {mounted ? current.icon : OPTIONS[2].icon}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-36 overflow-hidden rounded-xl border border-line bg-card card-shadow"
        >
          {OPTIONS.map((o) => {
            const active = theme === o.id;
            return (
              <button
                key={o.id}
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setTheme(o.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                  active ? "bg-paper-soft text-ink" : "text-ink-soft hover:bg-paper-soft hover:text-ink"
                }`}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center text-muted">
                  {o.icon}
                </span>
                <span className="flex-1">{o.label}</span>
                {active && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-ember">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
