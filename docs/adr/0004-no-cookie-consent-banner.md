# No cookie consent banner — privacy-first posture for `Web/`

**Date:** 2026-05-13
**Status:** accepted

## Decision

`Web/` ships **without** a cookie consent banner, modal, or any other consent surface. Instead a small `/privacy` page plus a footer link state plainly what the site does and does not do.

When (and only when) the first non-essential cookie, tracker, or storage write is added, the consent surface gets added in the same PR — bundled with the tracker it gates.

## Context

The marketing site is currently Astro + Preact + Tailwind only. It sets no cookies, writes no `localStorage` or `sessionStorage`, loads no analytics SDK (no GA, no Plausible, no PostHog, no Segment, no Fathom), and runs no marketing or attribution pixels. The only browser-side data is fonts loaded from Google Fonts.

Under GDPR / ePrivacy Art 5(3), informed consent is only required for **non-essential cookies and similar trackers**. With none present, there is nothing to consent or refuse to.

Showing a consent banner anyway has three concrete costs:
1. Conversion friction on a marketing landing page.
2. Misleading signal: "we track you" appears in the modal copy *before* tracking actually happens.
3. Future contributors assume the banner reflects real categories — they may wire a future tracker through it without thinking, instead of revisiting the trade-off.

## Considered alternatives

- **Generic accept/reject banner.** Rejected: theatre. Banner without cookies advertises tracking the site doesn't do, hurts conversion, and lies by implication.
- **Footer line only** ("No cookies. No tracking."). Rejected as the only artefact: too small to be findable; visitors looking for a privacy statement expect a navigable page.
- **Full legal-style privacy policy.** Rejected: the company is a workshop demo; boilerplate sections about data controllers and retention windows would be fabricated, which is worse than not having them.
- **Future-ready `<ConsentProvider>` plumbing with no UI.** Rejected as premature; violates the "don't design for hypothetical future requirements" rule in repo conventions. When a tracker is added, the consent UI lands with it.

## Consequences

- The footer link `Privacy` points to `/privacy`. The previous `Privacy (coming soon)` placeholder is replaced.
- The Playwright E2E spec for this page also asserts the actual claim: no cookies set, no `localStorage`/`sessionStorage` writes after visiting `/`. That test will fail and reject the PR if a future change quietly adds a tracker without updating the privacy stance.
- The next contributor who wants to add an analytics SDK or third-party widget is expected to:
  1. Update this ADR (status → superseded) and write a new ADR explaining the new consent posture, **or**
  2. Use a genuinely cookieless analytics (Plausible, Fathom, Simple Analytics in cookieless mode) that does not trigger consent obligations.
- `Web/CONTEXT.md` gains a `privacy posture` term pointing at this ADR.
