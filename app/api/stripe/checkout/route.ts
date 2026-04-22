import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { bootstrapUser } from "@/lib/userBootstrap";
import { db } from "@/lib/db";
import { assertStripe } from "@/lib/stripe";
import { siteConfig } from "@/lib/siteConfig";
import { MIN_TOPUP_CENTS, MAX_TOPUP_CENTS } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const amountCents = Math.round(Number(body.amountCents ?? MIN_TOPUP_CENTS));
  if (!Number.isFinite(amountCents) || amountCents < MIN_TOPUP_CENTS || amountCents > MAX_TOPUP_CENTS) {
    return NextResponse.json(
      { error: `amount must be between ${MIN_TOPUP_CENTS} and ${MAX_TOPUP_CENTS} cents` },
      { status: 400 },
    );
  }

  const me = await currentUser();
  const email = me?.emailAddresses?.[0]?.emailAddress ?? "";
  const { user } = await bootstrapUser({ id: userId, email });

  let stripe;
  try {
    stripe = assertStripe();
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { clerk_user_id: user.id },
    });
    customerId = customer.id;
    await db.users.update(user.id, { stripeCustomerId: customerId });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Agentronics credits",
            description: "Added to your wallet. No expiry.",
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${siteConfig.siteUrl}/dashboard?topup=success`,
    cancel_url: `${siteConfig.siteUrl}/dashboard?topup=canceled`,
    client_reference_id: user.id,
    metadata: {
      clerk_user_id: user.id,
      purpose: "credits_topup",
      amount_cents: String(amountCents),
    },
    payment_intent_data: {
      metadata: {
        clerk_user_id: user.id,
        purpose: "credits_topup",
      },
    },
  });

  return NextResponse.json({ url: session.url });
}
