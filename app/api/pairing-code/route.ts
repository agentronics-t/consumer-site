import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { generatePairingCode } from "@/lib/crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  db.pairingCodes.deleteForUser(userId);

  // Avoid collision with an existing unexpired code (extremely unlikely but cheap).
  let code = generatePairingCode();
  let attempts = 0;
  while (db.pairingCodes.get(code) && attempts++ < 5) {
    code = generatePairingCode();
  }

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  db.pairingCodes.insert({ code, userId, expiresAt, consumedAt: null });

  return NextResponse.json({ code, expiresAt });
}
