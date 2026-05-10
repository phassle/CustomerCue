import { test, expect } from "@playwright/test";

test("/ renders CustomerCue in the header", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header");
  await expect(header).toBeVisible();
  await expect(header).toContainText("CustomerCue");
});

test("/ has a dark background", async ({ page }) => {
  await page.goto("/");
  const body = page.locator("body");
  const bg = await body.evaluate((el) => getComputedStyle(el).backgroundColor);
  // bg-background should be a dark colour — RGB values all below 30
  const match = bg.match(/(\d+),\s*(\d+),\s*(\d+)/);
  expect(match).not.toBeNull();
  const [r, g, b] = [Number(match![1]), Number(match![2]), Number(match![3])];
  expect(r).toBeLessThan(30);
  expect(g).toBeLessThan(30);
  expect(b).toBeLessThan(30);
});
