# CONTEXT — Saas

Ubiquitous language for the CustomerCue signed-in product. Terms used verbatim in code, tests, and PRD slices.

## Core domain

- **Signal** — An AI-detected revenue-relevant pattern extracted from support conversations. Has a type, urgency, rationale, confidence, and links to source conversations. Rendered in the Triage Inbox queue.
- **Signal type** — One of 10 canonical categories from `docs/signals.md`: `churn risk`, `expansion intent`, `product friction`, `bug cluster`, `onboarding issue`, `feature request`, `negative sentiment`, `strategic account escalation`, `documentation gap`, `repeated manual workaround`. No synonyms.
- **Classification** — The output of `classifyConversation()`: `{ signalType, urgency, rationale, confidence }`. Identical shape from both the Anthropic adapter and the Stub Classifier.
- **Conversation** — A support ticket or message thread. Source evidence for a Signal. Has channel, subject, snippet, body, date.
- **Account** — A customer organization with `arr`, `plan`, `segment`, `owner`. 10 seeded accounts.
- **Owner** — The CSM or account manager responsible for an Account.
- **Trust contract** — Every rendered Signal MUST link to its source Conversation(s). No exceptions. The product's answer to "customers don't trust AI signals."

## Classifier

- **classifyConversation()** — Single entry point. Tries Anthropic adapter; falls back to Stub Classifier on any error.
- **Anthropic adapter** — Thin wrapper over `@anthropic-ai/sdk`. Server-only.
- **Stub Classifier** — Deterministic keyword matcher. Prefixes rationale with `[stub]`. Default type = `negative sentiment`.
- **Token budget** — Per-process counter (50k tokens). `tryReserve(n)` throws when exceeded. Resets on server restart.

## Surfaces

- **Triage Inbox** — Three-column layout (icon nav, signals queue, detail canvas). Primary route `/`.
- **Paste-classify** — `/classify` route. Form → server action → `classifyConversation()` → new Signal at top of queue.
- **Account drilldown** — Slide-in panel showing all Signals for one Account.
- **Send-to-owner modal** — Preview of Slack/email mock-up. Appends to Signal's Actioned log.

## Scoring

- **Priority Score** — `arrWeight(account.arr) × urgencyWeight(signal.urgency)`. ARR weight = `log10(arr + 1)`. Urgency weight: high=3, medium=2, low=1.

## UI vocabulary

- **Cards** — Editorial multi-line signal cards in the queue (layout 1).
- **Ledger** — Bloomberg-style one-line rows (layout 2).
- **Grouped** — Collapsible bands per signal type (layout 3).
- **Sort mode** — `priority`, `arr`, `recent`, `urgency`, `type`. Orthogonal to layout.

## Editorial palette (VA_TONE)

10 signal types each mapped to a colour. Ported from prototype's `VA_TONE` object.
- `churn risk` → `#8C2D2D` (oxblood)
- `expansion intent` → `#2A5D3C` (forest)
- `product friction` → `#B8893C` (gold)
- `bug cluster` → `#C25A1F` (orange)
- `onboarding issue` → `#2D5C8C` (blue)
- `feature request` → `#5A3C8C` (purple)
- `negative sentiment` → `#8C2D5C` (magenta)
- `strategic account escalation` → `#A02020` (red)
- `documentation gap` → `#4A453E` (charcoal)
- `repeated manual workaround` → `#2D7C7C` (teal)
