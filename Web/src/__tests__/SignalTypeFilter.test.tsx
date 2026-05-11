import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/preact";
import { ConversationExplainer } from "../components/ConversationExplainer";

function getFilterGroup() {
  return screen.getByRole("group", { name: /signal type filter/i });
}

function getFilterChips() {
  return getFilterGroup().querySelectorAll("button");
}

function getScenarioChips() {
  return screen
    .getByRole("group", { name: /scenario picker/i })
    .querySelectorAll("button");
}

describe("SignalTypeFilter", () => {
  beforeEach(() => {
    cleanup();
    render(<ConversationExplainer />);
  });

  describe("Filter renders one chip per active signal type", () => {
    it("NordicPay fixture shows exactly one chip", () => {
      fireEvent.click(getScenarioChips()[1]);
      expect(getFilterChips()).toHaveLength(1);
    });

    it("chip label is 'expansion intent' verbatim from signal-catalog.ts", () => {
      fireEvent.click(getScenarioChips()[1]);
      expect(getFilterChips()[0].textContent).toContain("expansion intent");
    });

    it("CSV-workaround fixture shows two chips", () => {
      fireEvent.click(getScenarioChips()[3]);
      expect(getFilterChips()).toHaveLength(2);
    });
  });

  describe("Toggling a chip hides matching highlights", () => {
    it("clicking documentation gap hides its marks but not others", () => {
      fireEvent.click(getScenarioChips()[3]);

      const docGapChip = Array.from(getFilterChips()).find((c) =>
        c.textContent?.includes("documentation gap"),
      )!;
      fireEvent.click(docGapChip);

      const docGapMarks = document.querySelectorAll(
        'mark[data-signal-type="documentation gap"]',
      );
      for (const mark of docGapMarks) {
        expect((mark as HTMLElement).hidden).toBe(true);
      }

      const workaroundMarks = document.querySelectorAll(
        'mark[data-signal-type="repeated manual workaround"]',
      );
      for (const mark of workaroundMarks) {
        expect((mark as HTMLElement).hidden).toBe(false);
      }
    });
  });

  describe("Toggling restores the highlights", () => {
    it("toggling off then on makes marks visible again", () => {
      fireEvent.click(getScenarioChips()[3]);

      const docGapChip = Array.from(getFilterChips()).find((c) =>
        c.textContent?.includes("documentation gap"),
      )!;

      fireEvent.click(docGapChip);
      fireEvent.click(docGapChip);

      const docGapMarks = document.querySelectorAll(
        'mark[data-signal-type="documentation gap"]',
      );
      for (const mark of docGapMarks) {
        expect((mark as HTMLElement).hidden).toBe(false);
      }
    });
  });

  describe("Filter change is announced to screen readers", () => {
    it("aria-live region updates with hidden state", () => {
      fireEvent.click(getScenarioChips()[3]);

      const docGapChip = Array.from(getFilterChips()).find((c) =>
        c.textContent?.includes("documentation gap"),
      )!;
      fireEvent.click(docGapChip);

      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).not.toBeNull();
      expect(liveRegion!.textContent).toContain("documentation gap");
      expect(liveRegion!.textContent).toMatch(/hidden/i);
    });

    it("aria-live region updates with visible state on re-toggle", () => {
      fireEvent.click(getScenarioChips()[3]);

      const docGapChip = Array.from(getFilterChips()).find((c) =>
        c.textContent?.includes("documentation gap"),
      )!;
      fireEvent.click(docGapChip);
      fireEvent.click(docGapChip);

      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion!.textContent).toContain("documentation gap");
      expect(liveRegion!.textContent).toMatch(/visible/i);
    });
  });

  describe("Filter resets when scenario changes", () => {
    it("switching scenarios clears all hidden filters", () => {
      fireEvent.click(getScenarioChips()[3]);

      const docGapChip = Array.from(getFilterChips()).find((c) =>
        c.textContent?.includes("documentation gap"),
      )!;
      fireEvent.click(docGapChip);

      fireEvent.click(getScenarioChips()[1]);
      fireEvent.click(getScenarioChips()[3]);

      const docGapMarks = document.querySelectorAll(
        'mark[data-signal-type="documentation gap"]',
      );
      for (const mark of docGapMarks) {
        expect((mark as HTMLElement).hidden).toBe(false);
      }
    });

    it("filter chips reflect new scenario signal types", () => {
      fireEvent.click(getScenarioChips()[3]);
      expect(getFilterChips()).toHaveLength(2);

      fireEvent.click(getScenarioChips()[1]);
      expect(getFilterChips()).toHaveLength(1);
    });
  });
});
