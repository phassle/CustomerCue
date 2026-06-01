# Signal Field Guide — slice authoring guide

Each folder here is **one signal type** from the canonical taxonomy
(`../../../docs/signals.md`). A slice is **self-contained**: you only ever
create files inside your own `src/signals/<slug>/` folder. Nothing shared is
edited, so many slices can be built in parallel with zero merge conflicts —
the gallery and routes pick yours up automatically via `import.meta.glob`
(see `../lib/signal-library.ts`).

## The slice contract

A slice MUST named-export `entry: SignalTypeEntry` from `<slug>/index.ts`:

```ts
// src/signals/<slug>/index.ts
import type { SignalTypeEntry } from "../../lib/signal-library";
import { toSlug } from "../../lib/signal-catalog"; // value import: catalog, NOT signal-library
import { myFixture } from "./fixture"; // or import a canonical fixture

const name = "feature request" as const; // canonical name, verbatim

export const entry: SignalTypeEntry = {
  name,
  slug: toSlug(name),
  summary: "One-line revenue meaning shown on the gallery card.",
  whatItMeans: "A short paragraph: what this signal type is and why it matters.",
  fixture: myFixture,
};
```

- **`name`** — verbatim from `SIGNAL_NAMES` (`../lib/signal-catalog.ts`). No synonyms.
- **`slug`** — always `toSlug(name)` (spaces → hyphens). The folder name must equal the slug. Import `toSlug` from `../../lib/signal-catalog` (a value import from `signal-library` would create a hoisted-glob circular dependency; the `SignalTypeEntry` *type* import from `signal-library` is fine because it is erased at build).
- **`fixture`** — a `Conversation` (`../../data/conversation-fixtures/types.ts`) whose
  `annotations` include **at least one** of this signal type. Those annotations
  are the receipts — their `rationale` + `suggestedAction` render on the detail
  page. This satisfies the trust contract.

## Fixture: reuse or author

- **Reuse** a canonical demo account read-only by importing it (e.g.
  `acme-integration`, `nordicpay-enterprise`, `step3-onboarding`,
  `csv-workaround`) when it already annotates your signal type. See
  `churn-risk/index.ts` for this path.
- **Author** your own `<slug>/fixture.ts` exporting a `Conversation` otherwise.
  Keep it fictional (mocked-data rule in `../../../docs/conventions.md`); the
  demo accounts (Acme Corp, NordicPay, the step-3 cluster) are the canonical
  cast — invent new fictional accounts freely for other types.

## Test

Copy `churn-risk/entry.test.ts` into your folder and change only the
`import { entry } from "./index"` line — the assertions are identical for
every slice. Run with `npm run test`.

## Done when

- `npm run test` green (your `entry.test.ts` + the shared contract guard).
- `npm run build` succeeds.
- Your card links from `/signals` and the landing grid, and `/signals/<slug>`
  renders the source thread with your signal's evidence highlighted.
