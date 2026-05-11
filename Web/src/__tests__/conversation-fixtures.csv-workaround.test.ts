import { describe, it, expect } from "vitest";
import { csvWorkaround } from "../data/conversation-fixtures/csv-workaround";
import { SIGNAL_NAMES } from "../lib/signal-catalog";

describe("CSV workaround fixture", () => {
  const conversation = csvWorkaround;

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

  describe("both signal types are present", () => {
    it("has at least one repeated manual workaround annotation", () => {
      const workaroundAnnotations = conversation.annotations.filter(
        (a) => a.signalType === "repeated manual workaround",
      );
      expect(workaroundAnnotations.length).toBeGreaterThanOrEqual(1);
    });

    it("has at least one documentation gap annotation", () => {
      const docGapAnnotations = conversation.annotations.filter(
        (a) => a.signalType === "documentation gap",
      );
      expect(docGapAnnotations.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("workaround narrative is recognisable", () => {
    it("customer describes a process they perform manually", () => {
      const customerBodies = conversation.messages
        .filter((m) => m.author === "customer")
        .map((m) => m.body.toLowerCase())
        .join(" ");
      expect(customerBodies).toMatch(/manual/);
    });

    it("agent acknowledges missing functionality or missing documentation", () => {
      const agentBodies = conversation.messages
        .filter((m) => m.author === "agent")
        .map((m) => m.body.toLowerCase())
        .join(" ");
      const mentionsMissing =
        /documentation/.test(agentBodies) || /missing/.test(agentBodies);
      expect(mentionsMissing).toBe(true);
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
