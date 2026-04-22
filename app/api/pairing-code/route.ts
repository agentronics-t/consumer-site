import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { generatePairingCode } from "@/lib/crypto";
import { bootstrapUser } from "@/lib/userBootstrap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const me = await currentUser();
  const email = me?.emailAddresses?.[0]?.emailAddress ?? "";
  await bootstrapUser({ id: userId, email });

  await db.pairingCodes.deleteForUser(userId);

  // Avoid collision with an existing unexpired code (extremely unlikely but cheap).
  let code = generatePairingCode();
  let attempts = 0;
  while ((await db.pairingCodes.get(code)) && attempts++ < 5) {
    code = generatePairingCode();
  }

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  await db.pairingCodes.insert({ code, userId, expiresAt, consumedAt: null });

  return NextResponse.json({ code, expiresAt });
}
