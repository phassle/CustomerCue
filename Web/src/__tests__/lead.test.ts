import { describe, it, expect } from "vitest";
import { validateLead, type LeadSubmission } from "../lib/lead-capture.js";

const validDemo: LeadSubmission = {
  kind: "demo",
  name: "Alex",
  email: "alex@example.com",
  company: "Acme",
};

const validConversations: LeadSubmission = {
  kind: "conversations",
  name: "Alex",
  email: "alex@example.com",
  fileMeta: { name: "export.csv", size: 1024, type: "text/csv" },
};

describe("validateLead", () => {
  it("accepts a valid demo submission", () => {
    const result = validateLead(validDemo);
    expect(result).toBeNull();
  });

  it("accepts a valid conversations submission", () => {
    const result = validateLead(validConversations);
    expect(result).toBeNull();
  });

  it("rejects missing kind", () => {
    const result = validateLead({ name: "Alex", email: "a@b.com" });
    expect(result).toMatch(/kind/i);
  });

  it("rejects unknown kind", () => {
    const result = validateLead({ kind: "other", name: "Alex", email: "a@b.com" });
    expect(result).toMatch(/kind/i);
  });

  it("rejects missing name", () => {
    const result = validateLead({ ...validDemo, name: "" });
    expect(result).toMatch(/name/i);
  });

  it("rejects missing name field entirely", () => {
    const { name, ...rest } = validDemo;
    const result = validateLead(rest);
    expect(result).toMatch(/name/i);
  });

  it("rejects invalid email", () => {
    const result = validateLead({ ...validDemo, email: "not-an-email" });
    expect(result).toMatch(/email/i);
  });

  it("rejects missing email", () => {
    const result = validateLead({ ...validDemo, email: "" });
    expect(result).toMatch(/email/i);
  });

  it("rejects demo without company", () => {
    const { company, ...rest } = validDemo;
    const result = validateLead(rest);
    expect(result).toMatch(/company/i);
  });

  it("rejects demo with empty company", () => {
    const result = validateLead({ ...validDemo, company: "" });
    expect(result).toMatch(/company/i);
  });

  it("rejects conversations without fileMeta", () => {
    const { fileMeta, ...rest } = validConversations;
    const result = validateLead(rest);
    expect(result).toMatch(/file/i);
  });

  it("rejects conversations with empty fileMeta name", () => {
    const result = validateLead({
      ...validConversations,
      fileMeta: { name: "", size: 1024, type: "text/csv" },
    });
    expect(result).toMatch(/file/i);
  });

  it("rejects conversations with fileMeta size 0", () => {
    const result = validateLead({
      ...validConversations,
      fileMeta: { name: "export.csv", size: 0, type: "text/csv" },
    });
    expect(result).toMatch(/file/i);
  });
});

describe("POST /api/lead handler", () => {
  async function callHandler(method: string, body?: unknown) {
    const { POST, ALL } = await import("../pages/api/lead.js");
    if (method !== "POST") {
      return ALL({ request: new Request("http://localhost/api/lead", { method }) } as any);
    }
    const request = new Request("http://localhost/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return POST({ request } as any);
  }

  it("returns 200 with ok and id for valid demo", async () => {
    const res = await callHandler("POST", validDemo);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.id).toBeTypeOf("string");
    expect(json.id.length).toBeGreaterThan(0);
  });

  it("returns 200 with ok and id for valid conversations", async () => {
    const res = await callHandler("POST", validConversations);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.id).toBeTypeOf("string");
    expect(json.id.length).toBeGreaterThan(0);
  });

  it("generates unique ids per request", async () => {
    const res1 = await callHandler("POST", validDemo);
    const res2 = await callHandler("POST", validDemo);
    const json1 = await res1.json();
    const json2 = await res2.json();
    expect(json1.id).not.toBe(json2.id);
  });

  it("returns 400 for missing kind", async () => {
    const res = await callHandler("POST", { name: "Alex", email: "a@b.com" });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toBeTypeOf("string");
  });

  it("returns 400 for invalid email", async () => {
    const res = await callHandler("POST", { ...validDemo, email: "bad" });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toMatch(/email/i);
  });

  it("returns 400 for demo missing company", async () => {
    const { company, ...rest } = validDemo;
    const res = await callHandler("POST", rest);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
  });

  it("returns 400 for conversations missing fileMeta", async () => {
    const { fileMeta, ...rest } = validConversations;
    const res = await callHandler("POST", rest);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
  });

  it("returns 405 for GET", async () => {
    const res = await callHandler("GET");
    expect(res.status).toBe(405);
  });

  it("returns 405 for PUT", async () => {
    const res = await callHandler("PUT");
    expect(res.status).toBe(405);
  });
});
