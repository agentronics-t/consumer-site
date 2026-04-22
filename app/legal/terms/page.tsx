import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Terms of Service · Agentronics" };

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32">
        <article className="mx-auto max-w-3xl px-6 pb-24">
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink">
            Terms of Service
          </h1>
          <p className="mt-3 text-xs text-muted">Effective 2026-04-22</p>
          <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink-soft">
            <section>
              <h2 className="font-display text-xl font-semibold text-ink">1. Acceptance</h2>
              <p className="mt-2">
                By installing the extension or creating an account you agree to these Terms and the
                Privacy Policy.
              </p>
            </section>
            <section>
              <h2 className="font-display text-xl font-semibold text-ink">2. Acceptable use</h2>
              <p className="mt-2">
                Don&apos;t use Agentronics to impersonate others, violate a site&apos;s terms of service,
                scrape at abusive rates, or do anything illegal. We reserve the right to revoke
                access if we see clear abuse.
              </p>
            </section>
            <section>
              <h2 className="font-display text-xl font-semibold text-ink">3. Credits and billing</h2>
              <p className="mt-2">
                Top-ups are charged once via Stripe. Credits don&apos;t expire. Refunds on unused
                balance on request. You pay the model provider&apos;s rate plus a small margin that
                keeps the lights on.
              </p>
            </section>
            <section>
              <h2 className="font-display text-xl font-semibold text-ink">4. Liability</h2>
              <p className="mt-2">
                Service is provided as-is. You&apos;re responsible for reviewing what the agent did
                before acting on it — we can&apos;t guarantee any particular outcome on third-party
                sites. Liability is capped at fees paid in the prior 12 months.
              </p>
            </section>
            <section>
              <p className="text-xs text-muted">
                This document is a template. Have counsel review before any enterprise deployment.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
