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
      expect(screen.queryByRole("region")).not.toBeNull();
    });

    it("displays the matching annotation's signal type in caps", () => {
      const marks = document.querySelectorAll("mark");
      fireEvent.click(marks[0]);
      expect(
        screen.getByText(ordered[0].signalType.toUpperCase()),
      ).toBeTruthy();
    });

    it("displays the matching annotation's rationale", () => {
      const marks = document.querySelectorAll("mark");
      fireEvent.click(marks[0]);
      expect(screen.getByText(ordered[0].rationale)).toBeTruthy();
    });
  });

  describe("Scenario: Closing the panel", () => {
    it("close button removes the panel from the DOM", () => {
      const marks = document.querySelectorAll("mark");
      fireEvent.click(marks[0]);
      fireEvent.click(
        screen.getByRole("button", { name: /close rationale/i }),
      );
      expect(screen.queryByRole("region")).toBeNull();
    });

    it("Escape key closes the panel", () => {
      const marks = document.querySelectorAll("mark");
      fireEvent.click(marks[0]);
      fireEvent.keyDown(screen.getByRole("region"), { key: "Escape" });
      expect(screen.queryByRole("region")).toBeNull();
    });
  });

  describe("Scenario: Switching between highlights", () => {
    it("clicking a different <mark> updates the panel content", () => {
      const marks = document.querySelectorAll("mark");
      fireEvent.click(marks[0]);
      fireEvent.click(marks[1]);
      expect(
        screen.getByText(ordered[1].signalType.toUpperCase()),
      ).toBeTruthy();
      expect(screen.getByText(ordered[1].rationale)).toBeTruthy();
    });
  });

  describe("Scenario: Responsive placement", () => {
    it("layout container uses md:flex for side-column positioning at desktop", () => {
      const marks = document.querySelectorAll("mark");
      fireEvent.click(marks[0]);
      const panel = screen.getByRole("region");
      const layout = panel.parentElement!;
      expect(layout.className).toContain("md:flex");
    });
  });

  describe("Scenario: Accessibility", () => {
    it("panel is announced as a labelled region via aria-labelledby", () => {
      const marks = document.querySelectorAll("mark");
      fireEvent.click(marks[0]);
      const panel = screen.getByRole("region");
      const labelId = panel.getAttribute("aria-labelledby");
      expect(labelId).toBeTruthy();
      const heading = document.getElementById(labelId!);
      expect(heading).toBeTruthy();
      expect(heading!.textContent).toBe(
        ordered[0].signalType.toUpperCase(),
      );
    });

    it("Escape closes the panel from a child element within it", () => {
      const marks = document.querySelectorAll("mark");
      fireEvent.click(marks[0]);
      const rationale = screen.getByText(ordered[0].rationale);
      fireEvent.keyDown(rationale, { key: "Escape" });
      expect(screen.queryByRole("region")).toBeNull();
    });
  });

  describe("Scenario: Switching scenarios clears the panel", () => {
    it("panel closes when user switches to a different scenario", () => {
      const marks = document.querySelectorAll("mark");
      fireEvent.click(marks[0]);
      expect(screen.queryByRole("region")).not.toBeNull();

      const group = screen.getByRole("group", { name: /scenario picker/i });
      const chips = group.querySelectorAll("button");
      fireEvent.click(chips[1]);
      expect(screen.queryByRole("region")).toBeNull();
    });
  });
});
