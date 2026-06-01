# Signal Field Guide — `Web/` becomes multi-page

**Date:** 2026-06-01
**Status:** accepted

## Decision

`Web/` expands from a single landing page (`/`) to a small multi-page site. The
new surface is the **Signal Field Guide**: a gallery at `/signals` plus one
detail page per signal type at `/signals/<slug>`. The single-page constraint in
[`Web/docs/page-scope.md`](../../Web/docs/page-scope.md) is relaxed for this
content section; the rest of that doc (CTA hierarchy, the Saas boundary, the
pricing/social-proof exclusions) still holds.

Each detail page documents one **signal type** (a taxonomy category) and
illustrates it with one annotated example conversation. The Field Guide carries
**no classifier** — it renders existing `Annotation` fixture data only.
Detection/classification stays in `Saas/` per the context map and
[`docs/conventions.md`](../conventions.md).

## Context

The original page scope deliberately locked the marketing site to one scrollable
`/` and listed "separate /docs pages" as out of scope, to keep the conversion
path focused. Two things changed the trade-off:

1. The 10 canonical signal types are the product's reason to exist, yet the
   landing grid showed them as bare name-cards with no depth. A field guide that
   explains each type with a real-shaped, sourced example is genuine content
   marketing — it reinforces the trust contract ("every signal links to its
   source conversation") rather than diluting the funnel.
2. The feature is also the host for a live **agentic-coding workshop demo**: the
   10 signal types are 10 independent vertical slices, each a self-contained
   folder auto-discovered via `import.meta.glob`, so many agents can build them
   in parallel with zero shared-file edits. That parallelism is the demo's
   point and it needs real routes/pages to land in.

## Considered alternatives

- **Keep everything on `/` (anchors only).** Rejected: ten in-depth examples
  with annotated threads would bloat the landing page and bury the CTA — the
  exact harm the single-page rule guards against. Separate routes keep `/` lean.
- **Build the guide in `Saas/`.** Rejected for this iteration: `Saas/` is empty
  (Next.js per [ADR 0005](./0005-nextjs-app-router-for-saas.md)) and not
  runnable today; the guide is public, educational, marketing content, not a
  signed-in product surface. Classification logic, when it grows, still belongs
  in `Saas/`.
- **A per-slice `detect()` classifier in `Web/`.** Rejected: that would smuggle
  product-side classification into the marketing site, violating the Web/Saas
  boundary. The existing `Annotation` model already carries the evidence
  (`rationale`, `suggestedAction`); slices reuse it.

## Consequences

- `Web/docs/page-scope.md` is amended to reference this ADR and document the
  `/signals` section; "everything lives on `/`" no longer holds verbatim.
- New pages inherit the privacy posture from
  [ADR 0004](./0004-no-cookie-consent-banner.md): they are static and
  scriptless, and `Web/e2e/signal-library.spec.ts` now asserts zero
  cookies/storage and zero critical axe violations on `/signals` and a detail
  page — extending the guarantee, not weakening it.
- `Web/CONTEXT.md` gains a `signal type` term (distinct from a surfaced
  `signal` instance).
- Adding a signal type is a folder under `Web/src/signals/<slug>/` exporting an
  `entry`; nothing shared is edited. The contract is documented in
  `Web/src/signals/README.md` and guarded by
  `Web/src/__tests__/signal-library.test.ts`.
