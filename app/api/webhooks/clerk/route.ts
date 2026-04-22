import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { bootstrapUser } from "@/lib/userBootstrap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ClerkUserPayload = {
  id: string;
  email_addresses?: Array<{ email_address: string; id: string }>;
  primary_email_address_id?: string;
};

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CLERK_WEBHOOK_SECRET missing" }, { status: 500 });
  }

  const payload = await req.text();
  const headers = {
    "svix-id": req.headers.get("svix-id") ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };

  let evt: { type: string; data: ClerkUserPayload };
  try {
    evt = new Webhook(secret).verify(payload, headers) as typeof evt;
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const data = evt.data;
    const primary =
      data.email_addresses?.find((e) => e.id === data.primary_email_address_id)?.email_address ??
      data.email_addresses?.[0]?.email_address ??
      "";
    if (data.id && primary) {
      bootstrapUser({ id: data.id, email: primary });
    }
  }

  return NextResponse.json({ ok: true });
}
