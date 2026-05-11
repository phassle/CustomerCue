import { test, expect } from "@playwright/test";

test.describe("Performance", () => {
  test("page load event fires within 2 seconds", async ({ page }) => {
    const start = Date.now();
    await page.goto("/", { waitUntil: "load" });
    const loadTime = Date.now() - start;

    expect(loadTime).toBeLessThan(2000);
  });

  test("cache-control meta tags are present to prevent stale content", async ({
    page,
  }) => {
    await page.goto("/");

    const cacheControl = await page.locator(
      'meta[http-equiv="Cache-Control"]'
    ).getAttribute("content");
    expect(cacheControl).toContain("no-cache");

    const pragma = await page.locator(
      'meta[http-equiv="Pragma"]'
    ).getAttribute("content");
    expect(pragma).toBe("no-cache");

    const expires = await page.locator(
      'meta[http-equiv="Expires"]'
    ).getAttribute("content");
    expect(expires).toBe("0");
  });
});
