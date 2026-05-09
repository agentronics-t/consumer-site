"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MIN_TOPUP_CENTS, TOPUP_PRESETS_CENTS, dollars } from "@/lib/plans";

export function CreditsCard({
  creditsCents,
  spentCents,
  taskCount,
  autoTopup = 0,
}: {
  creditsCents: number;
  spentCents: number;
  taskCount: number;
  autoTopup?: number;
}) {
  const [amount, setAmount] = useState<number>(
    TOPUP_PRESETS_CENTS.includes(autoTopup as (typeof TOPUP_PRESETS_CENTS)[number])
      ? autoTopup
      : MIN_TOPUP_CENTS,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topUp = async (cents: number) => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amountCents: cents }),
      });
      const data = (await r.json()) as { url?: string; error?: string };
      if (!r.ok || !data.url) throw new Error(data.error ?? `HTTP ${r.status}`);
      window.location.href = data.url;
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  };

  const low = creditsCents < MIN_TOPUP_CENTS;

  return (
    <Card className="md:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
            Wallet
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-text-primary">{dollars(creditsCents)}</span>
            <span className="text-sm text-text-muted">available credit</span>
          </div>
          <div className="mt-1 text-xs text-text-muted">
            Last 30 days · {taskCount} task{taskCount === 1 ? "" : "s"} · {dollars(spentCents)} used
          </div>
        </div>
        {low && (
          <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent">
            Top up to keep running
          </span>
        )}
      </div>

      <div className="mt-6">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-text-muted">
          Add credits
        </div>
        <div className="flex flex-wrap gap-2">
          {TOPUP_PRESETS_CENTS.map((c) => (
            <button
              key={c}
              onClick={() => setAmount(c)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                amount === c
                  ? "border-border-glow bg-border-glow text-white"
                  : "border-border bg-bg-card text-text-primary hover:bg-bg-elevated"
              }`}
            >
              {dollars(c)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={() => topUp(amount)} disabled={loading} variant="primary">
          {loading ? "Redirecting…" : `Top up ${dollars(amount)}`}
        </Button>
        <span className="text-xs text-text-muted">
          Minimum {dollars(MIN_TOPUP_CENTS)} · charged once · no subscription
        </span>
      </div>

      {error && <p className="mt-3 text-xs text-accent">Error: {error}</p>}
    </Card>
  );
}
