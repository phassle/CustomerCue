// @vitest-environment node
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Wordmark from "../components/Wordmark.astro";

describe("Wordmark", () => {
  it("renders the text CustomerCue", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Wordmark);
    const textContent = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    expect(textContent).toContain("CustomerCue");
  });
});
