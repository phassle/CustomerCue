import { describe, it, expect } from "vitest";
import {
  signalTypeEntries,
  getSignalTypeEntry,
  toSlug,
} from "../lib/signal-library";
import { SIGNAL_NAMES } from "../lib/signal-catalog";

// Contract guard for the auto-discovered Signal Field Guide. Passes while
// slices are still being built in parallel; the final-coverage assertion
// tightens to all 10 once the feature is complete.
describe("signal library (auto-discovered entries)", () => {
  it("discovers at least the reference slice", () => {
    expect(signalTypeEntries.length).toBeGreaterThanOrEqual(1);
  });

  it("every entry name is a canonical signal type", () => {
    for (const entry of signalTypeEntries) {
      expect(SIGNAL_NAMES).toContain(entry.name);
    }
  });

  it("every entry slug equals toSlug(name)", () => {
    for (const entry of signalTypeEntries) {
      expect(entry.slug).toBe(toSlug(entry.name));
    }
  });

  it("slugs are unique (no duplicate signal types)", () => {
    const slugs = signalTypeEntries.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("entries are sorted by canonical taxonomy order", () => {
    const order = signalTypeEntries.map((e) => SIGNAL_NAMES.indexOf(e.name));
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it("getSignalTypeEntry resolves each discovered slug", () => {
    for (const entry of signalTypeEntries) {
      expect(getSignalTypeEntry(entry.slug)).toBe(entry);
    }
  });

  // Tighten this to `.toBe(SIGNAL_NAMES.length)` once all 10 slices land.
  it("does not exceed the canonical taxonomy size", () => {
    expect(signalTypeEntries.length).toBeLessThanOrEqual(SIGNAL_NAMES.length);
  });
});
