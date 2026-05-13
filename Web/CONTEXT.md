# Web — domain glossary

Terms specific to the public marketing site. For repo-wide vocabulary see [`../brief.md`](../brief.md) and [`../docs/signals.md`](../docs/signals.md).

## Glossary

### signal

A real, surfaced revenue signal extracted from a real support conversation. Every rendered signal MUST link to its source conversation(s) — the trust contract from [`../docs/signals.md`](../docs/signals.md). Canonical taxonomy in the same file.

In `Web/`, "signal" only appears in fixture data inside the Explainer and Sample digest — both clearly labelled fictional.

### privacy posture

The site's deliberate non-decision to ship **without** a cookie consent banner. The posture is: no cookies, no trackers, no analytics SDKs, no storage writes; instead a plain `/privacy` page plus a footer link state what is and is not collected.

The posture is enforced by `Web/e2e/privacy.spec.ts`, which asserts that visiting `/` writes zero cookies and zero `localStorage` / `sessionStorage` entries. Adding a tracker without updating the privacy page will fail CI.

If the posture changes (e.g. cookieless analytics added, scheduling widget embedded), the change lands together with an updated ADR. See [`../docs/adr/0004-no-cookie-consent-banner.md`](../docs/adr/0004-no-cookie-consent-banner.md).
