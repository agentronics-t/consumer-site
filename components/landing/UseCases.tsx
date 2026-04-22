"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const cases = [
  { emoji: "🛒", title: "Do the grocery run", sub: "Fill an Instacart cart from a recipe link." },
  { emoji: "✈️", title: "Book the flight", sub: "Cheapest non-stop, window seat, under $500." },
  { emoji: "🏠", title: "Shortlist apartments", sub: "Pet-friendly, under $3k, near the L line." },
  { emoji: "📝", title: "Fill any form", sub: "Visa, job apps, insurance claims — all of it." },
  { emoji: "🎁", title: "Find a thoughtful gift", sub: "Under $75, ships by Friday, 4+ stars." },
  { emoji: "💼", title: "Apply to jobs", sub: "Tailor the cover letter for each posting." },
  { emoji: "🧠", title: "Research anything", sub: "Summarize 20 tabs into one clean doc." },
  { emoji: "📬", title: "Reply to the inbox", sub: "Triage, draft, and send in your voice." },
  { emoji: "📊", title: "Compare prices", sub: "Same SKU across 8 stores, in 20 seconds." },
];

export function UseCases() {
  return (
    <section id="use-cases" className="relative bg-paper-soft/60 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-2xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            What it can do
          </div>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-5xl">
            If the web can do it,{" "}
            <span className="font-serif italic text-ember">Agentronics can do it for you.</span>
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
            Not a chatbot. Not a plugin. A real browser agent that clicks, types, and scrolls like you would —
            only faster, and without getting bored.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {cases.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease: EASE, delay: (i % 3) * 0.05 }}
              className="group rounded-xl border border-line bg-card p-5 card-shadow transition-transform hover:-translate-y-0.5"
            >
              <div className="text-2xl">{c.emoji}</div>
              <div className="mt-3 font-display text-[15px] font-semibold text-ink">{c.title}</div>
              <div className="mt-1 text-[13px] leading-relaxed text-muted">{c.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
