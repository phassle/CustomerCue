import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/preact";
import { ConversationExplainer } from "../components/ConversationExplainer";
import { acmeIntegration } from "../data/conversation-fixtures/acme-integration";
import type { Annotation, Conversation } from "../data/conversation-fixtures/types";

function domOrderAnnotations(fixture: Conversation): Annotation[] {
  const msgOrder = new Map(fixture.messages.map((m, i) => [m.id, i]));
  return [...fixture.annotations].sort((a, b) => {
    const msgDiff =
      msgOrder.get(a.range.messageId)! - msgOrder.get(b.range.messageId)!;
    return msgDiff !== 0 ? msgDiff : a.range.start - b.range.start;
  });
}

function getPanel() {
  return document.querySelector("[data-testid='rationale-panel']");
}

function getExplainer() {
  return screen.getByRole("region", { name: /signal explainer/i });
}

describe("RationalePanel", () => {
  let ordered: Annotation[];

  beforeEach(() => {
    cleanup();
    render(<ConversationExplainer />);
    ordered = domOrderAnnotations(acmeIntegration);
  });

  describe("Scenario: Clicking a highlight opens the panel", () => {
    it("panel appears when the first <mark> is clicked", () => {
      const marks = document.querySelectorAll("mark");
      fireEvent.click(marks[0]);
      expect(getPanel()).not.toBeNull();
    });

    it("displays the matching annotation's signal type", () => {
      const marks = document.querySelectorAll("mark");
      fireEvent.click(marks[0]);
      const panel = getPanel()!;
      expect(panel.textContent).toContain(ordered[0].signalType);
    });

    it("displays the matching annotation's rationale", () => {
      const marks = document.querySelectorAll("mark");
      fireEvent.click(marks[0]);
      expect(screen.getByText(ordered[0].rationale)).toBeTruthy();
    });
  });

  describe("Scenario: Closing the panel", () => {
    it("Escape key closes the panel", () => {
      const marks = document.querySelectorAll("mark");
      fireEvent.click(marks[0]);
      expect(getPanel()).not.toBeNull();
      fireEvent.keyDown(getExplainer(), { key: "Escape" });
      expect(getPanel()).toBeNull();
    });
  });

  describe("Scenario: Switching between highlights", () => {
    it("clicking a different <mark> updates the panel content", () => {
      const marks = document.querySelectorAll("mark");
      fireEvent.click(marks[0]);
      fireEvent.click(marks[1]);
      const panel = getPanel()!;
      expect(panel.textContent).toContain(ordered[1].signalType);
      expect(panel.textContent).toContain(ordered[1].rationale);
    });
  });

  describe("Scenario: Suggested action", () => {
    it("displays the matching annotation's suggested action", () => {
      const marks = document.querySelectorAll("mark");
      fireEvent.click(marks[0]);
      expect(screen.getByText(ordered[0].suggestedAction)).toBeTruthy();
    });
  });

  describe("Scenario: Switching scenarios clears the panel", () => {
    it("panel closes when user switches to a different scenario", () => {
      const marks = document.querySelectorAll("mark");
      fireEvent.click(marks[0]);
      expect(getPanel()).not.toBeNull();

      const group = screen.getByRole("group", { name: /scenario picker/i });
      const chips = group.querySelectorAll("button");
      fireEvent.click(chips[1]);
      expect(getPanel()).toBeNull();
    });
  });
});
