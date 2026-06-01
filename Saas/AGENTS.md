# AGENTS — Saas

**The CustomerCue app.** Signed-in product: Triage Inbox, paste-classify, account drilldown, source-conversation receipts, mocked routing to Slack/CRM. The marketing site is in `../Web/` and is independent.

## Stack

| | |
|---|---|
| Framework | Next.js 16 App Router + TypeScript 5 (ADR 0005) |
| UI | shadcn/ui + Tailwind CSS v4 via `@tailwindcss/postcss` |
| Classifier | `@anthropic-ai/sdk` with Stub Classifier fallback (Saas ADR 0001) |
| Auth | Cookie-backed mock. Two seeded users (Sara Lindqvist CSM, Marc Bergström VP CS). No real OAuth. |
| Data | Mocked — 10 accounts, 14 signals, ~36 conversations. In-memory stores. No DB, no ORM, no migrations. |
| Test — unit | Vitest 4 + happy-dom |
| Test — E2E | Playwright (Chromium Headless Shell) |

## Commands

```bash
npm install              # install dependencies
npm run dev              # start dev server at localhost:3000
npm run build            # production build
npm run typecheck        # tsc --noEmit
npm run test             # vitest run (unit tests)
npm run test:e2e         # playwright test (E2E, starts dev server automatically)
```

## Key entry points

- `src/lib/classifier/classify.ts` — `classifyConversation()` single entry point
- `src/lib/classifier/stub.ts` — Stub Classifier (keyword matcher, `[stub]` prefix)
- `src/lib/classifier/anthropic-adapter.ts` — Anthropic SDK wrapper (server-only)
- `src/lib/classifier/token-budget.ts` — per-process 50k token budget
- `src/lib/signals/types.ts` — core types: Signal, Conversation, Account, Classification, SignalType
- `src/lib/signals/priority.ts` — Priority Score: `arrWeight × urgencyWeight`
- `src/lib/signals/sort.ts` — sort modes, formatting helpers
- `src/lib/stores/signal-store.ts` — in-memory signal store
- `src/lib/stores/conversation-store.ts` — in-memory conversation store
- `src/lib/session.ts` — cookie-backed user session
- `src/data/` — seed data (accounts, signals, conversations, users)

## Read these on demand

- [`CONTEXT.md`](./CONTEXT.md) — ubiquitous language for the Saas domain
- [`docs/adr/0001-anthropic-classifier-with-stub-fallback.md`](./docs/adr/0001-anthropic-classifier-with-stub-fallback.md)
- [`docs/feature-scope.md`](./docs/feature-scope.md) — MVP feature list
- [`docs/architecture.md`](./docs/architecture.md) — entry points and file paths
- [`docs/demo-data.md`](./docs/demo-data.md) — Acme Corp / NordicPay / step-3 cluster seeds
- [`../docs/signals.md`](../docs/signals.md) — canonical signal taxonomy + trust contract
- [`../docs/conventions.md`](../docs/conventions.md) — mocked-data, types-near-producer, no cross-import to `../Web/`
- [`../docs/stop-rules.md`](../docs/stop-rules.md) — when to ask before acting
- [`../brief.md`](../brief.md) — product scope, ICP, example outputs
