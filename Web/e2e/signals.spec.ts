import { test, expect } from "@playwright/test";

const CANONICAL_NAMES = [
  "churn risk",
  "expansion intent",
  "product friction",
  "bug cluster",
  "onboarding issue",
  "feature request",
  "negative sentiment",
  "strategic account escalation",
  "documentation gap",
  "repeated manual workaround",
];

test("/ displays all 10 canonical signal names", async ({ page }) => {
  await page.goto("/");

  for (const name of CANONICAL_NAMES) {
    await expect(page.locator(`[data-signal-cell]`, { hasText: name })).toBeVisible();
  }
});

test("/ renders exactly 10 signal cells", async ({ page }) => {
  await page.goto("/");
  const cells = page.locator("[data-signal-cell]");
  await expect(cells).toHaveCount(10);
});
