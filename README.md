# CustomerCue

> Turn support conversations into customer revenue signals.

AI revenue intelligence for B2B SaaS Customer Success, Support, and Product teams. CustomerCue reads support conversations (Intercom / Zendesk) and surfaces prioritized signals — churn risk, expansion intent, product friction, bug clusters, onboarding issues.

It's not another support bot. It's an intelligence layer on top of your support inbox.

## Status

Monterro / InfuseAI live agentic-development workshop demo. **Visual-first, mocked data, no production deployment.**

- **[`Web/`](./Web/)** — v1.0 marketing landing page is built and running. Astro 6.3 + Tailwind v4 + Preact form islands; `POST /api/lead` is a mock endpoint that validates and returns a synthetic id (stores nothing). See [`Web/README.md`](./Web/README.md).
- **[`Saas/`](./Saas/)** — still an empty scaffold; the signed-in product hasn't started. Stack TBD.

## Repo layout

| Path | Purpose |
|---|---|
| [`Web/`](./Web/) | Public marketing site |
| [`Saas/`](./Saas/) | The signed-in product |
| [`brief.md`](./brief.md) | Source of truth for positioning, ICP, signal taxonomy, pricing |
| [`docs/`](./docs/) | Shared agent-facing docs (signals, conventions, stop rules) |
| [`AGENTS.md`](./AGENTS.md) | Entry point for AI agents working in this repo |

`Web/` and `Saas/` are independent codebases. No shared deps, no monorepo tooling.

## Getting started

`Web/` is runnable:

```bash
cd Web
npm install
npm run dev            # http://localhost:4321
npm run test           # vitest (unit + component)
npm run test:e2e       # playwright (E2E, Chromium)
npm run build          # static export + Node SSR for /api/lead
```

`Saas/` has no code yet — see [`Saas/README.md`](./Saas/README.md).

## The MVP wedge

> Weekly revenue signals from your support inbox.

Not an autonomous support agent. The validation offer is: *"Send us 1,000 support conversations. We return your churn, expansion, and product-risk report in 48 hours."* Full positioning lives in [`brief.md`](./brief.md).

## Trust contract

Every signal in the product must link back to the source conversations. No exceptions — this is the brief's stated mitigation against "AI signals you can't trust."
