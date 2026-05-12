import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const EXPLAINER = 'section[aria-label="Signal explainer"]';
const MARKS = "mark[data-annotation-id]";
const RATIONALE = '[data-testid="rationale-panel"]';

async function prepareExplainer(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const section = page.locator(EXPLAINER);
  await section.scrollIntoViewIfNeeded();
  await expect(async () => {
    await page.locator(MARKS).first().click({ timeout: 1000 });
    await expect(page.locator(RATIONALE)).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15000 });
  await page.keyboard.press("Escape");
  await expect(page.locator(RATIONALE)).not.toBeVisible();
}

test.describe("Explainer", () => {
  test.describe("Default flow", () => {
    test("opens with Acme, switches to NordicPay, shows rationale on mark click", async ({
      page,
    }) => {
      await prepareExplainer(page);

      await expect(page.getByText("Dana Reeves").first()).toBeVisible();

      await page.getByRole("button", { name: /NordicPay enterprise/ }).click();
      await expect(page.getByText("Linnea Strand").first()).toBeVisible();
      await expect(page.getByText("Dana Reeves").first()).not.toBeVisible();

      await page.locator(MARKS).first().click();
      const panel = page.locator(RATIONALE);
      await expect(panel).toBeVisible();
      await expect(panel.getByText("expansion intent")).toBeVisible();
      await expect(
        panel.locator('[aria-label^="confidence:"]'),
      ).toBeVisible();
      await expect(panel.getByText("Suggested action")).toBeVisible();
    });
  });

  test.describe("Filter flow", () => {
    test("toggling documentation gap hides and restores highlights", async ({
      page,
    }) => {
      await prepareExplainer(page);

      await page.getByRole("button", { name: /Vantage CSV/ }).click();
      await expect(page.getByText("Priya Sharma").first()).toBeVisible();

      const visible = page.locator(`${MARKS}:not([data-filtered="true"])`);
      await expect(visible).toHaveCount(4);

      const filter = page.locator('[aria-label="Signal type filter"]');
      await filter
        .getByRole("button", { name: "documentation gap" })
        .click();

      await expect(visible).toHaveCount(2);
      for (const mark of await visible.all()) {
        await expect(mark).toHaveAttribute(
          "data-signal-type",
          "repeated manual workaround",
        );
      }

      await filter
        .getByRole("button", { name: "documentation gap" })
        .click();
      await expect(visible).toHaveCount(4);
    });
  });

  test.describe("Keyboard flow", () => {
    test("j traverses annotations, Enter opens rationale, Escape restores focus", async ({
      page,
    }) => {
      await prepareExplainer(page);

      await page.locator(EXPLAINER).focus();

      for (let i = 0; i < 5; i++) {
        await page.keyboard.press("j");
      }

      const focused = page.locator(`${MARKS}:focus`);
      await expect(focused).toBeVisible();
      const id = await focused.getAttribute("data-annotation-id");
      expect(id).toBe("ann-5");

      await page.keyboard.press("Enter");
      await expect(page.locator(RATIONALE)).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(page.locator(RATIONALE)).not.toBeVisible();
      await expect(page.locator(`${MARKS}:focus`)).toHaveAttribute(
        "data-annotation-id",
        id!,
      );
    });
  });

  test.describe("Accessibility", () => {
    test("zero serious or critical violations with rationale panel open", async ({
      page,
    }) => {
      await prepareExplainer(page);

      await page.locator(MARKS).first().click();
      await expect(page.locator(RATIONALE)).toBeVisible();

      const results = await new AxeBuilder({ page })
        .include(EXPLAINER)
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

  test.describe("Mobile placement", () => {
    test.use({ viewport: { width: 375, height: 700 } });

    test("rationale panel renders inline, not as floating overlay", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const section = page.locator(EXPLAINER);
      await section.scrollIntoViewIfNeeded();
      await expect(async () => {
        await page.locator(MARKS).first().click({ timeout: 1000 });
        await expect(page.locator(RATIONALE)).toBeVisible({ timeout: 1000 });
      }).toPass({ timeout: 15000 });

      const position = await page.locator(RATIONALE).evaluate(
        (el) => getComputedStyle(el).position,
      );
      // The aside must remain in the document flow (no floating overlay).
      // `static` and `relative` both keep the element in-flow; `absolute`,
      // `fixed`, and `sticky` would make it overlay-like.
      expect(["static", "relative"]).toContain(position);
    });
  });

  test.describe("Performance budget", () => {
    test("domcontentloaded within 2s and explainer interactive within 3s", async ({
      page,
    }) => {
      const start = Date.now();
      await page.goto("/", { waitUntil: "domcontentloaded" });
      expect(Date.now() - start).toBeLessThan(2000);

      const section = page.locator(EXPLAINER);
      await section.scrollIntoViewIfNeeded();
      await expect(async () => {
        await page.locator(MARKS).first().click({ timeout: 500 });
        await expect(page.locator(RATIONALE)).toBeVisible({ timeout: 500 });
      }).toPass({ timeout: 3000 });
    });
  });
});
