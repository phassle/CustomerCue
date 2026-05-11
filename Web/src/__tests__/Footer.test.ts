// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Footer from "../components/Footer.astro";

describe("Footer", () => {
  let html: string;

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(Footer);
  });

  it("renders all four section headers: Product, Company, Legal, Contact", () => {
    for (const heading of ["Product", "Company", "Legal", "Contact"]) {
      expect(html).toContain(heading);
    }
  });

  it("renders at least one link per section", () => {
    expect(html).toContain('href="#signals"');
    expect(html).toContain('href="#"');
    expect(html).toContain('href="mailto:hello@customercue.com"');
  });

  it("renders the Signals link under Product pointing to #signals", () => {
    expect(html).toMatch(/Signals/);
    expect(html).toContain('href="#signals"');
  });

  it("renders About link under Company", () => {
    expect(html).toContain("About");
  });

  it("renders Privacy and Terms links under Legal", () => {
    expect(html).toContain("Privacy");
    expect(html).toContain("Terms");
  });

  it("renders the contact email as a mailto link", () => {
    expect(html).toContain('href="mailto:hello@customercue.com"');
    expect(html).toContain("hello@customercue.com");
  });

  it("renders the copyright line with the current year", () => {
    const year = new Date().getFullYear();
    expect(html).toMatch(new RegExp(`(&copy;|©)\\s*${year}\\s*CustomerCue`));
  });

  it("uses muted text token", () => {
    expect(html).toContain("text-muted");
  });

  it("every <a> has a non-empty href", () => {
    const anchorPattern = /<a\b[^>]*>/g;
    let match;
    let count = 0;
    while ((match = anchorPattern.exec(html)) !== null) {
      count++;
      expect(match[0]).toMatch(/href="[^"]+"/);
    }
    expect(count).toBeGreaterThan(0);
  });

  it("does not contain social icons, newsletter signup, or fake address", () => {
    const text = html.replace(/<[^>]+>/g, "").toLowerCase();
    expect(text).not.toContain("newsletter");
    expect(text).not.toContain("subscribe");
    expect(text).not.toContain("twitter");
    expect(text).not.toContain("facebook");
    expect(text).not.toContain("linkedin");
    expect(text).not.toContain("instagram");
    expect(text).not.toMatch(/\d{3}[\s-]\d{3}[\s-]\d{4}/);
  });

  it("all links have focus-visible ring classes", () => {
    const anchorPattern = /<a\b[^>]*class="([^"]*)"[^>]*>/g;
    let match;
    let count = 0;
    while ((match = anchorPattern.exec(html)) !== null) {
      count++;
      expect(match[1]).toContain("focus-visible:ring");
    }
    expect(count).toBeGreaterThan(0);
  });

  it("renders the wordmark", () => {
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    expect(text).toContain("CustomerCue");
  });
});
