// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import InboxEstimatorSection from "../components/InboxEstimatorSection.astro";
import { INBOX_ESTIMATOR } from "../components/inbox-estimator-fixtures";

function stripTags(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

describe("InboxEstimatorSection", () => {
  let html: string;
  let text: string;

  beforeAll(async () => {
    const container = await AstroContainer.create();
    container.addServerRenderer({
      name: "@astrojs/preact",
      renderer: {
        name: "@astrojs/preact",
        check: async () => true,
        renderToStaticMarkup: async () => ({ html: "" }),
      },
    });
    container.addClientRenderer({
      name: "@astrojs/preact",
      entrypoint: "@astrojs/preact/client.js",
    });
    html = await container.renderToString(InboxEstimatorSection);
    text = stripTags(html);
  });

  it("renders the heading", () => {
    expect(text).toContain("What's hiding in your inbox?");
  });

  it("renders the subhead from the brief", () => {
    expect(text).toContain(
      "Find churn risk, expansion intent, and product friction inside your support conversations.",
    );
  });

  it("has an anchor id matching the INBOX_ESTIMATOR constant", () => {
    expect(html).toContain(`id="${INBOX_ESTIMATOR}"`);
  });

  it("renders the disclaimer", () => {
    expect(text).toContain(
      "Illustrative ranges based on patterns from our 1,000-conversation reports.",
    );
    expect(text).toContain(
      "Send us your conversations to see your real numbers.",
    );
  });

  it("contains the InboxEstimator island mount", () => {
    expect(html).toContain("InboxEstimator");
  });
});
