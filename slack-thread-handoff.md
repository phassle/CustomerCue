# `#proj-customercue` — Slack thread

> Customer Success product working group. Thread from Tuesday afternoon.

---

**Sara Lindqvist** (Product Owner) · `Tue 13:42`
> Following up on the CSM round-table this morning. Three of them said the same thing — they get the weekly digest, they read it, then on Monday they can't find their place again. They're tabbing back and forth between Intercom and our dashboard, and our dashboard isn't earning the second tab.
>
> I think we need to land the **listing** of customer cues. Not a dashboard. Not a report. A *queue* — something a CSM opens at 09:00 and works down. The detail pane is fine; the rail isn't.
>
> @Tomas — can you take the first crack at how the listing should feel? Editorial direction is open. Three constraints from research:
> 1. **ARR-weighted priority** matters more than recency. Top of the list = biggest at-risk dollars.
> 2. **Signal type has to be glanceable.** Maja told me she scans for "churn risk" first, then expansion, then everything else. Colour or shape, your call.
> 3. **The trust contract is non-negotiable.** Every cue links to source conversations. We've burned that bridge twice already with PMs.

---

**Tomas Eklund** (Designer) · `Tue 14:01`
> 👀 reading
>
> Quick clarifying Qs before I sketch:
>
> 1. How many cues in a typical week? Five? Fifty? That changes everything about density.
> 2. Do they ever want to slice by *type* on its own (e.g. "show me all churn risks this week") or always priority-first?
> 3. Sort by ARR vs sort by priority — same thing or different? Priority sounds like "ARR × urgency" but I want to confirm.

---

**Sara Lindqvist** · `Tue 14:09`
> 1. 10–25 per week per CSM for the ICP range we care about. Goes up during onboarding waves.
> 2. **Yes**, frequently. Maja literally said "Mondays I want everything by type, Thursdays I want the priority list." So the listing needs to let her swap.
> 3. Priority = ARR × urgency (high/med/low). Big account + high urgency floats. Small account + low urgency sinks. The score itself doesn't need to be visible — just the order.

---

**Tomas Eklund** · `Tue 14:11`
> 👍 helpful. Last one:
>
> The brief calls these **"customer cues"** but the canonical taxonomy uses lowercase strings like `churn risk` / `expansion intent`. Should the listing show those verbatim, or should I introduce a display layer (e.g. "Churn Risk" with title case + an icon)?

---

**Sara Lindqvist** · `Tue 14:13`
> Verbatim. We've burned twice on synonyms — Product launched "retention signal" in beta last year and three CSMs thought it was a different feature. Lowercase strings, signal-type chip with a coloured dot, that's it. No icons.
>
> Use the 10 canonical names from `docs/signals.md` exactly: `churn risk` · `expansion intent` · `product friction` · `bug cluster` · `onboarding issue` · `feature request` · `negative sentiment` · `strategic account escalation` · `documentation gap` · `repeated manual workaround`.

---

**Tomas Eklund** · `Tue 14:38`
> Initial direction — I'm leaning *editorial* / financial-terminal rather than CRM-table. The CSMs aren't doing data entry; they're reading and deciding. Think *Bloomberg meets New York Times*: cream paper background, Fraunces serif for the account names, Geist for UI, JetBrains Mono for the meta line (ARR, plan, owner). Oxblood for risk, forest green for expansion, gold accent.
>
> Rationale: turns each cue into something that *reads* like a brief, not a row in a spreadsheet. ARR and urgency stand out because the typography respects them.

---

**Sara Lindqvist** · `Tue 14:41`
> 💯 yes. I was bracing for "another CRM" and that's not what we are. Editorial is right.
>
> Caveat: keep a denser option in reserve. Felix is the Bloomberg-feel CSM — he'll want every pixel busy. Maja is the editorial-feel CSM — she'll love what you're describing. Don't pick one over the other if you don't have to.

---

**Tomas Eklund** · `Wed 10:14`
> Picked it apart yesterday. Three queue layouts on the same rail, switchable from the toolbar or `1` / `2` / `3`:
>
> 1. **Cards** — editorial multi-line cards. Rank · type+name · serif account · mono meta · 2-line summary · urgency + source count. ~6–7 visible at once. Default.
> 2. **Ledger** — Bloomberg one-liner rows. Rank · type dot (no name) · serif account · ARR mono · H/M/L solid chip · short relative time. ~2× density. Drill into the detail pane for the summary.
> 3. **Grouped** — collapsible bands per signal type. Coloured 4px type bar header, uppercase type name + count. Best for "show me all the churn risks this week" mode.
>
> Then I made sort **orthogonal** to layout — dropdown with Priority / ARR / Recent / Urgency / Type. When sort = Type in Cards or Ledger, you get type dividers (3px coloured bar + uppercase type label + count) between groups, so you get the *reading* of Grouped without giving up Cards' richness or Ledger's density. URL params `?layout=` and `?sort=` so links round-trip.

---

**Sara Lindqvist** · `Wed 10:21`
> Reading this on my phone and grinning. The sort-decoupled-from-layout thing is exactly what Maja and Felix both wanted but couldn't articulate. Ship it.
>
> One product-y nit: the cues panel on the right (the detail) — make sure the "Source conversations" section is *prominent*, not hidden in a tab. That's our trust contract. Editorial typography for the headline + ARR is good, but the receipts list needs to feel like a load-bearing column, not a footer.

---

**Tomas Eklund** · `Wed 10:24`
> 👍 receipts are a `<section>` with its own ink rule above and below, channel tag + ticket ID + subject + snippet + date + arrow. Hard to miss. Pull-quote treatment for the AI rationale right above it, so the eye lands on *why we flagged this* → *here's the evidence*. Same vertical column, not behind a tab.

---

**Sara Lindqvist** · `Wed 10:25`
> 🙌

---

**Tomas Eklund** · `Wed 16:48`
> Done. Polished single-file HTML with the three listings, the sort dropdown, the editorial detail canvas, the dark status footer, keyboard hints surfaced as inline `<kbd>` chips. 10 fictional accounts, 14 signals across all 10 canonical types, ~30 mocked tickets. No real API calls — all dead, demo-only.
>
> Throwing it over the wall to engineering now. @Mikael — file's in the design system, prompt below for Claude Code. Variant A is the one. Don't change the taxonomy and don't drop the receipts.

---

**Mikael Borg** (Engineering) · `Wed 16:52`
> 🫡 picking it up — running it through Claude Code tonight.

---

## Prompt for Claude Code

```
Fetch this design file, read its readme, and implement the relevant aspects of the design.
https://api.anthropic.com/v1/design/h/qgmmgVPau9MqwsV91gP_dg?open_file=CustomerCue+-+Variant+A.html

Implement: CustomerCue - Variant A.html
```
