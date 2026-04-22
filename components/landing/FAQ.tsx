"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const items = [
  {
    q: "Is my data safe?",
    a: "Agentronics runs inside your browser — the same Chrome you already trust. Your credentials and cookies never leave your device. Prompts route through your chosen model provider (Anthropic, OpenAI, Google); nothing is stored on our servers beyond what's needed to run your tasks.",
  },
  {
    q: "Which sites does it work on?",
    a: "Any website you can load in Chrome. We don't need a special integration — Agentronics reads and interacts with the page the way a human would. If it renders, it works.",
  },
  {
    q: "Do I have to share my passwords?",
    a: "No. If you're already logged in to a site (Gmail, Amazon, United), the agent uses your existing session — just like a new tab would. You stay in control of every login.",
  },
  {
    q: "Which model should I pick?",
    a: "Claude is our default — it's the most careful at multi-step tasks. GPT is faster and cheaper for simple forms. Gemini is great for search-heavy jobs. Switch any time from the extension popup.",
  },
  {
    q: "How much does it actually cost?",
    a: "Free to install. Runs cost whatever your chosen model charges plus a small margin — most tasks are a few cents. Drop in $10 to start; top up whenever. No subscription, no lock-in.",
  },
  {
    q: "Can I stop it mid-task?",
    a: "Yes — one click pauses, another cancels. You can also watch every step happen live, or let it run in a background tab while you do other things.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            FAQ
          </div>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-5xl">
            Answers, before you ask.
          </h2>
        </div>
        <div className="divide-y divide-line rounded-2xl border border-line bg-card card-shadow">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-6 px-6 py-5 text-left"
                >
                  <span className="font-display text-[17px] font-semibold text-ink">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-muted"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-[15px] leading-relaxed text-ink-soft">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
