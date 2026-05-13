// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import InboxEstimatorSection from "../components/InboxEstimatorSection.astro";
import {
  INBOX_ESTIMATOR,
  WEEKLY_CONVERSATIONS,
  CUSTOMER_COUNT,
} from "../components/inbox-estimator-fixtures";
import { estimateSignals } from "../components/inbox-estimator";

function stripTags(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/\s+/g, " ")
    .trim();
}

describe("InboxEstimatorSection", () => {
  let html: string;
  let text: string;

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(InboxEstimatorSection);
    text = stripTags(html);
  });

  it("renders the heading", () => {
    expect(text).toContain("What" + "'" + "s hiding in your inbox?");
  });

  it("renders the subhead from the brief", () => {
    expect(text).toContain(
      "Find churn risk, expansion intent, and product friction inside your support conversations.",
    );
  });

  it("has an anchor id matching the INBOX_ESTIMATOR constant", () => {
    expect(html).toContain("id=\"" + INBOX_ESTIMATOR + "\"");
  });

  it("renders the disclaimer", () => {
    expect(text).toContain(
      "Illustrative ranges based on patterns from our 1,000-conversation reports.",
    );
    expect(text).toContain(
      "Send us your conversations to see your real numbers.",
    );
  });

  it("renders all four bucket labels", () => {
    expect(text).toContain("Churn Risk");
    expect(text).toContain("Expansion Intent");
    expect(text).toContain("Product Friction & Bugs");
    expect(text).toContain("Long Tail");
  });

  it("renders default-input counts from estimateSignals", () => {
    const estimate = estimateSignals(
      WEEKLY_CONVERSATIONS.default,
      CUSTOMER_COUNT.default,
    );

    for (const range of Object.values(estimate)) {
      expect(text).toContain(String(range.low));
      expect(text).toContain(String(range.high));
    }
  });
});
