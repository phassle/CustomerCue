import { describe, it, expect } from "vitest";
import { getAllSignals } from "../lib/signal-catalog";

const CANONICAL_NAMES = [
  "churn risk",
  "expansion intent",
  "product friction",
  "bug cluster",
  "onboarding issue",
  "feature request",
  "negative sentiment",
  "strategic account escalation",
  "documentation gap",
  "repeated manual workaround",
];

describe("signalCatalog", () => {
  it("returns exactly 10 signals", () => {
    expect(getAllSignals()).toHaveLength(10);
  });

  it("returns canonical names verbatim and in order", () => {
    const names = getAllSignals().map((s) => s.name);
    expect(names).toEqual(CANONICAL_NAMES);
  });

  it("returns a new array each call (no shared mutation)", () => {
    const a = getAllSignals();
    const b = getAllSignals();
    expect(a).not.toBe(b);
  });
});
