# Web — domain glossary

Terms specific to the public marketing site. For repo-wide vocabulary see [`../brief.md`](../brief.md) and [`../docs/signals.md`](../docs/signals.md).

## Glossary

### signal

A real, surfaced revenue signal extracted from a real support conversation. Every rendered signal MUST link to its source conversation(s) — the trust contract from [`../docs/signals.md`](../docs/signals.md). Canonical taxonomy in the same file.

In `Web/`, "signal" only appears in fixture data inside the Explainer and Sample digest — both clearly labelled fictional.

### signal estimate

A *projected*, illustrative count of how many signals of a given type a visitor would plausibly see in a week, given their inputs (weekly support-conversation volume and customer count). Lives only on the landing-page **"What's hiding in your inbox?"** section.

A signal estimate is **not** a signal — it has no source conversation, links to nothing, and represents no specific account. It is a tactile aggregate. The trust contract does not apply to it directly, but the section anchors back to the Explainer's three concrete examples for receipts.

Estimates are always shown as **counts**, never as monetary values. See [`../docs/adr/0003-signal-estimator-counts-not-dollars.md`](../docs/adr/0003-signal-estimator-counts-not-dollars.md).
