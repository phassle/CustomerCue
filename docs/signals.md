# Signals

The product's reason to exist. Read before touching any signal-related code, type, or UI.

## Canonical taxonomy

Use these names **verbatim** — in types, UI labels, filters, copy, demo data, everywhere. No synonyms.

`churn risk` · `expansion intent` · `product friction` · `bug cluster` · `onboarding issue` · `feature request` · `negative sentiment` · `strategic account escalation` · `documentation gap` · `repeated manual workaround`

If a new type genuinely belongs, add it to `brief.md` first — don't quietly extend the taxonomy in code.

## Trust contract

**Every rendered signal MUST link to its source conversation(s).** No exceptions.

This is the brief's stated mitigation for the "customers don't trust AI signals" risk. Mocked source links are fine in this demo, but the affordance must be there. A signal without receipts is a bug, not a styling oversight.

## Demo storytelling hooks

The brief's three example outputs are concrete, fictional, and reusable across both Web (illustrations) and Saas (seed data):

- **Acme Corp** — $42k ARR, 6 tickets in 14 days about an integration issue, declining sentiment → `churn risk` pre-renewal.
- **NordicPay** — repeated questions about SSO, audit logs, admin roles → `expansion intent`.
- **Onboarding step 3 cluster** — 37 tickets across 11 customers, 4 in target ICP → `onboarding issue` + `bug cluster`.

Label them as fictional when they appear on-screen.
