# Retro — Web privacy posture (`feature/web-privacy-posture`)

Per-PRD retro. Owned by Claude Code (host); Sandcastle agents read it before starting, do not edit it.

This isn&rsquo;t a PRD in the usual sense &mdash; it&rsquo;s a single-slice deliberate non-decision. The retro is kept anyway so the reasoning is durable next to the ADR, and so any future "let&rsquo;s add a consent banner" instinct hits a paper trail.

## Gotchas that bit us (and how they&rsquo;re resolved)

- **The initial ask was "build a cookie consent popup."** Codebase scan showed zero non-essential cookies / trackers / storage writes in `Web/`. Building a consent surface for nothing would have been theatre and would have advertised tracking the site doesn&rsquo;t do. Redirected the slice into a `/privacy` page + footer link + ADR. Rule: before building a consent / compliance surface, grep for what it would gate. If there&rsquo;s nothing to gate, ship a privacy posture instead.

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
