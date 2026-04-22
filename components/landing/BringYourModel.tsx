"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const models = [
  { name: "Claude", vendor: "Anthropic", blurb: "Best for careful, multi-step tasks." },
  { name: "GPT-4", vendor: "OpenAI", blurb: "Fast, familiar, great at forms." },
  { name: "Gemini", vendor: "Google", blurb: "Strong on search and comparison." },
];

export function BringYourModel() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Bring your own model
            </div>
            <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-5xl">
              You pick the brain.{" "}
              <span className="font-serif italic text-ember">We do the driving.</span>
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
              Claude, GPT, Gemini, or anything we add next — pay the raw model cost plus a tiny
              margin. Switch per-task, per-project, or per-mood.
            </p>
            <ul className="mt-6 space-y-3 text-[15px] text-ink-soft">
              <li className="flex items-start gap-3">
                <Check /> <span>No subscription. Start with a $10 top-up.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check /> <span>See cost before every run. No surprises.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check /> <span>Runs exhausted? Reload when you need more.</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="grid gap-3"
          >
            {models.map((m, i) => (
              <div
                key={m.name}
                className="flex items-center gap-5 rounded-2xl border border-line bg-card p-5 card-shadow"
              >
                <ModelMark name={m.name} />
                <div className="flex-1">
                  <div className="font-display text-[17px] font-semibold text-ink">
                    {m.name}{" "}
                    <span className="text-xs font-normal text-muted">· {m.vendor}</span>
                  </div>
                  <div className="mt-0.5 text-[13px] text-muted">{m.blurb}</div>
                </div>
                <span className="rounded-md border border-line bg-paper-soft px-2 py-1 font-mono text-[10px] text-muted">
                  {i === 0 ? "default" : "switch anytime"}
                </span>
              </div>
            ))}
            <div className="mt-1 text-center text-xs text-muted">
              More models coming — you're never locked in.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ModelMark({ name }: { name: string }) {
  const colors: Record<string, string> = {
    Claude: "#D97757",
    "GPT-4": "#10A37F",
    Gemini: "#4285F4",
  };
  const initial = name[0];
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-lg font-bold text-white"
      style={{ backgroundColor: colors[name] ?? "#1A1A19" }}
    >
      {initial}
    </div>
  );
}
