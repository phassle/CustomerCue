// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Hero from "../components/Hero.astro";

describe("Hero", () => {
  let html: string;

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(Hero);
  });

  it("renders the verbatim tagline", () => {
    expect(html).toContain(
      "Turn support conversations into customer revenue signals."
    );
  });

  it("renders a sub-positioning line naming Intercom and Zendesk", () => {
    expect(html).toContain("Intercom");
    expect(html).toContain("Zendesk");
  });

  it("renders both CTA labels", () => {
    expect(html).toContain("Book a demo");
    expect(html).toContain("Send us 1,000 conversations");
  });

  it("primary CTA carries the accent treatment class", () => {
    const primaryMatch = html.match(/<a[^>]*>Book a demo<\/a>/s);
    expect(primaryMatch).not.toBeNull();
    expect(primaryMatch![0]).toMatch(/bg-accent/);
  });

  it("secondary CTA does not carry the accent treatment class", () => {
    const secondaryMatch = html.match(
      /<a[^>]*>Send us 1,000 conversations<\/a>/s
    );
    expect(secondaryMatch).not.toBeNull();
    expect(secondaryMatch![0]).not.toMatch(/bg-accent/);
  });

  it("both CTAs link to #cta", () => {
    const links = [...html.matchAll(/<a[^>]*href="([^"]*)"[^>]*>/g)];
    const ctaLinks = links.filter((m) => m[1] === "#cta");
    expect(ctaLinks.length).toBeGreaterThanOrEqual(2);
  });
});
