import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { bootstrapUser } from "@/lib/userBootstrap";
import { db } from "@/lib/db";
import { rollingWindowStart } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const me = await currentUser();
  const email = me?.emailAddresses?.[0]?.emailAddress ?? "";
  const { user } = bootstrapUser({ id: userId, email });
  const since = rollingWindowStart(30);
  const spentCents = db.usage.recentSpendCents(userId, since);
  const taskCount = db.usage.count(userId, since);

  return NextResponse.json({
    id: user.id,
    email: user.email,
    creditsCents: user.creditsCents,
    preferredModel: user.preferredModel,
    usage: {
      window: "rolling_30d",
      spentCents,
      taskCount,
    },
  });
}
