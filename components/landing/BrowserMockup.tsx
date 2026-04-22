"use client";

import { motion } from "framer-motion";

const TYPED = "Find me the cheapest non-stop flight to Tokyo in June, window seat.";

export function BrowserMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      {/* Soft background glow */}
      <div className="absolute -inset-10 -z-10 bg-[radial-gradient(closest-side,rgba(99,102,241,0.18),transparent_75%)]" />

      {/* Browser chrome */}
      <div className="overflow-hidden rounded-[20px] border border-line-strong bg-card card-shadow-strong">
        <div className="flex items-center gap-2 border-b border-line bg-paper-soft px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#E87769]" />
          <span className="h-3 w-3 rounded-full bg-[#F5BD4F]" />
          <span className="h-3 w-3 rounded-full bg-[#62C46B]" />
          <div className="mx-auto flex items-center gap-2 rounded-md bg-paper px-3 py-1 text-xs text-muted">
            <LockIcon />
            <span className="font-mono">united.com/search</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-ink/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember animate-pulse" />
            Agentronics
          </div>
        </div>

        {/* Page preview */}
        <div className="relative aspect-[4/3] bg-paper">
          {/* Fake page skeleton */}
          <div className="absolute inset-6 space-y-3">
            <div className="h-3 w-1/3 rounded bg-line" />
            <div className="h-3 w-1/2 rounded bg-line" />
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="h-20 rounded-lg bg-paper-soft border border-line" />
              <div className="h-20 rounded-lg bg-paper-soft border border-line" />
              <div className="h-20 rounded-lg bg-paper-soft border border-line" />
              <div className="h-20 rounded-lg bg-paper-soft border border-line" />
            </div>
          </div>

          {/* Command palette */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-6 top-10 rounded-xl border border-line-strong bg-card card-shadow-strong"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <SparkIcon />
              <TypedPrompt text={TYPED} />
              <span className="ml-auto rounded-md border border-line bg-paper-soft px-2 py-0.5 font-mono text-[10px] text-muted">⌘ K</span>
            </div>
            <div className="space-y-2 px-4 py-3">
              <StepLine delay={1.6} label="Open united.com" />
              <StepLine delay={2.2} label="Set departure to Tokyo (HND)" icon="→" />
              <StepLine delay={2.8} label="Filter: Non-stop, window seat" icon="→" />
              <StepLine delay={3.4} label="Sort by price, pick cheapest" icon="✓" done />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stamp pill on the side */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 3.6 }}
        className="absolute -right-4 bottom-8 rotate-3 rounded-xl border border-line-strong bg-card px-4 py-3 card-shadow"
      >
        <div className="text-xs font-semibold text-ink">Flight booked</div>
        <div className="mt-0.5 text-[11px] text-muted">24 s · saved $148 vs manual</div>
      </motion.div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" aria-hidden>
      <path d="M12 2l2.39 6.61L21 11l-6.61 2.39L12 20l-2.39-6.61L3 11l6.61-2.39z" />
    </svg>
  );
}

function TypedPrompt({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "auto" }}
      transition={{ duration: 1.1, delay: 0.6, ease: "easeOut" }}
      className="overflow-hidden whitespace-nowrap text-[14px] text-ink"
    >
      {text}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-ember align-middle"
      />
    </motion.div>
  );
}

function StepLine({ label, delay, icon = "·", done = false }: { label: string; delay: number; icon?: string; done?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay }}
      className="flex items-center gap-2 text-[13px]"
    >
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${
          done ? "bg-mint/20 text-[#10B981]" : "bg-ink/5 text-ink-soft"
        }`}
      >
        {icon}
      </span>
      <span className="text-ink-soft">{label}</span>
    </motion.div>
  );
}
