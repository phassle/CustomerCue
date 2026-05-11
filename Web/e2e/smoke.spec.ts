import { test, expect } from "@playwright/test";

test("/ renders CustomerCue in the header", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  await expect(header).toBeVisible();
  await expect(header).toContainText("CustomerCue");
});

test("footer is visible at the bottom of /", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeVisible();
});

test("every footer <a> has a non-empty href", async ({ page }) => {
  await page.goto("/");
  const links = page.locator("footer a");
  const count = await links.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute("href");
    expect(href).toBeTruthy();
  }
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
