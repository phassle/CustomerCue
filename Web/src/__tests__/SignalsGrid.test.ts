// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import SignalsGrid from "../components/SignalsGrid.astro";
import { getAllSignals } from "../lib/signal-catalog";

describe("SignalsGrid", () => {
  let html: string;

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(SignalsGrid);
  });

  it("renders 10 cells with the canonical signal names", () => {
    const names = getAllSignals().map((s) => s.name);
    for (const name of names) {
      expect(html).toContain(name);
    }
  });

  it("has id='signals' anchor for footer link", () => {
    expect(html).toMatch(/id=["']signals["']/);
  });

  it("renders exactly 10 signal cells", () => {
    const cellCount = (html.match(/data-signal-cell/g) || []).length;
    expect(cellCount).toBe(10);
  });
});
