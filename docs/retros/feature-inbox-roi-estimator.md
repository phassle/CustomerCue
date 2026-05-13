# Retro — Web inbox signal estimator (PRD #34)

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

_To be filled before the feature branch closes (per `AGENTS.md` § Per-PRD retros)._
