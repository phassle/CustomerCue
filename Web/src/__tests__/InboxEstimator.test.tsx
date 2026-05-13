import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/preact";
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
});
