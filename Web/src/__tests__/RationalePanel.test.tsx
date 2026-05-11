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

function clickMarkFor(ann: Annotation) {
  const mark = Array.from(document.querySelectorAll("mark")).find(
    (m) => m.getAttribute("data-annotation-id") === ann.id,
  )!;
  fireEvent.click(mark);
  return mark;
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

  describe("Scenario: Confidence indicator reflects the annotation", () => {
    it("shows aria-label matching the annotation confidence level", () => {
      const mediumAnn = ordered.find((a) => a.confidence === "medium")!;
      clickMarkFor(mediumAnn);
      const indicator = getPanel()!.querySelector(
        '[aria-label="confidence: medium"]',
      );
      expect(indicator).not.toBeNull();
    });

    it("renders two filled and one empty dot for medium confidence", () => {
      const mediumAnn = ordered.find((a) => a.confidence === "medium")!;
      clickMarkFor(mediumAnn);
      const indicator = getPanel()!.querySelector(
        '[aria-label="confidence: medium"]',
      );
      expect(indicator!.textContent).toBe("●●○");
    });
  });

  describe("Scenario: Suggested-action block renders the annotation's action", () => {
    it("displays suggestedAction inside a labelled callout", () => {
      const marks = document.querySelectorAll("mark");
      fireEvent.click(marks[0]);
      const panel = getPanel()!;
      expect(panel.textContent).toContain("Suggested action");
      expect(panel.textContent).toContain(ordered[0].suggestedAction);
    });
  });

  describe("Scenario: Confidence levels visually differ", () => {
    it("low, medium, and high produce distinct dot patterns", () => {
      const lowAnn = ordered.find((a) => a.confidence === "low")!;
      const medAnn = ordered.find((a) => a.confidence === "medium")!;
      const highAnn = ordered.find((a) => a.confidence === "high")!;

      const dotsFor = (ann: Annotation) => {
        clickMarkFor(ann);
        return getPanel()!.querySelector(`[aria-label="confidence: ${ann.confidence}"]`)!
          .textContent;
      };

      expect(dotsFor(lowAnn)).toBe("●○○");
      expect(dotsFor(medAnn)).toBe("●●○");
      expect(dotsFor(highAnn)).toBe("●●●");
    });
  });

  describe("Scenario: Accessibility — confidence is announced once", () => {
    it("decorative dots are aria-hidden", () => {
      const marks = document.querySelectorAll("mark");
      fireEvent.click(marks[0]);
      const indicator = getPanel()!.querySelector(
        `[aria-label="confidence: ${ordered[0].confidence}"]`,
      );
      const dots = indicator!.querySelector('[aria-hidden="true"]');
      expect(dots).not.toBeNull();
    });
  });
});
