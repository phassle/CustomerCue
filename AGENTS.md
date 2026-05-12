# AGENTS

**CustomerCue** — Monterro / InfuseAI demo. AI revenue intelligence for B2B SaaS Customer Success, Support, and Product teams. Reads support conversations (Intercom / Zendesk) and turns them into prioritized signals.

> *Turn support conversations into customer revenue signals.* — MVP wedge: weekly revenue signals from your support inbox. Not an autonomous support agent.

Live agentic-development workshop demo. Visual-first, mocked data, no production deployment. **Read [`brief.md`](./brief.md) before scoping any work** — it's the source of truth for positioning, ICP, signal taxonomy, and pricing.

## Subprojects

| Path | Purpose | Status |
|---|---|---|
| [`Web/`](./Web/AGENTS.md) | Public marketing site | Empty — stack TBD |
| [`Saas/`](./Saas/AGENTS.md) | The signed-in product | Empty — stack TBD |

Independent codebases; no shared deps, no monorepo tooling. Run dev servers separately.

## Build / typecheck

Per-subproject. Both empty — commands TBD until the stack is chosen.

## Branching

Git-flow always.

- `main` — latest stable. No direct commits.
- `develop` — integration branch. Default merge target.
- `feature/<name>` — off `develop`, back to `develop` via PR.
- `release/<version>` — off `develop`, merged to both `main` and `develop`.
- `hotfix/<name>` — off `main`, merged to both `main` and `develop`.

Work happens on `feature/*`. Never commit straight to `main` or `develop`.

## Read these on demand

- [`docs/signals.md`](./docs/signals.md) — canonical signal taxonomy + trust contract (every signal must link to source conversations)
- [`docs/conventions.md`](./docs/conventions.md) — mocked-data, vocabulary, code rules
- [`docs/stop-rules.md`](./docs/stop-rules.md) — when to ask before acting
- [`docs/retros/`](./docs/retros/) — per-PRD retro docs. **Any agent (Claude Code or Sandcastle) about to work on a slice MUST read the retro for its PRD first** — it lists time-sinks and workarounds earlier slices already paid for. Filename matches the feature branch (e.g. `web-1-0-landing.md` for `feature/web-1-0`).

## Per-PRD retros (mandatory)

For every PRD that produces a feature branch, maintain `docs/retros/<feature-branch-slug>.md`. Claude Code (host agent) owns the bookkeeping; Sandcastle never edits it. Two trigger points where the retro must be brought current:

1. **At the end of each Claude Code session that touched Sandcastle output** — capture what was learned from any Sandcastle log read or review during the session.
2. **Before the feature branch is closed** (merged into `develop` via PR, or deleted) — final pass synthesising the whole PRD build into "lessons for the next PRD."

A PR that merges a `feature/*` branch must not be merged until the retro for that branch has its "Lessons for the next PRD" section filled in.

## Plan output

Be extremely concise; sacrifice grammar for concision. End each plan with unresolved questions — flag scope choices that depend on the brief's open questions (Intercom vs Zendesk, dashboard vs Slack vs report, etc.).

## Agent skills

Repo agent instructions are shared across agents and models. `AGENTS.md` is canonical; `CLAUDE.md` is only a compatibility symlink. Shared skills live in `.agents/skills`; provider-specific skill folders should mirror those skills rather than fork behavior. Repo memory/context belongs in `brief.md`, `docs/`, `AGENTS.md`, or `.agents/skills`, not model-local instructions.

### Issue tracker

Issues live in GitHub Issues on `phassle/CustomerCue`, accessed via the `gh` CLI. See [`docs/agents/issue-tracker.md`](./docs/agents/issue-tracker.md).

### Triage labels

Default canonical names (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) — no overrides. See [`docs/agents/triage-labels.md`](./docs/agents/triage-labels.md).

### Domain docs

Multi-context: `CONTEXT-MAP.md` at the root pointing at per-subproject `CONTEXT.md` files (`Web/`, `Saas/`). See [`docs/agents/domain.md`](./docs/agents/domain.md).
