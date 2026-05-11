export type LeadSubmission = {
  kind: "demo" | "conversations";
  name: string;
  email: string;
  company?: string;
  fileMeta?: { name: string; size: number; type: string };
};

export type LeadResponse =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function submitLead(body: LeadSubmission): Promise<LeadResponse> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return (await res.json()) as LeadResponse;
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLead(body: unknown): string | null {
  if (!body || typeof body !== "object") return "Request body must be a JSON object.";

  const b = body as Record<string, unknown>;

  if (b.kind !== "demo" && b.kind !== "conversations") {
    return "kind must be 'demo' or 'conversations'.";
  }

  if (typeof b.name !== "string" || b.name.trim() === "") {
    return "name is required.";
  }

  if (typeof b.email !== "string" || !EMAIL_RE.test(b.email)) {
    return "A valid email is required.";
  }

  if (b.kind === "demo") {
    if (typeof b.company !== "string" || b.company.trim() === "") {
      return "company is required for demo requests.";
    }
  }

  if (b.kind === "conversations") {
    const fm = b.fileMeta as Record<string, unknown> | undefined;
    if (
      !fm ||
      typeof fm !== "object" ||
      typeof fm.name !== "string" ||
      fm.name.trim() === "" ||
      typeof fm.size !== "number" ||
      fm.size <= 0
    ) {
      return "fileMeta with a non-empty name and size > 0 is required for conversations.";
    }
  }

  return null;
}
