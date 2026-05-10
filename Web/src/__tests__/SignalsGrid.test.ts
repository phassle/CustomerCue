// @vitest-environment node
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import SignalsGrid from "../components/SignalsGrid.astro";
import { getAllSignals } from "../lib/signal-catalog";

describe("SignalsGrid", () => {
  it("renders 10 cells with the canonical signal names", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SignalsGrid);
    const names = getAllSignals().map((s) => s.name);

    for (const name of names) {
      expect(html).toContain(name);
    }
  });

  it("renders exactly 10 signal cells", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SignalsGrid);
    const cellCount = (html.match(/data-signal-cell/g) || []).length;
    expect(cellCount).toBe(10);
  });
});
