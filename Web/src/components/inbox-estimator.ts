import { BASE_RATES, CUSTOMER_COUNT } from "./inbox-estimator-fixtures";

export interface SignalRange {
  low: number;
  high: number;
}

export interface SignalEstimate {
  churnRisk: SignalRange;
  expansionIntent: SignalRange;
  productFrictionAndBugs: SignalRange;
  longTail: SignalRange;
}

function customerFactor(customerCount: number): number {
  if (customerCount <= 0) return 0;
  const ratio = customerCount / CUSTOMER_COUNT.default;
  return 1 + 0.15 * Math.log2(ratio);
}

function estimateBucket(
  weeklyConversations: number,
  customerCount: number,
  rate: { low: number; high: number },
): SignalRange {
  const scale = (weeklyConversations / 100) * customerFactor(customerCount);
  const low = Math.round(rate.low * scale);
  const high = Math.round(rate.high * scale);
  return { low, high };
}

export function estimateSignals(
  weeklyConversations: number,
  customerCount: number,
): SignalEstimate {
  return {
    churnRisk: estimateBucket(
      weeklyConversations,
      customerCount,
      BASE_RATES.churnRisk.perHundredConversations,
    ),
    expansionIntent: estimateBucket(
      weeklyConversations,
      customerCount,
      BASE_RATES.expansionIntent.perHundredConversations,
    ),
    productFrictionAndBugs: estimateBucket(
      weeklyConversations,
      customerCount,
      BASE_RATES.productFrictionAndBugs.perHundredConversations,
    ),
    longTail: estimateBucket(
      weeklyConversations,
      customerCount,
      BASE_RATES.longTail.perHundredConversations,
    ),
  };
}
