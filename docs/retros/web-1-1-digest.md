# Retro — Web 1.1 sample weekly digest (PRD #13)

Per-PRD retro. Owned by Claude Code (host); Sandcastle agents read it before starting, do not edit it.

## Gotchas that bit us (and how they're resolved)

- **`aria-label` on a `<span>` is not announced by screen readers.** The digest glyph spans (`⚠`, `↗`, `◷`) needed `role="img"` for assistive tech to pick up the labels. Fixed in commit `3d85160`. Rule: any decorative-glyph element used as a labelled landmark must carry both `aria-label` and `role="img"` (or be replaced with an actual `<img>` / SVG with `<title>`).
- **`it.each` cast noise.** First-pass test for the digest fixture used `it.each(... as const)` with a redundant cast. Replaced with direct object interpolation (commit `bfeade1`). Cleaner and avoids the type-cast pattern entirely.

## What's already in the code (don't re-derive)

- Digest fixture lives in `Web/src/data/digest-fixture.ts`; component in `Web/src/components/SampleDigest.astro`. Both consume canonical signal names from `src/lib/signal-catalog.ts` — no parallel taxonomy.
- Source-link expand uses native `<details>/<summary>` (no JS island).
- Fictional disclosure rendered as inline header badge + caption under the digest.

## Lessons for the next PRD

1. **Treat `aria-label` on non-semantic elements as a contract that needs a `role`.** Without `role="img"` (or equivalent) the screen reader skips the label. Bake this into a11y-touching slice acceptance criteria from day one.
2. **Single-slice PRDs work.** This PRD shipped as one issue (#14) and merged clean. No regret — the file-disjointness lesson from web-1-0 held.
3. **Verbatim copy from `brief.md` and verbatim signal names from `signal-catalog.ts` make review trivial.** Keep doing this.
