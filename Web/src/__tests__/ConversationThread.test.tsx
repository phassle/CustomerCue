import { describe, it, expect, beforeAll } from "vitest";
import { render, screen, cleanup } from "@testing-library/preact";
import { ConversationThread } from "../components/ConversationThread";
import { acmeIntegration } from "../data/conversation-fixtures/acme-integration";

describe("ConversationThread", () => {
  beforeAll(() => {
    cleanup();
    render(<ConversationThread conversation={acmeIntegration} />);
  });

  describe("renders all messages from the fixture", () => {
    it("every message body appears in the DOM in fixture order", () => {
      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(acmeIntegration.messages.length);

      acmeIntegration.messages.forEach((msg, i) => {
        expect(articles[i].textContent).toContain(msg.body);
      });
    });

    it("each message shows its authorName", () => {
      const uniqueAuthors = [
        ...new Set(acmeIntegration.messages.map((m) => m.authorName)),
      ];
      for (const name of uniqueAuthors) {
        expect(screen.getAllByText(name).length).toBeGreaterThan(0);
      }
    });

    it("each message shows its timestamp", () => {
      for (const msg of acmeIntegration.messages) {
        expect(screen.getByText(msg.timestamp)).toBeDefined();
      }
    });
  });

  describe("ticket header reflects the conversation", () => {
    it("scenarioLabel is visible in a header region", () => {
      const banner = screen.getByRole("banner");
      expect(banner.textContent).toContain(acmeIntegration.scenarioLabel);
    });

    it("account is visible in a header region", () => {
      const banner = screen.getByRole("banner");
      expect(banner.textContent).toContain(acmeIntegration.account);
    });

    it("productContext is visible in a header region", () => {
      const banner = screen.getByRole("banner");
      expect(banner.textContent).toContain(acmeIntegration.productContext);
    });
  });

  describe("customer and agent messages are visually distinguished", () => {
    it("customer messages have a different class than agent messages", () => {
      const articles = screen.getAllByRole("article");
      const customerArticle = articles[0]; // msg-1: Dana (customer)
      const agentArticle = articles[1]; // msg-2: Kai (agent)

      expect(customerArticle.className).not.toBe(agentArticle.className);
    });
  });

  describe("accessibility", () => {
    it("each message is an article labelled with its author", () => {
      const articles = screen.getAllByRole("article");
      acmeIntegration.messages.forEach((msg, i) => {
        expect(articles[i].getAttribute("aria-label")).toContain(msg.authorName);
      });
    });

    it("message list reads in fixture order", () => {
      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(acmeIntegration.messages.length);
      for (let i = 0; i < articles.length; i++) {
        expect(articles[i].textContent).toContain(
          acmeIntegration.messages[i].body,
        );
      }
    });
  });
});
