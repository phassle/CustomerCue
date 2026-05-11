# CustomerCue

> Turn support conversations into customer revenue signals.

AI revenue intelligence for B2B SaaS Customer Success, Support, and Product teams. CustomerCue reads support conversations (Intercom / Zendesk) and surfaces prioritized signals — churn risk, expansion intent, product friction, bug clusters, onboarding issues.

It's not another support bot. It's an intelligence layer on top of your support inbox.

## Status

Monterro / InfuseAI live agentic-development workshop demo. **Visual-first, mocked data, no production deployment.** Both subprojects are empty scaffolds — stack choices are still open.

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

Nothing to run yet — pick a stack per subproject first. See [`Web/README.md`](./Web/README.md) and [`Saas/README.md`](./Saas/README.md).

## The MVP wedge

> Weekly revenue signals from your support inbox.

Not an autonomous support agent. The validation offer is: *"Send us 1,000 support conversations. We return your churn, expansion, and product-risk report in 48 hours."* Full positioning lives in [`brief.md`](./brief.md).

## Trust contract

Every signal in the product must link back to the source conversations. No exceptions — this is the brief's stated mitigation against "AI signals you can't trust."
