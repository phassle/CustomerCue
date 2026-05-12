import { describe, it, expect } from "vitest";
import { digestFixture } from "../data/digest-fixture";
import { SIGNAL_NAMES } from "../lib/signal-catalog";

describe("digestFixture", () => {
  it("contains exactly three entries", () => {
    expect(digestFixture.entries).toHaveLength(3);
  });

  it("every entry signalType is a canonical SIGNAL_NAMES member", () => {
    for (const entry of digestFixture.entries) {
      expect(SIGNAL_NAMES).toContain(entry.signalType);
    }
  });

  it("every entry has a positive sourceConversationCount", () => {
    for (const entry of digestFixture.entries) {
      expect(entry.sourceConversationCount).toBeGreaterThan(0);
    }
  });

  it("every entry has at least one source excerpt", () => {
    for (const entry of digestFixture.entries) {
      expect(entry.sourceExcerpts.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every source excerpt has from and snippet", () => {
    for (const entry of digestFixture.entries) {
      for (const excerpt of entry.sourceExcerpts) {
        expect(excerpt.from).toBeTruthy();
        expect(excerpt.snippet).toBeTruthy();
      }
    }
  });

  it("from, to, subject, weekLabel, and fictionalBadge are non-empty strings", () => {
    expect(digestFixture.from).toBeTruthy();
    expect(digestFixture.to).toBeTruthy();
    expect(digestFixture.subject).toBeTruthy();
    expect(digestFixture.weekLabel).toBeTruthy();
    expect(digestFixture.fictionalBadge).toBeTruthy();
  });

  it("every entry has a glyph and glyphLabel", () => {
    for (const entry of digestFixture.entries) {
      expect(entry.glyph).toBeTruthy();
      expect(entry.glyphLabel).toBeTruthy();
    }
  });

  it("entries are churn risk, expansion intent, onboarding issue in order", () => {
    expect(digestFixture.entries[0].signalType).toBe("churn risk");
    expect(digestFixture.entries[1].signalType).toBe("expansion intent");
    expect(digestFixture.entries[2].signalType).toBe("onboarding issue");
  });
});
