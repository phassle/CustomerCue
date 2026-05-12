# SaaS prototype — NOTES

**Throwaway.** Delete this folder once a variant has been picked and folded into the real `Saas/` app.

## Question being answered

What should the signed-in CustomerCue product look like for the MVP wedge —
*"weekly revenue signals from your support inbox"*?

Specifically: which information-architecture metaphor fits CS/Support/Product daily use best?

## Variants

- **A — Triage Inbox** — left rail of prioritized signals + main pane with detail, source conversations, and act-on-this-now buttons. CSM workflow feel (Linear / Front / Intercom Inbox).
- **B — Executive Brief** — KPI tiles (ARR at risk, expansion pipeline) + signal-volume trend + "top 5 to act on this week" + theme breakdown. VP / leadership weekly-digest feel.
- **C — Account Portfolio** — sortable account table with signal badges, filter rail, slide-in drilldown. Account-first / book-of-business feel.

Each variant covers the same dataset (10 fictional accounts, 14 signals across all 10 canonical types) so they are directly comparable.

## How to run

No build step. Stack-agnostic by design — the `Saas/` framework choice is open (`docs/stop-rules.md`), so this prototype must not lock it in.

```bash
# from repo root
open Saas/prototype/index.html
# or, if "open" is unhappy:
python3 -m http.server -d Saas/prototype 8765
# then http://localhost:8765
```

URL params: `?variant=A`, `?variant=B`, `?variant=C`. Floating bar at the bottom or ← / → keys also cycle.

## What this prototype deliberately is NOT

- Not a framework choice. Vanilla HTML + Tailwind CDN. Picking Next.js / Astro / Remix is a separate decision (`Saas/AGENTS.md`).
- Not wired to anything. All buttons are dead. No real Intercom / Zendesk / Slack / CRM calls.
- Not a content review. Copy is placeholder; signal names are correct per `docs/signals.md` but everything else is sketch quality.
- Not accessible / not responsive past laptop widths. Both matter for the real build; not for this question.

## Trust contract

Every rendered signal links to source conversation(s) — required by `docs/signals.md`. All three variants honour this (right pane in A, "view evidence →" in B, drilldown panel in C). Don't promote any variant that drops this.

## Sub-prototype: listing layout within A (2026-05-12)

User liked A's editorial design but wanted to explore the queue rail. Three listing layouts now share the rail; switchable via the inline tabs in the queue toolbar, hotkeys **1 / 2 / 3**, or `?layout=1|2|3` in the URL. Layouts stack inside `renderListingBody()` (Saas/prototype/index.html, `renderListingCards`, `renderListingLedger`, `renderListingGrouped`).

- **1 — Cards** (default) — editorial multi-line cards: rank · type+name · serif account · mono meta · 2-line summary · urgency + source count. Highest information per row, ~6–7 visible at once. Best for unfamiliar queues where context per signal matters.
- **2 — Ledger** — Bloomberg-style one-line rows: rank · type dot (no name) · serif account · ARR mono · H/M/L solid chip · short relative time. ~2× density (12–15 visible). No summary in the rail — drill into the detail pane to read it. Best for an experienced CSM scanning a familiar book of business.
- **3 — Grouped** — collapsible bands per canonical signal type with a coloured 4px type bar header (uppercase type name + count). Accounts inside the group are medium-density (no type indicator since the band carries it). Best when triaging by theme — e.g. "show me all this week's churn risks together" or "what's the bug-cluster picture for Product?".

Decision deferred — pick after a few days of using them.

### Sort, decoupled from layout (2026-05-12 follow-up)

User liked all three layouts and asked for the orderings from 1 and 3 (priority, type) to be available together. Sort and layout are now **orthogonal axes**:

- **Sort** (toolbar dropdown, URL `?sort=`) — `priority` (default, ARR × urgency), `arr`, `recent`, `urgency`, `type`. Each mode has a sensible tie-breaker (priority score). See `SORT_MODES` and `applySort()` in `Saas/prototype/index.html`.
- **Layout** (tabs, URL `?layout=`) — `cards | ledger | grouped` controls visual density only.

