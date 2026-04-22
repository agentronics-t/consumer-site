"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";

const EASE = [0.22, 1, 0.36, 1] as const;

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-x-0 top-0 -z-10 h-[260px] paper-dots opacity-70" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mx-auto max-w-3xl px-6 text-center"
      >
        <h2 className="font-display text-4xl font-bold leading-[1.04] tracking-tight text-ink md:text-6xl">
          Browse less.{" "}
          <span className="font-serif italic text-ember">Do more.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ink-soft">
          Agentronics is free to install and $10 to start. Your AI, your browser, your rules.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href={siteConfig.chromeStoreUrl} external size="lg" variant="primary">
            Add to Chrome — free
          </ButtonLink>
          <ButtonLink href="#demo" size="lg" variant="outline">
            Watch the demo
          </ButtonLink>
        </div>
        <div className="mt-5 text-xs text-muted">
          No card to start · Cancel any time (there's nothing to cancel) · Your data stays in your browser
        </div>
      </motion.div>
    </section>
  );
}
