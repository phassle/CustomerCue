# ADR 0005 — Next.js App Router for `Saas/`

**Status:** Accepted (2026-06-01)

## Context

`Saas/` is the signed-in CustomerCue product. It requires:
- Server-side rendering (SSR) for the paste-classify route (dynamic API call)
- Server/client boundary enforcement (Anthropic SDK must stay server-only)
- Cookie-backed session management
- React component ecosystem (shadcn/ui)

`Web/` uses Astro (ADR 0001) — a static-first tool. `Saas/` needs a framework that supports dynamic routes natively.

## Decision

Use **Next.js App Router** (v16) with:
- **TypeScript** for type safety
- **Tailwind CSS v4** via `@tailwindcss/postcss` for styling
- **shadcn/ui** for component primitives
- **Vitest** + happy-dom for unit tests
- **Playwright** (Chromium) for E2E tests
- `output: "standalone"` for SSR via Node adapter

## Consequences

- `'use client'` / server component split enforces the Anthropic SDK stays server-only.
- No shared component library between `Web/` (Astro) and `Saas/` (Next.js). This is intentional per `docs/conventions.md`.
- Dev server runs on `localhost:3000` (distinct from Web's `localhost:4321`).
- Tailwind v4 with shadcn works out of the box via `@tailwindcss/postcss`.