When **sort = type** in `cards` or `ledger`, a small editorial divider (3px coloured bar + uppercase type label + count) is rendered between groups, so the user gets the *reading experience* of layout 3 without giving up card richness or ledger density. Layout 3 ignores the sort dropdown's direct visual effect (it always groups by type) but uses the sort mode as **within-group ordering** — e.g. `layout=3&sort=arr` shows type groups, biggest accounts first inside each.

This is the "I want bits from 1 and 3" combination the earlier note predicted.

## Variant A standalone export (2026-05-12)

`Saas/prototype/variant-a-standalone.html` is a single-file fork of A *only* — variants B and C, the bottom main-variant switcher, and their helpers (`typeBadge`, `urgencyBadge`, `channelIcon`, `TYPE_TONE`, `URGENCY_TONE`, `topBar`, `filterGroup`, `sortHeader`, `riskScore`) are stripped. The three layout tabs (1/2/3), the sort dropdown, and the `?layout=` + `?sort=` URL params are retained intact — the user has *not* locked a single layout+sort combo, so the standalone keeps the exploration alive.

```bash
open Saas/prototype/variant-a-standalone.html
# or
python3 -m http.server -d Saas/prototype 8765
# then http://localhost:8765/variant-a-standalone.html
```

The standalone is for dropping into a fresh design chat to iterate on A in isolation. The original three-variant `index.html` is kept untouched for comparison and so the B/C codepaths remain readable.

## Decision capture

- **Winner:** **A — Triage Inbox.** Picked 2026-05-12.
- **Why:** the SaaS product is a *workflow* (signals queue → act on one → next). A is the only variant whose primary affordance is "do something about this signal *now*". B reads like a recurring report and C reads like a CRM — both are secondary views the app should have, but neither is the daily-use surface.
- **Polished pass:** rebuilt A with an editorial / financial-terminal aesthetic — paper-cream background (`#F7F3EC`), Fraunces serif for headlines and figures, Geist for UI, JetBrains Mono for IDs and meta. Oxblood for risk, forest green for expansion, gold accent. Pull-quote treatment for the AI rationale. Tabular source-conversation list with channel tags + ticket IDs (e.g. `IC·001`). Dark status footer with classifier version, sync age, and indexed-volume stats. Keyboard hints (`J/K`, `E`, `T`, `F`, `X`) surfaced inline.
- **Borrowed bits to fold in from B and C:**
  - From **B**: ARR-at-risk and expansion-pipeline KPIs as a "leadership digest" *view* (separate route, not the main inbox). The sparkline-with-trend treatment for sentiment.
  - From **C**: the account-drilldown slide-in pattern — open it when clicking an account name in A's detail pane or in the queue meta line. Risk-score column in account list views.

## What to fold into the real Saas app

When the stack is chosen and the real `Saas/` is scaffolded, port these in order:

1. **IA**: three columns — icon nav · signals queue · detail canvas. Independent scroll for each.
2. **Ranking**: ARR-weighted urgency score for the queue (`score()` in this prototype's JS is the seed of the right logic).
3. **Trust contract**: source-conversation list as a first-class section in the detail view, not an afterthought. Channel + ticket ref + date + arrow.
4. **Type taxonomy + tone map**: 10 canonical types from `docs/signals.md`, used verbatim. The `VA_TONE` palette in the prototype is the editorial colour decision — port it.
5. **Typography system**: Fraunces (display) + Geist (UI) + JetBrains Mono (meta). Variable Fraunces is non-negotiable — the optical-size axis is what makes the headline work.
6. **Action bar**: primary (send/Slack), secondary (CSM task, forward to product), ghost (mark handled). Keyboard shortcuts surfaced as inline `<kbd>` chips.
7. **Status footer**: indexed conversation count, classifier version, last sync age, source connector list. Sells the "always working" feel.

## Explicitly *not* in scope for the real port

- The `?variant=` switcher and the floating bar — prototype-only chrome.
- The amber "fictional data" banner — replace with real product chrome.
- The mocked 14-signal seed — real demo-data lives in `Saas/src/data/` once the stack is in.

## Next step

Scaffold `Saas/` (Next.js App Router + Tailwind + shadcn expected per `Saas/AGENTS.md`, but framework choice is still open per `docs/stop-rules.md` — confirm before installing). Then port the seven items above one at a time, deleting this prototype folder once the third (trust contract) lands.
