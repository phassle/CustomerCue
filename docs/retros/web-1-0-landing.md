# Retro — Web 1.0 landing page (PRD #1)

Per-PRD retro for the marketing landing page build. One file per PRD; per-slice findings are sections inside.

> **For agents picking up any slice on this PRD: read this file before starting.** It lists the time-sinks earlier slices already paid for so you don't repeat them.

> This file is owned by Claude Code (host agent). Sandcastle agents do not edit it — Claude Code writes findings after observing the Sandcastle session.

## Cross-cutting lessons (apply to every remaining slice)

### Playwright system libs are missing in the Sandcastle Docker image

**What bit us (Issue #2, implementer run).** After Astro/Tailwind/Vitest came up cleanly (~15 commands), the agent spent ~60 commands fighting Playwright. Browsers were cached at `~/.cache/ms-playwright/` but Chromium needed ~20 system libs the image does not ship: `libnss3`, `libnspr4`, `libatk1.0-0`, `libatk-bridge2.0-0`, `libdbus-1-3`, `libcups2`, `libxkbcommon0`, `libasound2`, `libgbm1`, `libxcomposite1`, `libxdamage1`, `libxfixes3`, `libxrandr2`, `libatspi2.0-0`, `libdrm2`, `libwayland-server0`, `libXi6`, `libavahi-common3`, `libavahi-client3`. `npx playwright install --with-deps` failed (no sudo, apt-get unauthorised).

**The workaround the implementer landed.** Hand-downloaded individual `.deb` packages from `deb.debian.org/debian/pool/main`, extracted with `ar x` + `tar`, copied `.so` files into `/tmp/pw-libs/libs/combined/`, then ran tests with `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LD_LIBRARY_PATH=/tmp/pw-libs/libs/combined:...`. **This is fragile**: `/tmp/pw-libs/` is ephemeral and vanishes on container restart. Any subsequent Sandcastle run that depends on `npm run test:e2e` will hit the wall again unless one of the durable fixes below is applied first.

**Durable fixes — pick one before the next E2E-touching slice (#4, #5, #6, #9, #10, #11):**

1. **Switch the Playwright config to WebKit.** The implementer log (line 60) confirms WebKit has **zero missing system libs** in the image as-shipped. This is the lowest-friction change: edit `Web/playwright.config.ts` to add `{ name: 'webkit', use: { ...devices['Desktop Safari'] } }` and drop Chromium. Costs: one slightly different rendering engine on the smoke path; acceptable for the workshop demo where the goal is "the flow works," not "tested against Chrome's quirks."
2. **Add the missing `.deb` libs to the Sandcastle base image** so `npx playwright install --with-deps chromium` succeeds. Requires editing the Sandcastle harness, not just the project. Higher leverage but blocks until the image rebuild lands.
3. **Bake a prepared `/opt/pw-libs/` into the image** (not `/tmp`) with the 20 libs the implementer collected, plus an `.envrc` that sets `LD_LIBRARY_PATH`. Salvages the existing workaround by making it persistent. Ugly but cheap.

**Recommended for the next slice:** option 1 (switch to WebKit). It's a one-file change in `Web/playwright.config.ts`, removes the LD_LIBRARY_PATH dependency, and unblocks every E2E test in slices #4–#11.

**Status:** Applied on the feature branch on 2026-05-11. `Web/playwright.config.ts` now uses WebKit; `Web/AGENTS.md` reflects the choice and updates the install command to `npx playwright install webkit`. Subsequent slices should not see this issue. The `npm run test:e2e` script in `Web/package.json` was already clean (the `/tmp/pw-libs` `LD_LIBRARY_PATH` hack was only in the implementer's shell, not committed).

### Reviewer agent ran out of budget on cold containers (Issue #2, reviewer run)

The reviewer log was 16 lines. It got through `git log`, `git diff`, started `npm install` — and the log truncated mid-install. The reviewer never reached the actual code-review phase. Implementer work landed without review.

**Update from #3 and #7 reviewers:** both ran cleanly in 1 iteration each (#3 moved `global.css` import to Layout; #7 reordered a null-guard before a cast). The cold-container cost only bit issue #2 because it scaffolded `node_modules` from scratch. Subsequent slices benefit from a warm package cache. **Mitigation:** leave as-is for now; only revisit if a future slice introduces another huge dependency tree.

### Astro Container API requires Node, not happy-dom (Issue #3)

Component tests using `experimental_AstroContainer` need a Node-like environment. With `happy-dom` set as the Vitest env, Astro detects "browser-like" and the Container API misbehaves. Fix: `Web/vitest.config.ts` imports `getViteConfig` from `astro/config` so Vitest inherits Astro's Vite config and treats `.astro` files correctly. Issue #3's implementer landed this fix already — subsequent component-test slices (#4, #5, #6, #8, #9, #10) inherit it for free. Do not re-introduce a pure-`happy-dom` Vitest config for component tests.

### Astro 6 changed two integration points worth knowing (Issues #2, #7)

- `@astrojs/tailwind` does not support Astro 6 — use `@tailwindcss/vite` (Tailwind v4's official Vite plugin) directly. Already done in #2.
- Astro 6 removed `output: "hybrid"` mode. Per-route server rendering now uses `export const prerender = false;` inside the route module, with `output: "static"` retained as the default. Already done in #7's `Web/src/pages/api/lead.ts`. Future API-route slices inherit this pattern.

## Per-issue findings

### Issue #2 — Scaffold Astro + Tailwind + Vitest + Playwright at /

- **Status:** implementer COMPLETE; reviewer incomplete (see cross-cutting lesson above).
- **Branch:** `sandcastle/issue-2-scaffold-astro`.
- **Time profile (rough, by command count):** scaffold ~15 cmds, Playwright workaround ~60 cmds, verification + commit ~20 cmds. Playwright was the dominant cost.
- **Decisions landed:** Astro 6.3, Tailwind CSS 4.3 via `@tailwindcss/vite` (the `@astrojs/tailwind` integration doesn't support Astro 6), Vitest 4.1 + happy-dom, Playwright 1.59 with Chromium (see Playwright lesson — should be switched to WebKit), static export to Vercel/Cloudflare Pages, no island framework yet (add Preact when forms land in #9/#10).
- **What went well:** correct stack decisions; clean separation between unit and E2E test config; `Web/.gitignore` added; `Web/AGENTS.md` populated end-to-end (commands, stack table, test stack); committed with referenced PRD #1 and `fixes #2`.
- **What to watch on review:** test:e2e script likely embeds the `/tmp/pw-libs/` `LD_LIBRARY_PATH` — confirm before merging that the committed command works on a fresh container, or apply the WebKit switch. Verified after the fact: `package.json` was actually clean; the LD_LIBRARY_PATH hack only lived in the implementer's shell.

### Issue #3 — Brand chrome: Layout, design tokens, Wordmark

- **Status:** implementer + reviewer both COMPLETE; merged into `feature/web-1-0` (commits `074856b` implementer, `f4717fb` reviewer).
- **Time profile:** ~50 commands implementer, ~15 reviewer. Playwright wall cost ~15 commands before implementer gave up trying to run E2E (committed the test without executing it).
- **Decisions landed:** background `#0B0F1A`, foreground `#F0F0F2`, accent `#D4763C` (warm copper), muted `#7A7D85`; type pairing Plus Jakarta Sans / Inter / JetBrains Mono via Google Fonts; spacing scale 0.25rem; Wordmark splits "Customer" + "Cue" with accent colour on "Cue"; tokens in Tailwind v4 `@theme` block in `global.css`.
- **What went well:** disciplined TDD (RED → GREEN → REFACTOR); reviewer caught a real issue (global.css imported in `index.astro` not `Layout.astro` — moved); discovered and fixed the Container API / happy-dom collision via `getViteConfig`.
- **What went badly:** repeated the Playwright wall that #2 already paid for, because the retro pointer wasn't on the issue and AGENTS.md was not pulled into context. Validates the planner-level architecture.

### Issue #7 — Lead capture mock API: POST /api/lead

- **Status:** implementer + reviewer both COMPLETE; merged into `feature/web-1-0` (commits `0e1e8bd` implementer, `1f948e2` reviewer).
- **Time profile:** ~35 commands implementer, ~25 reviewer. No Playwright involvement.
- **Decisions landed:** `@astrojs/node` adapter added; `output: "static"` with `export const prerender = false;` on the API route (Astro 6 dropped `hybrid`); validation logic in `Web/src/lib/lead-capture.ts`; 22 unit tests covering valid demo, valid conversations, unique ids, missing/invalid fields, non-POST → 405.
- **What went well:** clean TDD pass; reviewer found a subtle bug (premature `as Record<string, unknown>` cast in `validateLead`) and fixed the ordering so the type guard runs first.
- **What went badly:** initial config used Astro 5's `hybrid` mode and had to be reworked when typecheck flagged it. Time was small (~3 commands) but a future API-route slice should know `prerender = false` is the Astro 6 pattern.

## In flight (current Sandcastle session)

As of 2026-05-11 ~01:30 UTC: Sandcastle is running issues #4, #5, #6, #8 in parallel. The WebKit fix was pushed to `origin/feature/web-1-0` at commit `1184502`. Agents that started before that commit will still ship Chromium-config-based E2E and likely hit the wall again; agents that pulled after will inherit WebKit. Read their logs after they stop and update this retro accordingly.

## What went well (running list)

- Astro / Tailwind / Vitest scaffolded cleanly with one round-trip each.
- Sandcastle followed the PRD vocabulary (PRD #1 reference, slice issue closes via `fixes #2`).
- TDD discipline held across slices (#3, #7 both wrote tests first).
- Reviewers caught real issues on #3 and #7 (global.css placement, premature cast).

## What went badly (running list)

- Playwright system libs (see cross-cutting lesson) — bit #2 and #3 both; fixed at the host level by switching to WebKit on 2026-05-11.
- Reviewer cold-start cost (see cross-cutting lesson) — only bit #2; #3 and #7 reviewers ran cleanly.
- `Co-Authored-By` line on Sandcastle commits credits `Claude Opus 4.6`, not 4.7 — flag if retro needs to compare across model versions.
- The retro pointer in AGENTS.md was NOT pulled into Sandcastle's context on issue #3, even though the file existed at commit time. Auto-loaded `CLAUDE.md` symlinks did not propagate to Sandcastle either. **Conclusion: passive "read on demand" pointers don't work for Sandcastle — the planner must encode lessons into specs/code at planning time.**

## Lessons for the next PRD

_(Populated once this PRD's build is fully done.)_
