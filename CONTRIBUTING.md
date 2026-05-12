# Contributing

CustomerCue is a Monterro / InfuseAI live agentic-development workshop demo. Contributions are welcome from workshop participants and Monterro / InfuseAI staff.

## Before you start

1. Read [`brief.md`](./brief.md) — the source of truth for positioning, ICP, signal taxonomy, and pricing. Scope choices must trace back to it.
2. Read [`AGENTS.md`](./AGENTS.md) — entry point for agents and humans working in this repo.
3. If your change touches a slice that belongs to an existing PRD, read the matching retro in [`docs/retros/`](./docs/retros/) — it lists time-sinks earlier slices already paid for.

## Branching (git-flow)

- `main` — latest stable. No direct commits.
- `develop` — integration branch. Default merge target.
- `feature/<name>` — off `develop`, back to `develop` via PR.
- `release/<version>` — off `develop`, merged to both `main` and `develop`.
- `hotfix/<name>` — off `main`, merged to both `main` and `develop`.

Never commit straight to `main` or `develop`.

## Issues

Issues live in GitHub Issues. See [`docs/agents/issue-tracker.md`](./docs/agents/issue-tracker.md) for the issue lifecycle and [`docs/agents/triage-labels.md`](./docs/agents/triage-labels.md) for the label vocabulary.

**Implementation issues must include a BDD section** — Given / When / Then scenarios. PRDs are exempt.

## Pull requests

- Target `develop` unless you're cutting a release or hotfix.
- Keep PRs focused — one slice per PR.
- Fill in the PR template.
- For PRs that close a `feature/*` branch: the matching retro in `docs/retros/` must have its "Lessons for the next PRD" section filled in before merge.
- After fixing Copilot review comments, reply inline **and** post a top-level `@copilot` mention to trigger re-review.

## Code conventions

See [`docs/conventions.md`](./docs/conventions.md) — mocked-data rules, vocabulary, code style. Trust contract: every signal in the product must link back to source conversations.

## Stop rules

See [`docs/stop-rules.md`](./docs/stop-rules.md) — when to ask before acting.

## Running locally

Per-subproject. See [`Web/README.md`](./Web/README.md) — `Saas/` is not yet runnable.

## Security

Do not file vulnerabilities as public issues. See [`SECURITY.md`](./SECURITY.md).
