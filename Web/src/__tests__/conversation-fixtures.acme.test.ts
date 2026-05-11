import { describe, it, expect } from "vitest";
import { acmeIntegration } from "../data/conversation-fixtures/acme-integration";
import { SIGNAL_NAMES } from "../lib/signal-catalog";

describe("Acme integration fixture", () => {
  const conversation = acmeIntegration;

  describe("conforms to the shared shape", () => {
    it("exports a single Conversation with non-empty messages and annotations", () => {
      expect(conversation.id).toBeTruthy();
      expect(conversation.scenarioLabel).toBeTruthy();
      expect(conversation.account).toBeTruthy();
      expect(conversation.productContext).toBeTruthy();
      expect(conversation.messages.length).toBeGreaterThan(0);
      expect(conversation.annotations.length).toBeGreaterThan(0);
    });

    it("every annotation.signalType is a member of SIGNAL_NAMES", () => {
      for (const annotation of conversation.annotations) {
        expect(SIGNAL_NAMES).toContain(annotation.signalType);
      }
    });

    it("every annotation.range.messageId references a real message id", () => {
      const messageIds = new Set(conversation.messages.map((m) => m.id));
      for (const annotation of conversation.annotations) {
        expect(messageIds.has(annotation.range.messageId)).toBe(true);
      }
    });

    it("every range.start < range.end and both are within the message body", () => {
      const messagesById = new Map(
        conversation.messages.map((m) => [m.id, m]),
      );
      for (const annotation of conversation.annotations) {
        const { start, end, messageId } = annotation.range;
        expect(start).toBeLessThan(end);
        const message = messagesById.get(messageId)!;
        expect(start).toBeGreaterThanOrEqual(0);
        expect(end).toBeLessThanOrEqual(message.body.length);
      }
    });
  });

  describe("Acme narrative is covered", () => {
    it("has at least one churn risk annotation", () => {
      const churnAnnotations = conversation.annotations.filter(
        (a) => a.signalType === "churn risk",
      );
      expect(churnAnnotations.length).toBeGreaterThanOrEqual(1);
    });

    it("has at least one bug cluster annotation", () => {
      const bugAnnotations = conversation.annotations.filter(
        (a) => a.signalType === "bug cluster",
      );
      expect(bugAnnotations.length).toBeGreaterThanOrEqual(1);
    });

    it("productContext mentions ARR and renewal timing", () => {
      expect(conversation.productContext).toMatch(/ARR/i);
      expect(conversation.productContext).toMatch(/renewal/i);
    });
  });

  describe("every annotation carries human-readable explanation", () => {
    it.each(conversation.annotations)(
      "$id ($signalType) has non-empty rationale and suggestedAction",
      (a) => {
        expect(a.rationale.trim()).toBeTruthy();
        expect(a.suggestedAction.trim()).toBeTruthy();
      },
    );
  });
});
