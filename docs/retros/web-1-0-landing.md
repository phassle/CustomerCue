# Retro — Web 1.0 landing page (PRD #1)

Per-PRD retro. Owned by Claude Code (host); Sandcastle agents read it before starting, do not edit it.

## Gotchas that bit us (and how they're resolved)

- **Playwright system libs missing in the Sandcastle Docker image.** Tried WebKit (issue #11 confirmed it needs ~30 libs including `libatk-1.0.so.0` in Playwright 1.59 — earlier "0 missing" claim from #2 was version-specific and wrong). Landed on **Chromium Headless Shell + 13-package `.deb` extraction + `LD_LIBRARY_PATH`**. `Web/AGENTS.md` + `playwright.config.ts` reflect this. Real long-term fix is upstream: bake the 13 libs into the Sandcastle base image.
- **Astro Container API + happy-dom collide.** Component tests need `// @vitest-environment node` and `getViteConfig` from `astro/config` in `vitest.config.ts`. Tests with Preact islands additionally need a mock Preact server renderer added to the container.
- **Astro 6 dropped `output: "hybrid"`** — use `output: "static"` + per-route `prerender = false` + adapter. **`@astrojs/tailwind` doesn't support Astro 6** — use `@tailwindcss/vite`.
- **`@testing-library/preact` doubles accessible names** when both `<label for>` and `name=` exist (renders as `"Name Name"`). Query by `id` instead of role.
- **Passive `AGENTS.md` / `CLAUDE.md` pointers don't reach Sandcastle.** Issue #3 re-paid #2's Playwright cost despite this retro existing. Fix: planner encodes lessons into slice specs AND commits durable code changes to the feature branch before the next executor runs. Codified in `.claude/skills/to-issues/SKILL.md` step 2.5.

## What's already in the code (don't re-derive)

- Form pattern: `submitLead()` in `Web/src/lib/lead-capture.ts`; primitives (`FormState`, `INPUT_CLASS`, `FOCUS_RING_ACCENT`, `<SuccessCard>`, `<ErrorAlert>`) in `Web/src/components/form-primitives.tsx`.
- Signal taxonomy: single module `Web/src/lib/signal-catalog.ts` (`SIGNAL_NAMES`, `SignalType`, `Signal`, `getAllSignals`). Do not add a parallel data module.
- Design tokens: bg `#0B0F1A`, fg `#F0F0F2`, accent `#D4763C`, muted `#7A7D85`, Plus Jakarta Sans / Inter / JetBrains Mono — all in `Web/src/styles/global.css` `@theme` block.
- Test entrypoint: `/verify` runs typecheck + unit + build in parallel, then E2E.

## Lessons for the next PRD

1. **Read every `docs/retros/*.md` before drafting slices.** Encode lessons into specs AND code on the feature branch — never as banner notes in issue bodies.
2. **Slice for file disjointness.** Four slices touching `index.astro` here all merged via 3-way; design slices to own their files end-to-end when possible.
3. **Scaffold first.** Test infra and integration decisions belong in the first slice; later slices inherit. Don't retrofit mid-PRD.
4. **Reviewer cold-start cost only bites slice #1.** Subsequent reviewers run clean — leave the budget alone.
5. **The retro is fallible.** A claim from an early implementer can be invalidated by version drift (see WebKit). Verify before acting; correct the retro when you find a stale claim.
6. **Sandcastle commits sign as `Claude Opus 4.6`**, host commits as `Claude Opus 4.7 (1M context)`. Document for traceability when comparing across model versions.
