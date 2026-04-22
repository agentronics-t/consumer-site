# project_plan.md — Agentronics Marketing Site

> The public face of Agentronics. Tells the WebMCP story, converts visitors into extension users, handles auth, and collects payments.

---

## 1. Goal & Positioning

Agentronics ships a Chrome extension that governs every WebMCP tool call — auth, authz, memory, observability, context management. This site is the **top of the funnel and the billing surface**:

1. **Explain** what the extension does (for developers and enterprises discovering WebMCP).
2. **Convert** visitors into extension installs.
3. **Onboard** installed users through login → plan selection → API key issuance.
4. **Charge** them on Free / Pro / Enterprise tiers.

The North Star conversion: *visitor → Chrome Web Store install → account → paid plan*.

### Positioning line (site-wide)
> **The infrastructure layer for the agent web.** Auth, memory, and observability for every WebMCP tool call — one extension away.

---

## 2. Primary CTA & Funnel

**Primary CTA, repeated everywhere:** `Install the Extension` (links to Chrome Web Store listing)

**Secondary CTA:** `Sign in` (top-right, for existing users hitting the dashboard)

### The funnel the site is optimized for

```
Landing page (hero)
   │
   ├─► Install Extension (Chrome Web Store)  ← primary CTA
   │        │
   │        ▼
   │   Extension prompts login
   │        │
   │        ▼
   │   Sign in on site (Google / GitHub OAuth)
   │        │
   │        ▼
   │   Choose plan → (Free: skip payment | Pro: Stripe checkout)
   │        │
   │        ▼
   │   Dashboard: API key + extension pairing code
   │
   └─► Secondary: Docs / Pricing / Demo video
```

The extension is the product. The site exists to get people to install it, authenticate them, and charge them.

---

## 3. Tech Stack (locked)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | Marketing pages + auth + payments in one codebase; great SEO; server actions for Stripe. |
| Styling | **Tailwind CSS v4** | Matches your existing Amazon demo stack; fast iteration. |
| Motion (component) | **Framer Motion** | For hero orchestration, card hover, reveal animations. |
| Motion (scroll) | **GSAP + ScrollTrigger** | For scroll-pinned sections (5 problems, architecture diagram). |
| Smooth scroll | **Lenis** | The "buttery" scroll feel MetaMask-class sites have. |
| Auth | **Clerk** (or Supabase Auth as backup) | Google/GitHub OAuth in under an hour; generous free tier; webhooks for user lifecycle. |
| Payments | **Stripe Checkout + Customer Portal** | Hosted, PCI-compliant, handles subscriptions + cancellations without building forms. |
| DB | **Postgres via Supabase** or **Neon** | Store user → plan → API key mapping. |
| Deployment | **Vercel** | Zero-config Next.js; edge functions; env secrets. |
| Email | **Resend** | Transactional emails (welcome, API key, receipts). |
| Analytics | **PostHog** or **Plausible** | Funnel tracking from visit → install → paid. |

**Why not Clerk + Stripe DIY instead of a combined platform?** Because Clerk + Stripe is the standard, battle-tested combo and both have first-class Next.js starters. You'll be live in days, not weeks.

---

## 4. Brand System

Carry your pitch-deck brand directly. No redesign.

| Token | Value | Use |
|---|---|---|
| `--bg-base` | `#07091A` | Page background |
| `--bg-elevated` | `#0E1230` | Cards, elevated surfaces |
| `--brand-indigo` | `#6366F1` | Primary buttons, logo glow, key highlights |
| `--brand-cyan` | `#22D3EE` | Secondary accent, live-state indicators |
| `--brand-amber` | `#F59E0B` | Warning/attention, pricing accents |
| `--text-primary` | `#F5F5F7` | Headings, body |
| `--text-muted` | `#8B8FA8` | Subheads, captions |
| `--border-subtle` | `rgba(99,102,241,0.15)` | Card borders, dividers |

**Typography:**
- Display: **Space Grotesk** (700, 500) — matches the logo's geometric feel.
- Body: **Inter** (400, 500, 600).
- Mono: **JetBrains Mono** (for code blocks, tool names).

**Motion principles:**
- Ease: `cubic-bezier(0.22, 1, 0.36, 1)` (smooth "out" feel) as the default.
- Durations: micro 150ms, small 300ms, large 600–900ms for hero reveals.
- Respect `prefers-reduced-motion` — disable all transform/opacity animations, keep the content.

---

## 5. Site Map

