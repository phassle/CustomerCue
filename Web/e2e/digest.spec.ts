import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Sample digest section", () => {
  test("section is visible on the landing page between signals grid and CTA", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const heading = page.getByRole("heading", {
      name: /What arrives on Monday morning/i,
    });
    await expect(heading).toBeVisible();

    const order = await page.evaluate(() => {
      const ids = ["signals", "sample-digest", "cta"];
      const positions: Record<string, number> = {};
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) positions[id] = el.getBoundingClientRect().top;
      }
      return positions;
    });
    expect(order["signals"]).toBeLessThan(order["sample-digest"]);
    expect(order["sample-digest"]).toBeLessThan(order["cta"]);
  });

  test("each summary is keyboard-activatable and reveals excerpts", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const summaries = page.locator("#sample-digest summary");
    await expect(summaries).toHaveCount(3);

    for (let i = 0; i < 3; i++) {
      const summary = summaries.nth(i);
      const details = summary.locator("..");

      await expect(details).not.toHaveAttribute("open", "");

      await summary.focus();
      await page.keyboard.press("Enter");

      await expect(details).toHaveAttribute("open", "");

      const blockquotes = details.locator("blockquote");
      await expect(blockquotes.first()).toBeVisible();
    }
  });

  test("axe scan reports zero serious or critical violations in digest section", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .include("#sample-digest")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(
      serious,
      `Serious/critical violations: ${JSON.stringify(serious, null, 2)}`,
    ).toHaveLength(0);
  });
});
