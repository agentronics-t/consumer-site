"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";

const EASE = [0.22, 1, 0.36, 1] as const;

export const TIERS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "Install it. Try a few tasks. No card, no catch.",
    features: [
      "10 free tasks per month",
      "All sites, all features",
      "Community support",
    ],
    cta: { label: "Add to Chrome — free", href: siteConfig.chromeStoreUrl, external: true, variant: "outline" as const },
    highlight: false,
  },
  {
    id: "payg",
    name: "Pay as you go",
    price: "$10",
    cadence: "minimum top-up",
    description: "Bring your model. Pay for what you actually use.",
    features: [
      "Unlimited tasks",
      "Pick any model — Claude, GPT, Gemini",
      "Model cost + small margin, nothing more",
      "Live cost preview on every run",
      "Top up whenever you want",
      "Priority support",
    ],
    cta: { label: "Start with $10 →", href: "/dashboard?topup=10", external: false, variant: "primary" as const },
    highlight: true,
  },
];

export function PricingCards({ compact = false }: { compact?: boolean }) {
  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        {!compact && (
          <div className="mb-14 max-w-2xl">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Pricing
            </div>
            <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-5xl">
              Free to try.{" "}
              <span className="font-serif italic text-ember">Pennies to use.</span>
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
              No subscription. No seats. Pay the model cost plus a small margin — that's it.
            </p>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
              className={`relative rounded-2xl border p-8 ${
                t.highlight
                  ? "border-ember/50 bg-card card-shadow-strong"
                  : "border-line bg-card card-shadow"
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-8 rounded-full bg-ember px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
                  Most people pick this
                </div>
              )}
              <div className="font-display text-xl font-semibold text-ink">{t.name}</div>
              <div className="mt-1 text-sm text-muted">{t.description}</div>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-5xl font-bold text-ink">{t.price}</span>
                <span className="text-sm text-muted">{t.cadence}</span>
              </div>
              <ul className="mt-7 space-y-3 text-[14px]">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={t.highlight ? "#6366F1" : "#10B981"}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-0.5 shrink-0"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-ink-soft">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <ButtonLink
                  href={t.cta.href}
                  external={t.cta.external}
                  variant={t.cta.variant}
                  size="md"
                  className="w-full"
                >
                  {t.cta.label}
                </ButtonLink>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center text-xs text-muted">
          Example: a typical shopping task with Claude Sonnet ≈ 4¢ · a flight search ≈ 7¢
        </div>
      </div>
    </section>
  );
}
