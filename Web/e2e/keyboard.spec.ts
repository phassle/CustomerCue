import { test, expect } from "@playwright/test";

test.describe("Keyboard navigation", () => {
  test("tab visits every interactive element from header to footer with visible focus rings", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const expectedOrder = [
      { role: "link", name: /Book a demo/i },
      { role: "link", name: /Send us 1,000 conversations/i },
      { role: "textbox", name: /^Name$/i, form: "demo" },
      { role: "textbox", name: /Work email/i, form: "demo" },
      { role: "textbox", name: /Company/i },
      { role: "button", name: /Book a demo/i },
      { role: "textbox", name: /^Name$/i, form: "conv" },
      { role: "textbox", name: /Work email/i, form: "conv" },
      { role: "file", name: /Conversations file/i },
      // Submit button is disabled (no file selected) — skipped in tab order
      { role: "link", name: /Signals/i },
      { role: "link", name: /About/i },
      { role: "link", name: /Privacy/i },
      { role: "link", name: /Terms/i },
      { role: "link", name: /hello@customercue\.com/i },
    ];

    const visited: string[] = [];

    for (const expected of expectedOrder) {
      await page.keyboard.press("Tab");

      const focused = page.locator(":focus");
      await expect(focused).toBeVisible();

      if (expected.role === "link") {
        const role = await focused.getAttribute("role");
        const tag = await focused.evaluate((el) => el.tagName.toLowerCase());
        expect(role === "link" || tag === "a").toBeTruthy();
        const text = await focused.textContent();
        expect(text).toMatch(expected.name);
      } else if (expected.role === "textbox") {
        const tag = await focused.evaluate((el) => el.tagName.toLowerCase());
        expect(tag).toBe("input");
        const id = await focused.getAttribute("id");
        expect(id).toBeTruthy();
        const label = page.locator(`label[for="${id}"]`);
        const labelText = await label.textContent();
        expect(labelText).toMatch(expected.name);
      } else if (expected.role === "button") {
        const tag = await focused.evaluate((el) => el.tagName.toLowerCase());
        expect(tag).toBe("button");
        const text = await focused.textContent();
        expect(text).toMatch(expected.name);
      } else if (expected.role === "file") {
        const type = await focused.getAttribute("type");
        expect(type).toBe("file");
      }

      const ring = await focused.evaluate((el) => {
        const style = getComputedStyle(el);
        const outline = style.outline;
        const boxShadow = style.boxShadow;
        return { outline, boxShadow };
      });
      const hasVisibleFocus =
        (ring.outline && ring.outline !== "none" && !ring.outline.includes("0px")) ||
        (ring.boxShadow && ring.boxShadow !== "none");
      expect(
        hasVisibleFocus,
        `No visible focus ring on element with text: "${await focused.textContent()}"`
      ).toBeTruthy();

      visited.push(
        `${expected.role}: ${expected.name}`
      );
    }

    expect(visited).toHaveLength(expectedOrder.length);
  });

  test("demo form can be submitted by keyboard alone", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Scroll the CTA form into view and wait for Preact hydration
    await page.locator("#demo-name").scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () => !document.querySelectorAll("astro-island")[0]?.hasAttribute("ssr"),
    );

    await page.locator("#demo-name").fill("Test User");
    await page.locator("#demo-email").fill("test@example.com");
    await page.locator("#demo-company").fill("TestCo");

    await page.getByRole("button", { name: /Book a demo/i }).focus();
    await page.keyboard.press("Enter");

    const success = page.locator("[role='status']").first();
    await expect(success).toBeVisible({ timeout: 10000 });
    await expect(success).toContainText("Thanks");
  });
});
