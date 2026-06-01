import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const DETAIL = "/signals/churn-risk";

test.describe("Signal Field Guide", () => {
  test("/signals lists all 10 signal types", async ({ page }) => {
    await page.goto("/signals");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const cards = page.locator("[data-signal-card]");
    await expect(cards).toHaveCount(10);
    await expect(page.getByText(/of 10 documented/i)).toBeVisible();
  });

  test("a documented card links through to its detail page", async ({
    page,
  }) => {
    await page.goto("/signals");
    const link = page.locator('[data-signal-card][data-state="documented"]').first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/signals\/[a-z-]+\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("detail page shows the source conversation and receipts", async ({
    page,
  }) => {
    await page.goto(DETAIL);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      /churn risk/i,
    );
    // Trust contract: the source thread is rendered with highlighted evidence.
    await expect(page.locator("mark[data-signal-type]").first()).toBeVisible();
    // ...and the receipts (rationale + suggested action) are present.
    await expect(page.getByText(/why this is a churn risk signal/i)).toBeVisible();
    await expect(page.getByText(/suggested action/i).first()).toBeVisible();
    await expect(page.getByText(/fictional/i).first()).toBeVisible();
  });

  test("landing grid links to the field guide", async ({ page }) => {
    await page.goto("/");
    const link = page.locator('section#signals a[href="/signals/churn-risk"]');
    await expect(link.first()).toBeVisible();
  });

  for (const path of ["/signals", DETAIL]) {
    test(`${path} writes zero cookies and zero storage`, async ({
      page,
      context,
    }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const cookies = await context.cookies();
      expect(
        cookies,
        `Cookies set unexpectedly on ${path}: ${JSON.stringify(cookies)}. ` +
          `If you intentionally added a tracker, update /privacy and ADR 0004.`,
      ).toHaveLength(0);
      const storage = await page.evaluate(() => ({
        local: Array.from({ length: localStorage.length }, (_, i) =>
          localStorage.key(i),
        ).filter(Boolean),
        session: Array.from({ length: sessionStorage.length }, (_, i) =>
          sessionStorage.key(i),
        ).filter(Boolean),
      }));
      expect(storage.local, `localStorage written on ${path}`).toHaveLength(0);
      expect(storage.session, `sessionStorage written on ${path}`).toHaveLength(
        0,
      );
    });

    test(`${path} axe scan reports zero critical violations`, async ({
      page,
    }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const critical = results.violations.filter(
        (v) => v.impact === "critical",
      );
      expect(
        critical,
        `Critical violations on ${path}: ${JSON.stringify(critical, null, 2)}`,
      ).toHaveLength(0);
    });
  }
});
