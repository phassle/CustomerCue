# Astro for the marketing site

**Date:** 2026-05-10
**Status:** accepted

## Decision

`Web/` is built with **Astro**, not Next.js. `Saas/` will be built with a separate framework (likely Next.js + React) and the two codebases are intentionally allowed to diverge.

## Context

`Web/` is a single, mostly-static landing page (see [`../../Web/docs/page-scope.md`](../../Web/docs/page-scope.md) — hero, how-it-works, signals, CTA, footer) with one mocked lead-capture form. There is no auth, no dashboard, no per-user data, no signed-in flow.

The default for Monterro / InfuseAI sibling demos is Next.js everywhere. Choosing Astro here is a deliberate deviation.

## Why Astro

1. **Right tool for the job.** Astro ships almost no JavaScript to the browser for static content. A React framework rendering mostly-static HTML is overhead the user pays for on every page load.
2. **Performance as positioning.** CustomerCue pitches itself as an intelligence layer. The marketing page loading instantly with a perfect Lighthouse score is congruent with that pitch in a way a heavier framework can't quietly match.
3. **Workshop pedagogy.** This is a live agentic-development workshop demo. Showing "marketing site in Astro, app in a React framework" demonstrates real architectural judgement — pick the right tool, don't homogenise for its own sake.
4. **No shared-component pressure.** [`../conventions.md`](../conventions.md) already forbids cross-imports between `Web/` and `Saas/`. The codebases are independent. Stack divergence is consistent with that, not in conflict with it.

## Considered alternatives

- **Next.js App Router.** Rejected for this codebase: a React runtime for static content is overkill, and the workshop value of demonstrating stack divergence outweighs the familiarity benefit. Next.js remains the expected choice for `Saas/`.

## Consequences

- Components in `Web/` are `.astro` files, not React. Interactive bits (the CTA form, anything client-side) use Astro islands with whatever framework fits — React acceptable, but not required.
- No shared component library between `Web/` and `Saas/`. If we later want to share design tokens (colours, typography, spacing), share them as a Tailwind config or CSS variable file — not as React components.
- The team carries two mental models (Astro + whatever `Saas/` lands on). Acceptable cost given the scope of each codebase.
