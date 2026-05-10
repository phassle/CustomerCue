# AGENTS — Web

A conventional sales-oriented marketing website for **CustomerCue** — the kind of site a B2B SaaS visitor would expect: hero, value props, how-it-works, signals, differentiation, pricing, social proof, "book a demo" / "try it" CTAs. Nothing experimental. No signed-in experience — that lives in `../Saas/` (the app itself).

> Status: empty directory. Stack not yet chosen. Fill in this file as decisions are made — don't leave stale placeholders.
> Product positioning, taglines, ICP, and differentiation copy live in `../brief.md`. Pull from there; do not invent.

## Stack (decide before first commit)

- Framework: _TBD_ (Next.js App Router or Astro for static-first)
- Styling: _TBD_ (Tailwind expected, matching sibling demos)
- Hosting: _TBD_ (Vercel / static export)

Once chosen, record exact versions and rationale here.

## Commands

```
# placeholder — fill in once scaffolded
# npm install
# npm run dev
# npm run build
# npm run lint
```

No test runner planned — visual-first demo site.

## Page scope (driven by `../brief.md`)

A standard B2B SaaS marketing site — these sections are the baseline; add/remove as the design evolves:

- **Hero / landing** — tagline *"Turn support conversations into customer revenue signals."* Sub-positioning: AI revenue intelligence on top of Intercom/Zendesk, not another support bot. Primary CTA (e.g. "Book a demo" or "Start free trial").
- **How it works** — three to four steps from "connect Intercom/Zendesk" to "weekly revenue signals in Slack/email." Use brief's example outputs (Acme Corp, NordicPay, onboarding-step-3 cluster) as illustrations.
- **Signals** — the 10 canonical signal types from the brief. Use the exact names.
- **Differentiation** — vs Intercom Fin, Zendesk AI, Gainsight. *Resolution* vs *revenue meaning*.
- **Who it's for / ICP** — VP CS as primary buyer; B2B SaaS 50–500 employees; recurring revenue.
- **Pricing** — Starter / Growth / Enterprise tiers per brief's hypothesis (treat as draft; don't promise a price-locked SKU).
- **Social proof / trust** — logos / testimonials / case-study slots (placeholder content until real customers exist), plus security/trust signals.
- **Footer** — standard B2B footer (product, company, legal, contact).

Optional secondary CTA: "Send us 1,000 support conversations, get your report in 48 hours" (the brief's validation offer) — fine as a secondary lead magnet, but the primary CTA should be the conventional "book a demo" / "try it" ask.

Auth, dashboards, in-app data → **NOT here**. Belongs in `../Saas/` (the app).

## Conventions

- Use the brief's vocabulary verbatim — same signal names, same tagline, same MVP wedge phrasing. No synonyms.
- All copy is mocked / draft until the user signs off — flag claims (logos, customer counts, ROI numbers) that need approval before they go on-screen.
- Forms (1,000-conversations CTA, contact, demo-request) post to a mock endpoint — no real CRM/email/HubSpot integration in this repo.
- Images and assets under `public/` (or framework equivalent); avoid binary blobs > 1 MB.
- Don't import from `../Saas/` — the website and the product are independent codebases.

## Stop rules

- No stack choice without confirming with the user.
- No real third-party integrations (analytics, CRM, email, calendar) without explicit ask.
- No invented logos, testimonials, or customer counts. The brief's example outputs (Acme Corp, NordicPay) are explicitly fictional — fine to use as illustrations, label them as such.
- Pricing numbers are a hypothesis in the brief — don't present them as committed pricing without confirmation.
