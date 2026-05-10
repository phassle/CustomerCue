# AGENTS — Web

Public marketing site for **CustomerCue**. A single focused landing page — hero, how-it-works, signals, CTA, footer. No signed-in experience (that's `../Saas/`). Page scope locked in [`docs/page-scope.md`](./docs/page-scope.md).

## Stack

| | |
|---|---|
| Framework | **Astro 6.3** — static-first delivery. See [`../docs/adr/0001-astro-for-web.md`](../docs/adr/0001-astro-for-web.md). |
| Styling | **Tailwind CSS 4.3** via `@tailwindcss/vite` |
| Island framework | None yet — vanilla Astro components. Add Preact when interactive islands (forms) land. |
| Hosting | **Static export** (`output: "static"` in astro.config). Deploy to Vercel or Cloudflare Pages. |
| Test — unit | **Vitest 4.1** + **happy-dom** for DOM environment |
| Test — E2E | **Playwright 1.59** (Chromium) |
| TypeScript | **6.0** via `astro check` |

## Commands

```bash
npm install            # install dependencies
npm run dev            # start dev server at localhost:4321
npm run build          # static export to dist/
npm run preview        # preview production build
npm run typecheck      # astro check (TypeScript)
npm run test           # vitest run (unit tests)
npm run test:e2e       # playwright test (E2E, starts dev server automatically)
```

Playwright requires browser binaries: `npx playwright install --with-deps chromium`.

## Read these on demand

- [`docs/page-scope.md`](./docs/page-scope.md) — page-level scope and CTA hierarchy
- [`docs/design-system.md`](./docs/design-system.md) — editorial-analytical visual direction and tokens
- [`../docs/signals.md`](../docs/signals.md) — canonical signal taxonomy (use names verbatim in copy)
- [`../docs/conventions.md`](../docs/conventions.md) — mocked-data and vocabulary rules
- [`../docs/stop-rules.md`](../docs/stop-rules.md) — when to ask before acting
- [`../docs/adr/`](../docs/adr/) — Astro choice (0001), visual direction (0002)
- [`../brief.md`](../brief.md) — positioning, ICP, differentiation copy
- [`../Demo/retros/web-1-0-landing.md`](../Demo/retros/web-1-0-landing.md) — **read before starting any slice on this PRD**. Lists Playwright system-lib gotchas and other time-sinks earlier slices already paid for. See [`../AGENTS.md`](../AGENTS.md) § Per-PRD retros for the full rule.
