import type { SignalType } from "../lib/signal-catalog";

export const INBOX_ESTIMATOR = "inbox-estimator";

export const WEEKLY_CONVERSATIONS = {
  min: 50,
  max: 5000,
  step: 50,
  default: 500,
} as const;

export const CUSTOMER_COUNT = {
  min: 20,
  max: 1000,
  step: 10,
  default: 150,
} as const;

export interface BucketBaseRate {
  signals: readonly SignalType[];
  perHundredConversations: { low: number; high: number };
}

// Base rates are illustrative — counts of weekly revenue signals per 100
// weekly support conversations, anchored to the brief's three named example
// outputs. They are *not* dollar projections (ADR-0003).
//
// Anchors:
//  • Acme Corp: 6 tickets / 14 days → 1 churn-risk signal. Concentrated on a
//    single account; weekly fleet density of churn-risk is therefore < 1
//    per 100 conversations even when the per-account density is high.
//  • Onboarding step-3 cluster: 37 tickets / 11 customers → 1 onboarding-issue
//    + 1 bug-cluster signal. Anchors the combined product-friction-and-bugs
//    bucket and the long-tail (onboarding-issue rolls into long-tail).
export const BASE_RATES = {
  churnRisk: {
    signals: ["churn risk"],
    perHundredConversations: { low: 0.3, high: 0.8 },
  },
  expansionIntent: {
    signals: ["expansion intent"],
    perHundredConversations: { low: 0.2, high: 0.6 },
  },
  productFrictionAndBugs: {
    signals: ["product friction", "bug cluster"],
    perHundredConversations: { low: 0.5, high: 1.2 },
  },
  longTail: {
    signals: [
      "onboarding issue",
      "feature request",
      "negative sentiment",
      "strategic account escalation",
      "documentation gap",
      "repeated manual workaround",
    ],
    perHundredConversations: { low: 0.8, high: 2.0 },
  },
} as const satisfies Record<string, BucketBaseRate>;
