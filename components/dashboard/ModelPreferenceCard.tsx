"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { MODELS } from "@/lib/plans";
import type { ModelId } from "@/lib/db";

export function ModelPreferenceCard({ initial }: { initial: ModelId }) {
  const [selected, setSelected] = useState<ModelId>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (id: ModelId) => {
    if (id === selected) return;
    const prev = selected;
    setSelected(id);
    setSaving(true);
    setError(null);
    try {
      const r = await fetch("/api/user/model", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ model: id }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
    } catch (e) {
      setSelected(prev);
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <div className="text-[11px] font-semibold uppercase tracking-widest text-muted">
        Default model
      </div>
      <div className="mt-1 font-display text-lg font-semibold text-ink">
        Pick the brain.
      </div>
      <p className="mt-1 text-sm text-muted">
        Used when you don't specify one. Switch any time in the extension popup.
      </p>

      <div className="mt-4 space-y-2">
        {MODELS.map((m) => {
          const active = selected === m.id;
          return (
            <button
              key={m.id}
              onClick={() => pick(m.id)}
              disabled={saving}
              className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                active
                  ? "border-ember bg-ember/5"
                  : "border-line bg-card hover:bg-paper-soft"
              }`}
            >
              <span
                className={`mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  active ? "border-ember" : "border-line-strong"
                }`}
              >
                {active && <span className="h-2 w-2 rounded-full bg-ember" />}
              </span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-ink">
                  {m.name} <span className="font-normal text-muted">· {m.vendor}</span>
                </div>
                <div className="mt-0.5 text-xs text-muted">{m.blurb}</div>
              </div>
            </button>
          );
        })}
      </div>

      {error && <p className="mt-3 text-xs text-gold">Error: {error}</p>}
    </Card>
  );
}
