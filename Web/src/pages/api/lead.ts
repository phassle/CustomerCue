import type { APIContext } from "astro";
import { validateLead, type LeadResponse } from "../../lib/lead-capture.js";

export const prerender = false;

function json(body: LeadResponse, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request }: APIContext): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body." }, 400);
  }

  const error = validateLead(body);
  if (error) return json({ ok: false, error }, 400);

  return json({ ok: true, id: crypto.randomUUID() }, 200);
}

export function ALL(_ctx: APIContext): Response {
  return new Response(null, { status: 405 });
}
