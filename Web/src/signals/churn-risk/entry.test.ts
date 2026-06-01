import { describe, it, expect } from "vitest";
import { entry } from "./index";
import { toSlug, SIGNAL_NAMES } from "../../lib/signal-catalog";

// Per-slice contract. Every slice copies this test and only changes the
// import above — the assertions are identical across all 10 signal types.
describe("churn-risk signal-type entry", () => {
  it("name is a canonical signal type", () => {
    expect(SIGNAL_NAMES).toContain(entry.name);
  });

  it("slug is the canonical slug of its name", () => {
    expect(entry.slug).toBe(toSlug(entry.name));
  });

  it("has non-empty editorial copy", () => {
    expect(entry.summary.trim()).toBeTruthy();
    expect(entry.whatItMeans.trim()).toBeTruthy();
  });

  it("fixture carries at least one annotation of this signal type", () => {
    const matching = entry.fixture.annotations.filter(
      (a) => a.signalType === entry.name,
    );
    expect(matching.length).toBeGreaterThanOrEqual(1);
  });

  it("every annotation range falls within its referenced message body", () => {
    const messagesById = new Map(
      entry.fixture.messages.map((m) => [m.id, m]),
    );
    for (const ann of entry.fixture.annotations) {
      const message = messagesById.get(ann.range.messageId);
      expect(message, `unknown messageId ${ann.range.messageId}`).toBeTruthy();
      expect(ann.range.start).toBeGreaterThanOrEqual(0);
      expect(ann.range.start).toBeLessThan(ann.range.end);
      expect(ann.range.end).toBeLessThanOrEqual(message!.body.length);
    }
  });

  it("matching annotations carry rationale and suggestedAction (the receipts)", () => {
    const matching = entry.fixture.annotations.filter(
      (a) => a.signalType === entry.name,
    );
    for (const ann of matching) {
      expect(ann.rationale.trim()).toBeTruthy();
      expect(ann.suggestedAction.trim()).toBeTruthy();
    }
  });
});
