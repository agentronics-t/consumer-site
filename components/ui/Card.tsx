import type { ReactNode } from "react";

export type CardTone = "card" | "tint" | "elevated" | "code";

export type CardProps = {
  children: ReactNode;
  tone?: CardTone;
  className?: string;
  glow?: boolean;
};

const toneBg: Record<CardTone, string> = {
  card: "bg-bg-card",
  tint: "bg-bg-card-hover",
  elevated: "bg-bg-elevated",
  code: "bg-bg-code",
};

export function Card({ children, tone = "card", glow = false, className = "" }: CardProps) {
  const base = `relative rounded-2xl border border-border ${toneBg[tone]} card-shadow p-6`;
  const glowClass = glow
    ? "transition-colors hover:border-border-strong hover:shadow-[0_0_30px_rgba(99,102,241,0.10),inset_0_0_30px_rgba(99,102,241,0.03)]"
    : "";
  return <div className={`${base} ${glowClass} ${className}`.trim()}>{children}</div>;
}
