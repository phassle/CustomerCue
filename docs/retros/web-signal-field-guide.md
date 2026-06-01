# Retro — `feature/web-signal-field-guide`

PRD: Signal Field Guide. A public, multi-page guide to the 10 canonical signal
types in `Web/`, designed as a **parallel-agent coding demo** — each signal
type is a self-contained, auto-discovered slice so many agents build at once
with zero merge conflicts.

> Claude Code (host agent) owns this file. Sandcastle never edits it. Bring it
> current at the end of any session that touched Sandcastle output, and do a
> final "Lessons for the next PRD" pass before the branch is merged/closed.

## Architecture decisions made during build

- **Auto-discovery seam (`src/lib/signal-library.ts`).** Slices are globbed via
  `import.meta.glob('../signals/*/index.ts', { eager: true })`. The whole point:
  a new slice plugs in without editing any shared file → no contention between
  parallel agents. A central registry array would have serialized them.
- **No classifier in `Web/`.** The original plan had a per-slice `detect()`.
  Grilling against `docs/conventions.md` + the context map showed that's
  product-side logic that belongs in `Saas/`. Slices use the existing
  `Annotation` fixture model instead — the evidence is data, not code.
- **Scope expansion is ADR'd.** `Web/` was locked to a single page; expanding to
  `/signals/*` reversed a deliberate decision, so it got [ADR 0006](../adr/0006-web-signal-field-guide-multipage.md)
  and a `page-scope.md` amendment rather than a quiet override.
- **Terminology.** Introduced **signal type** (a taxonomy category) as distinct
  from **signal** (a surfaced instance) in `Web/CONTEXT.md`.

## Time-sinks / gotchas (for slice agents on this branch)

- Playwright needs `npx playwright install chromium`; on the Sandcastle Docker
  image Chromium Headless Shell also needs ~13 system libs — see
  [`web-1-0-landing.md`](./web-1-0-landing.md) before running `test:e2e`.
- The working tree carried an unrelated repo-wide skill-folder move
  (`.claude/skills` → `.agents/skills`). Stage only your own files by explicit
  path; never `git add -A` on this branch.
- The shared contract test (`signal-library.test.ts`) intentionally asserts
  `<= 10`, not `=== 10`, while slices are still landing. Tighten to `=== 10`
  once all slices merge.

## Slice contract (what each parallel agent does)

Create only `Web/src/signals/<slug>/` (`index.ts` exporting `entry`, optional
`fixture.ts`, `entry.test.ts`). Copy `churn-risk` as the template. Full contract
in `Web/src/signals/README.md`.

## Lessons for the next PRD

_To be filled in the final pass before this branch merges into `develop`._
