import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingCards } from "@/components/landing/PricingCards";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";

export const metadata: Metadata = {
  title: "Pricing · Agentronics",
  description: "Free to install. $10 minimum top-up. Pay only for what you use.",
};

const examples: Array<{ task: string; model: string; cost: string }> = [
  { task: "Find the cheapest non-stop flight to Tokyo", model: "Claude Sonnet", cost: "~$0.07" },
  { task: "Fill a 12-field visa application", model: "Claude Sonnet", cost: "~$0.04" },
  { task: "Compare one SKU across 8 retailers", model: "Gemini", cost: "~$0.03" },
  { task: "Summarize 20 open tabs into a doc", model: "GPT-4", cost: "~$0.06" },
  { task: "Apply to 5 jobs with tailored cover letters", model: "Claude Sonnet", cost: "~$0.22" },
  { task: "Book a restaurant for Friday 8pm", model: "GPT-4", cost: "~$0.02" },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32">
        <section className="mx-auto max-w-4xl px-6 text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Pricing
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.04] tracking-tight text-ink md:text-6xl">
            Free to install.{" "}
            <span className="font-serif italic text-ember">Pennies to run.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ink-soft">
            No subscription. No seats. You pay the raw model cost plus a small margin —
            that&apos;s the whole deal.
          </p>
        </section>

        <PricingCards compact />

        <section className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="mb-3 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            What tasks actually cost
          </h2>
          <p className="mb-8 text-[15px] text-ink-soft">
            A $10 top-up covers weeks of everyday use. Real examples, real prices.
          </p>
          <div className="overflow-hidden rounded-2xl border border-line bg-card card-shadow">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-paper-soft text-muted">
                  <th className="p-4 text-xs font-semibold uppercase tracking-widest">Task</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-widest">Model</th>
                  <th className="p-4 text-right text-xs font-semibold uppercase tracking-widest">
                    You&apos;d pay
                  </th>
                </tr>
              </thead>
              <tbody>
                {examples.map((row) => (
                  <tr key={row.task} className="border-b border-line last:border-0">
                    <td className="p-4 text-ink-soft">{row.task}</td>
                    <td className="p-4 text-muted">{row.model}</td>
                    <td className="p-4 text-right font-mono text-ink">{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted">
            Prices vary with task complexity. The extension shows exact cost before every run.
          </p>
        </section>

        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
