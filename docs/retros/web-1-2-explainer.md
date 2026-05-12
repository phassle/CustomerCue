# Retro — Web 1.2 interactive conversation → signal explainer (PRD #15)

Per-PRD retro. Owned by Claude Code (host); Sandcastle agents read it before starting, do not edit it.

## Gotchas that bit us (and how they're resolved)

- **Signal-type → colour mapping got duplicated across components.** Each new component that touched annotations (`AnnotationOverlay`, `RationalePanel`, `SignalTypeFilter`) initially re-defined its own four-hue palette. Consolidated into `Web/src/lib/signal-colors.ts` (commit `1db4e3a`). Rule: a per-`SignalType` derived value (colour, icon, label format) lives in one module, not in each consumer.
- **`Set<string>` weakens the catalog guarantee.** Filter state was typed as `Set<string>` in the first cut. Tightened to `Set<SignalType>` in the same commit. Whenever a collection holds catalog members, type it against the catalog union.
- **Deprecated Preact event-type imports.** Keyboard handler used a Preact type that's deprecated in the project's Preact version. Fix: inline the handler signature and use the proper current event type (commit `c6bc0cc`, then `111145f`). Rule: don't import Preact event types speculatively — check what the installed version actually exports.
- **Nested ternary key-handler.** Keyboard handler started as `key === 'j' ? next : key === 'k' ? prev : ...` ternary chain. Replaced with `switch` (commit `9fcf598`). Three or more keys → `switch` from the start.
- **Orphaned files after section replacement.** Slice 12 replaced `<HowItWorks />` with the explainer but left `ExampleCard.astro` and `example-outputs.ts` behind (only consumed by HowItWorks). Cleaned up in commit `e0b5470`. Rule: when a slice deletes a section, enumerate its transitively-only-used dependencies in the slice spec and delete them in the same commit.
- **Hardcoded selector in a11y test.** First-pass a11y test selected the explainer section by a string literal that duplicated the component's section id. Replaced with an exported `EXPLAINER` constant (commit `8c8eda1`). Rule: section identifiers used in tests come from the component's own export, not a string copy.
- **Duplicated test setup across fixture tests.** Step-3 fixture test defined the same `filter(annotation by signalType)` inline twice; NordicPay test repeated similar boilerplate. Extracted (commits `bdd3415`, `f6eca60`, `a5e4197`). Rule: when three fixture tests share a filter helper, extract on the third.
- **`it.each(... as const)` cast noise (recurring).** Same pattern as the digest retro. Direct object interpolation cleaner (commits `bfeade1`, `ae74941`). Worth codifying as a Sandcastle prompt rule rather than re-paying per slice.

## What's already in the code (don't re-derive)

- Conversation fixtures: one file per scenario under `Web/src/data/conversation-fixtures/`, all importing types from `types.ts` in the same directory. Annotations validate `signalType ∈ SIGNAL_NAMES` in tests.
- Top-level island `ConversationExplainer` owns scenario / filter / selected-annotation state. Sub-components (`ConversationThread`, `AnnotationOverlay`, `RationalePanel`, `ScenarioPicker`, `SignalTypeFilter`) are presentational.
- Signal-type → colour mapping in `Web/src/lib/signal-colors.ts`.
- Keyboard nav: `j`/`k`/Enter/Escape scoped to the explainer section. Wrap-around enabled.
- Page placement: explainer replaces `HowItWorks` between Hero and Signals.

## Lessons for the next PRD

1. **Centralise per-catalog-member derived values from day one.** Colour, icon, action-verb-per-signal — all should land in `signal-colors.ts`-style modules at slice 1, not be re-derived per component. The cost of three simplify passes exceeds the cost of one shared module up front.
2. **Type collections against the catalog union, not `string`.** `Set<SignalType>` not `Set<string>`. Acceptance criteria for any catalog-touching slice should name the expected types.
3. **When a slice replaces a section, name the transitively-orphaned files in the slice spec.** Sandcastle will not chase down dead code unless told to. The replacement slice owns the cleanup.
4. **Three-or-more-key handlers use `switch`, never nested ternaries.** Codify in the slice spec for keyboard-touching work.
5. **Tests reference exported constants, not duplicated string literals.** Especially for section ids and role names — when the component changes, the test should fail to compile or fail to find the section, not silently pass against stale strings.
6. **Three fixture tests is the threshold for extracting a shared helper.** Two is acceptable copy-paste; three is duplication.
7. **The `it.each(... as const)` cast is a Sandcastle reflex worth pre-empting.** Add to the to-issues skill's standard testing decisions: "use direct object interpolation in parameterised tests; no `as const` cast on the table."
8. **A 13-slice PRD with four-wide parallelism worked.** Wave 1 (#16–#20) ran in parallel cleanly; later waves needed coordination but stayed AFK. Repeat this scale for future workshop-demo PRDs.
