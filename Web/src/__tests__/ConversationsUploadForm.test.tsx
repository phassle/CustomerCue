import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
} from "@testing-library/preact";
import { ConversationsUploadForm } from "../components/ConversationsUploadForm";

function getInput(id: string): HTMLInputElement {
  return document.getElementById(id) as HTMLInputElement;
}

function createFile(
  name = "export.csv",
  size = 1024,
  type = "text/csv",
): File {
  const content = new Uint8Array(size);
  return new File([content], name, { type });
}

function fillForm(name = "Alex", email = "alex@example.com") {
  fireEvent.input(getInput("conv-name"), { target: { value: name } });
  fireEvent.input(getInput("conv-email"), { target: { value: email } });
}

function attachFile(file?: File) {
  const f = file ?? createFile();
  const input = getInput("conv-file");
  Object.defineProperty(input, "files", { value: [f], configurable: true });
  fireEvent.change(input);
}

function fillAndSubmit(
  name = "Alex",
  email = "alex@example.com",
  file?: File,
) {
  fillForm(name, email);
  attachFile(file);
  fireEvent.click(screen.getByRole("button", { name: /send conversations/i }));
}

describe("ConversationsUploadForm", () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders name, email, and file fields with labels", () => {
    render(<ConversationsUploadForm />);
    expect(getInput("conv-name")).toBeDefined();
    expect(getInput("conv-email")).toBeDefined();
    expect(getInput("conv-file")).toBeDefined();
    expect(screen.getByText("Name")).toBeDefined();
    expect(screen.getByText("Work email")).toBeDefined();
  });

  it("renders the 'what's expected' block with three lines", () => {
    render(<ConversationsUploadForm />);
    expect(screen.getByText(/CSV, JSON, ZIP/)).toBeDefined();
    expect(screen.getByText(/same pipeline/i)).toBeDefined();
    expect(screen.getByText(/48 hours/)).toBeDefined();
  });

  it("all text fields are required", () => {
    render(<ConversationsUploadForm />);
    expect(getInput("conv-name").required).toBe(true);
    expect(getInput("conv-email").required).toBe(true);
  });

  it("file input is required", () => {
    render(<ConversationsUploadForm />);
    expect(getInput("conv-file").required).toBe(true);
  });

  it("email field validates email shape client-side", () => {
    render(<ConversationsUploadForm />);
    expect(getInput("conv-email").type).toBe("email");
  });

  it("submit button is disabled until a file is selected", () => {
    render(<ConversationsUploadForm />);
    fillForm();
    const btn = screen.getByRole("button", {
      name: /send conversations/i,
    }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);

    attachFile();
    expect(btn.disabled).toBe(false);
  });

  it("submits to /api/lead with kind: 'conversations' and fileMeta", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true, id: "test-456" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<ConversationsUploadForm />);
    const file = createFile("export.csv", 2048, "text/csv");
    fillAndSubmit("Alex", "alex@example.com", file);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "conversations",
          name: "Alex",
          email: "alex@example.com",
          fileMeta: { name: "export.csv", size: 2048, type: "text/csv" },
        }),
      });
    });
  });

  it("does NOT send file bytes in the request", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true, id: "test-789" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<ConversationsUploadForm />);
    fillAndSubmit();

    await waitFor(() => {
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.fileMeta).toBeDefined();
      expect(body.file).toBeUndefined();
      expect(typeof body.fileMeta.name).toBe("string");
      expect(typeof body.fileMeta.size).toBe("number");
      expect(typeof body.fileMeta.type).toBe("string");
    });
  });

  it("shows success state on { ok: true } with id and 48-hour promise", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ ok: true, id: "conv-abc" }),
      }),
    );

    render(<ConversationsUploadForm />);
    fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText(/48 hours/)).toBeDefined();
      expect(screen.getByText(/conv-abc/)).toBeDefined();
    });
  });

  it("shows error on { ok: false } and form remains submittable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ ok: false, error: "A valid email is required." }),
      }),
    );

    render(<ConversationsUploadForm />);
    fillAndSubmit("Alex", "bad");

    await waitFor(() => {
      expect(screen.getByText(/A valid email is required/)).toBeDefined();
    });

    const btn = screen.getByRole("button", {
      name: /send conversations/i,
    }) as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });

  it("submit button shows pending state while request is in flight", async () => {
    let resolveRequest!: (v: unknown) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockReturnValue(
        new Promise((r) => {
          resolveRequest = r;
        }),
      ),
    );

    render(<ConversationsUploadForm />);
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

  it("all inputs have visible focus-ring classes", () => {
    render(<ConversationsUploadForm />);
    for (const el of [
      getInput("conv-name"),
      getInput("conv-email"),
      getInput("conv-file"),
    ]) {
      expect(el.className).toMatch(/focus-visible:ring/);
    }
  });
});
