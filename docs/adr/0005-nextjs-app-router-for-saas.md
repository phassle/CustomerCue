# Next.js App Router for the product app

**Date:** 2026-05-13
**Status:** accepted

## Decision

`Saas/` is built with **Next.js (App Router) + React + TypeScript + Tailwind v4 + shadcn**. SSR via the Node adapter — **not** static export. This is the counterpart to ADR 0001 (Astro for `Web/`); the two subprojects intentionally diverge.

## Context

`Saas/` is a workflow surface, not a marketing page: keyboard-driven Triage Inbox, account drilldown, paste-classify route that calls Claude server-side, mocked cookie sign-in. Decision crystallised in the `/grill-with-docs` pass on 2026-05-13. `Saas/AGENTS.md` and `Saas/README.md` already anticipated this stack as "_TBD_ — Next.js App Router + TS expected"; this ADR is the lock-in.

## Why Next.js App Router

1. **Server actions + API routes for the Anthropic key.** The paste-classify call must run server-only. App Router's server actions + `/app/api/*` route handlers give a clear place for it; `'use client'` boundaries make it hard to accidentally ship the key.
2. **shadcn ecosystem.** shadcn-ui has first-class Next.js + Tailwind v4 templates. Astro / Remix integrations exist but are bespoke.
3. **Workshop pedagogy.** Pairing Astro for `Web/` with Next.js for `Saas/` demonstrates the same "right tool for each job" judgement ADR 0001 already commits to. Homogenising on either framework would undercut both ADRs.

## Considered alternatives

- **Astro everywhere.** Rejected: an island-heavy interactive app loses Astro's static-first advantage and ends up React-everywhere with extra ceremony.
- **Remix.** Rejected: loader/action model maps cleanly to signal-queue interactions, but no first-class shadcn-Remix template and smaller ecosystem than App Router.
- **Next.js Pages Router.** Rejected: App Router is where current shadcn / Tailwind v4 / server-action documentation lives.
- **Static export.** Rejected: the paste-classify route is dynamic by definition. Static export is incompatible as long as the Anthropic call lives inside the app.

## Consequences

- `Saas/` ships SSR via `@next` + Node adapter. Deploy targets: Vercel, Railway, Render. Pure-static hosts (Cloudflare Pages without Functions, GitHub Pages) are out.
- Tailwind v4 is the target. Verify shadcn-on-v4 compatibility at scaffold time; if v4 isn't ready, drop to Tailwind 3.4 with a note in `Saas/AGENTS.md`. `Web/` is already on Tailwind 4.3 so v4 is the reasonable shared bet.
- No shared component library with `Web/` (already forbidden by `docs/conventions.md`; not changed by this choice). Shared design tokens, if ever needed, ship as Tailwind config or CSS variables — not as React components.
- Exact versions land in `Saas/AGENTS.md` once `npx create-next-app` runs. This ADR records the family choice, not the pinned versions.
