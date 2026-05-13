# Retro — Web inbox signal estimator (PRD #34)

Per-PRD retro. Owned by Claude Code (host); Sandcastle agents read it before starting, do not edit it.

Feature branch: `feature/inbox-roi-estimator`.

## Gotchas that bit us (and how they're resolved)

_None yet — slice 1 in flight._

## What's already in the code (don't re-derive)

- ADR-0003 locks the output unit to **counts, not dollars**. No currency symbols or monetary copy anywhere in this PRD's surface area.
- Domain vocabulary distinction *signal* vs *signal estimate* lives in `Web/CONTEXT.md`. Apply the trust contract (every signal links to its source conversation) only to *signal*, never to *signal estimate*.
- Canonical signal-type catalogue lives in `Web/src/lib/signal-catalog.ts` (`SIGNAL_NAMES`, `SignalType`). No parallel taxonomy.
- Carry-over rules from PRD #15's retro that bind every slice here:
  - Test parameterisation uses direct object interpolation. **No `it.each(... as const)` casts.**
  - Section identifiers used in tests come from an exported constant (`INBOX_ESTIMATOR = 'inbox-estimator'`), never a string literal.
  - Collections that hold catalog members type against `SignalType`, not `string`.

## Lessons for the next PRD

_To be filled before the feature branch closes (per `AGENTS.md` § Per-PRD retros)._
