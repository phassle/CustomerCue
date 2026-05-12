import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/preact";
import { DemoRequestForm } from "../components/DemoRequestForm";

function getInput(id: string): HTMLInputElement {
  return document.getElementById(id) as HTMLInputElement;
}

function fillAndSubmit(name = "Alex", email = "alex@example.com", company = "Acme") {
  fireEvent.input(getInput("demo-name"), { target: { value: name } });
  fireEvent.input(getInput("demo-email"), { target: { value: email } });
  fireEvent.input(getInput("demo-company"), { target: { value: company } });
  fireEvent.click(screen.getByRole("button", { name: /book a demo/i }));
}

describe("DemoRequestForm", () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders name, email, and company fields with labels", () => {
    render(<DemoRequestForm />);
    expect(getInput("demo-name")).toBeDefined();
    expect(getInput("demo-email")).toBeDefined();
    expect(getInput("demo-company")).toBeDefined();
    expect(screen.getByText("Name")).toBeDefined();
    expect(screen.getByText("Work email")).toBeDefined();
    expect(screen.getByText("Company")).toBeDefined();
  });

  it("all fields are required", () => {
    render(<DemoRequestForm />);
    expect(getInput("demo-name").required).toBe(true);
    expect(getInput("demo-email").required).toBe(true);
    expect(getInput("demo-company").required).toBe(true);
  });

  it("email field validates email shape client-side", () => {
    render(<DemoRequestForm />);
    expect(getInput("demo-email").type).toBe("email");
  });

  it("submits to /api/lead with kind: 'demo'", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true, id: "test-123" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<DemoRequestForm />);
    fillAndSubmit();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "demo",
          name: "Alex",
          email: "alex@example.com",
          company: "Acme",
        }),
      });
    });
  });

  it("shows success state on { ok: true } response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ ok: true, id: "abc-123" }),
      })
    );

    render(<DemoRequestForm />);
    fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText(/thanks/i)).toBeDefined();
      expect(screen.getByText(/abc-123/)).toBeDefined();
    });
  });

  it("shows error on { ok: false } and form remains submittable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ ok: false, error: "A valid email is required." }),
      })
    );

    render(<DemoRequestForm />);
    fillAndSubmit("Alex", "bad", "Acme");

    await waitFor(() => {
      expect(screen.getByText(/A valid email is required/)).toBeDefined();
    });

    const btn = screen.getByRole("button", { name: /book a demo/i });
    expect((btn as HTMLButtonElement).disabled).toBe(false);
  });

  it("submit button shows pending state while request is in flight", async () => {
    let resolveRequest!: (v: unknown) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockReturnValue(
        new Promise((r) => {
          resolveRequest = r;
        })
      )
    );

    render(<DemoRequestForm />);
    fillAndSubmit();

    await waitFor(() => {
      const btn = screen.getByRole("button");
      expect((btn as HTMLButtonElement).disabled).toBe(true);
      expect(btn.textContent).toMatch(/submitting/i);
    });

    resolveRequest({
      ok: true,
      json: () => Promise.resolve({ ok: true, id: "x" }),
    });
  });

  it("success state has aria-live='polite' for screen readers", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ ok: true, id: "abc-123" }),
      })
    );

    render(<DemoRequestForm />);
    fillAndSubmit();

    await waitFor(() => {
      const status = document.querySelector("[role='status']");
      expect(status).toBeDefined();
      expect(status?.getAttribute("aria-live")).toBe("polite");
    });
  });

  it("error state has aria-live='assertive' for screen readers", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ ok: false, error: "Invalid email" }),
      })
    );

    render(<DemoRequestForm />);
    fillAndSubmit("Alex", "bad", "Acme");

    await waitFor(() => {
      const alert = document.querySelector("[role='alert']");
      expect(alert).toBeDefined();
      expect(alert?.getAttribute("aria-live")).toBe("assertive");
    });
  });

  it("all inputs have visible focus-ring classes", () => {
    render(<DemoRequestForm />);
    for (const el of [getInput("demo-name"), getInput("demo-email"), getInput("demo-company")]) {
      expect(el.className).toMatch(/focus-visible:ring/);
    }
  });
});
