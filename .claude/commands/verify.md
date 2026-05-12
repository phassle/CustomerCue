---
description: Run every check on the current branch — typecheck, unit tests, build, E2E, Lighthouse — and report a single verdict.
---

# /verify

Run **all** checks on `Web/`:

1. `npm --prefix Web run typecheck` — `astro check`
2. `npm --prefix Web run test` — Vitest unit + component tests
3. `npm --prefix Web run build` — static export with the one server-rendered route
4. `npm --prefix Web run test:e2e` — Playwright (Chromium) — re-uses an existing dev server on `:4321` if one is up; otherwise Playwright starts one via its `webServer` config
5. **Lighthouse spot-check against the production preview build.** Kill anything on `:4321`, then `npm --prefix Web run preview` in the background, wait until `curl :4321/` responds, then `npx --yes lighthouse http://localhost:4321 --only-categories=accessibility,performance --output=json --output-path=/tmp/lh.json --chrome-flags="--headless=new --no-sandbox" --quiet`. Parse the JSON with `jq` to pull accessibility, performance, FCP, LCP, CLS, TBT, and `color-contrast` audit status. Kill the preview server (`kill $(lsof -ti:4321)`) before reporting.

Run **1, 2, and 3 in parallel** (single message, three Bash tool calls). They are independent. Then run **4 sequentially** afterwards — E2E should not race with build for the dev port. Then run **5 sequentially** after E2E — Lighthouse needs port `:4321` exclusively for the prod preview build.

For each check, report: ✓ pass / ✗ fail, the wall-clock duration, and a one-line summary (test counts / error counts / build size / Lighthouse scores). If any check fails, paste the last ~20 lines of its output so the failure is actionable. If everything passes, finish with a single line: `verify: all green (typecheck N | unit N/N | build ✓ | e2e N/N | lighthouse a11y X.XX perf X.XX).`

If `Saas/` ever grows a test runner, extend this command to run those checks too — but only if `Saas/package.json` exists; do not invent tests.

## What each step catches that the others don't

- **Typecheck (1)** — type errors, deprecated-API hints. Does not catch runtime bugs.
- **Unit (2)** — component behaviour and pure-data invariants. Drives real fixtures, not mocks. Does not catch render-order or hydration issues.
- **Build (3)** — module-resolution and SSR-rendering breakage that only shows up in the production pipeline.
- **E2E (4)** — real-flow correctness in a real browser. Includes axe-core a11y scans on specific sections (passes contrast checks that axe's default rule set inspects, which is **narrower than Lighthouse's**).
- **Lighthouse (5)** — broader a11y audits (notably **color-contrast across the whole page**, which axe in E2E missed during PR #29 — two violations in the footer survived all four prior steps), plus realistic FCP/LCP/CLS/TBT on the production build. **Dev-server perf numbers are meaningless** (unminified JS, no render-blocking optimisations) — always run Lighthouse against `preview`, never against `dev`.

## Lessons baked in (don't re-derive)

- **Lighthouse against `dev` is not representative.** During PR #29 the dev-server Lighthouse reported perf 0.58 / LCP 9.6s. The production preview reported perf 0.91 / LCP 2.7s. Always build + preview before Lighthouse, never assume the dev server numbers mean anything.
- **axe (E2E) and Lighthouse disagree on a11y coverage.** axe's default rule set in `@axe-core/playwright` skips some contrast checks Lighthouse runs. If E2E a11y passes but you haven't run Lighthouse, contrast misses can ship. Run both.
- **Hydration waits that target `astro-island[0]` are fragile.** DOM order changes when sections are added or removed (PR #29 broke the demo-form keyboard E2E this way). When a test needs to wait for a specific island to hydrate, walk up from a known element inside it (`element.closest("astro-island")`), don't index by position.
- **Free port `:4321` between dev and preview.** Astro `dev` and `preview` both default to `:4321`. The verify run can leave a dev server running between steps 4 and 5. Always `kill $(lsof -ti:4321)` before starting `preview`.
