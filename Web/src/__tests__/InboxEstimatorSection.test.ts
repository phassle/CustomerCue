// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import InboxEstimatorSection from "../components/InboxEstimatorSection.astro";
import { INBOX_ESTIMATOR } from "../components/inbox-estimator-fixtures";
import { EXPLAINER } from "../components/ConversationExplainer";
import { CONVERSATIONS_UPLOAD } from "../components/ConversationsUploadForm";

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

  it("renders a ‘See three real examples’ link whose href uses the EXPLAINER constant", () => {
    expect(text).toContain("See three real examples");
    expect(html).toContain(`href="#${EXPLAINER}"`);
  });

  it("the examples link appears between the island and the disclaimer", () => {
    const islandPos = html.indexOf("InboxEstimator");
    const linkPos = html.indexOf("See three real examples");
    const disclaimerPos = html.indexOf("Illustrative ranges");
    expect(islandPos).toBeLessThan(linkPos);
    expect(linkPos).toBeLessThan(disclaimerPos);
  });

  it("renders a closing-line anchor linking to the upload form", () => {
    expect(html).toContain(`href="#${CONVERSATIONS_UPLOAD}"`);
  });

  it("closing-line copy contains the brief’s verbatim validation-offer phrase", () => {
    expect(text).toContain(
      "Send us 1,000 of your support conversations and we’ll return your real numbers in 48 hours",
    );
  });

  it("closing line is a plain anchor, not a button", () => {
    expect(html).toMatch(
      /<a[^>]*href="#conversations-upload"[^>]*>/,
    );
    expect(html).not.toMatch(
      /<button[^>]*>[\s\S]*?Send us 1,000[\s\S]*?<\/button>/,
    );
  });
});
