# Saas — domain glossary

Terms specific to the CustomerCue product (the signed-in app). For repo-wide language see [`../brief.md`](../brief.md), the canonical signal taxonomy in [`../docs/signals.md`](../docs/signals.md), and the marketing-site glossary in [`../Web/CONTEXT.md`](../Web/CONTEXT.md).

## Language

### Core domain

**Signal**:
A surfaced revenue cue extracted from one or more **Conversations**, classified into exactly one type from the canonical taxonomy in [`../docs/signals.md`](../docs/signals.md). Every rendered Signal links to at least one source **Conversation** — the Trust Contract.
_Avoid_: alert, insight, item, card, finding, lead.

**Conversation**:
One support-system ticket / thread — the unit a Signal aggregates over and links to as its receipt. Channel-tagged (`intercom`, `zendesk`) and carries a ticket reference like `IC·001`.
_Avoid_: ticket (as a standalone noun), thread, message, case.

**Account**:
The customer company a Signal pertains to. Carries `arr`, `plan`, `segment`, and `owner` as first-class fields — Signals are prioritised, filtered, and routed by them.
_Avoid_: customer, client, organisation, company.

**Owner**:
The internal user (typically a CSM) responsible for an Account. The default destination for "send to owner" actions on a Signal.
_Avoid_: account manager, rep, assignee.

### Signal anatomy

**Urgency**:
Claude's per-Signal read of how time-sensitive it is on its own merits, ignoring **Account** ARR. One of `high | medium | low`. Combined with ARR to compute **Priority Score**.
_Avoid_: severity, importance, priority (alone).

**Rationale**:
Claude-authored 1–2 sentence explanation of why a Signal got its type. Rendered as a pull-quote in the detail canvas. Prefixed with `[stub]` when the **Stub Classifier** produced it instead of the live Anthropic API (see [`docs/adr/0001-anthropic-classifier-with-stub-fallback.md`](./docs/adr/0001-anthropic-classifier-with-stub-fallback.md)).
_Avoid_: reasoning, explanation, summary.

**Priority Score**:
Derived value `arrWeight(account.arr) × urgencyWeight(signal.urgency)` used as the default sort key for the queue. Pure function of **Account** ARR band and Signal **Urgency** — never persisted.
_Avoid_: ranking, weight, score (alone).

**Actioned log**:
Per-Signal in-memory record of completed `send-to-owner` actions — `{ at, byUser, channel }` per entry. Empty by default; mocked sends append. Not persisted across server restarts (see [`docs/adr/0001-anthropic-classifier-with-stub-fallback.md`](./docs/adr/0001-anthropic-classifier-with-stub-fallback.md) for the wider in-memory-only stance).
_Avoid_: history, audit log, events.

### Surfaces

**Triage Inbox**:
The product's primary surface — three columns: icon nav · prioritised Signals queue · detail canvas. The workflow shape of the app, picked over dashboard/portfolio variants (see `prototype/NOTES.md`).
_Avoid_: dashboard, queue (as the surface name — "queue" refers to the middle column only), feed.

**Card**:
The rendering of a Signal in the queue column. Strictly 1:1 with a Signal — "Card" is presentation, "Signal" is the domain object.
_Avoid_: row, item, tile.

**Paste-classify**:
The v1 ingest path: a user pastes one Conversation into `/classify`, picks the **Account** and channel, the server **Screens** it, and if it passes the server calls `classifyConversation()` and the resulting Signal lands at the top of the queue. Phase 2's mailbox listener calls the same internal functions — no UI involved.
_Avoid_: import, upload, classify-route.

**Quarantine**:
The holding surface for Conversations the **Screen** flagged as junk (spam / phishing / scam). No **Signal** is created and nothing enters the queue. Reversible — a Conversation can be **Restore**d, which re-runs `classifyConversation()`. In-memory only; resets on server restart. A quarantined Conversation is never silently dropped — its **Screening Reason** is always shown.
_Avoid_: spam folder, trash, blocklist, junk box.

### Screening (pre-classify gate)

**Screen** (verb) / **Screening**:
The pre-classify gate. `screenConversation(conv)` runs **before** `classifyConversation()` and returns a verdict — `pass` or `quarantine` — plus a **Screening Reason** and a confidence. Pass → the Conversation proceeds to classification. Quarantine → it lands in **Quarantine** and no **Signal** is ever created. Detects junk (spam / phishing / scam); it does **not** assign a signal type and never extends the canonical taxonomy.
_Avoid_: filter, spam check, scam check, moderation, gate (as a noun).

