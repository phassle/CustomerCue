// @vitest-environment node
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Layout from "../layouts/Layout.astro";

describe("Layout", () => {
  it("applies the background token class to <body>", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Layout, {
      props: { title: "Test" },
      slots: { default: "<p>Hello</p>" },
    });
    expect(html).toMatch(/body[^>]*bg-background/);
  });
});
