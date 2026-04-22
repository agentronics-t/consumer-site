import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Privacy Policy · Agentronics" };

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32">
        <article className="mx-auto max-w-3xl px-6 pb-24">
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink">
            Privacy Policy
          </h1>
          <p className="mt-3 text-xs text-muted">Effective 2026-04-22</p>
          <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink-soft">
            <section>
              <h2 className="font-display text-xl font-semibold text-ink">What we collect</h2>
              <p className="mt-2">
                Your account email (from OAuth via Clerk), a hashed API key, wallet balance and
                top-up history (via Stripe), your default model preference, and task-run metadata —
                timestamps, cost, and model used. We never collect the contents of the sites you
                visit.
              </p>
            </section>
            <section>
              <h2 className="font-display text-xl font-semibold text-ink">What stays on your device</h2>
              <p className="mt-2">
                Your logged-in sessions, cookies, passwords, and the actual content of pages you
                browse. Agentronics runs inside Chrome and uses what&apos;s already there — we don&apos;t
                transmit it to our servers.
              </p>
            </section>
            <section>
              <h2 className="font-display text-xl font-semibold text-ink">Model providers</h2>
              <p className="mt-2">
                When you run a task, the prompt and the page context the agent needs are sent to
                the model provider you picked (Anthropic, OpenAI, or Google). Their data policies
                apply to those requests.
              </p>
            </section>
            <section>
              <h2 className="font-display text-xl font-semibold text-ink">Processors</h2>
              <p className="mt-2">
                Clerk (auth), Stripe (payments), Vercel (hosting), and the model provider you pick.
              </p>
            </section>
            <section>
              <h2 className="font-display text-xl font-semibold text-ink">Your rights</h2>
              <p className="mt-2">
                Export, deletion, and correction: email privacy@agentronics.com. We respond within
                30 days.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
