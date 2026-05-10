# AGENTS — Saas

**The CustomerCue app.** This folder *is* the product — the signed-in SaaS that VP CS / CSMs / Support leads / PMs log into. Signals dashboard built from support-conversation classification, account drilldown, source receipts, routing to Slack/CRM. The public marketing site lives in `../Web/` and is a separate codebase.

> Status: empty directory. Stack not yet chosen. Fill in this file as decisions are made — don't leave stale placeholders.
> Product scope, signal taxonomy, ICP, and example outputs in `../brief.md`. Read it before scoping any feature.

## Stack (decide before first commit)

- Framework: _TBD_ (Next.js App Router with TS expected, matching sibling demos)
- UI: _TBD_ (shadcn/ui + Tailwind expected)
- Charts: _TBD_ (Chart.js / Recharts) — needed for trend lines on signal volume, ARR-weighted views, sentiment-over-time
- Auth: _TBD_ — for a demo, prefer a mocked auth provider over real OAuth
- Data: mocked — synthetic Intercom/Zendesk-shaped conversations, synthetic accounts with ARR/plan/segment/owner. No DB, no ORM, no migrations.

Record exact versions and rationale here once chosen.

## Commands

```
# placeholder — fill in once scaffolded
# npm install
# npm run dev          # http://localhost:3000
# npm run build
# npm run lint
```

No test runner planned — visual-first demo. If signal-classification logic grows, add Vitest and document it here.

## MVP feature scope (from brief — first product version)

1. **Mock Intercom / Zendesk integration** — read-only ingest of conversations. Pick one (open question in brief).
2. **Historical conversation import** — seed dataset of mocked tickets across ~20 fictional accounts.
3. **Customer data import** — CSV / mocked HubSpot / mocked Salesforce → account records with **ARR, plan, segment, account owner**.
4. **AI classification** — assign signals from the canonical taxonomy (see below). Mocked classifier output is fine for the demo.
5. **Signals dashboard** — list/board of prioritized signals, filterable by type, account, ARR-weight, owner.
6. **Account drilldown** — every signal links to the source conversations. *Trust requirement: never display a signal without source receipts.*
7. **Slack / email alert mock** — "send to owner" UI that surfaces a preview, doesn't actually send.
8. **Weekly report mock** — printable / shareable summary view for CS / Product / Support leadership.

## Canonical signal taxonomy (use these names verbatim)

`churn risk` · `expansion intent` · `product friction` · `bug cluster` · `onboarding issue` · `feature request` · `negative sentiment` · `strategic account escalation` · `documentation gap` · `repeated manual workaround`

Don't invent synonyms. If a new type genuinely belongs, add it to `../brief.md` first.

## Architecture entry points (fill in as built)

- View state hub → _TBD_
- Render switch / nav → _TBD_
- Mock conversation data → `src/data/conversations.ts`
- Mock account data → `src/data/accounts.ts` (must include `arr`, `plan`, `segment`, `owner`)
- Signal classifier (mocked) → `src/lib/signals/classify.ts`
- Signal → source-conversation linking → _TBD_ (this is the trust contract — every signal renders with at least one linked ticket)
- API routes → `src/app/api/*` (server-only — never `'use client'`)

## Conventions

- All data hardcoded in `src/data/` or `src/lib/constants.ts` — no database. Edit source files; no schema change needed.
- Account records carry ARR/plan/segment/owner — these are first-class fields, not optional. Signals get prioritized and filtered by them.
- **Every rendered signal MUST link to its source conversation(s).** No exceptions — this is the brief's stated trust mitigation.
- Use the canonical signal-type names verbatim in types, UI labels, and filters.
- Shared types live next to their producer module, not in a global `types/` folder.
- Tailwind only for styling; no styled-components, no CSS modules.
- API routes are server-only — never add `'use client'` there.
- Don't import from `../Web/` — the product and the website are independent codebases.
- Linters handle style — don't restate.

## Demo storytelling hooks (from brief's example outputs)

Use these as concrete UI seeds — they make the demo legible:

- **Acme Corp** — $42k ARR, 6 tickets in 14 days about an integration issue, declining sentiment → `churn risk` signal pre-renewal.
- **NordicPay** — repeated questions about SSO, audit logs, admin roles → `expansion intent` signal.
- **Onboarding step 3 cluster** — 37 tickets across 11 customers, 4 in target ICP → `onboarding issue` + `bug cluster` for product prioritization.

These are explicitly fictional in the brief — fine to ship as demo data, label as such.

## Stop rules

- No stack choice without confirming with the user.
- No real third-party integrations (Intercom, Zendesk, HubSpot, Salesforce, Slack, billing, auth) without explicit ask — mock them.
- No new signal types beyond the canonical taxonomy without updating `../brief.md` first.
- No signal UI that lacks source-conversation receipts — this is non-negotiable per the brief's trust mitigation.
- No customer-data shapes invented from thin air beyond the brief's `ARR / plan / segment / owner` baseline — confirm before extending.
