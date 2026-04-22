import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Help · Agentronics",
  description: "Get help using Agentronics.",
};

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[70vh] items-center pt-32">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Help center
          </div>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-5xl">
            Need a hand?{" "}
            <span className="font-serif italic text-ember">We&apos;re listening.</span>
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
            Full guides are on the way. In the meantime, reach out and we&apos;ll walk you through anything.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={siteConfig.links.contact} external variant="primary">
              Contact us →
            </ButtonLink>
            <ButtonLink href="/pricing" variant="outline">
              See pricing
            </ButtonLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
