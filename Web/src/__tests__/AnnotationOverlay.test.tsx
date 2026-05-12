import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { render, cleanup } from "@testing-library/preact";
import { ConversationThread } from "../components/ConversationThread";
import { acmeIntegration } from "../data/conversation-fixtures/acme-integration";
import { nordicpayEnterprise } from "../data/conversation-fixtures/nordicpay-enterprise";
import { step3Onboarding } from "../data/conversation-fixtures/step3-onboarding";
import { csvWorkaround } from "../data/conversation-fixtures/csv-workaround";
import type { Annotation, Conversation } from "../data/conversation-fixtures/types";

function domOrderAnnotations(fixture: Conversation): Annotation[] {
  const msgOrder = new Map(fixture.messages.map((m, i) => [m.id, i]));
  return [...fixture.annotations].sort((a, b) => {
    const msgDiff = msgOrder.get(a.range.messageId)! - msgOrder.get(b.range.messageId)!;
    return msgDiff !== 0 ? msgDiff : a.range.start - b.range.start;
  });
}

describe("AnnotationOverlay — Acme fixture", () => {
  let ordered: Annotation[];

  beforeAll(() => {
    cleanup();
    render(<ConversationThread conversation={acmeIntegration} />);
    ordered = domOrderAnnotations(acmeIntegration);
  });

  afterAll(() => cleanup());

  it("renders a <mark> for every annotation in the fixture", () => {
    const marks = document.querySelectorAll("mark");
    expect(marks).toHaveLength(acmeIntegration.annotations.length);
  });

  it("each <mark> covers the exact substring body.slice(start, end)", () => {
    const marks = document.querySelectorAll("mark");
    const messageMap = new Map(
      acmeIntegration.messages.map((m) => [m.id, m]),
    );

    ordered.forEach((ann, i) => {
      const msg = messageMap.get(ann.range.messageId)!;
      const expected = msg.body.slice(ann.range.start, ann.range.end);
      expect(marks[i].textContent).toBe(expected);
    });
  });

  it("each <mark> carries data-signal-type matching its annotation", () => {
    const marks = document.querySelectorAll("mark");
    ordered.forEach((ann, i) => {
      expect(marks[i].getAttribute("data-signal-type")).toBe(ann.signalType);
    });
  });

  it("each <mark> carries data-annotation-id", () => {
    const marks = document.querySelectorAll("mark");
    ordered.forEach((ann, i) => {
      expect(marks[i].getAttribute("data-annotation-id")).toBe(ann.id);
    });
  });

  it("each <mark> has aria-label of the form 'highlight: <signal type>'", () => {
    const marks = document.querySelectorAll("mark");
    ordered.forEach((ann, i) => {
      expect(marks[i].getAttribute("aria-label")).toBe(
        `highlight: ${ann.signalType}`,
      );
    });
  });

  it("visual style differs across at least two signal types", () => {
    const marks = document.querySelectorAll("mark");
    const styles = new Set<string>();
    marks.forEach((m) => {
      styles.add(m.getAttribute("style") || m.className);
    });
    expect(styles.size).toBeGreaterThanOrEqual(2);
  });
});

describe("AnnotationOverlay — multi-fixture coverage", () => {
  const fixtures: [string, Conversation][] = [
    ["NordicPay", nordicpayEnterprise],
    ["step3-onboarding", step3Onboarding],
    ["csv-workaround", csvWorkaround],
  ];

  for (const [label, fixture] of fixtures) {
    describe(label, () => {
      let ordered: Annotation[];

      beforeAll(() => {
        cleanup();
        render(<ConversationThread conversation={fixture} />);
        ordered = domOrderAnnotations(fixture);
      });

      afterAll(() => cleanup());

      it(`renders exactly ${label}'s annotation count as <mark> elements`, () => {
        const marks = document.querySelectorAll("mark");
        expect(marks).toHaveLength(fixture.annotations.length);
      });

      it("each <mark> covers the correct substring", () => {
        const marks = document.querySelectorAll("mark");
        const messageMap = new Map(fixture.messages.map((m) => [m.id, m]));

        ordered.forEach((ann, i) => {
          const msg = messageMap.get(ann.range.messageId)!;
          const expected = msg.body.slice(ann.range.start, ann.range.end);
          expect(marks[i].textContent).toBe(expected);
        });
      });

      it("each <mark> carries correct data-signal-type", () => {
        const marks = document.querySelectorAll("mark");
        ordered.forEach((ann, i) => {
          expect(marks[i].getAttribute("data-signal-type")).toBe(
            ann.signalType,
          );
        });
      });
    });
  }
});
