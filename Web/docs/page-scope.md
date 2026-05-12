# Page scope

**A single focused landing page.** One scrollable `/`. All copy pulls from `../../brief.md` verbatim.

## Sections (in order)

1. **Hero** — tagline *"Turn support conversations into customer revenue signals."* Sub-positioning weaves in the differentiator (AI revenue intelligence on top of Intercom/Zendesk, not another support bot) and the ICP hint (B2B SaaS with a CS team). Primary CTA inline.
2. **Explainer** — interactive conversation-to-signal explainer. Heading: *"Watch a support conversation become a signal."* Four switchable scenarios (Acme Corp, NordicPay, step-3 onboarding, CSV workaround) with annotated conversation threads showing how signals are extracted from real support conversations.
3. **Signals** — the 10 canonical signal types as a grid/list. Names verbatim. See [`../../docs/signals.md`](../../docs/signals.md).
4. **Sample digest** — fictional email-shaped weekly digest demonstrating the deliverable. Three signal entries (Acme / NordicPay / step-3) with `<details>/<summary>` source-conversation expanders. Labelled fictional.
5. **CTA section** — the close. Primary + secondary CTA, repeated from hero.
6. **Footer** — standard minimal B2B footer (product, company, legal, contact).

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
