import { describe, it, expect } from "vitest";
import {
  estimateSignals,
  type SignalEstimate,
} from "../components/inbox-estimator";
import {
  BASE_RATES,
  CUSTOMER_COUNT,
  INBOX_ESTIMATOR,
  WEEKLY_CONVERSATIONS,
} from "../components/inbox-estimator-fixtures";
import { SIGNAL_NAMES } from "../lib/signal-catalog";

const BUCKET_KEYS: Array<keyof SignalEstimate> = [
  "churnRisk",
  "expansionIntent",
  "productFrictionAndBugs",
  "longTail",
];

describe("section id constant", () => {
  it("exports INBOX_ESTIMATOR as the kebab-case section anchor", () => {
    expect(INBOX_ESTIMATOR).toBe("inbox-estimator");
  });
});

describe("slider config constants", () => {
  it("WEEKLY_CONVERSATIONS matches the issue spec", () => {
    expect(WEEKLY_CONVERSATIONS).toEqual({
      min: 50,
      max: 5000,
      step: 50,
      default: 500,
    });
  });

  it("CUSTOMER_COUNT matches the issue spec", () => {
    expect(CUSTOMER_COUNT).toEqual({
      min: 20,
      max: 1000,
      step: 10,
      default: 150,
    });
  });
});

describe("BASE_RATES fixture", () => {
  it("covers exactly the four bucket keys", () => {
    expect(Object.keys(BASE_RATES).sort()).toEqual(
      [
        "churnRisk",
        "expansionIntent",
        "longTail",
        "productFrictionAndBugs",
      ].sort(),
    );
  });

  it("only references canonical signal names from the catalog", () => {
    const referenced = Object.values(BASE_RATES).flatMap((b) => b.signals);
    for (const name of referenced) {
      expect(SIGNAL_NAMES).toContain(name);
    }
  });

  it("partitions the canonical catalog: every signal appears in exactly one bucket", () => {
    const referenced = Object.values(BASE_RATES).flatMap((b) => b.signals);
    expect([...referenced].sort()).toEqual([...SIGNAL_NAMES].sort());
    expect(new Set(referenced).size).toBe(referenced.length);
  });

  it("has 0 ≤ low ≤ high for every bucket rate", () => {
    for (const bucket of Object.values(BASE_RATES)) {
      const { low, high } = bucket.perHundredConversations;
      expect(low).toBeGreaterThanOrEqual(0);
      expect(low).toBeLessThanOrEqual(high);
    }
  });
});

describe("estimateSignals — default inputs", () => {
  it("returns four buckets with low ≥ 0, low ≤ high, and churnRisk.high ≥ 1", () => {
    const estimate = estimateSignals(
      WEEKLY_CONVERSATIONS.default,
      CUSTOMER_COUNT.default,
    );

    for (const key of BUCKET_KEYS) {
      const bucket = estimate[key];
      expect(bucket.low).toBeGreaterThanOrEqual(0);
      expect(bucket.low).toBeLessThanOrEqual(bucket.high);
    }
    expect(estimate.churnRisk.high).toBeGreaterThanOrEqual(1);
  });
});

describe("estimateSignals — integer outputs", () => {
  it("returns integer low and high for every bucket across the slider grid", () => {
    const conversations: number[] = [];
    for (
      let v = WEEKLY_CONVERSATIONS.min;
      v <= WEEKLY_CONVERSATIONS.max;
      v += WEEKLY_CONVERSATIONS.step
    ) {
      conversations.push(v);
    }
    const customers: number[] = [];
    for (
      let v = CUSTOMER_COUNT.min;
      v <= CUSTOMER_COUNT.max;
      v += CUSTOMER_COUNT.step
    ) {
      customers.push(v);
    }

    const sampleCustomers = [customers[0], customers[Math.floor(customers.length / 2)], customers[customers.length - 1]];

    for (const weekly of conversations) {
      for (const customer of sampleCustomers) {
        const estimate = estimateSignals(weekly, customer);
        for (const key of BUCKET_KEYS) {
          expect(Number.isInteger(estimate[key].low)).toBe(true);
          expect(Number.isInteger(estimate[key].high)).toBe(true);
        }
      }
    }
  });
});

describe("estimateSignals — slider maximum ceiling", () => {
  it("keeps every bucket's high finite and at most 200 at slider maxima", () => {
    const estimate = estimateSignals(
      WEEKLY_CONVERSATIONS.max,
      CUSTOMER_COUNT.max,
    );
    for (const key of BUCKET_KEYS) {
      expect(Number.isFinite(estimate[key].high)).toBe(true);
      expect(estimate[key].high).toBeLessThanOrEqual(200);
    }
  });
});

describe("estimateSignals — zero conversations", () => {
  it("returns all-zero buckets regardless of customer count", () => {
    const samples = [
      { weekly: 0, customers: CUSTOMER_COUNT.min },
      { weekly: 0, customers: CUSTOMER_COUNT.default },
      { weekly: 0, customers: CUSTOMER_COUNT.max },
    ];

    for (const { weekly, customers } of samples) {
      const estimate = estimateSignals(weekly, customers);
      for (const key of BUCKET_KEYS) {
        expect(estimate[key].low).toBe(0);
        expect(estimate[key].high).toBe(0);
      }
    }
  });
});

describe("estimateSignals — monotonicity", () => {
  it("never produces fewer signals when weekly conversations strictly increase", () => {
    const pairs = [
      { a: 100, b: 200 },
      { a: 500, b: 501 },
      { a: 1000, b: 4000 },
      { a: WEEKLY_CONVERSATIONS.min, b: WEEKLY_CONVERSATIONS.max },
    ];
    const customerCount = CUSTOMER_COUNT.default;

    for (const { a, b } of pairs) {
      const ea = estimateSignals(a, customerCount);
      const eb = estimateSignals(b, customerCount);
      for (const key of BUCKET_KEYS) {
        expect(eb[key].low).toBeGreaterThanOrEqual(ea[key].low);
        expect(eb[key].high).toBeGreaterThanOrEqual(ea[key].high);
      }
    }
  });
});
