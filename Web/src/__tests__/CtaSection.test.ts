// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import CtaSection from "../components/CtaSection.astro";

describe("CtaSection", () => {
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
    const result = await container.renderToString(CtaSection);
    html = result;
  });

  it("renders with id='cta' anchor", () => {
    expect(html).toContain('id="cta"');
  });

  it("renders a section element", () => {
    expect(html).toMatch(/<section[^>]*id="cta"/);
  });

  it("renders 'Book a demo' CTA", () => {
    expect(html).toContain("Book a demo");
  });

  it("renders 'Send us 1,000 conversations' CTA", () => {
    expect(html).toContain("Send us 1,000 conversations");
  });

  it("primary CTA uses accent styling (visually dominant)", () => {
    const match = html.match(/<span[^>]*>[^<]*Book a demo[^<]*<\/span>/);
    expect(match).not.toBeNull();
    expect(match![0]).toContain("bg-accent");
  });

  it("secondary CTA uses outline styling", () => {
    const match = html.match(
      /<span[^>]*>[^<]*Send us 1,000 conversations[^<]*<\/span>/
    );
    expect(match).not.toBeNull();
    expect(match![0]).toContain("border");
  });

  it("contains a placeholder slot for conversations form", () => {
    expect(html).toContain("conversations-form-slot");
  });
});