```
/                   ← Landing (the main attraction)
/pricing            ← Dedicated pricing page (deeper FAQ + comparison)
/docs               ← Developer docs (SDK, extension, API ref) — can stub for MVP
/login              ← OAuth redirect
/signup             ← OAuth redirect (alias)
/dashboard          ← Logged-in: API key, usage, pairing code, plan mgmt
/dashboard/billing  ← Stripe customer portal iframe/link
/legal/privacy
/legal/terms
```

MVP scope: `/`, `/pricing`, `/login`, `/dashboard`, `/dashboard/billing`, legal pages. Stub `/docs` as "coming soon" with a GitHub link.

---

## 6. Landing Page — Section by Section

This is the whole game. Below is the full narrative, top to bottom, with copy direction and animation specs.

### Section 1 — Navbar (fixed, translucent on scroll)

- Left: Agentronics logo (the "A" gate from `logo.png`) + wordmark.
- Center: `Product` · `Pricing` · `Docs` · `GitHub`.
- Right: `Sign in` (ghost button) · `Install Extension` (primary, indigo with subtle glow).

**Animation:** On scroll past hero, navbar gains a `backdrop-blur` + border-bottom. 200ms transition.

### Section 2 — Hero

**Copy:**
> **H1:** The infrastructure layer for the agent web.
> **Subhead:** Auth, memory, and observability for every WebMCP tool call. One extension. Five problems solved.
> **Primary CTA:** Install for Chrome →
> **Secondary CTA:** Watch 30-sec demo ↓

**Visual (the hero animation — balanced, no 3D):**

A centered composition of your logo's "A" gate, rendered as an animated SVG. The gate sits in the middle; the circuit-trace pins on each side pulse with a soft indigo glow. Small colored "packets" (indigo squares for `authz`, cyan for `memory`, amber for `observability`) fly in from the right side (labeled "Agent: Claude / Gemini / GPT"), pass *through* the gate, and exit left (labeled "WebMCP site: amazon.com"). As each packet passes through, a small tooltip briefly pops up on the gate: `✓ auth verified`, `✓ logged`, `✓ memory persisted`.

The gate is the governance layer. The packets are tool calls. Visually obvious, no explanation required.

**Implementation:**
- Pure SVG + Framer Motion. No Three.js.
- One continuous loop, ~8 seconds per cycle, 3 packets per cycle staggered.
- Pause on hover (respects `prefers-reduced-motion` → static composition with gentle pulse only).

### Section 3 — Social proof / quick credibility strip

A single row, understated:
> Built on the W3C WebMCP spec · Compatible with Chrome 146+ · Works with Claude, Gemini, GPT

Logos as subtle monochrome SVGs on dark background. No vendor lock-in messaging here — just signal.

### Section 4 — "The internet just became agent-addressable" (timeline)

Scroll-reveal horizontal timeline, three points. As the user scrolls, a progress line draws left-to-right and each milestone fades up:

- **2022–2024 — Browser Automation.** DOM scraping, screenshots. Fragile.
- **2025 — MCP Protocol (Desktop).** Structured tools. But desktop-only.
- **2026 — WebMCP.** `navigator.modelContext` ships in Chrome 146+. Any website can register agent-callable tools.

**Animation:** GSAP ScrollTrigger pins the section briefly, line draws as scroll progresses, each card lights up on intersection.

### Section 5 — "5 Unsolved Problems" (the anchor section)

Copy lifted straight from your deck — it's already good. Five cards arranged in a responsive grid (3+2 on desktop, 1-col on mobile):

1. **No Authentication** — *Security Risk*
2. **No Authorization** — *Compliance Blocker*
3. **No Memory** — *Broken Experience*
4. **No Observability** — *Ops Blindspot*
5. **Context Bloat** — *Cost × Quality*

Each card: amber title, indigo icon, paragraph from deck, amber severity tag at bottom.

**Animation:** Cards stagger-fade in on scroll (each 100ms offset). On hover, card lifts 4px with a subtle indigo border-glow.

### Section 6 — "Why WebMCP — see this to know" (the side-by-side video)

You already have this asset from the deck. A clean two-column comparison:

| Left: Claude (DOM automation) | Right: WebMCP (via Agentronics) |
|---|---|
| Video player, 45 sec | Video player, 20 sec |
| Label: *Takes 45 seconds, fragile* | Label: *Takes 20 seconds, governed* |

Both videos autoplay, muted, loop. A single `▶ Play both from start` button above to sync them.

