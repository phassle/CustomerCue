# Design system

Visual direction for `Web/`. Implementation tokens (exact hex codes, typeface choices, spacing scale) get locked during scaffolding and recorded back here.

## Direction: editorial-analytical

Dark, calm, serious. The visual register of a research tool, not a SaaS catalog. Reference points: Linear, Cursor, Anthropic, Arc. Decision context in [`../../docs/adr/0002-editorial-analytical-visual-direction.md`](../../docs/adr/0002-editorial-analytical-visual-direction.md).

## Principles

- **Calm over busy.** Generous whitespace. No more than one accent colour on screen at a time. No gradients unless they're doing real work.
- **Numerals are content.** Metrics in the example outputs ($42k ARR, 6 tickets in 14 days, 37 tickets across 11 customers) render in a monospace numeric variant. They should read as *telemetry*, not copy filler.
- **Type does the heavy lifting.** A confident type pairing carries more weight here than ornament. Pick one display face and one body face; commit.
- **Honesty over polish theatre.** No invented social proof, no fake testimonials, no faked metrics outside the brief's labelled illustrations.

## Token shape (to be filled on scaffold)

| Token | Decision | Locked? |
|---|---|---|
| Background | Deep neutral (near-black or rich navy) | direction set, exact value TBD |
| Foreground | High-contrast off-white | direction set, exact value TBD |
| Accent | One warm hue (amber / copper / signal-orange) for CTAs and signal callouts | direction set, exact value TBD |
| Muted text | Dimmed off-white at ~60% contrast for secondary copy | direction set, exact value TBD |
| Display type | Geometric or modern sans, optional serif for editorial headlines | TBD |
| Body type | Highly-legible sans, designed for screen body | TBD |
| Numerals | Monospaced numeric variant of the body face (or dedicated mono for metrics) | TBD |
| Radius / shadow | Minimal — flat-with-edges, not skeuomorphic | direction set |

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
