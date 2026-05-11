import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/preact";
import { ConversationExplainer } from "../components/ConversationExplainer";
import { acmeIntegration } from "../data/conversation-fixtures/acme-integration";
import { nordicpayEnterprise } from "../data/conversation-fixtures/nordicpay-enterprise";
import { step3Onboarding } from "../data/conversation-fixtures/step3-onboarding";
import { csvWorkaround } from "../data/conversation-fixtures/csv-workaround";

describe("ConversationExplainer", () => {
  beforeEach(() => {
    cleanup();
    render(<ConversationExplainer />);
  });

  describe("renders ScenarioPicker with all four fixtures", () => {
    it("four scenario chips are visible", () => {
      const group = screen.getByRole("group", { name: /scenario picker/i });
      const buttons = group.querySelectorAll("button");
      expect(buttons).toHaveLength(4);
    });

    it("each chip label matches its fixture scenarioLabel", () => {
      const group = screen.getByRole("group", { name: /scenario picker/i });
      const buttons = group.querySelectorAll("button");
      const labels = Array.from(buttons).map((b) => b.textContent);
      expect(labels).toContain(acmeIntegration.scenarioLabel);
      expect(labels).toContain(nordicpayEnterprise.scenarioLabel);
      expect(labels).toContain(step3Onboarding.scenarioLabel);
      expect(labels).toContain(csvWorkaround.scenarioLabel);
    });
  });

  describe("default scenario is Acme", () => {
    it("Acme chip is active on mount", () => {
      const group = screen.getByRole("group", { name: /scenario picker/i });
      const buttons = group.querySelectorAll("button");
      expect(buttons[0].getAttribute("aria-pressed")).toBe("true");
    });

    it("Acme conversation is rendered below", () => {
      const banner = screen.getByRole("banner");
      expect(banner.textContent).toContain(acmeIntegration.account);
    });
  });

  function getChips() {
    const group = screen.getByRole("group", { name: /scenario picker/i });
    return group.querySelectorAll("button");
  }

  describe("clicking a chip switches scenarios", () => {
    it("clicking NordicPay chip renders NordicPay conversation", () => {
      fireEvent.click(getChips()[1]);
      const banner = screen.getByRole("banner");
      expect(banner.textContent).toContain(nordicpayEnterprise.account);
    });

    it("NordicPay chip becomes active after click", () => {
      const chips = getChips();
      fireEvent.click(chips[1]);
      expect(chips[1].getAttribute("aria-pressed")).toBe("true");
    });

    it("Acme chip becomes inactive after switching", () => {
      const chips = getChips();
      fireEvent.click(chips[1]);
      expect(chips[0].getAttribute("aria-pressed")).toBe("false");
    });
  });

  describe("all four scenarios are reachable", () => {
    it("step-3 onboarding scenario renders its conversation", () => {
      fireEvent.click(getChips()[2]);
      const banner = screen.getByRole("banner");
      expect(banner.textContent).toContain(step3Onboarding.account);
    });

    it("CSV workaround scenario renders its conversation", () => {
      fireEvent.click(getChips()[3]);
      const banner = screen.getByRole("banner");
      expect(banner.textContent).toContain(csvWorkaround.account);
    });
  });

  describe("section heading and intro", () => {
    it("heading reads 'Watch a support conversation become a signal.'", () => {
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading.textContent).toBe(
        "Watch a support conversation become a signal."
      );
    });

    it("intro mentions clicking highlights and switching scenarios", () => {
      expect(screen.getByText(/Click any highlight to see the rationale/));
      expect(
        screen.getByText(
          /Switch scenarios to see four signal types in action/
        )
      );
    });
  });

  describe("scenario switch resets to clean state", () => {
    it("switching back to Acme after visiting NordicPay re-renders Acme", () => {
      const group = screen.getByRole("group", { name: /scenario picker/i });
      const buttons = group.querySelectorAll("button");

      fireEvent.click(buttons[1]);
      fireEvent.click(buttons[0]);

      const banner = screen.getByRole("banner");
      expect(banner.textContent).toContain(acmeIntegration.account);
      expect(buttons[0].getAttribute("aria-pressed")).toBe("true");
    });
  });
});
