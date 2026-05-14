# Retro — Inbox signal estimator (PRD #34)

Per-PRD retro. Owned by Claude Code (host); Sandcastle agents read it before starting, do not edit it.

Feature branch: `feature/inbox-roi-estimator`.

## Gotchas that bit us (and how they're resolved)

- **Slice 1 had a `customerCount` parameter required by the public signature but no actual use of it yet.** The BDD scenarios in issue #35 do not exercise customer-count scaling, so adding it speculatively would be horizontal-TDD. Marked the parameter as `_customerCount` to make the intent explicit. Subsequent slices that introduce customer-count scaling will rename it without breaking the public contract.

## What's already in the code (don't re-derive)

- `estimateSignals(weeklyConversations, customerCount)` lives at `Web/src/components/inbox-estimator.ts` and is pure (no DOM, no fetch, no globals). Math: per-bucket rate × (weeklyConversations / 100), rounded to integers at the boundary. Trivially monotonic in `weeklyConversations`.
- `BASE_RATES` fixture at `Web/src/components/inbox-estimator-fixtures.ts` partitions the canonical 10-signal catalog into the four buckets and is unit-tested for that partition (no overlaps, no drops).
- Slider config + section id constants — `WEEKLY_CONVERSATIONS`, `CUSTOMER_COUNT`, `INBOX_ESTIMATOR` — live in the fixture module. Downstream slices import the section id, never repeat the string `"inbox-estimator"`.

- ADR-0003 locks the output unit to **counts, not dollars**. No currency symbols or monetary copy anywhere in this PRD's surface area.
- Domain vocabulary distinction *signal* vs *signal estimate* lives in `Web/CONTEXT.md`. Apply the trust contract (every signal links to its source conversation) only to *signal*, never to *signal estimate*.
- Canonical signal-type catalogue lives in `Web/src/lib/signal-catalog.ts` (`SIGNAL_NAMES`, `SignalType`). No parallel taxonomy.
- Carry-over rules from PRD #15's retro that bind every slice here:
  - Test parameterisation uses direct object interpolation. **No `it.each(... as const)` casts.**
  - Section identifiers used in tests come from an exported constant (`INBOX_ESTIMATOR = 'inbox-estimator'`), never a string literal.
  - Collections that hold catalog members type against `SignalType`, not `string`.

## Lessons for the next PRD

Synthesised on close of `feature/inbox-roi-estimator` (11 slices, issues #35–#45).

- **Lock the unit at PRD time, not at first slice.** ADR-0003 (counts, not dollars) was written before slice 1 and made every downstream copy/typography/test decision boring. Pattern: any PRD whose surface area shows numbers should ship an ADR that names the unit before code starts.
- **Section ids as exported constants, no string literals.** `INBOX_ESTIMATOR`, `EXPLAINER`, `CONVERSATIONS_UPLOAD` were imported into both implementation and E2E. Rename safety + grep-ability. Carry this rule into every PRD that adds new sections — it was the single biggest reason slices 6, 7 and 11 didn't need debugging.
- **Reserve params before you exercise them, mark intent.** Slice 1's `_customerCount` placeholder kept the public signature stable for slices that later activated customer-count scaling, with the underscore broadcasting "intentionally unused". Cheaper than churning the signature mid-PRD.
- **Astro island hydration needs an explicit E2E gate.** Slice 11 added a `client-render-time` attribute the Playwright spec waits for; without it, slider interactions raced `client:visible`. Any future PRD that puts a Preact/React island behind `client:visible` should expose a similar attribute up front, not after a flaky first run.
- **Keyboard-drive sliders in E2E (ArrowRight × N).** Deterministic across CI, doubles as an a11y check, no `page.mouse` flakiness. Default to keyboard interaction for all custom controls in future E2E specs.
- **Vocabulary entries belong in `Web/CONTEXT.md`, not slice-local comments.** *signal* vs *signal estimate* would have drifted across files without the glossary entry. Any PRD that introduces a near-homonym of an existing domain term must update `Web/CONTEXT.md` in the same slice.
- **Animated transitions need `prefers-reduced-motion` from slice 1 of the animation, not as a follow-up.** Slice 9 added `use-prefers-reduced-motion` together with the animation, not after. Faster than retrofitting the hook later when an a11y sweep flags it.
- **`axe-core` sweep as a dedicated slice, not a checklist item.** Slice 10 gave a11y its own commit and test surface (`a11y.spec.ts` extension); the previous pattern of "just make each slice accessible" left no single owning artefact. Reuse the dedicated-slice pattern.
- **Sandcastle slice rhythm held.** 11 slices × roughly one issue per RALPH commit with refactor commits interleaved. No slice ballooned past its issue's BDD scenarios. Worth keeping the "one RALPH commit per issue + free-form refactor commits between" cadence.
- **Test parameterisation: direct object interpolation, no `as const` casts.** Carried over from PRD #15's retro and held up here too — promote this from carry-over to repo-wide convention in the next PRD's retro.
