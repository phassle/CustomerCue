# AGENTS — Web

Public marketing site for **CustomerCue**. A single focused landing page — hero, how-it-works, signals, CTA, footer. No signed-in experience (that's `../Saas/`). Page scope locked in [`docs/page-scope.md`](./docs/page-scope.md).

> Empty directory — not yet scaffolded. Update this file as decisions are made; don't leave stale placeholders.

## Stack

| | |
|---|---|
| Framework | **Astro** — chosen for static-first delivery. See [`../docs/adr/0001-astro-for-web.md`](../docs/adr/0001-astro-for-web.md). Version: TBD on scaffold. |
| Styling | _TBD_ — Tailwind expected |
| Hosting | _TBD_ — Vercel or Cloudflare Pages (static export) |

Record exact versions on scaffold. Saas/ uses a different stack — Web and Saas are intentionally allowed to diverge.

## Commands

```
# placeholder — fill in once scaffolded
# npm install
# npm run dev
# npm run build
# npm run lint
```

No test runner planned (visual-first demo).

## Read these on demand

- [`docs/page-scope.md`](./docs/page-scope.md) — page-level scope and CTA hierarchy
- [`docs/design-system.md`](./docs/design-system.md) — editorial-analytical visual direction and tokens
- [`../docs/signals.md`](../docs/signals.md) — canonical signal taxonomy (use names verbatim in copy)
- [`../docs/conventions.md`](../docs/conventions.md) — mocked-data and vocabulary rules
- [`../docs/stop-rules.md`](../docs/stop-rules.md) — when to ask before acting
- [`../docs/adr/`](../docs/adr/) — Astro choice (0001), visual direction (0002)
- [`../brief.md`](../brief.md) — positioning, ICP, differentiation copy
