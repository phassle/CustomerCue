import { test, expect } from "@playwright/test";

test.describe("Hero section", () => {
  test("hero is fully visible above the fold on 1280×800", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const tagline = page.getByText(
      "Turn support conversations into customer revenue signals."
    );
    await expect(tagline).toBeVisible();

    const primary = page.getByRole("link", { name: "Book a demo" });
    await expect(primary).toBeVisible();
    await expect(primary).toBeInViewport();

    const secondary = page.getByRole("link", {
      name: "Send us 1,000 conversations",
    });
    await expect(secondary).toBeVisible();
    await expect(secondary).toBeInViewport();
  });

  test("both CTAs are reachable by keyboard with visible focus rings", async ({
    page,
  }) => {
    await page.goto("/");

    const primary = page.getByRole("link", { name: "Book a demo" });
    const secondary = page.getByRole("link", {
      name: "Send us 1,000 conversations",
    });

    await primary.focus();
    await expect(primary).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(secondary).toBeFocused();
  });
});
