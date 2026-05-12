# Design system

Visual direction for `Web/`. Implementation tokens (exact hex codes, typeface choices, spacing scale) get locked during scaffolding and recorded back here.

## Direction: editorial-analytical

Dark, calm, serious. The visual register of a research tool, not a SaaS catalog. Reference points: Linear, Cursor, Anthropic, Arc. Decision context in [`../../docs/adr/0002-editorial-analytical-visual-direction.md`](../../docs/adr/0002-editorial-analytical-visual-direction.md).

## Principles

- **Calm over busy.** Generous whitespace. No more than one accent colour on screen at a time. No gradients unless they're doing real work.
- **Numerals are content.** Metrics in the example outputs ($42k ARR, 6 tickets in 14 days, 37 tickets across 11 customers) render in a monospace numeric variant. They should read as *telemetry*, not copy filler.
- **Type does the heavy lifting.** A confident type pairing carries more weight here than ornament. Pick one display face and one body face; commit.
- **Honesty over polish theatre.** No invented social proof, no fake testimonials, no faked metrics outside the brief's labelled illustrations.

## Tokens

Defined in `src/styles/global.css` via Tailwind v4 `@theme`. Use Tailwind utilities (`bg-background`, `text-accent`, `font-display`, etc.) — never hard-code hex values.

| Token | Value | Tailwind utility |
|---|---|---|
| Background | `#0B0F1A` (deep navy, near-black) | `bg-background` |
| Foreground | `#F0F0F2` (high-contrast off-white) | `text-foreground` |
| Accent | `#D4763C` (warm copper) — CTAs and signal callouts only | `text-accent`, `bg-accent` |
| Muted text | `#8B8D95` (~65% contrast) | `text-muted` |
| Display type | Plus Jakarta Sans 600/700/800 | `font-display` |
| Body type | Inter 400/500/600 | `font-body` |
| Monospace | JetBrains Mono 400/500 (tabular numerals for metrics) | `font-mono` |
| Spacing scale | 0.25rem (4px) base — Tailwind default grid | `p-{n}`, `m-{n}`, `gap-{n}` |
| Radius / shadow | Minimal — flat-with-edges, not skeuomorphic | — |

Fonts loaded via Google Fonts in `Layout.astro` `<head>`.

## Component shape (to be filled as built)

- **Wordmark** — typographic, not iconographic. "CustomerCue" set in the display face with a single subtle treatment (custom kerning or one-letter accent). No logo mark in v1.
- **Hero metric strip** — the three brief examples (Acme Corp / NordicPay / step-3 cluster) rendered as a horizontal strip of metric cards. Monospace numerals. Each card labelled `EXAMPLE — fictional`.
- **Signal grid** — the 10 signal types as a 10-cell grid. Names verbatim per [`../../docs/signals.md`](../../docs/signals.md). No icons; type and one accent rule per cell.
- **CTA section** — primary "Book a demo" button, secondary "Send us 1,000 conversations" link below. Both post to mock endpoints.
- **Footer** — minimal: product, company, legal, contact. Dim text on background.

## What this is *not*

- Not a multi-colour signal-type palette. That's a separate design system project, deferred until `Saas/`.
- Not a maximalist marketing site. No carousels, no parallax, no auto-rotating testimonials.
- Not a Monterro-branded property visually. Workshop context aside, the *page* reads as CustomerCue, Inc.
