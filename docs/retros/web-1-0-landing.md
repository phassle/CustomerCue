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

### Reviewer agent ran out of budget on cold containers (Issue #2, reviewer run)

The reviewer log was 16 lines. It got through `git log`, `git diff`, started `npm install` — and the log truncated mid-install. The reviewer never reached the actual code-review phase. Implementer work landed without review.

**Mitigation for next slice:** either pre-warm `node_modules` in the Sandcastle image so reviewers don't pay install cost on every run, or raise the reviewer iteration budget, or both. Until that's fixed, the host (Claude Code) should re-run a manual code review on the implementer branch before merge.

## Per-issue findings

### Issue #2 — Scaffold Astro + Tailwind + Vitest + Playwright at /

- **Status:** implementer COMPLETE; reviewer incomplete (see cross-cutting lesson above).
- **Branch:** `sandcastle/issue-2-scaffold-astro`.
- **Time profile (rough, by command count):** scaffold ~15 cmds, Playwright workaround ~60 cmds, verification + commit ~20 cmds. Playwright was the dominant cost.
- **Decisions landed:** Astro 6.3, Tailwind CSS 4.3 via `@tailwindcss/vite` (the `@astrojs/tailwind` integration doesn't support Astro 6), Vitest 4.1 + happy-dom, Playwright 1.59 with Chromium (see Playwright lesson — should be switched to WebKit), static export to Vercel/Cloudflare Pages, no island framework yet (add Preact when forms land in #9/#10).
- **What went well:** correct stack decisions; clean separation between unit and E2E test config; `Web/.gitignore` added; `Web/AGENTS.md` populated end-to-end (commands, stack table, test stack); committed with referenced PRD #1 and `fixes #2`.
- **What to watch on review:** test:e2e script likely embeds the `/tmp/pw-libs/` `LD_LIBRARY_PATH` — confirm before merging that the committed command works on a fresh container, or apply the WebKit switch.

## What went well (running list)

- Astro / Tailwind / Vitest scaffolded cleanly with one round-trip each.
- Sandcastle followed the PRD vocabulary (PRD #1 reference, slice issue closes via `fixes #2`).

## What went badly (running list)

- Playwright system libs (see cross-cutting lesson).
- Reviewer cold-start cost (see cross-cutting lesson).
- `Co-Authored-By` line on the implementer's commit credits `Claude Opus 4.6`, not 4.7 — flag if retro needs to compare across model versions.

## Lessons for the next PRD

_(Populated once this PRD's build is fully done.)_
