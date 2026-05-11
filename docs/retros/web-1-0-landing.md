# Retro — Web 1.0 landing page (PRD #1)

Per-PRD retro for the marketing landing page build. One file per PRD; per-slice findings are sections inside.

> **For agents picking up any slice on this PRD: read this file before starting.** It lists the time-sinks earlier slices already paid for so you don't repeat them.

> This file is owned by Claude Code (host agent). Sandcastle agents do not edit it — Claude Code writes findings after observing the Sandcastle session.

## Cross-cutting lessons (apply to every remaining slice)

### Playwright system libs are missing in the Sandcastle Docker image

**What bit us (Issue #2 implementer).** After Astro/Tailwind/Vitest came up cleanly (~15 commands), the agent spent ~60 commands fighting Playwright. Browsers were cached at `~/.cache/ms-playwright/` but the image is missing the system libraries every browser binary links against. `npx playwright install --with-deps` failed (no sudo, apt-get unauthorised).

**The non-durable workaround #2 landed.** Hand-downloaded individual `.deb` packages from `deb.debian.org/debian/pool/main`, extracted with `ar x` + `tar`, copied `.so` files into `/tmp/pw-libs/libs/combined/`, then ran tests with `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LD_LIBRARY_PATH=/tmp/pw-libs/libs/combined:...`. `/tmp/pw-libs/` was ephemeral — gone on container restart.

**What we tried in between.** Issue #2's log claimed WebKit had **zero missing libs** on the image, so the host (Claude Code) committed a `playwright.config.ts` switch to WebKit at commit `1184502`. This proved wrong for Playwright 1.59: WebKit still wants `libatk-1.0.so.0` and ~30 others. The "WebKit clean" claim was only true for the version installed at the time of issue #2; the version drift between #2 and #11 invalidated it.

**The durable fix that actually landed (Issue #11).** `playwright.config.ts` is back on Chromium (the linter-applied AGENTS.md update reflects this). The agent extracted 13 `.deb` packages — the minimum subset Chromium Headless Shell needs — into a persistent location, set `LD_LIBRARY_PATH`, and added `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` to the test invocation. `Web/AGENTS.md` documents the install line.

**Lesson, restated correctly:** Playwright in this Sandcastle image needs out-of-band system libs no matter which browser is chosen. Chromium Headless Shell has the smallest missing-lib set. The right long-term fix is **baking the 13 libs into the Sandcastle base image**, not solving it inside the project repeatedly. Until that lands, every E2E-touching slice will pay some setup cost.

### Reviewer agent ran out of budget on cold containers (Issue #2 only)

The Issue #2 reviewer log was 16 lines and truncated mid-`npm install`; review never happened. Issues #3, #5, #7, #8, #9, #10, #11 all had reviewers that ran cleanly in 1 iteration and committed real refactors (global.css placement, premature cast, focus-ring constant, switch-instead-of-if-chain, etc.). The cold-container cost only bit the first slice.

### Astro Container API requires Node, not happy-dom (Issue #3, #9)

Component tests using `experimental_AstroContainer` need a Node-like environment. With `happy-dom` set as the Vitest env, Astro detects "browser-like" and the Container API misbehaves. Fix: `Web/vitest.config.ts` uses `getViteConfig` from `astro/config` so Vitest inherits Astro's Vite config and treats `.astro` files correctly. Component test files using Container API put `// @vitest-environment node` at the top. Issue #3 landed the config fix; every later slice inherited it. Issue #9 hit a follow-on: Preact island tests using `<CtaSection>` needed a Preact server renderer added to the container — implementer landed a mock renderer since the test only asserts on static markup.

### Astro 6 differences worth knowing upfront (Issues #2, #7)

- `@astrojs/tailwind` does not support Astro 6 — use `@tailwindcss/vite` (Tailwind v4's official Vite plugin) directly. Issue #2 hit this on the first try.
- Astro 6 removed `output: "hybrid"`. Per-route server rendering now uses `export const prerender = false;` inside the route module, with `output: "static"` as the default and an adapter installed for any opted-in routes. Issue #7 hit this and reworked the config.

### `@testing-library/preact` accessible-name doubles when `<label for>` + `name=` both exist (Issue #9)

Querying `getByLabelText("Name")` matched the same input via two paths (label `for` attribute + input `name` attribute); `getByRole` then read the accessible name as `"Name Name"`. **Workaround:** query by `id` directly (`document.getByElementId(...)`), accept the slight loss of "test the role" purity. Tests still drive real DOM events.

## Per-issue findings

### Issue #2 — Scaffold Astro + Tailwind + Vitest + Playwright at /

- **Status:** implementer COMPLETE; reviewer incomplete.
- **Time profile (rough, by command count):** scaffold ~15, Playwright workaround ~60, verification + commit ~20. Playwright was the dominant cost.
- **Decisions landed:** Astro 6.3, Tailwind CSS 4.3 via `@tailwindcss/vite`, Vitest 4.1 + happy-dom, Playwright 1.59 Chromium, static export to Vercel/Cloudflare Pages, no island framework yet.

### Issue #3 — Brand chrome: Layout, design tokens, Wordmark

- **Status:** implementer + reviewer both COMPLETE.
- **Time profile:** ~50 implementer, ~15 reviewer. Playwright wall cost ~15 commands before implementer gave up and committed the E2E test without running it.
- **Decisions landed:** bg `#0B0F1A`, fg `#F0F0F2`, accent `#D4763C`, muted `#7A7D85`; Plus Jakarta Sans / Inter / JetBrains Mono via Google Fonts; spacing 0.25rem; wordmark splits "Customer" + "Cue" with accent on "Cue"; tokens in Tailwind v4 `@theme` block.
- **Discovered Container API / happy-dom collision and fixed it (`getViteConfig`).** Subsequent slices inherited the fix.
- **Reviewer caught:** `global.css` imported in `index.astro` instead of `Layout.astro` — moved.

### Issue #4 — SignalsGrid + signalCatalog with 10 canonical names

- **Status:** implementer + reviewer both COMPLETE.
- **Time profile:** ~25 commands implementer, clean TDD pass.
- **What went well:** disciplined RGR; all 10 canonical names verbatim; `Signal = { name }` interface stayed minimal per spec.
- **No Playwright cost** — implementer wrote E2E and skipped running per retro.
- **Reviewer:** light pass, no significant changes.

### Issue #5 — Hero section

- **Status:** implementer + reviewer both COMPLETE.
- **Time profile:** ~20 commands implementer, fast pass.
- **Decisions landed:** verbatim tagline, sub-positioning naming Intercom/Zendesk + ICP, primary CTA `bg-accent`, secondary CTA outline, both anchor to `#cta`, focus rings on both.
- **Reviewer:** deduplicated AstroContainer setup using `beforeAll` — first slice to introduce this pattern; later refactors of Footer/SignalsGrid tests follow it.

### Issue #6 — HowItWorks section with three fictional example cards

- **Status:** implementer + reviewer both COMPLETE.
- **Time profile:** ~30 commands. Created the parallel `data/signal-catalog.ts` that later got consolidated into `lib/` in the /simplify pass.
- **Decisions landed:** `ExampleOutput` type enforces `fictional: true` as non-optional literal; metric values render in `font-mono` (JetBrains Mono); 4-step flow; `EXAMPLE — fictional` label on every card.
- **Reviewer:** derived step numbers from index, fixed test setup ordering.

### Issue #7 — Lead capture mock API: POST /api/lead

- **Status:** implementer + reviewer both COMPLETE.
- **Time profile:** ~35 implementer, ~25 reviewer. No Playwright involvement.
- **Decisions landed:** `@astrojs/node` adapter; `output: "static"` with `prerender = false` on the API route; validation in `lib/lead-capture.ts`; 22 unit tests.
- **Astro 6 surprise:** initial config used `hybrid`; typecheck flagged it; reworked to `prerender = false` (~3 commands).
- **Reviewer:** guard-before-cast refactor on `validateLead` (premature `as Record` cast).

### Issue #8 — Footer

- **Status:** implementer + reviewer both COMPLETE.
- **Time profile:** ~25 commands. Trivial scope (no interactivity).
- **Decisions landed:** four-column grid (Product/Company/Legal/Contact), `text-muted` token throughout, year computed from `Date`, no social/newsletter/fake address.
- **Per spec, ships `href="#"` placeholders** for About/Privacy/Terms. /simplify pass flagged these as workshop-credibility risk but accepted them as spec-locked.

### Issue #9 — CtaSection + DemoRequestForm island

- **Status:** implementer + reviewer both COMPLETE.
- **Time profile:** ~80 commands implementer — heaviest of any slice. Most of that on Preact integration (AstroContainer + Preact renderer for tests) and on `@testing-library/preact` accessible-name doubling (see cross-cutting lesson).
- **Decisions landed:** Preact via `@astrojs/preact`, `jsxImportSource: "preact"` in tsconfig; `DemoRequestForm` is a Preact island with `client:visible`; form state machine idle → pending → success/error; success replaces form with reference id; error keeps form editable.
- **Reviewer:** hoisted `INPUT_CLASS` constant — first hoist that the /simplify pass later generalised to FOCUS_RING_ACCENT.

### Issue #10 — ConversationsUploadForm island

- **Status:** implementer + reviewer both COMPLETE.
- **Time profile:** ~25 commands. Most of the pattern was already laid down by #9 (Preact island, form state machine, fetch to `/api/lead`).
- **Decisions landed:** "what's expected" block above the form; submit disabled until file selected; payload sends `fileMeta` only, not file bytes; success says "Got it — report inbound within 48 hours."
- **Took it from concept to merged via fast-forward** in one Sandcastle pass; the cleanest slice in the PRD.

### Issue #11 — Accessibility + performance + keyboard E2E

- **Status:** implementer + reviewer both COMPLETE.
- **Time profile:** ~150 commands implementer — largest log of any slice (~35KB). Most of it on Playwright system libs.
- **Decisions landed:** `@axe-core/playwright` integrated, axe scan asserts zero critical violations on `/`; `aria-live` regions on form success/error; `id="signals"` on SignalsGrid for footer anchor; cache-control `<meta http-equiv>` tags in Layout; full keyboard E2E (tab + Enter through entire page + form submission); page-load-under-2s assertion.
- **Reverted the WebKit switch** (it didn't work in Playwright 1.59) and landed the durable `.deb` extraction approach for Chromium Headless Shell. Updated `Web/AGENTS.md` accordingly.
- **Reviewer:** extracted `LINK_CLASS` constant in Footer; replaced if/else chain with switch in keyboard E2E; tightened landmark assertions to `getByRole`.

## Post-Sandcastle host work

After all 10 slices merged, the host (Claude Code) ran a `/simplify` pass that:

- Consolidated the duplicate `signal-catalog` modules (`data/` + `lib/` → just `lib/`).
- Extracted shared form helpers (`submitLead`, `FormState`, `INPUT_CLASS`, `FOCUS_RING_ACCENT`, `<SuccessCard>`, `<ErrorAlert>`) — net ~60 LOC removed from the two form islands.
- Added `Allow: POST` header to the 405 response.
- Reconciled `astro.config.mjs` with `Web/AGENTS.md` (truthful "static + one server-rendered route" framing).
- Promoted Hero tagline to `<h1>`; dropped sr-only `<h1>` that screen readers were announcing before the tagline.
- Deduped AstroContainer boots in `Footer.test.ts` and `SignalsGrid.test.ts` via `beforeAll`.

Verified via `/verify`: typecheck clean, 95/95 unit, 16/16 E2E (Chromium), build succeeds.

## What went well

- Astro / Tailwind / Vitest scaffolded cleanly with one round-trip each (issue #2 first slice).
- TDD discipline held across every slice (RED → GREEN → REFACTOR).
- Reviewers caught real issues whenever the container was warm (#3, #5, #6, #7, #8, #9, #10, #11).
- Merger agent did the right thing on fast-forward and trivial 3-way merges; `index.astro` conflicts (4 slices touched it) resolved by including all imports.
- Per-PRD retro infrastructure proved its value: planner reads it; lessons get encoded into specs and code, not banner notes on issues.

## What went badly

- **Passive `AGENTS.md` / `CLAUDE.md` pointers don't propagate to Sandcastle.** Issue #3 re-paid #2's Playwright cost despite the retro existing. Fixed architecturally via planner-reads-retro (`.claude/skills/to-issues/SKILL.md` step 2.5) and by committing durable fixes (WebKit, then Chromium Headless Shell) to the feature branch.
- **The WebKit "zero missing libs" claim was wrong** for Playwright 1.59. The host (this agent) committed the WebKit switch in good faith based on issue #2's log; issue #11 had to reverse it. Always re-verify retro claims against the current state before acting on them.
- **`Co-Authored-By` line on every Sandcastle commit credits `Claude Opus 4.6`,** not 4.7. Document for traceability — implementer agents are running a different model than the host.
- **Parallel slices that touch shared files merge with conflicts.** Issues #4, #5, #6, #8 all edited `Web/src/pages/index.astro`; the merger resolved each. Plan slice file disjointness more carefully next time.

## Lessons for the next PRD

Distilled directives for the planner and executors of the next PRD on this codebase.

### Planning

1. **Read every `docs/retros/*.md` before drafting slices.** Encode lessons directly into slice specs AND committed code on the feature branch. Sandcastle does not pull `AGENTS.md` or `CLAUDE.md` into context; do not rely on them as a propagation channel for executor-facing decisions.
2. **Slice for file disjointness.** Two slices that both edit `index.astro` (or any single file) will conflict at merge time. The merger can handle trivial 3-way merges, but it adds friction. When possible, design slices so each owns its own files end-to-end.
3. **Scaffold-first.** Put all test infra, design tokens, and integration-layer decisions in the first slice (#2 here). Subsequent slices inherit the idiom for free. If a future PRD needs different infra, do not retrofit mid-PRD — open a new scaffold slice.

### Execution (infrastructure already known)

4. **Playwright in this Sandcastle image needs `.deb` library extraction.** `Web/AGENTS.md` documents the current install line; `playwright.config.ts` is on Chromium. Do not "fix" this by switching to WebKit — that path was tried and failed. The right durable fix is upstream: add the 13 libs to the Sandcastle Docker base image.
5. **Astro Container API + Preact tests:** use `// @vitest-environment node`, import `getViteConfig` from `astro/config` in `vitest.config.ts`, add a mock Preact server renderer to the container when an island appears in a test. Don't reintroduce a pure happy-dom config.
6. **Astro 6 patterns are committed.** `output: "static"` + `prerender = false` per route + `@astrojs/node` standalone adapter. `@tailwindcss/vite`, not `@astrojs/tailwind`.
7. **Form pattern is committed.** New forms should reuse `submitLead()` from `lib/lead-capture.ts` and the primitives in `components/form-primitives.tsx` (`FormState`, `INPUT_CLASS`, `FOCUS_RING_ACCENT`, `<SuccessCard>`, `<ErrorAlert>`). Don't re-derive.
8. **Signal taxonomy is one module:** `lib/signal-catalog.ts` (`SIGNAL_NAMES`, `SignalType`, `Signal`, `getAllSignals`). Don't add a parallel data module.

### Process

9. **Reviewer cold-start cost only bites the first slice.** Don't pre-warm `node_modules` in subsequent slice runs — let the merger's post-merge `npm install` carry the cost.
10. **`/verify` is the single test entrypoint.** Use it in the PR test plan and any CI hook. Do not enumerate per-check commands in PR bodies.
11. **End-of-session and before-branch-close retro updates are mandatory** (rule documented in root `AGENTS.md` § Per-PRD retros). This file is the artifact.
12. **The retro is fallible.** A claim made by an early implementer (here: WebKit "0 missing libs") can be invalidated by version drift. Verify before acting on a recommendation; update or correct the retro when you find a stale claim.
