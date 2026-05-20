import { describe, expect, it } from "vitest";
import {
  CUSTOMER_COUNT,
  INBOX_ESTIMATOR,
  WEEKLY_CONVERSATIONS,
} from "../data/inbox-estimator-fixture";
import { estimateSignals } from "../lib/estimate-signals";

const BUCKET_KEYS = [
  "churnRisk",
  "expansionIntent",
  "productFrictionAndBugs",
  "longTail",
] satisfies Array<keyof ReturnType<typeof estimateSignals>>;

describe("estimateSignals", () => {
  it("exports the estimator section id constant", () => {
    expect(INBOX_ESTIMATOR).toBe("inbox-estimator");
  });

  it("uses the expected slider configuration", () => {
    expect(WEEKLY_CONVERSATIONS).toEqual({
      min: 50,
      max: 5000,
      step: 50,
      default: 500,
    });
    expect(CUSTOMER_COUNT).toEqual({
      min: 20,
      max: 1000,
      step: 10,
      default: 150,
    });
  });

  it("default inputs produce four sensible buckets", () => {
    const estimate = estimateSignals(
      WEEKLY_CONVERSATIONS.default,
      CUSTOMER_COUNT.default,
    );

    expect(Object.keys(estimate).sort()).toEqual([
      "churnRisk",
      "expansionIntent",
      "longTail",
      "productFrictionAndBugs",
    ]);

    for (const key of BUCKET_KEYS) {
      const bucket = estimate[key];
      expect(bucket.low).toBeGreaterThanOrEqual(0);
      expect(bucket.low).toBeLessThanOrEqual(bucket.high);
    }

    expect(estimate.churnRisk.high).toBeGreaterThanOrEqual(1);
  });

  it("more conversations never produce fewer signals", () => {
    const customerCount = 240;
    const estimateA = estimateSignals(500, customerCount);
    const estimateB = estimateSignals(1000, customerCount);

    for (const key of BUCKET_KEYS) {
      expect(estimateB[key].low).toBeGreaterThanOrEqual(estimateA[key].low);
      expect(estimateB[key].high).toBeGreaterThanOrEqual(estimateA[key].high);
    }
  });

  it("zero conversations always return zero estimates", () => {
    const estimate = estimateSignals(0, CUSTOMER_COUNT.max);

    for (const key of BUCKET_KEYS) {
      expect(estimate[key]).toEqual({ low: 0, high: 0 });
    }
  });

  it("slider maximum stays within a sensible ceiling", () => {
    const estimate = estimateSignals(
      WEEKLY_CONVERSATIONS.max,
      CUSTOMER_COUNT.max,
    );

    for (const key of BUCKET_KEYS) {
      expect(Number.isFinite(estimate[key].high)).toBe(true);
      expect(estimate[key].high).toBeLessThanOrEqual(200);
    }
  });

  it("all returned counts are integers across slider ranges", () => {
    for (
      let weeklyConversations = WEEKLY_CONVERSATIONS.min;
      weeklyConversations <= WEEKLY_CONVERSATIONS.max;
      weeklyConversations += WEEKLY_CONVERSATIONS.step
    ) {
      for (
        let customerCount = CUSTOMER_COUNT.min;
        customerCount <= CUSTOMER_COUNT.max;
        customerCount += CUSTOMER_COUNT.step
      ) {
        const estimate = estimateSignals(weeklyConversations, customerCount);
        for (const key of BUCKET_KEYS) {
          expect(Number.isInteger(estimate[key].low)).toBe(true);
          expect(Number.isInteger(estimate[key].high)).toBe(true);
          expect(estimate[key].low).toBeLessThanOrEqual(estimate[key].high);
        }
      }
    }
  });
});
