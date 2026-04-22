import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { assertStripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "missing_webhook_secret" }, { status: 500 });

  let stripe;
  try {
    stripe = assertStripe();
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  const sig = req.headers.get("stripe-signature") ?? "";
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (e) {
    return NextResponse.json({ error: `bad_signature: ${(e as Error).message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    if (s.mode !== "payment") return NextResponse.json({ received: true });
    if (await db.topUps.hasProcessed(s.id)) return NextResponse.json({ received: true });

    const userId = (s.metadata?.clerk_user_id ?? s.client_reference_id) as string | undefined;
    const customerId = typeof s.customer === "string" ? s.customer : s.customer?.id ?? null;
    const amountCents = s.amount_total ?? Number(s.metadata?.amount_cents ?? 0);

    if (!userId || !amountCents) return NextResponse.json({ received: true });

    const inserted = await db.topUps.insert(userId, amountCents, s.id);
    if (!inserted) return NextResponse.json({ received: true });

    await db.users.addCredits(userId, amountCents);
    if (customerId) {
      const u = await db.users.get(userId);
      if (u && !u.stripeCustomerId) {
        await db.users.update(userId, { stripeCustomerId: customerId });
      }
    }
    await db.topUps.markProcessed(s.id);
  }

  return NextResponse.json({ received: true });
}
