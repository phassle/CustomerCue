import { describe, it, expect } from "vitest";
import { nordicpayEnterprise } from "../data/conversation-fixtures/nordicpay-enterprise";
import { SIGNAL_NAMES } from "../lib/signal-catalog";

describe("NordicPay enterprise fixture", () => {
  const conversation = nordicpayEnterprise;

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

  describe("NordicPay narrative covers enterprise expansion", () => {
    it("has at least three expansion intent annotations", () => {
      const expansionAnnotations = conversation.annotations.filter(
        (a) => a.signalType === "expansion intent",
      );
      expect(expansionAnnotations.length).toBeGreaterThanOrEqual(3);
    });

    it("message bodies mention SSO, audit logs, and admin roles", () => {
      const allBodies = conversation.messages.map((m) => m.body).join(" ");
      expect(allBodies).toMatch(/SSO/i);
      expect(allBodies).toMatch(/audit log/i);
      expect(allBodies).toMatch(/admin role/i);
    });
  });

  describe("annotations carry rationale and action", () => {
    it.each(nordicpayEnterprise.annotations)(
      "$id ($signalType) has non-empty rationale and suggestedAction",
      (a) => {
        expect(a.rationale.trim()).toBeTruthy();
        expect(a.suggestedAction.trim()).toBeTruthy();
      },
    );

    it("every suggested action references sales or CSM follow-up, not support resolution", () => {
      for (const annotation of conversation.annotations) {
        const action = annotation.suggestedAction.toLowerCase();
        expect(
          action.includes("sales") ||
            action.includes("csm") ||
            action.includes("account executive") ||
            action.includes("account manager"),
        ).toBe(true);
      }
    });
  });
});
