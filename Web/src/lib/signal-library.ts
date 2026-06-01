import { SIGNAL_NAMES, toSlug, type SignalType } from "./signal-catalog";
import type { Conversation } from "../data/conversation-fixtures/types";

// Re-exported so pages/components can pull it from one place. Slices that are
// auto-discovered by the glob below MUST import toSlug from ./signal-catalog
// directly (value import) to avoid a hoisted-glob circular dependency — see
// src/signals/README.md.
export { toSlug };

export interface SignalTypeEntry {
  /** Canonical signal-type name, verbatim from SIGNAL_NAMES. */
  name: SignalType;
  /** URL slug, always toSlug(name). */
  slug: string;
  /** One-line revenue meaning, shown on the gallery card. */
  summary: string;
  /** Short explanation of what this signal type means and why it matters. */
  whatItMeans: string;
  /** Source conversation; its annotations of `name` are the receipts. */
  fixture: Conversation;
}

const modules = import.meta.glob<{ entry: SignalTypeEntry }>(
  "../signals/*/index.ts",
  { eager: true },
);

export const signalTypeEntries: SignalTypeEntry[] = Object.values(modules)
  .map((m) => m.entry)
  .sort(
    (a, b) => SIGNAL_NAMES.indexOf(a.name) - SIGNAL_NAMES.indexOf(b.name),
  );

export const getSignalTypeEntry = (
  slug: string,
): SignalTypeEntry | undefined =>
  signalTypeEntries.find((e) => e.slug === slug);
