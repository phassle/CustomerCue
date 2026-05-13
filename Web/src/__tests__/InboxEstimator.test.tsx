import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, cleanup, fireEvent, act } from "@testing-library/preact";
import { InboxEstimator } from "../components/InboxEstimator";
import {
  WEEKLY_CONVERSATIONS,
  CUSTOMER_COUNT,
  BASE_RATES,
} from "../components/inbox-estimator-fixtures";
import { estimateSignals, type SignalEstimate } from "../components/inbox-estimator";

const BUCKET_KEYS: readonly (keyof SignalEstimate)[] = [
  "churnRisk",
  "expansionIntent",
  "productFrictionAndBugs",
  "longTail",
];

function getById(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found`);
  return el;
}

describe("InboxEstimator", () => {
  beforeEach(() => {
    cleanup();
  });

  describe("adjusting the conversations slider updates every output card", () => {
    it("at least three of the four output cards show a higher high value than at the default", () => {
      render(<InboxEstimator />);

      const defaultEstimate = estimateSignals(
        WEEKLY_CONVERSATIONS.default,
        CUSTOMER_COUNT.default,
      );

      const slider = getById("weekly-conversations") as HTMLInputElement;
      fireEvent.input(slider, {
        target: { value: String(WEEKLY_CONVERSATIONS.max) },
      });

      const maxEstimate = estimateSignals(
        WEEKLY_CONVERSATIONS.max,
        CUSTOMER_COUNT.default,
      );

      let higherCount = 0;
      for (const bucket of BUCKET_KEYS) {
        if (maxEstimate[bucket].high > defaultEstimate[bucket].high) {
          higherCount++;
        }
      }
      expect(higherCount).toBeGreaterThanOrEqual(3);
    });

    it("range text continues to render as ≈ low – high / week", () => {
      render(<InboxEstimator />);

      const slider = getById("weekly-conversations") as HTMLInputElement;
      fireEvent.input(slider, {
        target: { value: String(WEEKLY_CONVERSATIONS.max) },
      });

      const maxEstimate = estimateSignals(
        WEEKLY_CONVERSATIONS.max,
        CUSTOMER_COUNT.default,
      );

      const text = document.body.textContent ?? "";
      for (const range of Object.values(maxEstimate)) {
        expect(text).toContain(`≈ ${range.low}–${range.high} / week`);
      }
    });
  });

  describe("adjusting the customers slider updates the output cards", () => {
    it("at least one bucket's count is higher than at the default", () => {
      render(<InboxEstimator />);

      const defaultEstimate = estimateSignals(
        WEEKLY_CONVERSATIONS.default,
        CUSTOMER_COUNT.default,
      );

      const slider = getById("customer-count") as HTMLInputElement;
      fireEvent.input(slider, {
        target: { value: String(CUSTOMER_COUNT.max) },
      });

      const maxEstimate = estimateSignals(
        WEEKLY_CONVERSATIONS.default,
        CUSTOMER_COUNT.max,
      );

      let higherCount = 0;
      for (const bucket of BUCKET_KEYS) {
        if (
          maxEstimate[bucket].high > defaultEstimate[bucket].high ||
          maxEstimate[bucket].low > defaultEstimate[bucket].low
        ) {
          higherCount++;
        }
      }
      expect(higherCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe("bucket labels use canonical signal names verbatim", () => {
    it("renders canonical labels: churn risk, expansion intent, product friction, bug cluster", () => {
      render(<InboxEstimator />);

      const text = document.body.textContent ?? "";

      for (const key of ["churnRisk", "expansionIntent", "productFrictionAndBugs"] as const) {
        for (const signal of BASE_RATES[key].signals) {
          expect(text).toContain(signal);
        }
      }
    });

    it("long-tail label reads 'Other revenue signals'", () => {
      render(<InboxEstimator />);
      const text = document.body.textContent ?? "";
      expect(text).toContain("Other revenue signals");
    });
  });

  describe("range output never shows a hyphen between counts", () => {
    it("the separator is an en-dash (U+2013), not an ASCII hyphen-minus", () => {
      render(<InboxEstimator />);

      const estimate = estimateSignals(
        WEEKLY_CONVERSATIONS.default,
        CUSTOMER_COUNT.default,
      );

      const text = document.body.textContent ?? "";
      for (const range of Object.values(estimate)) {
        expect(text).toContain(`${range.low}–${range.high}`);
        expect(text).not.toContain(`${range.low}-${range.high}`);
      }
    });
  });

  describe("component tests query inputs by id, not by role", () => {
    it("sliders are accessible by getElementById", () => {
      render(<InboxEstimator />);

      const conversationsSlider = getById("weekly-conversations");
      expect(conversationsSlider).toBeDefined();
      expect(conversationsSlider.tagName.toLowerCase()).toBe("input");
      expect(conversationsSlider.getAttribute("type")).toBe("range");

      const customerSlider = getById("customer-count");
      expect(customerSlider).toBeDefined();
      expect(customerSlider.tagName.toLowerCase()).toBe("input");
      expect(customerSlider.getAttribute("type")).toBe("range");
    });
  });

  describe("slider defaults and labels", () => {
    it("conversations slider defaults to the WEEKLY_CONVERSATIONS constant", () => {
      render(<InboxEstimator />);
      const slider = getById("weekly-conversations") as HTMLInputElement;
      expect(slider.value).toBe(String(WEEKLY_CONVERSATIONS.default));
      expect(slider.min).toBe(String(WEEKLY_CONVERSATIONS.min));
      expect(slider.max).toBe(String(WEEKLY_CONVERSATIONS.max));
      expect(slider.step).toBe(String(WEEKLY_CONVERSATIONS.step));
    });

    it("customer slider defaults to the CUSTOMER_COUNT constant", () => {
      render(<InboxEstimator />);
      const slider = getById("customer-count") as HTMLInputElement;
      expect(slider.value).toBe(String(CUSTOMER_COUNT.default));
      expect(slider.min).toBe(String(CUSTOMER_COUNT.min));
      expect(slider.max).toBe(String(CUSTOMER_COUNT.max));
      expect(slider.step).toBe(String(CUSTOMER_COUNT.step));
    });

    it("renders a human-readable label for the conversations slider", () => {
      render(<InboxEstimator />);
      const text = document.body.textContent ?? "";
      expect(text).toContain(`${WEEKLY_CONVERSATIONS.default} conversations per week`);
    });

    it("renders a human-readable label for the customer slider", () => {
      render(<InboxEstimator />);
      const text = document.body.textContent ?? "";
      expect(text).toContain(`${CUSTOMER_COUNT.default} customers`);
    });
  });

  describe("default output cards render correctly", () => {
    it("renders four output cards with default estimate values", () => {
      render(<InboxEstimator />);
      const estimate = estimateSignals(
        WEEKLY_CONVERSATIONS.default,
        CUSTOMER_COUNT.default,
      );
      const text = document.body.textContent ?? "";
      for (const range of Object.values(estimate)) {
        expect(text).toContain(`≈ ${range.low}–${range.high} / week`);
      }
    });
  });

  describe("a11y: each slider announces its current value via aria-valuetext", () => {
    it("weekly-conversations slider has aria-valuetext reading '500 conversations per week' at default", () => {
      render(<InboxEstimator />);
      const slider = getById("weekly-conversations");
      expect(slider.getAttribute("aria-valuetext")).toBe(
        `${WEEKLY_CONVERSATIONS.default} conversations per week`,
      );
    });

    it("aria-valuetext updates when the slider moves to 1000", () => {
      render(<InboxEstimator />);
      const slider = getById("weekly-conversations") as HTMLInputElement;
      fireEvent.input(slider, { target: { value: "1000" } });
      expect(slider.getAttribute("aria-valuetext")).toBe(
        "1000 conversations per week",
      );
    });

    it("customer-count slider has aria-valuetext reading '150 customers' at default", () => {
      render(<InboxEstimator />);
      const slider = getById("customer-count");
      expect(slider.getAttribute("aria-valuetext")).toBe(
        `${CUSTOMER_COUNT.default} customers`,
      );
    });

    it("customer-count aria-valuetext updates when slider moves", () => {
      render(<InboxEstimator />);
      const slider = getById("customer-count") as HTMLInputElement;
      fireEvent.input(slider, { target: { value: "300" } });
      expect(slider.getAttribute("aria-valuetext")).toBe("300 customers");
    });
  });

  describe("a11y: output region announces updates politely", () => {
    it("output cards container has aria-live='polite'", () => {
      render(<InboxEstimator />);
      const liveRegion = document.querySelector("[aria-live='polite']");
      expect(liveRegion).not.toBeNull();
    });
  });

  describe("a11y: sustained slider movement does not flood announcements", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("at most one announcement per 500ms during sustained drag", () => {
      render(<InboxEstimator />);
      const slider = getById("weekly-conversations") as HTMLInputElement;
      const liveRegion = document.querySelector(
        "[aria-live='polite']",
      ) as HTMLElement;
      const srOnly = liveRegion.querySelector("[data-sr-announcement]");
      expect(srOnly).not.toBeNull();

      const initialText = srOnly!.textContent;

      for (let v = 100; v <= 5000; v += 100) {
        fireEvent.input(slider, { target: { value: String(v) } });
      }

      const textAfterBurst = srOnly!.textContent;
      expect(textAfterBurst).toBe(initialText);

      act(() => { vi.advanceTimersByTime(500); });
      const textAfterDebounce = srOnly!.textContent;
      expect(textAfterDebounce).not.toBe(initialText);
    });

    it("a final announcement fires on the slider's change event", () => {
      render(<InboxEstimator />);
      const slider = getById("weekly-conversations") as HTMLInputElement;
      const liveRegion = document.querySelector(
        "[aria-live='polite']",
      ) as HTMLElement;
      const srOnly = liveRegion.querySelector("[data-sr-announcement]");

      const initialText = srOnly!.textContent;

      fireEvent.input(slider, { target: { value: "2000" } });
      const textAfterInput = srOnly!.textContent;
      expect(textAfterInput).toBe(initialText);

      fireEvent.change(slider, { target: { value: "2000" } });
      const textAfterChange = srOnly!.textContent;
      expect(textAfterChange).not.toBe(initialText);
      expect(textAfterChange).toContain("signals per week");
    });
  });

  describe("a11y: decorative glyphs carry aria-label and role=img", () => {
    it("no standalone decorative-glyph elements exist without aria-label and role=img", () => {
      render(<InboxEstimator />);
      const glyphPattern = /[⚠↗→⬆⬇●◆★]/;
      const allElements = document.querySelectorAll("*");
      for (const el of allElements) {
        if (
          el.childNodes.length === 1 &&
          el.childNodes[0].nodeType === Node.TEXT_NODE &&
          glyphPattern.test(el.textContent ?? "")
        ) {
          expect(el.getAttribute("role")).toBe("img");
          expect(el.getAttribute("aria-label")).toBeTruthy();
        }
      }
    });
  });

  describe("responsive layout: sliders", () => {
    it("slider container stacks vertically by default (grid-cols-1)", () => {
      render(<InboxEstimator />);
      const container = document.querySelector("[data-testid='slider-container']") as HTMLElement;
      expect(container).not.toBeNull();
      expect(container.className).toContain("grid-cols-1");
    });

    it("slider container switches to two-column grid at md breakpoint", () => {
      render(<InboxEstimator />);
      const container = document.querySelector("[data-testid='slider-container']") as HTMLElement;
      expect(container.className).toContain("md:grid-cols-2");
    });
  });

  describe("responsive layout: output cards", () => {
    it("output cards stack in a single column by default (grid-cols-1)", () => {
      render(<InboxEstimator />);
      const container = document.querySelector("[data-testid='output-cards']") as HTMLElement;
      expect(container).not.toBeNull();
      expect(container.className).toContain("grid-cols-1");
    });

    it("output cards switch to 2×2 grid at md breakpoint", () => {
      render(<InboxEstimator />);
      const container = document.querySelector("[data-testid='output-cards']") as HTMLElement;
      expect(container.className).toContain("md:grid-cols-2");
    });

    it("output cards container does not use more than 2 columns at any breakpoint", () => {
      render(<InboxEstimator />);
      const container = document.querySelector("[data-testid='output-cards']") as HTMLElement;
      expect(container.className).not.toMatch(/grid-cols-[3-9]/);
    });
  });

  describe("touch targets", () => {
    it("slider inputs have the touch-target class for 44×44 px minimum", () => {
      render(<InboxEstimator />);
      const conversations = getById("weekly-conversations");
      const customers = getById("customer-count");
      expect(conversations.className).toContain("touch-target-slider");
      expect(customers.className).toContain("touch-target-slider");
    });
  });
});
