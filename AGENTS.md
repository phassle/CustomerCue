# AGENTS

**CustomerCue** — Monterro / InfuseAI demo. AI revenue intelligence for B2B SaaS Customer Success, Support, and Product teams. Reads support conversations (Intercom / Zendesk) and turns them into prioritized signals: churn risk, expansion intent, product friction, bug clusters, onboarding issues.

> **Tagline:** *Turn support conversations into customer revenue signals.*
> **MVP wedge:** *Weekly revenue signals from your support inbox.* Not an autonomous support agent.
> Full positioning, ICP, signal taxonomy, and pricing hypothesis in `brief.md` — read it before scoping work.

Built for live agentic-development workshops. Visual-first, mocked data, no production deployment.

## Subprojects

| Path | Purpose | Status |
|---|---|---|
| `Web/` | Public marketing site for CustomerCue (positioning, "send us 1,000 conversations" lead-gen) | Empty — not yet scaffolded. See `Web/AGENTS.md` |
| `Saas/` | The CustomerCue product — signals dashboard, account drilldown, signed-in CS/Support workflow | Empty — not yet scaffolded. See `Saas/AGENTS.md` |

Each subproject is independent — no shared deps, no monorepo tooling. Run dev servers separately. Stack decisions belong in the relevant subproject's AGENTS.md, not here.

## Product context cheat-sheet

- **Primary buyer:** VP Customer Success. **Secondary:** Head of Support, COO, CRO, VP Product.
- **Daily users:** Support leads, CSMs, account managers, PMs.
- **ICP:** B2B SaaS, 50–500 employees, recurring revenue, support in Intercom/Zendesk, has a CS team.
- **Signal types** (canonical taxonomy — use these names verbatim in code/UI): churn risk, expansion intent, product friction, bug cluster, onboarding issue, feature request, negative sentiment, strategic account escalation, documentation gap, repeated manual workaround.
- **Differentiator vs Intercom Fin / Zendesk AI / Gainsight:** they optimize *resolution*; CustomerCue surfaces *revenue meaning* of support conversations.
- **Trust requirement:** every signal MUST link back to the source conversations. Never show an AI signal without source receipts — this is a stated risk mitigation in the brief.

## Conventions (project-wide)

- Mocked data only — no real customer data, no production credentials in this repo.
- Use the canonical signal-type names from the brief; don't invent synonyms.
- Every signal in the UI must show source tickets/conversations (mocked is fine, but the link/affordance must be there).
- Shared types live next to their producer module, not in a global `types/` folder.
- Linters handle code style — don't restate style rules in AGENTS.md files.

## Branching

- Default to `main` for now. Switch to git-flow if/when the project grows multiple parallel tracks (mirror sibling demos).
- Don't commit or open PRs without explicit user request.

## Stop rules

If unsure, stop and ask. Specifically:

- No destructive shell ops (`rm -rf`, `git reset --hard`, `git push --force`) without explicit confirmation.
- No commits or PRs without explicit user request.
- No stack/framework decisions for an empty subproject without the user's input — record the chosen stack in the subproject AGENTS.md once decided.
- No new signal types beyond the brief's taxonomy without confirming.

## Plan output rules

- Be extremely concise. Sacrifice grammar for concision.
- At the end of each plan, list unresolved questions (if any). The brief's own open questions (Intercom vs Zendesk first, dashboard vs Slack vs weekly report, etc.) are still open — flag scope choices that depend on them.
