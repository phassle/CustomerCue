# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

Edit the right-hand column to match whatever vocabulary you actually use.

## Triage checks before applying `ready-for-agent`

When triaging an **implementation issue** (not a PRD), `ready-for-agent` is only correct after all of these are true:

1. **A subproject label is set** — `web` or `saas` (or both for cross-cutting work). See [`issue-tracker.md`](./issue-tracker.md).
2. **A `## BDD Acceptance Criteria` section is present**, with at least one Given/When/Then scenario covering the golden path. The rule and format are in [`issue-tracker.md`](./issue-tracker.md). An implementation issue without BDD scenarios is not ready — it cannot be translated into tests by an AFK agent.
3. **No open `needs-info` flag** on the issue.

If any check fails, leave the issue on `needs-triage` (or apply `needs-info`) and comment what's missing. Don't quietly upgrade an under-specified issue to `ready-for-agent`.

PRDs are exempt from check 2 — PRDs describe intent, not behaviour. The implementation issues that the PRD produces carry the BDD requirement.

## Merge-gate dimension: `human-review-required`

Orthogonal to "who implements" (`ready-for-agent` / `ready-for-human`) is **"who merges the PR"**. The default is that agent review (Copilot, `/ultrareview`, automated checks) suffices. Apply the `human-review-required` label when the code area demands a human reviewer regardless of who implemented the slice.

Apply `human-review-required` at triage time when any is true:

- Slice will touch auth, secrets, billing, infra, or CI/CD pipelines.
- Slice modifies public copy that must match `brief.md` verbatim (vocabulary correctness is judgment-heavy).
- Slice changes a domain ADR or its associated invariants.
- Slice touches a code path the team has explicitly stewarded (e.g. signal taxonomy, ADR-touching changes).
- Prior incident or retro mandates a human checkpoint for the area.

The label is independent of state and category — an issue can carry `enhancement` + `ready-for-agent` + `human-review-required` simultaneously. The agent will build it; a human must approve the PR before merge.

Enforcement: the workflow `.github/workflows/human-review-gate.yml` runs on every PR. It scans the PR body and title for `#<issue-number>` references, fetches each linked issue, and if any carry `human-review-required` the PR's status check fails until an approving review is recorded by a user (not a bot) on the PR's current HEAD commit. Force-pushing dismisses stale approvals — the gate then refails until a new approval is recorded.

If the slice's PR is *not* linked to any labelled issue, the gate passes by default. Link issues with `#<number>` in the PR body so the gate can find them.
