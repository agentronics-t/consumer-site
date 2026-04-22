import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateDeviceToken } from "@/lib/crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/auth/pair
 * Body: { code: string, label?: string }
 * Returns: { deviceToken, deviceId, userId, creditsCents, preferredModel }
 *
 * Called by the extension (no Clerk session) after the user reads the 6-digit
 * code from the dashboard and pastes it into the extension.
 */
export async function POST(req: Request) {
  let body: { code?: unknown; label?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const code = typeof body.code === "string" ? body.code.trim() : "";
  const label = typeof body.label === "string" ? body.label.slice(0, 60) : "Chrome extension";

  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "invalid_code_format" }, { status: 400 });
  }

  const row = db.pairingCodes.get(code);
  if (!row) return NextResponse.json({ error: "code_not_found" }, { status: 404 });
  if (row.consumedAt) return NextResponse.json({ error: "code_already_used" }, { status: 409 });
  if (new Date(row.expiresAt).getTime() < Date.now()) {
    return NextResponse.json({ error: "code_expired" }, { status: 410 });
  }

  const user = db.users.get(row.userId);
  if (!user) return NextResponse.json({ error: "user_missing" }, { status: 404 });

  const { plaintext: deviceToken, hash } = generateDeviceToken();
  const deviceId = `dev_${Date.now().toString(36)}`;
  db.devices.insert({
    id: deviceId,
    userId: user.id,
    deviceTokenHash: hash,
    label,
    lastSeenAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });
  db.pairingCodes.consume(code);

  return NextResponse.json({
    deviceToken,
    deviceId,
    userId: user.id,
    creditsCents: user.creditsCents,
    preferredModel: user.preferredModel,
  });
}
