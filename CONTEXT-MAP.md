# Context Map

This repo is multi-context: the marketing site and the product app are independent codebases with separate stacks. Each has its own `CONTEXT.md` for the language that lives only inside that surface. Repo-wide language (positioning, the canonical signal taxonomy) lives in [`brief.md`](./brief.md) and [`docs/signals.md`](./docs/signals.md).

## Contexts

- [Web](./Web/CONTEXT.md) — public marketing site. Astro + Preact + Tailwind. Static-first, no signed-in flows, privacy-first posture (no cookies, no trackers).
- [Saas](./Saas/CONTEXT.md) — the signed-in CustomerCue product. Signals queue, account drilldown, source-conversation receipts, mocked routing. Stack chosen per [`docs/adr/`](./docs/adr/).

## Relationships

- **Shared language** — both contexts consume the canonical `Signal` taxonomy in [`docs/signals.md`](./docs/signals.md) and the positioning vocabulary in [`brief.md`](./brief.md). Synonyms are *not* allowed; both contexts use the same 10 signal-type names verbatim.
- **Independent codebases** — no cross-imports between `Web/` and `Saas/` (enforced by [`docs/conventions.md`](./docs/conventions.md)). Shared design tokens, if ever needed, go via a Tailwind config or CSS variable file — not via shared React components.
- **Trust Contract** — both contexts honour the rule from [`docs/signals.md`](./docs/signals.md): every rendered Signal links to its source **Conversation**(s). In `Web/` this is illustrative (fictional Acme / NordicPay seeds in the Sample Digest); in `Saas/` it is structural (the detail canvas of every Signal renders the linked Conversations as a first-class section).