**Animation:** On scroll into view, both players fade in and start playing simultaneously.

### Section 7 — Architecture / "How it works" (the pitch)

Three-stage horizontal diagram:

```
[ AI Agent ]  ──►  [ Agentronics Extension ]  ──►  [ WebMCP Site ]
 Claude etc.        Auth · Authz · Memory           amazon.com
                    Observability · Context         shopify.com
                                                    your app
```

Each node is a card. Between them, an animated data packet travels continuously left-to-right. When it hits the Agentronics card, that card briefly highlights each governance pillar in sequence: `Auth ✓` → `Authz ✓` → `Memory ✓` → `Obs ✓`.

**The line under it (critical positioning):**
> Google built the browser pipes. Agentronics is the neutral governance layer — model-agnostic, enterprise-ready, one SDK line away.

### Section 8 — Pricing (compact; full detail on `/pricing`)

Three-column card grid. Use the tiers from your deck but reconciled with the memory note about a four-tier model. I'll use **three tiers on the landing page** (Free / Pro / Enterprise) because three converts better; the Team tier ($499 in memory) can live on the full `/pricing` page.

| Free | Pro — $149/mo | Enterprise |
|---|---|---|
| 1,000 governed tool calls/mo | 50K tool calls/mo | Unlimited |
| Basic auth | Full auth + authz + memory | SSO + audit trails |
| Community support | Observability dashboard | SLA + dedicated onboarding |
| — | Email support | Custom contracts |
| `Install free` | `Start Pro →` | `Talk to sales →` |

**Animation:** Cards scale up 1.02× on hover with a soft shadow. The Pro card has a persistent `Most popular` ribbon and subtle indigo border-glow.

### Section 9 — Founder / credibility

