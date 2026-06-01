# Saas ADR 0001 — Anthropic classifier with stub fallback

**Status:** Accepted (2026-06-01)

## Context

The paste-classify feature needs to classify support conversations into one of 10 canonical signal types. The workshop demo must work reliably — both on-stage with a live API key and offline/without credentials.

## Decision

`classifyConversation()` is the single internal entry point. It:
1. Tries the **Anthropic adapter** (calls `@anthropic-ai/sdk` with the conversation text)
2. On **any** failure (missing key, network timeout, 5xx, JSON parse failure, token budget exhaustion), falls back to the **Stub Classifier**
3. Both paths return the identical `Classification` shape: `{ signalType, urgency, rationale, confidence }`

The **Stub Classifier** is a deterministic keyword matcher. First-match wins across 10 keyword sets (one per canonical type). Default = `negative sentiment`. Rationale is prefixed with `[stub]`.

A **token budget** (50k per process) prevents runaway API costs. `tryReserve(n)` throws when exceeded; the catch triggers the stub fallback. Resets on server restart.

## Consequences

- `npm install && npm run dev` works with no env vars — always falls back to stub.
- `.env.example` ships with `ANTHROPIC_API_KEY=` placeholder.
- `[stub]` prefix on rationale is the only visible difference — no silent degradation.
- Phase 2 mailbox listener calls the same `classifyConversation()` function.
- Server-only: `'use client'` files must never import from `src/lib/classifier/`.
