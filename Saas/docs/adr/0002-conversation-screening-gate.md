# Conversation Screening gate before classification

**Date:** 2026-06-01
**Status:** accepted

## Decision

A new internal function `screenConversation(conv): Promise<ScreeningVerdict>` runs **before** `classifyConversation()` on every ingest path. It returns `{ verdict: 'pass' | 'quarantine', reason, confidence, kind?: 'spam' | 'phishing' | 'scam' }`. A `pass` Conversation proceeds to classification and becomes a **Signal**; a `quarantine` Conversation lands in the **Quarantine** surface and no Signal is ever created.

Screening detects junk (spam / phishing / scam). It is **not** an 11th signal type — the canonical taxonomy in [`../../../docs/signals.md`](../../../docs/signals.md) is unchanged, and `brief.md` is not touched.

Like the classifier (see [`0001-anthropic-classifier-with-stub-fallback.md`](./0001-anthropic-classifier-with-stub-fallback.md)), the Screen calls the Anthropic API and falls back to a deterministic **Stub Screener** on any failure or token-cap, prefixing `[stub]` to the **Screening Reason**.

## Context

The originating request was "check if the email is a scam." Support inboxes receive spam, phishing, and scam messages alongside real tickets. Without a gate these become junk **Signals** that pollute the **Triage Inbox** and erode trust in the queue — directly feeding the brief's "classification creates too much noise" risk.

## Why this shape

1. **Separate gate, not a classifier verdict.** Folding a "junk" result into `classifyConversation()` would break its clean "always one of 10 types" contract and force every UI consumer to handle a null signal type. One function, one job.
2. **Fail-open on uncertainty.** Low-confidence Conversations pass to the classifier rather than being quarantined. A false positive (a real churn-risk ticket quarantined) is an expensive missed revenue signal; a false negative (a junk Card the user dismisses) is cheap. The asymmetry sets the bias.
3. **Visible Quarantine, never a silent drop.** Quarantined Conversations are listed with their **Screening Reason** and can be **Restore**d (re-running `classifyConversation()`). This mirrors the `[stub]`-shown-not-buried stance of ADR 0001 — no silent degradation in a product about trustworthy AI.
4. **Same fallback pattern as the classifier.** Anthropic-with-Stub-fallback keeps the demo alive on a flaky network and keeps the screening path consistent with the classification path.
5. **One gate for all ingest paths.** Both **Paste-classify** and the Phase 2 mailbox listener call `screenConversation()` exactly as they share `classifyConversation()`.

## Considered alternatives

- **Extend the taxonomy with a "scam" signal type.** Rejected: scam isn't a revenue signal, and the stop rules forbid extending the taxonomy without a `brief.md` change. It belongs out of the queue, not in it.
- **Silently drop junk.** Rejected: a customer whose real ticket vanishes can't trust the queue. Quarantine must be visible and reversible.
- **Fail-closed (quarantine on any suspicion).** Rejected: the cost of quarantining a real revenue Signal outweighs the cost of a junk Card.
- **Reuse `strategic account escalation`** for scam-targeting reports. Out of scope here — that is a real Signal about an Account, not a junk gate on ingest. It needs no new function.

## Consequences

- **Quarantine** state is in-memory only, resetting on server restart — consistent with ADR 0001's persistence stance.
- The **Stub Screener** and live screener share one verdict shape; UI never branches on which ran (only the `[stub]` prefix differs).
- Quarantined Conversations are not **Signals**, so the [Trust Contract](../../../docs/signals.md) (every Signal links to source Conversations) does not apply to them — but its spirit (show your work) drives the always-visible **Screening Reason**.
- A fictional scam Conversation belongs in the seed data so the demo can show the gate catching it; label it fictional per the conventions.
- If the taxonomy or screening categories ever change, both classifier and screener (and their stubs) update in the same PR.
