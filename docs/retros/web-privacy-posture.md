# Retro — Web privacy posture (`feature/web-privacy-posture`)

Per-PRD retro. Owned by Claude Code (host); Sandcastle agents read it before starting, do not edit it.

This isn&rsquo;t a PRD in the usual sense &mdash; it&rsquo;s a single-slice deliberate non-decision. The retro is kept anyway so the reasoning is durable next to the ADR, and so any future "let&rsquo;s add a consent banner" instinct hits a paper trail.

## Gotchas that bit us (and how they&rsquo;re resolved)

- **The initial ask was "build a cookie consent popup."** Codebase scan showed zero non-essential cookies / trackers / storage writes in `Web/`. Building a consent surface for nothing would have been theatre and would have advertised tracking the site doesn&rsquo;t do. Redirected the slice into a `/privacy` page + footer link + ADR. Rule: before building a consent / compliance surface, grep for what it would gate. If there&rsquo;s nothing to gate, ship a privacy posture instead.
- **Multi-agent review on PR #50 was complementary, not redundant &mdash; but no single bot caught everything.** Claude (review bot) produced 3 issues + 3 observations. Codex (`@codex[agent]`) auto-picked up 2 of those (privacy-page copy + storage assertion implementation) and shipped fix `32cde8f`. Copilot reviewed and surfaced zero comments. The remaining item (Google Fonts CDN scoping in ADR) needed a human-driven top-up. Rule: when stacking multiple agent reviewers, do not assume any one of them sweeps the floor &mdash; the host should audit the union of findings against what was actually shipped before approving.
- **A red `claude-review` check on a feature branch can be a documented false-positive.** Post-push runs of `claude-code-review.yml` failed with `App token exchange failed: 401 ... Workflow validation failed. The workflow file must exist and have identical content to the version on the repository's default branch.` The error itself explicitly says &ldquo;If you're seeing this on a PR when you first add a code review workflow file to your repository, this is normal and you should ignore this error.&rdquo; The workflow on the feature branch hadn&rsquo;t diverged from `develop` (its base) &mdash; only from `main`. Manual `@claude review` triggers (via `claude.yml`) still ran fine and produced the actual review verdict. Rule: when CI shows red but the box says "ignore," read the error before treating it as a blocker.

## What&rsquo;s already in the code (don&rsquo;t re-derive)

- `Web/src/pages/privacy.astro` &mdash; the privacy page. Uses the standard `Layout` + `Wordmark` header + `Footer` pattern (same shape as `index.astro`).
- `Web/src/components/Footer.astro` &mdash; "Privacy (coming soon)" placeholder replaced with a real `/privacy` link. "Terms (coming soon)" left as-is.
- `docs/adr/0004-no-cookie-consent-banner.md` &mdash; captures the decision and its reasoning. Includes the explicit "if you add a tracker, update this ADR" instruction for future contributors.
- `Web/CONTEXT.md` &mdash; `privacy posture` glossary entry.
- `Web/e2e/privacy.spec.ts` &mdash; tests both the navigable artefact (page loads, footer link from `/` lands on it, axe-clean) and the underlying claim (`/` writes zero cookies and zero `localStorage`/`sessionStorage` keys). The second pair are the load-bearing assertions &mdash; they will fail if anyone later adds a tracker without updating the privacy stance.

## Lessons for the next PRD

1. **A consent surface without something to gate is theatre.** Before building any privacy / compliance UI, grep for the trackers/cookies/storage it would gate. If there are none, build a privacy posture (page + footer link + ADR) instead. The ADR is the load-bearing artefact &mdash; it pre-commits to *how* a future tracker would be introduced.
2. **Make the no-tracking claim machine-checkable.** A Playwright assertion that `document.cookie === ""` and `localStorage.length === 0` after loading the site converts the privacy posture from prose into a regression test. Any future PR that adds a tracker without updating the privacy page now fails CI.
3. **One-slice "deliberate non-decision" features still get a retro.** Future contributors will reflexively want to "fix" the missing banner. The retro and ADR together are how we ensure that instinct hits a paper trail before code.
4. **Audit the union of agent-review findings, don&rsquo;t outsource the sweep.** Stacking Claude + Codex + Copilot reviewers caught more than any one alone would have, but no single agent shipped all the fixes &mdash; the host had to reconcile what each picked up against what shipped. Treat agent reviews like the input of multiple junior reviewers: useful signal, still needs a maintainer to make sure each finding either landed or was explicitly declined with a reason.
