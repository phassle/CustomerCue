# Editorial-analytical visual direction for Web

**Date:** 2026-05-10
**Status:** accepted

## Decision

`Web/` adopts an **editorial-analytical** visual direction: dark / calm background, single warm accent, monospace numerals for example-output metrics, no multi-colour signal palette in v1. Reference register: Linear, Cursor, Anthropic, Arc.

Concrete tokens live in [`../../Web/docs/design-system.md`](../../Web/docs/design-system.md) and get filled in during scaffold.

## Context

The page sells *intelligence layer*, not *dashboard*. The brief positions CustomerCue as a tool that surfaces signal hidden in support conversations. The visual register has to make that pitch implicitly — a bright SaaS-catalog look would undercut it, and a multi-coloured data-product look would commit us to a 10-signal palette as a design-system project before any code ships.

## Considered alternatives

- **Signal-clinical** (bright, multi-colour signal palette). Rejected for v1: defining 10 harmonious signal hues is a design-system project, not a landing page, and that palette belongs in `Saas/` where users actually filter by signal type — not on a marketing page where it'd just decorate.
- **Editorial-warm** (cream / serif / warm accent). Rejected: reads as advisory-services or essay-publication, not as software. CustomerCue is a product, not a newsletter.

## Consequences

- The 10-signal palette is *deferred* to `Saas/`. The landing page renders signal names as type, not as coloured chips.
- Monospace numerals are a brand decision, not just a Tailwind choice — pick a body face with strong tabular numerals, or carry a dedicated mono for metrics.
- "No invented social proof" (already in [`../conventions.md`](../conventions.md) and [`stop-rules.md`](../stop-rules.md)) is now also a visual rule: no placeholder logo strips, no faux-testimonial cards. If we want social proof later, it goes in with real names or not at all.
