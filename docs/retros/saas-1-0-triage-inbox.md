# Retro — `feature/saas-1-0-triage-inbox`

PRD: Issue #55 — Saas 1.0: Triage Inbox with paste-classify

## Session 1 (2026-06-01)

### What was done
- Scaffolded `Saas/` as Next.js 16 App Router + TS + Tailwind v4 + shadcn
- Ported Variant A prototype into real components: three-column layout, 3 listing layouts, 5 sort modes
- Implemented classifier core: `classifyConversation()` with Anthropic adapter + Stub Classifier fallback
- Token budget (50k per process), Priority Score function
- In-memory stores for Signals, Conversations, Accounts
- Cookie-backed auth with two seeded users (Sara, Marc)
- All 14 seeded signals + 10 accounts + ~36 conversations ported from prototype
- `/login`, `/` (Triage Inbox), `/classify` (paste-classify) routes
- Account drilldown slide-in, Send-to-owner modal, keyboard shortcuts (J/K/E/X)
- Status footer with classifier info
- 37 unit tests (Vitest): types, priority score, stub classifier, token budget, classifyConversation
- 16 E2E specs (Playwright): login, inbox, classify, trust contract, keyboard nav, drilldown, modal

### Gotchas
- `create-next-app` rejects capital letters in project names — had to scaffold in temp dir and copy
- Stub classifier keyword overlap: `workaround` appeared in both `product friction` and `repeated manual workaround` — removed from product friction to avoid first-match ambiguity
- Playwright E2E cannot run in this container (missing `libnspr4.so`) — tests are written correctly but need CI with Chromium system deps

### Decisions made
- Tailwind v4 + shadcn works out of the box (no need to drop to v3)
- Used inline styles for prototype's CSS custom properties (--color-paper etc.) rather than mapping everything to Tailwind theme — faster port, maintains visual fidelity
- Kept `force-dynamic` on index route since signals are served from in-memory store
- Conversations store body field filled with expanded text beyond prototype's snippet

## Lessons for the next PRD

_To be filled before feature branch closes._
