import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { bootstrapUser } from "@/lib/userBootstrap";
import { db } from "@/lib/db";
import { rollingWindowStart } from "@/lib/plans";
import { ApiKeyCard } from "@/components/dashboard/ApiKeyCard";
import { PairingCodeCard } from "@/components/dashboard/PairingCodeCard";
import { CreditsCard } from "@/components/dashboard/CreditsCard";
import { ModelPreferenceCard } from "@/components/dashboard/ModelPreferenceCard";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ topup?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const me = await currentUser();
  const email = me?.emailAddresses?.[0]?.emailAddress ?? "";
  const { user, apiKeyPlaintext } = await bootstrapUser({ id: userId, email });

  const since = rollingWindowStart(30);
  const [spentCents, taskCount] = await Promise.all([
    db.usage.recentSpendCents(userId, since),
    db.usage.count(userId, since),
  ]);

  const params = await searchParams;
  const topupSuccess = params.topup === "success";
  const topupCanceled = params.topup === "canceled";
  const autoTopup = Number(params.topup);
  const autoTopupCents = Number.isFinite(autoTopup) && autoTopup >= 10 ? autoTopup * 100 : 0;

  const firstName = me?.firstName ?? me?.username ?? "there";

  return (
    <div className="space-y-8">
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
            Dashboard
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
            Welcome, {firstName}.
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Top up credits, pick your model, pair the extension.
          </p>
        </div>
        <div className="text-xs text-text-muted">{user.email}</div>
      </header>

      {topupSuccess && (
        <div className="rounded-xl border border-success/40 bg-success/10 p-4 text-sm text-text-primary">
          ✓ Top-up complete. Your credits are live.
        </div>
      )}
      {topupCanceled && (
        <div className="rounded-xl border border-border bg-bg-elevated p-4 text-sm text-text-secondary">
          Top-up canceled. You can start one any time.
        </div>
      )}

      <section className="grid gap-5 md:grid-cols-2">
        <CreditsCard
          creditsCents={user.creditsCents}
          spentCents={spentCents}
          taskCount={taskCount}
          autoTopup={autoTopupCents}
        />
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <ModelPreferenceCard initial={user.preferredModel} />
        <PairingCodeCard />
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <ApiKeyCard apiKeyPlaintext={apiKeyPlaintext} hashPreview={user.apiKeyHash} />
      </section>
    </div>
  );
}
