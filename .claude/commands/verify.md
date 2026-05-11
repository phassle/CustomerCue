---
description: Run every check on the current branch — typecheck, unit tests, build, E2E — and report a single verdict.
---

# /verify

Run **all** checks on `Web/`:

1. `npm --prefix Web run typecheck` — `astro check`
2. `npm --prefix Web run test` — Vitest unit + component tests
3. `npm --prefix Web run build` — static export with the one server-rendered route
4. `npm --prefix Web run test:e2e` — Playwright (Chromium) — re-uses an existing dev server on `:4321` if one is up; otherwise Playwright starts one via its `webServer` config

Run **1, 2, and 3 in parallel** (single message, three Bash tool calls). They are independent. Then run **4 sequentially** afterwards — E2E should not race with build for the dev port.

For each check, report: ✓ pass / ✗ fail, the wall-clock duration, and a one-line summary (test counts / error counts / build size). If any check fails, paste the last ~20 lines of its output so the failure is actionable. If everything passes, finish with a single line: `verify: all green (typecheck N | unit N/N | build ✓ | e2e N/N).`

If `Saas/` ever grows a test runner, extend this command to run those checks too — but only if `Saas/package.json` exists; do not invent tests.
