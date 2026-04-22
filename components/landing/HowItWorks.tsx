"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    num: "01",
    title: "Pin the extension",
    body: "Add Agentronics to Chrome in one click. Sign in, drop $10 into your wallet, and pick a model — Claude, GPT, or Gemini.",
    accent: "bg-ember",
  },
  {
    num: "02",
    title: "Press ⌘K, say what you want",
    body: "On any website — Amazon, United, Zillow, LinkedIn — press the shortcut and type the task in plain English. No scripts, no setup.",
    accent: "bg-ink",
  },
  {
    num: "03",
    title: "Watch it finish the job",
    body: "Agentronics clicks, scrolls, fills, and compares for you. You stay in the loop — pause it, correct it, or just walk away.",
    accent: "bg-mint",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 max-w-2xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            How it works
          </div>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-5xl">
            From <span className="font-serif italic text-ember">intent</span> to done —
            in three steps.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
              className="relative rounded-2xl border border-line bg-card p-7 card-shadow"
            >
              <div className="flex items-center gap-3">
                <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${s.accent} text-[11px] font-bold text-white`}>
                  {s.num}
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                  Step
                </span>
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold leading-snug text-ink">
                {s.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
