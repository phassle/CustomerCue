import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/preact";
import { ScenarioPicker } from "../components/ScenarioPicker";
import { acmeIntegration } from "../data/conversation-fixtures/acme-integration";
import { nordicpayEnterprise } from "../data/conversation-fixtures/nordicpay-enterprise";
import { step3Onboarding } from "../data/conversation-fixtures/step3-onboarding";
import { csvWorkaround } from "../data/conversation-fixtures/csv-workaround";
import type { Conversation } from "../data/conversation-fixtures/types";

const fixtures: Conversation[] = [
  acmeIntegration,
  nordicpayEnterprise,
  step3Onboarding,
  csvWorkaround,
];

describe("ScenarioPicker", () => {
  let onSelect: ReturnType<typeof vi.fn<(index: number) => void>>;

  beforeEach(() => {
    cleanup();
    onSelect = vi.fn<(index: number) => void>();
  });

  describe("four chips render", () => {
    it("renders exactly four chips", () => {
      render(
        <ScenarioPicker
          scenarios={fixtures}
          activeIndex={0}
          onSelect={onSelect}
        />,
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(4);
    });

    it("each chip label matches its fixture scenarioLabel", () => {
      render(
        <ScenarioPicker
          scenarios={fixtures}
          activeIndex={0}
          onSelect={onSelect}
        />,
      );
      for (const fixture of fixtures) {
        expect(screen.getByText(fixture.scenarioLabel)).toBeDefined();
      }
    });
  });

  describe("default scenario is Acme", () => {
    it("Acme chip has aria-pressed true when activeIndex is 0", () => {
      render(
        <ScenarioPicker
          scenarios={fixtures}
          activeIndex={0}
          onSelect={onSelect}
        />,
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons[0].getAttribute("aria-pressed")).toBe("true");
    });

    it("non-active chips have aria-pressed false", () => {
      render(
        <ScenarioPicker
          scenarios={fixtures}
          activeIndex={0}
          onSelect={onSelect}
        />,
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons[1].getAttribute("aria-pressed")).toBe("false");
      expect(buttons[2].getAttribute("aria-pressed")).toBe("false");
      expect(buttons[3].getAttribute("aria-pressed")).toBe("false");
    });
  });

  describe("clicking a chip switches scenarios", () => {
    it("calls onSelect with the clicked chip index", () => {
      render(
        <ScenarioPicker
          scenarios={fixtures}
          activeIndex={0}
          onSelect={onSelect}
        />,
      );
      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[1]);
      expect(onSelect).toHaveBeenCalledWith(1);
    });
  });

  describe("keyboard navigation across chips", () => {
    it("right arrow moves focus to the next chip", () => {
      render(
        <ScenarioPicker
          scenarios={fixtures}
          activeIndex={0}
          onSelect={onSelect}
        />,
      );
      const buttons = screen.getAllByRole("button");
      buttons[0].focus();
      fireEvent.keyDown(buttons[0], { key: "ArrowRight" });
      expect(document.activeElement).toBe(buttons[1]);
    });

    it("left arrow moves focus to the previous chip", () => {
      render(
        <ScenarioPicker
          scenarios={fixtures}
          activeIndex={0}
          onSelect={onSelect}
        />,
      );
      const buttons = screen.getAllByRole("button");
      buttons[1].focus();
      fireEvent.keyDown(buttons[1], { key: "ArrowLeft" });
      expect(document.activeElement).toBe(buttons[0]);
    });

    it("Enter on a focused chip activates that scenario", () => {
      render(
        <ScenarioPicker
          scenarios={fixtures}
          activeIndex={0}
          onSelect={onSelect}
        />,
      );
      const buttons = screen.getAllByRole("button");
      buttons[2].focus();
      fireEvent.keyDown(buttons[2], { key: "Enter" });
      expect(onSelect).toHaveBeenCalledWith(2);
    });

    it("Space on a focused chip activates that scenario", () => {
      render(
        <ScenarioPicker
          scenarios={fixtures}
          activeIndex={0}
          onSelect={onSelect}
        />,
      );
      const buttons = screen.getAllByRole("button");
      buttons[3].focus();
      fireEvent.keyDown(buttons[3], { key: " " });
      expect(onSelect).toHaveBeenCalledWith(3);
    });
  });

  describe("wrap-around on arrow nav", () => {
    it("right arrow from last chip wraps to first chip", () => {
      render(
        <ScenarioPicker
          scenarios={fixtures}
          activeIndex={0}
          onSelect={onSelect}
        />,
      );
      const buttons = screen.getAllByRole("button");
      buttons[3].focus();
      fireEvent.keyDown(buttons[3], { key: "ArrowRight" });
      expect(document.activeElement).toBe(buttons[0]);
    });

    it("left arrow from first chip wraps to last chip", () => {
      render(
        <ScenarioPicker
          scenarios={fixtures}
          activeIndex={0}
          onSelect={onSelect}
        />,
      );
      const buttons = screen.getAllByRole("button");
      buttons[0].focus();
      fireEvent.keyDown(buttons[0], { key: "ArrowLeft" });
      expect(document.activeElement).toBe(buttons[3]);
    });
  });
});
