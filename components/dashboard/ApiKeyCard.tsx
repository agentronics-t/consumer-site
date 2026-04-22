"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

export function ApiKeyCard({
  apiKeyPlaintext,
  hashPreview,
}: {
  apiKeyPlaintext: string | null;
  hashPreview: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const maskedPreview = `sha256:${hashPreview.slice(0, 12)}…${hashPreview.slice(-6)}`;
  const hasPlaintext = Boolean(apiKeyPlaintext);

  const copy = async () => {
    if (!apiKeyPlaintext) return;
    await navigator.clipboard.writeText(apiKeyPlaintext);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted">
            API key
          </div>
          <div className="mt-1 font-display text-lg font-semibold text-ink">
            Identify your extension
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-line bg-paper-soft p-4 font-mono text-sm">
        {hasPlaintext ? (
          revealed ? (
            <span className="break-all text-ember">{apiKeyPlaintext}</span>
          ) : (
            <span className="text-muted">ak_live_••••••••••••••••••••••••••••••••</span>
          )
        ) : (
          <span className="text-muted">{maskedPreview}</span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {hasPlaintext && (
          <>
            <button
              onClick={() => setRevealed((r) => !r)}
              className="rounded-full border border-line bg-card px-4 py-1.5 text-xs text-ink transition-colors hover:bg-paper-soft"
            >
              {revealed ? "Hide" : "Reveal"}
            </button>
            <button
              onClick={copy}
              className="rounded-full border border-line bg-card px-4 py-1.5 text-xs text-ink transition-colors hover:bg-paper-soft"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </>
        )}
      </div>

      <p className="mt-4 text-xs text-muted">
        {hasPlaintext
          ? "Shown once. Copy it now — we only store the hash."
          : "Your key is hashed and stored. Rotate it if you need a new one."}
      </p>
    </Card>
  );
}
