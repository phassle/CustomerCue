import { describe, it, expect } from "vitest";
import { exampleOutputs, type ExampleOutput } from "../data/example-outputs";
import { SIGNAL_NAMES } from "../lib/signal-catalog";

describe("exampleOutputs", () => {
  it("contains exactly three examples", () => {
    expect(exampleOutputs).toHaveLength(3);
  });

  it("every example has fictional: true", () => {
    for (const ex of exampleOutputs) {
      expect(ex.fictional).toBe(true);
    }
  });

  it("every example has required fields", () => {
    for (const ex of exampleOutputs) {
      expect(ex.id).toBeTruthy();
      expect(ex.accountName).toBeTruthy();
      expect(ex.narrative).toBeTruthy();
      expect(ex.metrics.length).toBeGreaterThanOrEqual(1);
      expect(ex.signalType.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every metric has a label and value", () => {
    for (const ex of exampleOutputs) {
      for (const m of ex.metrics) {
        expect(m.label).toBeTruthy();
        expect(m.value).toBeTruthy();
      }
    }
  });

  it("every signal type matches a canonical name from signalCatalog", () => {
    for (const ex of exampleOutputs) {
      for (const st of ex.signalType) {
        expect(SIGNAL_NAMES).toContain(st);
      }
    }
  });

  it("includes Acme Corp, NordicPay, and Onboarding step 3 cluster", () => {
    const names = exampleOutputs.map((e) => e.accountName);
    expect(names).toContain("Acme Corp");
    expect(names).toContain("NordicPay");
    expect(names).toContain("Onboarding step 3 cluster");
  });

  it("fictional field is typed as non-optional true literal", () => {
    const output: ExampleOutput = exampleOutputs[0];
    const fictional: true = output.fictional;
    expect(fictional).toBe(true);
  });
});
