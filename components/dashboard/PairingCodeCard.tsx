"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";

type PairState = { code: string; expiresAt: string } | null;

export function PairingCodeCard() {
  const [state, setState] = useState<PairState>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/pairing-code", { method: "POST" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = (await r.json()) as { code: string; expiresAt: string };
      setState(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const remainingMs = state ? new Date(state.expiresAt).getTime() - now : 0;
  const expired = state && remainingMs <= 0;
  const mm = Math.max(0, Math.floor(remainingMs / 60000));
  const ss = Math.max(0, Math.floor((remainingMs % 60000) / 1000));

  return (
    <Card>
      <div className="text-[11px] font-semibold uppercase tracking-widest text-muted">
        Pair the extension
      </div>
      <div className="mt-1 font-display text-lg font-semibold text-ink">
        Link to your account
      </div>

      <div className="mt-5 rounded-xl border border-line bg-paper-soft p-6">
        {state && !expired ? (
          <div className="flex flex-col items-center gap-2">
            <div className="font-mono text-4xl font-bold tracking-[0.4em] text-ink">
              {state.code}
            </div>
            <div className="font-mono text-xs text-muted">
              expires in {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-muted">
            {expired ? "Code expired." : "Generate a 6-digit code and paste it into the extension."}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={generate}
          disabled={loading}
          className="rounded-full bg-ink px-5 py-2 text-xs font-semibold uppercase tracking-widest text-paper transition-colors hover:bg-ink-soft disabled:opacity-50"
        >
          {loading ? "Generating…" : state && !expired ? "Regenerate" : "Generate code"}
        </button>
      </div>

      {error && <p className="mt-3 text-xs text-gold">Error: {error}</p>}

      <ol className="mt-5 space-y-2 text-sm text-ink-soft">
        <li>1. Open the extension popup.</li>
        <li>
          2. Click <span className="font-mono text-ink">Link to account</span>.
        </li>
        <li>3. Paste the code. You&apos;re paired.</li>
      </ol>
    </Card>
  );
}
