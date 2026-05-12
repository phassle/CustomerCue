# ADR-0003: Signal estimator shows counts, not dollars

**Status:** Accepted
**Date:** 2026-05-12
**Scope:** `Web/` — the "What's hiding in your inbox?" section on `/`.

## Context

The landing page is gaining an interactive estimator section: visitor adjusts two sliders (weekly support-conversation volume, customer count) and sees a projection of how many revenue signals CustomerCue would likely surface for them each week.

The natural-feeling output unit is **dollars** — projected churn $ at risk, expansion $ opportunity. Dollars are persuasive per pixel and easy to compare against a prospect's own budget.

Two constraints push against dollars:

1. [`conventions.md`](../conventions.md) line 9 explicitly flags **"ROI numbers"** alongside logos, customer counts, and committed pricing as claims that need sign-off before shipping on-screen. We have no empirical base rates — any dollar figure on this section would be invented.
2. [`brief.md`](../../brief.md) lists *"ROI is hard to prove if alerts do not lead to action"* as a main risk, and *"Customers do not trust AI signals without clear sources"* with the mitigation *"Always show the source conversations behind every signal"* (the trust contract in [`signals.md`](../signals.md)). A dollar projection on the landing page is exactly the kind of unsourced ROI claim the brief warns about.

## Decision

The estimator emits **counts of signals per week**, per signal-type bucket. Never dollars.

Output rows:
- `churn risk` — count/week
- `expansion intent` — count/week
- `product friction` + `bug cluster` — combined count/week
- "Other revenue signals" — long-tail count/week (rolls up the remaining 6 canonical types)

Base rates are illustrative ranges anchored to the brief's three named example outputs (Acme Corp, NordicPay, onboarding step 3 cluster). A small italic line under the output reads:

> *Illustrative ranges based on patterns from our 1,000-conversation reports. Send us your conversations to see your real numbers.*

That sentence is the only quantitative claim outside the count buckets.

## Consequences

**Honest.** No invented dollar figures ship to the public page. Honours `conventions.md` and the brief's risk register without needing a sign-off cycle.

**Less persuasive per pixel.** A "$340k churn pipeline" headline number would land harder than "≈4 churn-risk signals per week". We accept this — the section's job is to make the value-prop tactile, not to close a deal. The CTA section does the closing.

**Reversible.** If we later gather real base-rate data from the 1,000-conversation reports, we can ship a dollar overlay as a second tier — the count layer stays. The estimator math is isolated in a pure function so adding a dollar bucket is a non-breaking extension.

**A future reader will be surprised.** The brief uses "ROI" and "revenue" liberally; the obvious framing is dollars. This ADR is the breadcrumb that explains why we didn't.

## Alternatives considered

- **Dollar projection with disclaimer.** Rejected — `conventions.md` flags ROI numbers as a sign-off gate, not a disclaimer gate. Disclaimers don't dissolve unsourced claims.
- **No estimator at all.** Rejected — the page lacks a tactile "this would work for you" moment between the abstract Signals list and the concrete Sample digest. The estimator fills that gap without inventing data we don't have.
- **Hide the estimator behind the "send us 1,000 conversations" form.** Rejected — moves the section past the page's main fold and merges it with the secondary CTA, defeating the tactile-preview purpose.
