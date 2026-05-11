# AGENTS — Web

Public marketing site for **CustomerCue**. A single focused landing page — hero, how-it-works, signals, CTA, footer. No signed-in experience (that's `../Saas/`). Page scope locked in [`docs/page-scope.md`](./docs/page-scope.md).

## Stack

| | |
|---|---|
| Framework | **Astro 6.3** — static-first delivery. See [`../docs/adr/0001-astro-for-web.md`](../docs/adr/0001-astro-for-web.md). |
| Styling | **Tailwind CSS 4.3** via `@tailwindcss/vite` |
| Island framework | **Preact** via `@astrojs/preact` — used for interactive form islands (`DemoRequestForm`, `ConversationsUploadForm`). `tsconfig.json` sets `jsxImportSource: "preact"`. |
| Hosting | **Static with one server-rendered route.** `output: "static"` + `@astrojs/node` (standalone mode); `/api/lead` opts in to server rendering via `export const prerender = false;`. Deploy to any Node-capable host (Vercel, Railway, Render). A pure-static target like Cloudflare Pages would 404 on form submission unless the API route is moved to the host's serverless platform. |
| Test — unit | **Vitest 4.1** + **happy-dom** for DOM environment |
| Test — E2E | **Playwright 1.59** (Chromium Headless Shell) — switched from WebKit which had missing system libs (`libatk-1.0.so.0` etc.) in newer Playwright versions. Chromium Headless Shell's deps can be resolved via manual `.deb` extraction (see `docs/retros/web-1-0-landing.md`). |
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

Playwright requires browser binaries: `npx playwright install chromium`. On the Sandcastle Docker image, Chromium Headless Shell also needs ~13 system libs extracted from `.deb` packages into an `LD_LIBRARY_PATH` directory (see retro for the full list).

## Cache strategy

HTML pages use `<meta http-equiv>` cache-busting headers (`Cache-Control: no-cache, no-store, must-revalidate`, `Pragma: no-cache`, `Expires: 0`). These prevent browsers and CDN edge nodes from serving stale HTML after a redeploy. Static assets (JS/CSS/images) are fingerprinted by Astro's build pipeline and can be cached indefinitely by the hosting platform (Vercel / Cloudflare Pages handle this automatically via their default immutable-asset caching).

## Performance baseline

Measured on the Sandcastle Docker image (dev server, not production build). These are informational baselines — the build does not gate on them.

| Metric | Value | Notes |
|---|---|---|
| Page load (dev, CI) | < 2 s | Asserted in E2E test (`e2e/performance.spec.ts`) |
| LCP (fast-3G) | TBD | Measure after first production deploy; PRD stretch target is < 1 s |
| CLS | TBD | Measure after first production deploy |
| TTI (fast-3G) | TBD | Informational — document after first production deploy |

Production numbers require a deployed build + Lighthouse or WebPageTest run. The dev server is not representative for LCP/CLS/TTI.

## Read these on demand

- [`docs/page-scope.md`](./docs/page-scope.md) — page-level scope and CTA hierarchy
- [`docs/design-system.md`](./docs/design-system.md) — editorial-analytical visual direction and tokens
- [`../docs/signals.md`](../docs/signals.md) — canonical signal taxonomy (use names verbatim in copy)
- [`../docs/conventions.md`](../docs/conventions.md) — mocked-data and vocabulary rules
- [`../docs/stop-rules.md`](../docs/stop-rules.md) — when to ask before acting
- [`../docs/adr/`](../docs/adr/) — Astro choice (0001), visual direction (0002)
- [`../brief.md`](../brief.md) — positioning, ICP, differentiation copy
- [`../docs/retros/web-1-0-landing.md`](../docs/retros/web-1-0-landing.md) — **read before starting any slice on this PRD**. Lists Playwright system-lib gotchas and other time-sinks earlier slices already paid for. See [`../AGENTS.md`](../AGENTS.md) § Per-PRD retros for the full rule.
