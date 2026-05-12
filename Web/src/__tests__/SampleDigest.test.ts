// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import SampleDigest from "../components/SampleDigest.astro";
import { digestFixture } from "../data/digest-fixture";

function stripTags(html: string): string {
  // &amp; must be decoded last so &amp;lt; round-trips as &lt; (not <).
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

describe("SampleDigest", () => {
  let html: string;
  let text: string;

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(SampleDigest);
    text = stripTags(html);
  });

  it("renders without error", () => {
    expect(html).toBeTruthy();
  });

  it("shows the section heading", () => {
    expect(text).toMatch(/What arrives on Monday morning/);
  });

  it("shows the intro line", () => {
    expect(text).toContain(
      "Each Monday, a digest of revenue signals from your support inbox."
    );
  });

  it("renders From, To, and Subject lines", () => {
    expect(text).toContain(digestFixture.from);
    expect(text).toContain(digestFixture.to);
    expect(text).toContain(digestFixture.subject);
  });

  it("renders the week label", () => {
    expect(text).toContain(digestFixture.weekLabel);
  });

  it("renders three signal-type labels", () => {
    for (const entry of digestFixture.entries) {
      expect(text).toContain(entry.signalType);
    }
    expect(html).toMatch(/uppercase/);
  });

  it("renders three details elements with summary text", () => {
    const summaryMatches = html.match(/<summary[\s>]/g) ?? [];
    expect(summaryMatches).toHaveLength(3);

    for (const entry of digestFixture.entries) {
      expect(text).toContain(
        `View ${entry.sourceConversationCount} source conversation`
      );
    }
  });

  it("renders the fictional badge", () => {
    expect(text).toContain(digestFixture.fictionalBadge);
  });

  it("renders the caption naming fictional accounts", () => {
    expect(text).toMatch(/Fictional data/);
    expect(text).toContain("Acme Corp");
    expect(text).toContain("NordicPay");
    expect(text).toContain("step-3 cluster");
  });

  it("renders glyphs with role=img and aria-label attributes", () => {
    for (const entry of digestFixture.entries) {
      expect(html).toContain(`role="img"`);
      expect(html).toContain(`aria-label="${entry.glyphLabel}"`);
    }
  });

  it("renders account names and headlines", () => {
    for (const entry of digestFixture.entries) {
      expect(text).toContain(entry.account);
      expect(text).toContain(entry.headline);
    }
  });

  it("renders source excerpts inside details elements", () => {
    for (const entry of digestFixture.entries) {
      for (const excerpt of entry.sourceExcerpts) {
        expect(text).toContain(excerpt.from);
        expect(text).toContain(excerpt.snippet);
      }
    }
  });
});
