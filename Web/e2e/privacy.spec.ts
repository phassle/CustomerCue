import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Privacy posture", () => {
  test("/privacy renders with a single h1 and the no-tracking statement", async ({ page }) => {
    await page.goto("/privacy");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveText(/privacy/i);
    await expect(page.getByText(/we don.?t set cookies/i).first()).toBeVisible();
  });

  test("footer Privacy link on / navigates to /privacy", async ({ page }) => {
    await page.goto("/");
    const link = page.locator('footer a[href="/privacy"]');
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/privacy\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/privacy/i);
  });

  test("/ writes zero cookies", async ({ page, context }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const cookies = await context.cookies();
    expect(
      cookies,
      `Cookies set unexpectedly: ${JSON.stringify(cookies, null, 2)}. ` +
        `If you intentionally added a tracker, update /privacy and ADR 0004.`
    ).toHaveLength(0);
  });

  test("/ writes zero localStorage and sessionStorage entries", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const storage = await page.evaluate(() => ({
      local: { ...localStorage },
      session: { ...sessionStorage },
    }));
    expect(
      Object.keys(storage.local),
      `localStorage written unexpectedly: ${JSON.stringify(storage.local)}. ` +
        `If you intentionally added storage, update /privacy and ADR 0004.`
    ).toHaveLength(0);
    expect(
      Object.keys(storage.session),
      `sessionStorage written unexpectedly: ${JSON.stringify(storage.session)}.`
    ).toHaveLength(0);
  });

  test("/privacy axe scan reports zero critical violations", async ({ page }) => {
    await page.goto("/privacy");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(
      critical,
      `Critical violations: ${JSON.stringify(critical, null, 2)}`
    ).toHaveLength(0);
  });
});
