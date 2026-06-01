import type { SignalTypeEntry } from "../../lib/signal-library";
import { toSlug } from "../../lib/signal-catalog";
import { csvWorkaround } from "../../data/conversation-fixtures/csv-workaround";

const name = "repeated manual workaround" as const;

export const entry: SignalTypeEntry = {
  name,
  slug: toSlug(name),
  summary:
    "A customer has built a recurring manual process to compensate for missing functionality — a hidden cost that compounds every week.",
  whatItMeans:
    "Repeated manual workarounds are the support inbox's clearest proof that a product gap has moved from annoying to load-bearing. The customer has stopped asking for the feature and started engineering around its absence — exporting, reshaping, pasting, scripting. Each cycle costs real hours. Caught early, it's a roadmap signal that can retain an account; left unnoticed, it's a quiet drag on NRR that never shows up in a churn survey. Every workaround signal links back to the conversation where the customer described the process so Product can size the gap.",
  fixture: csvWorkaround,
};
