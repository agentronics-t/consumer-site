"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { BrowserMockup } from "./BrowserMockup";
import { siteConfig } from "@/lib/siteConfig";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-[380px] paper-dots opacity-70" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-xs text-ink-soft card-shadow">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember" />
            New — works on any site, with your favorite AI
          </div>

          <h1 className="font-display text-[44px] font-bold leading-[1.04] tracking-tight text-ink md:text-[68px]">
            Tell your browser what to do.{" "}
            <span className="font-serif italic text-ember">It does it.</span>
          </h1>

          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-soft md:text-lg">
            Agentronics is a Chrome extension that takes the wheel and finishes the task —
            shop, book, research, fill forms, compare — on any website. You pick the AI,
            pay only for what you use.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={siteConfig.chromeStoreUrl} external size="lg" variant="primary">
              <ChromeMark /> Add to Chrome — free
            </ButtonLink>
            <ButtonLink href="#demo" size="lg" variant="outline">
              Watch 60-sec demo
            </ButtonLink>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-muted">
            <span className="flex items-center gap-1.5">
              <CheckDot /> Free to start
            </span>
            <span className="flex items-center gap-1.5">
              <CheckDot /> Bring your own model
            </span>
            <span className="flex items-center gap-1.5">
              <CheckDot /> Works everywhere you browse
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        >
          <BrowserMockup />
        </motion.div>
      </div>
    </section>
  );
}

function ChromeMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="24" r="22" fill="#fff" />
      <circle cx="24" cy="24" r="8" fill="#4285F4" />
      <path d="M24 12h19a22 22 0 00-38.5 3l9.5 16z" fill="#EA4335" />
      <path d="M24 12a12 12 0 0110 18l-9.5 16A22 22 0 0043 15z" fill="#FBBC04" />
      <path d="M14 28a12 12 0 0120-4l9.5-16a22 22 0 00-39 7z" fill="#34A853" opacity="0" />
    </svg>
  );
}

function CheckDot() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
