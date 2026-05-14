// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import IndexPage from "../pages/index.astro";
import { INBOX_ESTIMATOR } from "../components/inbox-estimator-fixtures";

describe("Page integration: / renders ConversationExplainer", () => {
  let html: string;

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
    html = await container.renderToString(IndexPage);
  });

  it("renders the ConversationExplainer island", () => {
    expect(html).toContain("ConversationExplainer");
  });

  it("does not render the old HowItWorks section", () => {
    expect(html).not.toContain('id="how-it-works"');
  });

  it("does not contain how-it-works step content", () => {
    expect(html).not.toContain("Connect your support inbox");
  });

  it("explainer appears between Hero and Signals sections", () => {
    const heroPos = html.indexOf("</h1>");
    const explainerPos = html.indexOf("ConversationExplainer");
    const signalsPos = html.indexOf('id="signals"');
    expect(heroPos).toBeGreaterThan(-1);
    expect(explainerPos).toBeGreaterThan(-1);
    expect(signalsPos).toBeGreaterThan(-1);
    expect(heroPos).toBeLessThan(explainerPos);
    expect(explainerPos).toBeLessThan(signalsPos);
  });

  it("inbox estimator appears between Signals and Sample Digest sections", () => {
    const signalsPos = html.indexOf('id="signals"');
    const estimatorPos = html.indexOf(`id="${INBOX_ESTIMATOR}"`);
    const digestPos = html.indexOf('id="sample-digest"');
    expect(signalsPos).toBeGreaterThan(-1);
    expect(estimatorPos).toBeGreaterThan(-1);
    expect(digestPos).toBeGreaterThan(-1);
    expect(signalsPos).toBeLessThan(estimatorPos);
    expect(estimatorPos).toBeLessThan(digestPos);
  });
});
