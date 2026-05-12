# Page scope

**A single focused landing page.** One scrollable `/`. All copy pulls from `../../brief.md` verbatim.

## Sections (in order)

1. **Hero** — tagline *"Turn support conversations into customer revenue signals."* Sub-positioning weaves in the differentiator (AI revenue intelligence on top of Intercom/Zendesk, not another support bot) and the ICP hint (B2B SaaS with a CS team). Primary CTA inline.
2. **Explainer** — interactive conversation-to-signal explainer. Heading: *"Watch a support conversation become a signal."* Four switchable scenarios (Acme Corp, NordicPay, step-3 onboarding, CSV workaround) with annotated conversation threads showing how signals are extracted from real support conversations.
3. **Signals** — the 10 canonical signal types as a grid/list. Names verbatim. See [`../../docs/signals.md`](../../docs/signals.md).
4. **What's hiding in your inbox?** — interactive *signal estimate* section. Two sliders (weekly support-conversation volume, customer count) drive projected per-week counts across four signal-type buckets (`churn risk`, `expansion intent`, `product friction` + `bug cluster`, long tail). **Counts only, never dollars** — see [`../../docs/adr/0003-signal-estimator-counts-not-dollars.md`](../../docs/adr/0003-signal-estimator-counts-not-dollars.md). Anchors back to the Explainer for receipts; closing line links to the secondary CTA's `ConversationsUploadForm`. Terminology: see [`../CONTEXT.md`](../CONTEXT.md).
5. **Sample digest** — fictional email-shaped weekly digest demonstrating the deliverable. Three signal entries (Acme / NordicPay / step-3) with `<details>/<summary>` source-conversation expanders. Labelled fictional.
6. **CTA section** — the close. Primary + secondary CTA, repeated from hero.
7. **Footer** — standard minimal B2B footer (product, company, legal, contact).

Differentiation and ICP get woven into the hero/how-it-works copy, not their own sections.

## CTA hierarchy

- **Primary:** "Book a demo" (the brief's conventional ask).
- **Secondary:** *"Send us 1,000 support conversations — get your churn, expansion, and product-risk report in 48 hours."* The brief's validation offer.

Both post to mock endpoints — no real CRM/email wiring.

## Explicitly out of scope (deferred until we have real signal)

- **Pricing** — the brief's tiers are a hypothesis, not a committed SKU. Don't ship draft prices on the public page.
- **Social proof / logos / testimonials / customer counts** — no real customers yet. Empty slots look worse than no section.
- **Separate /pricing, /about, /docs pages** — everything lives on `/`.
- **Dollar-value ROI projections** in the *signal estimate* section — see ADR-0003. Counts only.

## Out of scope permanently (belongs in Saas)

Auth, dashboards, signed-in flows, in-app data. That's `../../Saas/`.
