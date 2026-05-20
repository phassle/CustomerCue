export const WEEKLY_CONVERSATIONS = {
  min: 50,
  max: 5000,
  step: 50,
  default: 500,
};

export const CUSTOMER_COUNT = {
  min: 20,
  max: 1000,
  step: 10,
  default: 150,
};

export const INBOX_ESTIMATOR = "inbox-estimator";

const ACME_REPEATED_TICKETS_IN_14_DAYS = 6;
const ACME_WEEKLY_CLUSTER_TICKETS = ACME_REPEATED_TICKETS_IN_14_DAYS / 2;
const ACME_CLUSTER_SHARE_OF_WEEKLY_INBOX = 0.012;

const NORDICPAY_ENTERPRISE_ASKS_FOR_ONE_SIGNAL = 5;
const NORDICPAY_EXPANSION_LIKE_SHARE = 0.028;

const ONBOARDING_CLUSTER_TICKETS = 37;
const ONBOARDING_CLUSTER_SIGNAL_PAIR = 2;
const ONBOARDING_CLUSTER_SHARE = 0.18;

export const BASE_SIGNAL_RATES = {
  // Acme anchor: 6 tickets in 14 days for one repeated integration issue
  // maps to one strong churn-like signal. We scale that cluster down to a
  // small inbox-wide share for an aggregate weekly estimate.
  churnRisk: ACME_CLUSTER_SHARE_OF_WEEKLY_INBOX / ACME_WEEKLY_CLUSTER_TICKETS,
  // NordicPay anchor: repeated enterprise-security/admin asks indicate one
  // expansion-intent signal; modeled as a modest recurring share.
  expansionIntent:
    NORDICPAY_EXPANSION_LIKE_SHARE / NORDICPAY_ENTERPRISE_ASKS_FOR_ONE_SIGNAL,
  // Onboarding anchor: 37 tickets across 11 customers surfaced two signals
  // (onboarding issue + bug cluster), scaled to an inbox-wide share.
  productFrictionAndBugs:
    (ONBOARDING_CLUSTER_SIGNAL_PAIR / ONBOARDING_CLUSTER_TICKETS) *
    ONBOARDING_CLUSTER_SHARE,
  // Long-tail rollup covers remaining signal families not shown as dedicated
  // top buckets in the estimator.
  longTail: 0.018,
} satisfies Record<
  "churnRisk" | "expansionIntent" | "productFrictionAndBugs" | "longTail",
  number
>;
