import { test, expect } from "@playwright/test";
import {
  INBOX_ESTIMATOR,
} from "../src/components/inbox-estimator-fixtures";
import { EXPLAINER } from "../src/components/ConversationExplainer";
import { CONVERSATIONS_UPLOAD } from "../src/components/ConversationsUploadForm";

const HYDRATION_SELECTOR =
  'astro-island[component-url*="InboxEstimator"][client-render-time]';

test.describe("Inbox estimator", () => {
  test("section is reachable and heading is visible", async ({ page }) => {
    await page.goto("/");
    const section = page.locator(`#${INBOX_ESTIMATOR}`);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
    await expect(
      section.getByRole("heading", { name: "What's hiding in your inbox?" }),
    ).toBeVisible();
  });

  test("slider movement updates churn risk output card", async ({ page }) => {
    await page.goto("/");
    const section = page.locator(`#${INBOX_ESTIMATOR}`);
    await section.scrollIntoViewIfNeeded();
    await expect(page.locator(HYDRATION_SELECTOR)).toBeAttached();

    const churnCard = section.locator('[data-testid="range-churnRisk"]');
    const initialText = await churnCard.textContent();

    const slider = section.locator("#weekly-conversations");
    await slider.focus();
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press("ArrowRight");
    }

    await expect(churnCard).not.toHaveText(initialText!);
  });

  test("disclaimer is visible after interaction", async ({ page }) => {
    await page.goto("/");
    const section = page.locator(`#${INBOX_ESTIMATOR}`);
    await section.scrollIntoViewIfNeeded();
    await expect(page.locator(HYDRATION_SELECTOR)).toBeAttached();

    const slider = section.locator("#weekly-conversations");
    await slider.focus();
    await page.keyboard.press("ArrowRight");

    await expect(section.getByText("Illustrative ranges")).toBeVisible();
  });

  test("'See three real examples' anchor scrolls to explainer", async ({
    page,
  }) => {
    await page.goto("/");
    const section = page.locator(`#${INBOX_ESTIMATOR}`);
    await section.scrollIntoViewIfNeeded();

    await section
      .getByRole("link", { name: /See three real examples/ })
      .click();

    await expect(page).toHaveURL(new RegExp(`#${EXPLAINER}$`));
    const explainer = page.locator(`#${EXPLAINER}`);
    await expect(explainer).toBeInViewport();
  });

  test("closing line anchor scrolls to upload form", async ({ page }) => {
    await page.goto("/");
    const section = page.locator(`#${INBOX_ESTIMATOR}`);
    await section.scrollIntoViewIfNeeded();

    await section.getByRole("link", { name: /Send us 1,000/ }).click();

    await expect(page).toHaveURL(new RegExp(`#${CONVERSATIONS_UPLOAD}$`));
    const uploadForm = page.locator(`#${CONVERSATIONS_UPLOAD}`);
    await expect(uploadForm).toBeInViewport();
  });
});
