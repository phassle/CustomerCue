# CustomerCue — Web

Public marketing site for CustomerCue. A single focused landing page — hero, how-it-works, signals, CTA, footer. No signed-in experience (that's [`../Saas/`](../Saas/)).

## Stack

| | |
|---|---|
| Framework | **Astro 6.3** — see [`../docs/adr/0001-astro-for-web.md`](../docs/adr/0001-astro-for-web.md) |
| Styling | **Tailwind CSS 4.3** via `@tailwindcss/vite` |
| Hosting | Static for the marketing page + `@astrojs/node` SSR for `/api/lead` (opted in via `prerender = false`). Requires a Node-capable host (Vercel, Railway, Render). Cloudflare Pages static-only would 404 on form submission unless the API route is moved to Cloudflare Workers with `@astrojs/cloudflare`. |

## Getting started

```bash
npm install
npm run dev            # localhost:4321
npm run build          # static export to dist/
npm run test           # vitest (unit)
npm run test:e2e       # playwright (E2E, starts dev server)
npm run typecheck      # astro check
```

## Read next

- [`AGENTS.md`](./AGENTS.md) — agent entry point (full stack table and commands)
- [`docs/page-scope.md`](./docs/page-scope.md) — page-level scope and CTA hierarchy
- [`../brief.md`](../brief.md) — positioning, ICP, differentiation copy
