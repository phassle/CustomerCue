# Page scope

**A single focused landing page.** One scrollable `/`. All copy pulls from `../../brief.md` verbatim.

## Sections (in order)

1. **Hero** — tagline *"Turn support conversations into customer revenue signals."* Sub-positioning weaves in the differentiator (AI revenue intelligence on top of Intercom/Zendesk, not another support bot) and the ICP hint (B2B SaaS with a CS team). Primary CTA inline.
2. **How it works** — three to four steps from "connect Intercom/Zendesk" to "weekly revenue signals in Slack/email." Use the brief's example outputs (Acme Corp / NordicPay / step-3 cluster) as illustrations. Label them as fictional.
3. **Signals** — the 10 canonical signal types as a grid/list. Names verbatim. See [`../../docs/signals.md`](../../docs/signals.md).
4. **CTA section** — the close. Primary + secondary CTA, repeated from hero.
5. **Footer** — standard minimal B2B footer (product, company, legal, contact).

Differentiation and ICP get woven into the hero/how-it-works copy, not their own sections.

## CTA hierarchy

- **Primary:** "Book a demo" (the brief's conventional ask).
- **Secondary:** *"Send us 1,000 support conversations — get your churn, expansion, and product-risk report in 48 hours."* The brief's validation offer.

Both post to mock endpoints — no real CRM/email wiring.

## Explicitly out of scope (deferred until we have real signal)

- **Pricing** — the brief's tiers are a hypothesis, not a committed SKU. Don't ship draft prices on the public page.
- **Social proof / logos / testimonials / customer counts** — no real customers yet. Empty slots look worse than no section.
- **Separate /pricing, /about, /docs pages** — everything lives on `/`.

## Out of scope permanently (belongs in Saas)

Auth, dashboards, signed-in flows, in-app data. That's `../../Saas/`.
