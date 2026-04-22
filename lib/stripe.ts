import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key
  ? new Stripe(key, { apiVersion: "2024-11-20.acacia" as Stripe.LatestApiVersion })
  : null;

export function assertStripe(): Stripe {
  if (!stripe) {
    throw new Error("Stripe not configured. Set STRIPE_SECRET_KEY.");
  }
  return stripe;
}
