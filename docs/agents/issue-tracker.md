# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub issues on `phassle/CustomerCue`. Use the `gh` CLI for all operations.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --comments`, filtering comments by `jq` and also fetching labels.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v` — `gh` does this automatically when run inside a clone.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.

## Subproject labels

Every issue must carry exactly one subproject label so it's clear which codebase it belongs to:

- `web` — belongs to `Web/` (marketing site)
- `saas` — belongs to `Saas/` (signed-in product)

Use both labels only for cross-cutting work that genuinely affects both subprojects.

## BDD acceptance criteria — required on implementation issues

Every **implementation issue** in this tracker must include a top-level `## BDD Acceptance Criteria` section with Given / When / Then scenarios. This is the bridge between the issue's intent and the test suite that proves it works — and tests must drive the real flow (see [`../conventions.md`](../conventions.md)).

**PRDs are exempt.** A PRD describes intent and scope; user stories carry the load and BDD belongs in the per-slice implementation issues that the PRD produces.

### Format

Use plain Gherkin shape. Each scenario:

```
**Scenario:** <short name>
- **Given** <starting condition>
- **When** <user / system action>
- **And** <additional action, optional>
- **Then** <observable outcome>
- **And** <additional outcome, optional>
```

Cover the golden path, the most important error paths, and any accessibility or performance assertion that matters for the issue. One scenario per logically distinct behaviour. Don't fold five behaviours into one scenario with ten Thens.

### Placement

Between `## User Stories` (if the issue has them) and `## Implementation Decisions`.
