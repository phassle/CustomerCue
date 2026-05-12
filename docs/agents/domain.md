# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

This repo is **multi-context**: the `Web/` (marketing site) and `Saas/` (product app) subprojects are independent products with separate stacks, so each gets its own `CONTEXT.md` once domain terms start to crystallise.

## Before exploring, read these

- **`CONTEXT-MAP.md`** at the repo root if it exists — it points at one `CONTEXT.md` per context. Read each one relevant to the topic.
- **Per-context `CONTEXT.md`** — `Web/CONTEXT.md` for marketing-site work, `Saas/CONTEXT.md` for product work. Read both if the change spans subprojects.
- **`docs/adr/`** at the repo root — system-wide decisions (signal taxonomy, mocked-data policy, etc.).
- **`<subproject>/docs/adr/`** — context-scoped decisions (e.g. `Saas/docs/adr/` for product-only choices).

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The producer skill (`/grill-with-docs`) creates them lazily when terms or decisions actually get resolved.

## File structure

```
/
├── CONTEXT-MAP.md                       ← index of per-context CONTEXT.md files
├── docs/adr/                            ← system-wide decisions
├── Web/
│   ├── CONTEXT.md                       ← marketing-site glossary
│   └── docs/adr/                        ← marketing-site decisions
└── Saas/
    ├── CONTEXT.md                       ← product glossary
    └── docs/adr/                        ← product decisions
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in the relevant `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

The brief's signal taxonomy (`brief.md`) is canonical — `churn risk`, `expansion intent`, `product friction`, `bug cluster`, `onboarding issue`, `feature request`, `negative sentiment`, `strategic account escalation`, `documentation gap`, `repeated manual workaround`. Use these names verbatim; don't invent synonyms.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/grill-with-docs`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders) — but worth reopening because…_
