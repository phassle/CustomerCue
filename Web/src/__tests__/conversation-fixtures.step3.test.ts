import { describe, it, expect } from "vitest";
import { step3Onboarding } from "../data/conversation-fixtures/step3-onboarding";
import { SIGNAL_NAMES } from "../lib/signal-catalog";

describe("Step-3 onboarding fixture", () => {
  const conversation = step3Onboarding;

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

  describe("narrative is onboarding-specific", () => {
    it("has at least three onboarding issue annotations", () => {
      const onboardingAnnotations = conversation.annotations.filter(
        (a) => a.signalType === "onboarding issue",
      );
      expect(onboardingAnnotations.length).toBeGreaterThanOrEqual(3);
    });

    it("the conversation explicitly references step 3 of onboarding", () => {
      const allBodies = conversation.messages.map((m) => m.body).join(" ");
      expect(allBodies).toMatch(/step\s*3/i);
    });
  });

  describe("suggested actions target product, not support", () => {
    it.each(
      conversation.annotations.filter(
        (a) => a.signalType === "onboarding issue",
      ),
    )(
      "$id suggestedAction mentions product/PM/feature-team escalation",
      (a) => {
        expect(a.suggestedAction).toMatch(
          /product|PM|feature.team|escalat/i,
        );
      },
    );

    it.each(
      conversation.annotations.filter(
        (a) => a.signalType === "onboarding issue",
      ),
    )(
      "$id suggestedAction does not resolve the ticket — it routes the pattern",
      (a) => {
        expect(a.suggestedAction).not.toMatch(
          /close.*(ticket|issue)|resolve.*(ticket|issue)|mark.*(resolved|closed)/i,
        );
      },
    );
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
