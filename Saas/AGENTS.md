# AGENTS — Saas

**The CustomerCue app.** Signed-in product: signals dashboard, account drilldown, source-conversation receipts, mocked routing to Slack/CRM. The marketing site is in `../Web/` and is independent.

> Empty directory. Stack not yet chosen — fill this file in as decisions are made; don't leave stale placeholders.

## Stack

| | |
|---|---|
| Framework | _TBD_ — Next.js App Router + TS expected |
| UI | _TBD_ — shadcn/ui + Tailwind expected |
| Charts | _TBD_ — Chart.js / Recharts (signal volume, ARR-weighted, sentiment-over-time) |
| Auth | _TBD_ — prefer mocked over real OAuth for demo |
| Data | Mocked — synthetic Intercom/Zendesk-shaped conversations + accounts. No DB, no ORM, no migrations. |

Record exact versions and rationale here once chosen.

## Commands

```
# placeholder — fill in once scaffolded
# npm install
# npm run dev          # http://localhost:3000
# npm run build
# npm run lint
```

No test runner planned. If signal-classification logic grows, add Vitest and document it here.

## Read these on demand

- [`docs/feature-scope.md`](./docs/feature-scope.md) — MVP feature list
- [`docs/architecture.md`](./docs/architecture.md) — entry points and file paths
- [`docs/demo-data.md`](./docs/demo-data.md) — Acme Corp / NordicPay / step-3 cluster seeds
- [`../docs/signals.md`](../docs/signals.md) — canonical signal taxonomy + trust contract (every signal links to its source)
- [`../docs/conventions.md`](../docs/conventions.md) — mocked-data, types-near-producer, no cross-import to `../Web/`
- [`../docs/stop-rules.md`](../docs/stop-rules.md) — when to ask before acting
- [`../brief.md`](../brief.md) — product scope, ICP, example outputs
