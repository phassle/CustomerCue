import { test, expect, type Page, type Locator } from "@playwright/test";

type ExpectedFocus =
  | { role: "link"; name: RegExp }
  | { role: "textbox"; name: RegExp; form?: string }
  | { role: "slider"; name: RegExp }
  | { role: "button"; name: RegExp }
  | { role: "file"; name: RegExp }
  | { role: "summary"; name: RegExp };

async function assertFocus(page: Page, expected: ExpectedFocus): Promise<void> {
  const focused: Locator = page.locator(":focus");
  await expect(focused).toBeVisible();

  switch (expected.role) {
    case "link": {
      const role = await focused.getAttribute("role");
      const tag = await focused.evaluate((el) => el.tagName.toLowerCase());
      expect(role === "link" || tag === "a").toBeTruthy();
      const text = await focused.textContent();
      expect(text).toMatch(expected.name);
      break;
    }
    case "textbox": {
      const tag = await focused.evaluate((el) => el.tagName.toLowerCase());
      expect(tag).toBe("input");
      const id = await focused.getAttribute("id");
      expect(id).toBeTruthy();
      const label = page.locator(`label[for="${id}"]`);
      const labelText = await label.textContent();
      expect(labelText).toMatch(expected.name);
      break;
    }
    case "slider": {
      const tag = await focused.evaluate((el) => el.tagName.toLowerCase());
      expect(tag).toBe("input");
      const type = await focused.getAttribute("type");
      expect(type).toBe("range");
      const id = await focused.getAttribute("id");
      expect(id).toBeTruthy();
      const label = page.locator(`label[for="${id}"]`);
      const labelText = await label.textContent();
      expect(labelText).toMatch(expected.name);
      break;
    }
    case "button": {
      const tag = await focused.evaluate((el) => el.tagName.toLowerCase());
      expect(tag).toBe("button");
      const text = await focused.textContent();
      expect(text).toMatch(expected.name);
      break;
    }
    case "file": {
      const type = await focused.getAttribute("type");
      expect(type).toBe("file");
      break;
    }
    case "summary": {
      const tag = await focused.evaluate((el) => el.tagName.toLowerCase());
      expect(tag).toBe("summary");
      const text = await focused.textContent();
      expect(text).toMatch(expected.name);
      break;
    }
  }

  const ring = await focused.evaluate((el) => {
    const style = getComputedStyle(el);
    return { outline: style.outline, boxShadow: style.boxShadow };
  });
  const hasVisibleFocus =
    (ring.outline && ring.outline !== "none" && !ring.outline.includes("0px")) ||
    (ring.boxShadow && ring.boxShadow !== "none");
  expect(
    hasVisibleFocus,
    `No visible focus ring on element with text: "${await focused.textContent()}"`,
  ).toBeTruthy();
}

test.describe("Keyboard navigation", () => {
  test("tab visits hero, digest, CTA, and footer interactive elements with visible focus rings", async ({
    page,
  }) => {
    // Explainer tab order (scenario chips, filter chips, annotated marks) is
    // covered end-to-end in explainer.spec.ts. This spec asserts the rest of
    // the page tab order around it.
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const heroOrder: ExpectedFocus[] = [
      { role: "link", name: /Book a demo/i },
      { role: "link", name: /Send us 1,000 conversations/i },
    ];

    const postExplainerOrder: ExpectedFocus[] = [
      // InboxEstimatorSection sits between Explainer and SampleDigest in DOM
      // order (Web/src/pages/index.astro). Its two range sliders plus two
      // anchor links take tab focus before the digest's <summary> elements.
      { role: "slider", name: /conversations per week/i },
      { role: "slider", name: /customers/i },
      { role: "link", name: /See three real examples/i },
      { role: "link", name: /Send us 1,000 of your support conversations/i },
      { role: "summary", name: /View 6 source conversations/i },
      { role: "summary", name: /View 4 source conversations/i },
      { role: "summary", name: /View 37 source conversations/i },
      { role: "textbox", name: /^Name$/i, form: "demo" },
      { role: "textbox", name: /Work email/i, form: "demo" },
      { role: "textbox", name: /Company/i },
      { role: "button", name: /Book a demo/i },
      { role: "textbox", name: /^Name$/i, form: "conv" },
      { role: "textbox", name: /Work email/i, form: "conv" },
      { role: "file", name: /Conversations file/i },
      // Submit button is disabled (no file selected) — skipped in tab order
      { role: "link", name: /Signals/i },
      // About / Terms render as non-link placeholders — skipped in tab order.
      // Privacy is a real link to /privacy (ADR 0004).
      { role: "link", name: /^Privacy$/i },
      { role: "link", name: /hello@customercue\.com/i },
    ];

    // Count explainer focusables so we can tab past them. The count is dynamic
    // — filter chip count varies by scenario and mark count varies by fixture.
    const explainerFocusableCount = await page.evaluate(() => {
      const section = document.querySelector('[aria-label="Signal explainer"]');
      if (!section) return 0;
      return section.querySelectorAll(
        'button, mark[tabindex="0"], [href], input, select, textarea',
      ).length;
    });

    for (const expected of heroOrder) {
      await page.keyboard.press("Tab");
      await assertFocus(page, expected);
    }

    for (let i = 0; i < explainerFocusableCount; i++) {
      await page.keyboard.press("Tab");
    }

    for (const expected of postExplainerOrder) {
      await page.keyboard.press("Tab");
      await assertFocus(page, expected);
    }
  });

  test("demo form can be submitted by keyboard alone", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Scroll the CTA form into view and wait for its specific island to
    // hydrate. The page now has multiple astro-islands (explainer, demo form,
    // uploads form) in DOM order, so we can't just check the first one.
    await page.locator("#demo-name").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const input = document.getElementById("demo-name");
      const island = input?.closest("astro-island");
      return Boolean(island && !island.hasAttribute("ssr"));
    });

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