Straight from your deck — your photo, the TCP/IP quote, three credentials (Zera, NSCIF 2026 finalist, context-hub PR #97), and socials.

**Animation:** Fade + slight upward slide on scroll-in. No gimmicks here — this is where the investor eye lands.

### Section 10 — Final CTA

Full-width dark band with the animated gate SVG in the background (low opacity, slow-loop).

> **H2:** Ship the governed agent web.
> **Subhead:** Install the Agentronics extension. Sign in. Get governance on every tool call.
> **Button:** Install for Chrome (primary, large)
> **Link:** Read the docs

### Section 11 — Footer

Columns: Product (Extension, Pricing, Docs, Changelog) · Company (About, Blog, Careers) · Legal (Privacy, Terms) · Social (X, GitHub, LinkedIn). Copyright line.

---

## 7. Auth Flow

Using **Clerk** (fastest path — swap to Supabase Auth if you prefer zero-vendor).

1. User clicks `Sign in` → Clerk-hosted modal → Google/GitHub OAuth.
2. On first sign-in, a Clerk webhook fires → your `/api/webhooks/clerk` route creates a row in the `users` table with default `plan = 'free'` and generates a pairing code.
3. Post-auth redirect → `/dashboard`.
4. Dashboard shows: **API key** (masked, click-to-reveal), **Extension pairing code** (6-digit, expires in 10 min, regeneratable), current plan, usage meter, **Manage billing** button.

### Extension ↔ Site pairing

The extension, on first install, opens a popup prompting "Sign in to Agentronics." It links to `https://agentronics.com/pair?source=extension`. After login, the user copies the 6-digit pairing code from the dashboard into the extension. The extension then uses that code to exchange for a long-lived device token via `POST /api/auth/pair`.

This is the cleanest pattern — no password entry inside the extension, no storing OAuth tokens in the extension, and revocable per-device from the dashboard.

---

## 8. Payments Flow

Using **Stripe Checkout + Customer Portal** (hosted, no card fields on your site → PCI-light).

1. User on `/pricing` or `/dashboard` clicks `Upgrade to Pro`.
2. Server action creates a Stripe Checkout session with `price_pro_monthly`, `customer_email` pre-filled from Clerk, and `success_url = /dashboard?upgrade=success`.
3. Stripe redirects them out, they pay, Stripe redirects back.
4. Stripe webhook → your `/api/webhooks/stripe` route listens for `checkout.session.completed` → updates `users.plan = 'pro'` and `users.stripe_customer_id`.
5. Dashboard reflects new plan. Extension, on next API call, sees updated plan via `/api/me`.

**Manage billing:** Dashboard has a `Manage billing` button → creates a Customer Portal session → redirects to Stripe. All upgrades, downgrades, cancellations, invoices handled there. You don't build any billing UI.

**Enterprise tier:** `Talk to sales` → Calendly or a simple contact form → you handle contracts manually for the first 5–10 design partners.

---

## 9. Data Model (minimum viable)

```sql
-- users
id              uuid (PK, = clerk_user_id)
email           text
plan            text  -- 'free' | 'pro' | 'enterprise'
stripe_customer_id  text nullable
api_key_hash    text  -- store hash, not plaintext
created_at      timestamptz

-- devices (extension installs paired to a user)
id              uuid (PK)
user_id         uuid (FK → users.id)
device_token    text (unique, hashed)
label           text  -- "Chrome on MacBook Pro"
last_seen_at    timestamptz
created_at      timestamptz

-- pairing_codes (short-lived, used once)
code            text (PK, 6 chars)
user_id         uuid (FK)
expires_at      timestamptz
consumed_at     timestamptz nullable

-- usage_events (append-only, for metering)
id              bigserial (PK)
user_id         uuid (FK)
event_type      text  -- 'tool_call'
created_at      timestamptz
metadata        jsonb
```

For MVP, usage counting can be a simple count query on `usage_events` in a rolling 30-day window. Promote to TimescaleDB when volume requires it (this is already in your broader stack plan).

---

## 10. File Structure

```
agentronics-site/
├── app/
│   ├── layout.tsx                    # Root layout, Lenis provider, Clerk provider
│   ├── page.tsx                      # Landing page — imports all section components
│   ├── pricing/page.tsx
│   ├── docs/page.tsx                 # stub for MVP
│   ├── login/page.tsx                # Clerk <SignIn />
│   ├── signup/page.tsx               # Clerk <SignUp />
│   ├── dashboard/
│   │   ├── layout.tsx                # auth guard
│   │   ├── page.tsx                  # API key, pairing code, usage
│   │   └── billing/page.tsx          # Stripe portal redirect
│   ├── legal/privacy/page.tsx
│   ├── legal/terms/page.tsx
│   └── api/
│       ├── auth/pair/route.ts        # POST: exchange pairing code for device token
│       ├── me/route.ts               # GET: current user + plan + usage
│       ├── webhooks/clerk/route.ts
│       └── webhooks/stripe/route.ts
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── HeroGateAnimation.tsx     # the animated SVG centerpiece
│   │   ├── CredibilityStrip.tsx
│   │   ├── Timeline.tsx              # Section 4 (GSAP)
│   │   ├── ProblemsGrid.tsx          # Section 5
│   │   ├── ProblemCard.tsx
│   │   ├── ComparisonVideos.tsx      # Section 6
│   │   ├── ArchitectureDiagram.tsx   # Section 7 (animated packet)
│   │   ├── PricingCards.tsx
│   │   ├── FounderSection.tsx
│   │   └── FinalCTA.tsx
│   ├── dashboard/
│   │   ├── ApiKeyCard.tsx
│   │   ├── PairingCodeCard.tsx
│   │   ├── UsageMeter.tsx
│   │   └── PlanCard.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── GlowBorder.tsx            # reusable indigo glow effect
├── lib/
│   ├── stripe.ts                     # stripe client + price IDs
│   ├── db.ts                         # db client
│   ├── pairing.ts                    # code generation, validation
│   └── motion.ts                     # shared easing/duration tokens
├── hooks/
│   ├── useLenis.ts
│   └── useReducedMotion.ts
├── public/
│   ├── logo.svg                      # extracted from logo.png as vector
│   ├── favicon.ico
│   └── videos/
│       ├── claude-demo.mp4           # 45s version
│       └── webmcp-demo.mp4           # 20s version
├── middleware.ts                     # Clerk auth middleware
├── .env.local
│   CLERK_*, STRIPE_*, DATABASE_URL, RESEND_API_KEY
├── tailwind.config.ts
└── package.json
```

---

## 11. Build Order

Ship in this sequence. Each step produces a deployable, demo-able state.

### Phase 1 — Static marketing shell (days 1–2)
1. `npx create-next-app@latest` + Tailwind + TypeScript.
2. Navbar + Footer + brand tokens in `globals.css`.
3. Landing page with **all 11 sections as static HTML/Tailwind only** — no animations yet. Every section should look finished in a still screenshot.
4. `/pricing` static page.
5. Deploy to Vercel at a preview URL.

**Checkpoint:** Site tells the complete story already. You could send it to an investor today.

### Phase 2 — Animations (days 3–4)
1. Install Framer Motion + GSAP + Lenis.
2. Build `HeroGateAnimation.tsx` — the SVG gate with traveling packets. Iterate until it feels alive.
3. Add scroll-reveal to Timeline and ProblemsGrid (GSAP ScrollTrigger).
4. Add packet animation to ArchitectureDiagram.
5. Wire `useReducedMotion` — all animations become static for users who request it.
6. Add Lenis globally.

**Checkpoint:** Site feels alive. MetaMask-adjacent polish.

### Phase 3 — Auth (day 5)
1. Clerk setup, middleware, `/login`, `/signup`, `/dashboard` with auth guard.
2. `/api/webhooks/clerk` → creates user row on signup.
3. Dashboard shows "Hello {name}" as a smoke test.

**Checkpoint:** Login works end to end.

### Phase 4 — Dashboard + pairing (day 6)
1. Generate API key on signup (store hash, show once).
2. `PairingCodeCard`: button to generate a 6-digit code, shows expiry countdown.
3. `/api/auth/pair` endpoint.
4. `UsageMeter` — hard-code to 0 for MVP, wire to `usage_events` table later.

**Checkpoint:** User can install extension → sign in on site → pair extension with code.

### Phase 5 — Payments (day 7)
1. Stripe product + price setup (one-time, in Stripe dashboard).
2. `/api/stripe/checkout` server action.
3. `/api/webhooks/stripe` → updates user plan.
4. `Manage billing` → Stripe portal link.

**Checkpoint:** Real money can flow. Take a $149 test charge from your own card to verify.

### Phase 6 — Polish (day 8+)
1. OG images, meta tags, sitemap, robots.txt.
2. PostHog events on key CTAs.
3. Resend welcome email on signup.
4. Legal pages (use a generator, have a lawyer review before enterprise deals).
5. Lighthouse pass — target ≥90 on Performance, 100 on Accessibility.

---

## 12. Performance & Accessibility Budget

- **Lighthouse Performance ≥ 90** on mobile.
- **Largest Contentful Paint < 2.5s.**
- Hero video/animation lazy-loads after `DOMContentLoaded`.
- Demo videos in Section 6 use `preload="metadata"`, not `preload="auto"`.
- All animations respect `prefers-reduced-motion`.
- Keyboard navigation: every CTA and card focusable, visible focus ring in brand indigo.
- Color contrast: all text against `#07091A` ≥ 4.5:1.

---

## 13. Open Questions to Resolve Before Build

These map to the six open architecture questions in your broader product plan, filtered to what the site actually needs to answer:

1. **Chrome Web Store listing URL** — the primary CTA target. Is the extension already submitted?
2. **Pricing precision** — landing page shows three tiers (Free / $149 Pro / Enterprise). Keep the $499 Team tier on `/pricing` only, or fold it in?
3. **Enterprise contact mechanism** — Calendly link or a contact form that emails you?
4. **Domain** — `agentronics.com`? `agentronics.dev`? Need this before deploying Stripe live-mode (it pins the domain for webhooks).
5. **API key shape** — `ak_live_xxx` convention, shown once on creation? Confirm with extension team for format compatibility.
6. **Pairing code UX in extension** — does the extension have a text input field ready to accept a 6-digit code, or does it use a different handshake? This affects the `/api/auth/pair` contract.

---

## 14. What This Plan Deliberately Does NOT Include (Yet)

- **3D hero (MetaMask fox equivalent).** Deferred — balanced motion per your direction. The animated SVG gate with traveling packets carries the same narrative weight at a fraction of the build cost and loads instantly on mobile.
- **Full docs site.** Stub for MVP. Build on Mintlify or Fumadocs post-launch.
- **Blog / changelog.** Add when there's something to write about.
- **Multi-region / i18n.** English-only until revenue justifies it.
- **In-site dashboard observability views.** The extension's observability data can be visualized later; MVP dashboard just shows API key + plan + usage count.

---

## 15. Success Metrics (first 30 days post-launch)

- 500 unique landing-page visitors.
- 50 Chrome Web Store installs (10% visit → install).
- 20 authenticated accounts (40% install → signup).
- 3 paid Pro conversions (15% signup → paid).
- 1 enterprise conversation booked.

These are seed-stage numbers for a brand-new developer tool with no distribution. If you hit them, the landing page is working. If you don't, the bottleneck is visibility (distribution), not the site itself — and the pitch deck is ready for the residency/VC route regardless.