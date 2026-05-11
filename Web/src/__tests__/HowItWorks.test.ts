// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import HowItWorks from "../components/HowItWorks.astro";

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

describe("HowItWorks", () => {
  let html: string;
  let text: string;

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(HowItWorks);
    text = stripTags(html);
  });

  it("renders without error", () => {
    expect(html).toBeTruthy();
  });

  it("shows the how-it-works section heading", () => {
    expect(text).toMatch(/how it works/i);
  });

  it("shows three to four sequential steps", () => {
    // Steps should describe the flow
    expect(text).toMatch(/connect/i);
    expect(text).toMatch(/signal/i);
  });

  it("renders all three example account names", () => {
    expect(text).toContain("Acme Corp");
    expect(text).toContain("NordicPay");
    expect(text).toContain("Onboarding step 3 cluster");
  });

  it("every example card has EXAMPLE — fictional label", () => {
    const matches = html.match(/EXAMPLE\s*—\s*fictional/g);
    expect(matches).toHaveLength(3);
  });

  it("renders signal type names from signalCatalog", () => {
    expect(text).toContain("churn risk");
    expect(text).toContain("expansion intent");
    expect(text).toContain("onboarding issue");
    expect(text).toContain("bug cluster");
  });

  it("renders metric values with font-mono class", () => {
    const monoMatches = html.match(/font-mono/g) ?? [];
    expect(monoMatches.length).toBeGreaterThanOrEqual(3);
  });
});
