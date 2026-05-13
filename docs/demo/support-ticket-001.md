# Demo support ticket #001 — Web form rate-limit collision

Fictional support ticket designed for live demos of CustomerCue. Walks a support agent through debugging a real-feeling failure on the marketing site (`customercue.com` → `/api/lead`). All names, companies, IPs, and identifiers are invented.

## Ticket #4218 — "Your demo request form is broken — third attempt"

| | |
|---|---|
| **Channel** | Email-to-ticket via `support@customercue.com` |
| **Status** | Open · P2 (prospect blocked from converting) |
| **Assigned** | Jonna Ek (CSM) |
| **Created** | 2026-05-13 10:07 CEST |
| **Last reply** | 2026-05-13 10:24 CEST (customer) |
| **Tags** | `web`, `forms`, `prospect`, `intercom-user`, `hubspot-evaluator` |

### Submitter

- **Marta Lindqvist** — VP Customer Success, **NorthBeam Analytics** (B2B fintech analytics, ~180 employees, Stockholm)
- `m.lindqvist@northbeam.io` · `+46 70 555 0142`
- Source: `customercue.com` — clicked **"Request demo"** CTA in hero
- HubSpot: no record yet (lead form never persisted)

---

### Conversation

**Marta Lindqvist · 10:07 CEST**

> Hi,
>
> I've been trying to book a demo of CustomerCue for the past 20 minutes. Every time I click **Request demo** the form spins for a few seconds, then either:
>
> 1. Shows *"Something went wrong, please try again"* — but doesn't tell me what.
> 2. The page reloads and the form is empty again.
>
> I'm on Safari 19 (macOS 15.4, M3 MacBook Air). Also tried Chrome (latest) — same result.
>
> I genuinely want to evaluate this for our team (Intercom + HubSpot, ~50k support conversations/year). Please either fix it or book me a demo manually.
>
> — Marta

**Marta Lindqvist · 10:24 CEST** *(follow-up)*

> Update — I opened DevTools. The Network tab shows the POST to `/api/lead` returns **`429 Too Many Requests`** with header `retry-after: 3600`. I've only submitted twice.
>
> Is your rate limit shared across the whole company? My colleague Erik (`e.bergman@northbeam.io`) tried earlier today.

---

### Debugging breadcrumbs (visible to agent)

```
POST https://customercue.com/api/lead
↳ 429 Too Many Requests
   retry-after: 3600
   cf-ray: 8f2c1d4e9a8b6f12-ARN
   x-cc-request-id: lead_01HXPM4N5K3JR8Q9Z2YQHE7VC1

Request body (redacted):
{ "name": "Marta Lindqvist", "email": "m.lindqvist@northbeam.io",
  "company": "NorthBeam Analytics", "role": "VP CS",
  "volume": "10k-100k/month", "tools": ["intercom","hubspot"] }

Submitter IP (server-side): 185.41.97.214  (NorthBeam corp egress)
Submission timestamps (server log): 09:58:11 UTC, 10:04:33 UTC
Prior submission same /24, last hour: e.bergman@northbeam.io @ 09:42:07 UTC
```

---

### Root cause (for the agent to discover live)

`/api/lead` (the Astro server-rendered route — see `Web/src/pages/api/lead.ts`) rate-limits by **IP only**, with a **1-hour window**. NorthBeam's office traffic egresses through a single NAT, so once Erik submitted at 09:42 UTC, every subsequent submission from the same building was blocked until 10:42 UTC. Marta hit it twice.

The form's client-side error handler swallows the 429 and shows the generic `"Something went wrong"` — so the failure is invisible until the user opens DevTools.

### Resolution path (demo script for the agent)

1. **Triage** — open ticket, read both messages, note customer mentioned a specific HTTP code → don't replicate the bug, just confirm in logs.
2. **Confirm in logs** — grep Vercel logs for `lead_01HXPM4N5K3JR8Q9Z2YQHE7VC1` or for IP `185.41.97.214` → see two 429s + one preceding 200 from Erik.
3. **Workaround for Marta** — manually create the HubSpot lead, book her into the sales calendar, reply with the invite link.
4. **Real fix** — file issue: *"Rate-limit key should be `IP + email-domain`, window 5 min, not IP/1h. Surface real error to user instead of generic toast."*
5. **Reply** *(suggested wording)*:

> Hi Marta,
>
> Thanks for the detailed debug — that's exactly what we needed. You're right: our form rate-limiter is keyed only on IP, so when Erik submitted earlier the same hour it blocked you. I've booked you a demo directly — **Tuesday 15:00 CEST**, calendar invite incoming.
>
> We're filing the fix now (issue #142 if you'd like to track it). Apologies for the friction — and, ironically, this is exactly the kind of buried support signal CustomerCue exists to surface.
>
> — Jonna · CSM, CustomerCue

---

### CustomerCue signal classification (meta — for the demo punchline)

If this thread were ingested by CustomerCue, the classifier should emit:

- **Bug cluster** — `Web/api/lead rate-limiter blocks same-NAT submitters` (links: this ticket + Erik's 09:42 lead).
- **Strategic-account escalation** — submitter is in-ICP (B2B SaaS, ~180 employees, Intercom + HubSpot, >10k conversations/year, VP CS title); prospect about to churn from the funnel.
- **Documentation gap** *(optional)* — generic error toast hides actionable HTTP code from non-technical users.

That's the closing slide of the live demo: the support agent's manual debugging in this ticket is exactly the kind of signal CustomerCue surfaces automatically, on every conversation, every week.