**Screening Reason**:
The short, human-readable explanation of a Screening verdict (parallels **Rationale** for classification). Prefixed with `[stub]` when the **Stub Screener** produced it instead of the live Anthropic API.
_Avoid_: reason (alone), flag note, spam reason.

**Stub Screener**:
Deterministic keyword-matcher used by `screenConversation()` when the Anthropic API is unreachable, missing a key, times out, or the per-process token cap is exceeded. Same verdict shape as the live screener; the only difference is the `[stub]` prefix on the **Screening Reason**. The screening sibling of the **Stub Classifier** (see [`docs/adr/0002-conversation-screening-gate.md`](./docs/adr/0002-conversation-screening-gate.md)).
_Avoid_: spam heuristic, fallback screener, dummy.

### Classification engine

**Stub Classifier**:
Deterministic keyword-matcher used by `classifyConversation()` when the Anthropic API is unreachable, missing a key, times out, or the per-process token cap is exceeded. Same output shape as the live classifier; the only difference is the `[stub]` prefix on **Rationale**. Decision recorded in [`docs/adr/0001-anthropic-classifier-with-stub-fallback.md`](./docs/adr/0001-anthropic-classifier-with-stub-fallback.md).
_Avoid_: fallback, mock classifier, dummy.

## Relationships

- A **Signal** aggregates one or more **Conversations**. Never the reverse: a Conversation belongs to at most one Signal in v1.
- A **Signal** pertains to exactly one **Account**.
- An **Account** has exactly one **Owner**.
- A **Signal**'s **Priority Score** is a pure function of its **Account**'s ARR band and its own **Urgency**.
- A **Paste-classify** action creates exactly one new **Signal** containing exactly one new **Conversation** — no auto-merge into existing Signals in v1. Multi-Conversation Signals exist in the hand-authored seed (Acme 6-ticket cluster, onboarding-37 cluster) to demonstrate the aggregation case.
- The **Stub Classifier** and the live Anthropic classifier share one output shape; the route's `classifyConversation()` is the single internal function both **Paste-classify** and the Phase 2 mailbox listener will call.
- **Screen runs before classify.** Every ingest path screens first, then classifies. A Conversation becomes either a **Signal** (passed) or a **Quarantine** entry (junk) — never both, never neither. `screenConversation()` is the single gate both **Paste-classify** and the Phase 2 mailbox listener call, exactly as they share `classifyConversation()`.
- The Screen is **fail-open**: on low confidence it passes the Conversation to the classifier rather than quarantining. A junk Card the user dismisses is cheap; a quarantined real revenue Signal is an expensive miss.

## Example dialogue

> **PM:** "When Sara pastes a ticket into `/classify` and Claude returns `churn risk` for an Acme conversation, do we attach it to Acme's existing churn-risk Signal?"
> **Designer:** "No — in v1 each **Paste-classify** action creates a new **Signal** with one **Conversation**. Auto-clustering is a Phase 2 problem once the mailbox listener is feeding the system at volume. The hand-authored seed already demonstrates multi-Conversation Signals."
> **PM:** "And the pull-quote in the detail canvas?"
> **Designer:** "That's **Rationale** — Claude writes it as part of classification. If the API was unreachable, the **Stub Classifier** wrote it instead and you'll see `[stub]` at the front."

## Flagged ambiguities

- "ticket" was overloaded — used both as a synonym for **Conversation** and as the ID format (e.g. `IC·001`). Resolved: the noun is **Conversation**; "ticket reference" survives only as the string-format name.
- "card" was used as both UI noun and domain noun in the prototype. Resolved: **Card** is strictly the visual rendering of a **Signal** in the queue column — 1:1, no semantic difference, just presentation.
- "priority" was ambiguous between Claude's **Urgency** and the derived **Priority Score**. Resolved: **Urgency** is what Claude assigns (single-Signal read); **Priority Score** is the derived sort key (Urgency × ARR).
- "fallback classifier" / "mock classifier" / "dummy classifier" all referred to the same thing. Resolved: it is the **Stub Classifier**, with `[stub]` as the visible marker in **Rationale**.
- "scam check" / "is the email a scam" arrived as a feature request. Resolved: there is no "scam" **Signal** type and no "email" noun — the input is a **Conversation**. The capability is **Screening**, a pre-classify junk gate that routes spam/phishing/scam Conversations to **Quarantine**. It does not extend the canonical taxonomy.
