import type { SignalTypeEntry } from "../../lib/signal-library";
import { toSlug } from "../../lib/signal-catalog";
import { acmeIntegration } from "../../data/conversation-fixtures/acme-integration";

// Reference slice. Other slices copy this folder, rename it to their own
// <slug>, and either reuse a canonical demo fixture (as below) or author a
// self-contained ./fixture.ts. See ../README.md for the slice contract.
const name = "churn risk" as const;

export const entry: SignalTypeEntry = {
  name,
  slug: toSlug(name),
  summary:
    "A customer ties an unresolved problem to their renewal or questions the cost — the account may not renew.",
  whatItMeans:
    "Churn risk is the support inbox's earliest warning that an account is slipping. It rarely arrives as a cancellation; it arrives as frustration attached to a renewal date, a budget question, or a comparison to a competitor. Caught a few weeks before the renewal review, it is a save. Caught after, it is a logo lost. Every churn-risk signal links back to the conversation that raised it so a CSM can act on the customer's own words.",
  fixture: acmeIntegration,
};
