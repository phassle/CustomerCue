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

function getExplainer() {
  return screen.getByRole("region", {
    name: /signal explainer/i,
  }) as HTMLElement;
}

function getMarks() {
  return Array.from(
    document.querySelectorAll("mark[data-annotation-id]"),
  ) as HTMLElement[];
}

function pressKey(key: string, target?: HTMLElement) {
  fireEvent.keyDown(target ?? document.activeElement!, { key });
}

describe("ConversationExplainer — keyboard navigation", () => {
  const orderedAcme = domOrderAnnotations(acmeIntegration);

  beforeEach(() => {
    cleanup();
    render(<ConversationExplainer />);
  });

  describe("j advances to the next annotation", () => {
    it("first j press focuses the first annotation in document order", () => {
      const container = getExplainer();
      container.focus();
      pressKey("j", container);
      const marks = getMarks();
      expect(document.activeElement).toBe(marks[0]);
    });

    it("second j press moves focus to the second annotation", () => {
      const container = getExplainer();
      container.focus();
      pressKey("j", container);
      pressKey("j");
      const marks = getMarks();
      expect(document.activeElement).toBe(marks[1]);
    });
  });

  describe("k moves backwards", () => {
    it("k from second annotation moves to first", () => {
      const marks = getMarks();
      marks[1].focus();
      pressKey("k");
      expect(document.activeElement).toBe(marks[0]);
    });
  });

  describe("wrap-around", () => {
    it("j from last annotation wraps to first", () => {
      const marks = getMarks();
      marks[marks.length - 1].focus();
      pressKey("j");
      expect(document.activeElement).toBe(marks[0]);
    });

    it("k from first annotation wraps to last", () => {
      const marks = getMarks();
      marks[0].focus();
      pressKey("k");
      expect(document.activeElement).toBe(marks[marks.length - 1]);
    });
  });

  describe("Enter opens the rationale panel", () => {
    it("pressing Enter on focused annotation shows rationale panel", () => {
      const marks = getMarks();
      marks[0].focus();
      pressKey("Enter");
      const panel = document.querySelector("[data-testid='rationale-panel']");
      expect(panel).not.toBeNull();
      expect(panel!.textContent).toContain(orderedAcme[0].rationale);
    });

    it("rationale panel shows signal type and suggested action", () => {
      const marks = getMarks();
      marks[0].focus();
      pressKey("Enter");
      const panel = document.querySelector("[data-testid='rationale-panel']");
      expect(panel!.textContent).toContain(orderedAcme[0].signalType);
      expect(panel!.textContent).toContain(orderedAcme[0].suggestedAction);
    });
  });

  describe("Escape closes the rationale panel", () => {
    it("Escape closes the panel and focus returns to the annotation", () => {
      const marks = getMarks();
      marks[0].focus();
      pressKey("Enter");
      expect(
        document.querySelector("[data-testid='rationale-panel']"),
      ).not.toBeNull();
      pressKey("Escape");
      expect(
        document.querySelector("[data-testid='rationale-panel']"),
      ).toBeNull();
      expect(document.activeElement).toBe(marks[0]);
    });
  });

  describe("filter interaction", () => {
    it("j/k skip annotations whose signal type is hidden", () => {
      const group = screen.getByRole("group", { name: /scenario picker/i });
      const buttons = group.querySelectorAll("button");
      fireEvent.click(buttons[3]); // switch to CSV-workaround

      const allMarks = getMarks();
      allMarks.forEach((mark) => {
        if (mark.getAttribute("data-signal-type") === "documentation gap") {
          mark.hidden = true;
        }
      });

      const visibleMarks = getMarks().filter((m) => !m.hidden);
      expect(visibleMarks).toHaveLength(2);

      const container = getExplainer();
      container.focus();
      pressKey("j", container);
      expect(document.activeElement).toBe(visibleMarks[0]);

      pressKey("j");
      expect(document.activeElement).toBe(visibleMarks[1]);

      pressKey("j");
      expect(document.activeElement).toBe(visibleMarks[0]);

      pressKey("k");
      expect(document.activeElement).toBe(visibleMarks[1]);
    });
  });
});
