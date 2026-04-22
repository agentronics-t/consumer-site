import { ReactNode } from "react";

export function Card({
  children,
  className = "",
  tone = "card",
}: {
  children: ReactNode;
  className?: string;
  tone?: "card" | "tint" | "paper";
}) {
  const bg =
    tone === "tint"
      ? "bg-card-tint"
      : tone === "paper"
        ? "bg-paper"
        : "bg-card";
  return (
    <div className={`relative rounded-2xl border border-line ${bg} card-shadow p-6 ${className}`}>
      {children}
    </div>
  );
}
