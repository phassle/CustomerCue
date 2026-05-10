import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility", () => {
  test("axe scan reports zero critical violations on /", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === "critical"
    );
    expect(critical, `Critical violations: ${JSON.stringify(critical, null, 2)}`).toHaveLength(0);
  });

  test("page has exactly one h1 and no skipped heading levels", async ({
    page,
  }) => {
    await page.goto("/");

    const headings = await page.evaluate(() => {
      const els = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      return Array.from(els).map((el) => ({
        level: parseInt(el.tagName[1]),
        text: el.textContent?.trim() ?? "",
      }));
    });

    const h1s = headings.filter((h) => h.level === 1);
    expect(h1s).toHaveLength(1);

    for (let i = 1; i < headings.length; i++) {
      const jump = headings[i].level - headings[i - 1].level;
      expect(
        jump,
        `Heading skip: "${headings[i - 1].text}" (h${headings[i - 1].level}) → "${headings[i].text}" (h${headings[i].level})`
      ).toBeLessThanOrEqual(1);
    }
  });

  test("page has header, main, and footer landmarks", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("all form inputs have associated labels", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const unlabelled = await page.evaluate(() => {
      const inputs = document.querySelectorAll(
        "input:not([type='hidden']):not([type='submit'])"
      );
      return Array.from(inputs).filter((input) => {
        const id = input.getAttribute("id");
        if (id && document.querySelector(`label[for="${id}"]`)) return false;
        if (input.closest("label")) return false;
        if (input.getAttribute("aria-label")) return false;
        if (input.getAttribute("aria-labelledby")) return false;
        return true;
      }).length;
    });
    expect(unlabelled).toBe(0);
  });
});
