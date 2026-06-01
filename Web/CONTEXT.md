# Web — domain glossary

Terms specific to the public marketing site. For repo-wide vocabulary see [`../brief.md`](../brief.md) and [`../docs/signals.md`](../docs/signals.md).

## Glossary

### signal

A real, surfaced revenue signal *instance* — extracted from a specific support conversation (e.g. Acme's churn risk on a failing-sync thread). Distinct from a **signal type** (the category it belongs to). Every rendered signal MUST link to its source conversation(s) — the trust contract from [`../docs/signals.md`](../docs/signals.md).

In `Web/`, "signal" only appears in fixture data inside the Explainer, Sample digest, and Signal Field Guide — all clearly labelled fictional.

### signal type

One of the 10 canonical taxonomy categories in [`../docs/signals.md`](../docs/signals.md) (`churn risk`, `expansion intent`, …) — the *kind* a signal can be, not a surfaced instance. The **Signal Field Guide** (`/signals`, see [`docs/page-scope.md`](./docs/page-scope.md) and [`../docs/adr/0006-web-signal-field-guide-multipage.md`](../docs/adr/0006-web-signal-field-guide-multipage.md)) documents signal types; each detail page illustrates one with example signals (annotated fixtures). Use the names verbatim — no synonyms.

### signal estimate

A *projected*, illustrative count of how many signals of a given type a visitor would plausibly see in a week, given their inputs (weekly support-conversation volume and customer count). Lives only on the landing-page **"What's hiding in your inbox?"** section.

A signal estimate is **not** a signal — it has no source conversation, links to nothing, and represents no specific account. It is a tactile aggregate. The trust contract does not apply to it directly, but the section anchors back to the Explainer's three concrete examples for receipts.

Estimates are always shown as **counts**, never as monetary values. See [`../docs/adr/0003-signal-estimator-counts-not-dollars.md`](../docs/adr/0003-signal-estimator-counts-not-dollars.md).

### privacy posture

The site's deliberate non-decision to ship **without** a cookie consent banner. The posture is: no cookies, no trackers, no analytics SDKs, no storage writes; instead a plain `/privacy` page plus a footer link state what is and is not collected.

The posture is enforced by `Web/e2e/privacy.spec.ts`, which asserts that visiting `/` writes zero cookies and zero `localStorage` / `sessionStorage` entries. Adding a tracker without updating the privacy page will fail CI.

If the posture changes (e.g. cookieless analytics added, scheduling widget embedded), the change lands together with an updated ADR. See [`../docs/adr/0004-no-cookie-consent-banner.md`](../docs/adr/0004-no-cookie-consent-banner.md).
