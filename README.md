# Agentronics marketing site

The consumer web app: marketing landing page, pricing, auth, dashboard, and Stripe billing for the Agentronics Chrome extension.

Built from [`project_plan.md`](./project_plan.md).

## Quick start

```bash
npm install
cp .env.local.example .env.local   # then fill in real keys
npm run dev
```

Open http://localhost:3000.

## Environment

All keys are optional for *browsing* the site — pages render with placeholders — but you need them for the full flow:

| Var | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Auth (Google/GitHub OAuth). Free plan at dashboard.clerk.com. |
| `CLERK_WEBHOOK_SECRET` | Verifies `user.created` webhook — provisions API key + row in DB. |
| `STRIPE_SECRET_KEY` | Checkout + billing portal. |
| `STRIPE_WEBHOOK_SECRET` | Verifies plan upgrades on `checkout.session.completed`. |
| `NEXT_PUBLIC_STRIPE_PRICE_PRO` | Stripe price ID for the $149 Pro tier. |
| `NEXT_PUBLIC_CHROME_STORE_URL` | Primary CTA target. |
| `NEXT_PUBLIC_SITE_URL` | Absolute URL used in OG tags and webhook success URLs. |

## Routes

| Path | What |
| --- | --- |
| `/` | Landing (11 sections). |
| `/pricing` | Full pricing with comparison table + FAQ. |
| `/docs` | Stub — points to GitHub. |
| `/login`, `/signup` | Clerk hosted auth. |
| `/dashboard` | API key, pairing code, usage meter, plan card. |
| `/dashboard/billing` | Stripe Customer Portal redirect. |
| `/legal/privacy`, `/legal/terms` | Legal stubs. |
| `POST /api/pairing-code` | Generate 6-digit pairing code (authed). |
| `POST /api/auth/pair` | Extension exchanges 6-digit code → device token. |
| `GET /api/me` | Current user + plan + usage. |
| `POST /api/stripe/checkout` | Creates Checkout session. |
| `POST /api/stripe/portal` | Creates Billing Portal session. |
| `POST /api/webhooks/clerk` | Svix-verified user lifecycle. |
| `POST /api/webhooks/stripe` | Stripe-verified subscription lifecycle. |

## Data model

MVP uses an in-memory store at `lib/db.ts` (survives hot reload via a global symbol). Schema mirrors `project_plan.md` §9. Swap for Postgres (Supabase/Neon) before prod — the interface is the only thing tests/routes import.

## Extension pairing flow

1. User installs the extension → extension opens `/pair?source=extension` (same as `/dashboard`).
2. User signs in with Clerk, lands on `/dashboard`.
3. User clicks **Generate code** → 6-digit code shown with 10-min countdown.
4. Extension `POST /api/auth/pair { code }` → receives `{ deviceToken, userId, plan }`.
5. Extension stores the device token; all subsequent calls identify the user.

No OAuth tokens or passwords leave the site.

## Stack

- Next.js 15 + App Router + TypeScript
- Tailwind CSS v4 (CSS-first `@theme` config in `app/globals.css`)
- Clerk (auth), Stripe (payments), svix (webhook verification)
- Framer Motion (component animations), Lenis (smooth scroll)
- In-memory `lib/db.ts` (swap for Postgres when you ship)

## Production checklist

- [ ] Fill in `.env.local` with live keys.
- [ ] Replace `lib/db.ts` in-memory store with Postgres.
- [ ] Create Stripe product + monthly $149 Pro price, set `NEXT_PUBLIC_STRIPE_PRICE_PRO`.
- [ ] Register Clerk webhook at `/api/webhooks/clerk`.
- [ ] Register Stripe webhook at `/api/webhooks/stripe`.
- [ ] Drop `public/videos/claude-demo.mp4` and `webmcp-demo.mp4`.
- [ ] Set Chrome Web Store URL in `NEXT_PUBLIC_CHROME_STORE_URL`.
- [ ] Deploy to Vercel.
