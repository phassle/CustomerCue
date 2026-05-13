import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Privacy posture", () => {
  test("/privacy renders with a single h1 and the no-tracking statement", async ({ page }) => {
    await page.goto("/privacy");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveText(/privacy/i);
    await expect(page.getByText(/we don.?t set cookies/i).first()).toBeVisible();
  });

  test("/privacy renders with site header and footer", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("banner")).toContainText("CustomerCue");
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
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
      localKeys: Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)),
      sessionKeys: Array.from({ length: sessionStorage.length }, (_, i) => sessionStorage.key(i)),
    }));
    expect(
      storage.localKeys.filter(Boolean),
      `localStorage written unexpectedly: ${JSON.stringify(storage.localKeys)}. ` +
        `If you intentionally added storage, update /privacy and ADR 0004.`
    ).toHaveLength(0);
    expect(
      storage.sessionKeys.filter(Boolean),
      `sessionStorage written unexpectedly: ${JSON.stringify(storage.sessionKeys)}.`
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
