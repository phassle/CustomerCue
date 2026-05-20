import {
  BASE_SIGNAL_RATES,
  CUSTOMER_COUNT,
} from "../data/inbox-estimator-fixture";

export interface SignalBucketEstimate {
  low: number;
  high: number;
}

export interface SignalEstimate {
  churnRisk: SignalBucketEstimate;
  expansionIntent: SignalBucketEstimate;
  productFrictionAndBugs: SignalBucketEstimate;
  longTail: SignalBucketEstimate;
}

const LOW_MULTIPLIER = 0.8;
const HIGH_MULTIPLIER = 1.2;
const HIGH_CEILING = 200;
const CUSTOMER_ADJUSTMENT_MIN = 0.8;
const CUSTOMER_ADJUSTMENT_MAX = 1.2;
// Customer adjustment uses an affine curve:
// adjustment = base + (customerCount/defaultCustomerCount) * weight.
// It stays close to 1.0 around defaults while allowing gentle scaling.
const CUSTOMER_ADJUSTMENT_BASE = 0.9;
const CUSTOMER_ADJUSTMENT_RATIO_WEIGHT = 0.1;

function toBucketRange(projectedCount: number): SignalBucketEstimate {
  const roundedLow = Math.max(0, Math.floor(projectedCount * LOW_MULTIPLIER));
  const roundedHigh = Math.max(roundedLow, Math.ceil(projectedCount * HIGH_MULTIPLIER));
  const high = Math.min(HIGH_CEILING, roundedHigh);
  const low = Math.min(roundedLow, high);

  return { low, high };
}

function getCustomerAdjustment(customerCount: number): number {
  const ratio = customerCount / CUSTOMER_COUNT.default;
  return Math.min(
    CUSTOMER_ADJUSTMENT_MAX,
    Math.max(
      CUSTOMER_ADJUSTMENT_MIN,
      CUSTOMER_ADJUSTMENT_BASE + ratio * CUSTOMER_ADJUSTMENT_RATIO_WEIGHT,
    ),
  );
}

export function estimateSignals(
  weeklyConversations: number,
  customerCount: number,
): SignalEstimate {
  const normalizedConversations = Number.isFinite(weeklyConversations)
    ? Math.max(0, weeklyConversations)
    : 0;
  const normalizedCustomers = Number.isFinite(customerCount)
    ? Math.max(0, customerCount)
    : 0;

  if (normalizedConversations === 0) {
    return {
      churnRisk: { low: 0, high: 0 },
      expansionIntent: { low: 0, high: 0 },
      productFrictionAndBugs: { low: 0, high: 0 },
      longTail: { low: 0, high: 0 },
    };
  }

  const customerAdjustment = getCustomerAdjustment(normalizedCustomers);

  return {
    churnRisk: toBucketRange(
      normalizedConversations * BASE_SIGNAL_RATES.churnRisk * customerAdjustment,
    ),
    expansionIntent: toBucketRange(
      normalizedConversations *
        BASE_SIGNAL_RATES.expansionIntent *
        customerAdjustment,
    ),
    productFrictionAndBugs: toBucketRange(
      normalizedConversations *
        BASE_SIGNAL_RATES.productFrictionAndBugs *
        customerAdjustment,
    ),
    longTail: toBucketRange(
      normalizedConversations * BASE_SIGNAL_RATES.longTail * customerAdjustment,
    ),
  };
}
