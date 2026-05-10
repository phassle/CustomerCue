// @vitest-environment node
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Footer from "../components/Footer.astro";

describe("Footer", () => {
  async function renderFooter() {
    const container = await AstroContainer.create();
    return container.renderToString(Footer);
  }

  it("renders all four section headers: Product, Company, Legal, Contact", async () => {
    const html = await renderFooter();
    for (const heading of ["Product", "Company", "Legal", "Contact"]) {
      expect(html).toContain(heading);
    }
  });

  it("renders at least one link per section", async () => {
    const html = await renderFooter();
    expect(html).toContain('href="#signals"');
    expect(html).toContain('href="#"');
    expect(html).toContain('href="mailto:hello@customercue.com"');
  });

  it("renders the Signals link under Product pointing to #signals", async () => {
    const html = await renderFooter();
    expect(html).toMatch(/Signals/);
    expect(html).toContain('href="#signals"');
  });

  it("renders About link under Company", async () => {
    const html = await renderFooter();
    expect(html).toContain("About");
  });

  it("renders Privacy and Terms links under Legal", async () => {
    const html = await renderFooter();
    expect(html).toContain("Privacy");
    expect(html).toContain("Terms");
  });

  it("renders the contact email as a mailto link", async () => {
    const html = await renderFooter();
    expect(html).toContain('href="mailto:hello@customercue.com"');
    expect(html).toContain("hello@customercue.com");
  });

  it("renders the copyright line with 2026", async () => {
    const html = await renderFooter();
    expect(html).toMatch(/(&copy;|©)\s*2026\s*CustomerCue/);
  });

  it("uses muted text token", async () => {
    const html = await renderFooter();
    expect(html).toContain("text-muted");
  });

  it("every <a> has a non-empty href", async () => {
    const hrefPattern = /<a\b[^>]*>/g;
    const html = await renderFooter();
    let match;
    let count = 0;
    while ((match = hrefPattern.exec(html)) !== null) {
      count++;
      expect(match[0]).toMatch(/href="[^"]+"/);
    }
    expect(count).toBeGreaterThan(0);
  });

  it("does not contain social icons, newsletter signup, or fake address", async () => {
    const html = await renderFooter();
    const text = html.replace(/<[^>]+>/g, "").toLowerCase();
    expect(text).not.toContain("newsletter");
    expect(text).not.toContain("subscribe");
    expect(text).not.toContain("twitter");
    expect(text).not.toContain("facebook");
    expect(text).not.toContain("linkedin");
    expect(text).not.toContain("instagram");
    expect(text).not.toMatch(/\d{3}[\s-]\d{3}[\s-]\d{4}/); // no phone numbers
  });

  it("renders the wordmark", async () => {
    const html = await renderFooter();
    const text = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ");
    expect(text).toContain("CustomerCue");
  });
});
