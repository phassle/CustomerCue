# Anthropic classifier with Stub-Classifier fallback

**Date:** 2026-05-13
**Status:** accepted

## Decision

The **Paste-classify** route calls the Anthropic API to classify a pasted **Conversation** into one of the 10 canonical signal types from [`../../../docs/signals.md`](../../../docs/signals.md). The call returns `{ signalType, urgency, rationale, confidence }`.

On any failure — missing key, network timeout, 5xx, JSON parse error, or per-process token cap exceeded — the route falls back to a deterministic **Stub Classifier** that keyword-matches the same Conversation and returns the same output shape, with `[stub]` prefixed to the **Rationale**.

Both paths go through one internal function: `classifyConversation(conv): Promise<Classification>`. The Phase 2 mailbox listener will call this same function with no UI involved.

This is the **only** "for real" external dependency in the app. Everything else (Intercom/Zendesk ingest, Slack/CRM routing, sign-in, persistence) stays mocked per [`../../../docs/conventions.md`](../../../docs/conventions.md).

## Context

`brief.md` explicitly flags two top risks: "customers do not trust AI signals without clear sources" and "ROI is hard to prove if alerts do not lead to action." The workshop demo's job is to make the AI step visible — paste a real-looking ticket, watch Claude classify it, see it land in the queue with a **Rationale**. A purely mocked classifier removes the most demo-worthy moment from the app.

A live API call introduces a demo-failure surface: the workshop laptop's network can flake, the API can rate-limit, the key can be missing. A demo that dies on stage is worse than a slightly-less-magic demo that always works.

## Why this shape

1. **Same output contract from both paths.** UI code never branches on which classifier ran. Only visible difference is the `[stub]` prefix on **Rationale** — honest, not hidden.
2. **One internal function**. `classifyConversation()` owns the try-real-then-stub logic. Routes, the Phase 2 mailbox listener, and tests all call it the same way.
3. **Per-process token cap** of ~50k as a workshop-cost guard. Exceeded → stub. Resets on server restart (consistent with the broader in-memory-only persistence stance).
4. **`[stub]` is shown, not buried.** Audience can tell when the live API didn't run. No silent degradation.

## Considered alternatives

- **Mocked classifier only.** Rejected: the workshop's "for real" angle was the whole point. Mocked-only is what the prototype already did.
- **Live Anthropic with no fallback.** Rejected: one network blip on stage and the demo is dead.
- **Cache real classifications to disk and replay on rerun.** Rejected as premature — workshop runs are one-shot, no value in replay yet. Reintroduce in Phase 2 if the mailbox listener needs deterministic fixtures.
- **Hide the `[stub]` label.** Rejected: silent degradation in a demo about trustworthy AI signals would contradict the Trust Contract spirit.

## Consequences

- `Saas/` adds `@anthropic-ai/sdk` as a server-only dependency. `'use client'` modules must not import it; the import-boundary is enforced by Next.js App Router's server/client split.
- `.env.example` ships with `ANTHROPIC_API_KEY=` placeholder; `.env.local` is gitignored and holds the real key on the workshop laptop.
- The **Stub Classifier** keeps parity with the canonical signal taxonomy in `../../../docs/signals.md`. If the taxonomy ever extends, both classifiers update in the same PR.
- Phase 2's mailbox listener PRD calls `classifyConversation()` directly with `Conversation` instances pulled from the (mocked) inbox — no re-implementing of the route's plumbing, no second fallback path.
- In-memory state across the app (Signals, **Actioned log**, **Conversation** store, paste-classify counters) is consistent with this ADR's "demo-only, restart resets" stance. No DB, no file-backed JSON, no Vercel KV in v1.
