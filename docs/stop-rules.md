# Stop rules

When to stop and ask the user before acting. If unsure, stop.

## Stack and dependencies

- No framework / library / hosting choice for an empty subproject without explicit user input. Once chosen, record exact versions and rationale in that subproject's AGENTS.md.

## Commits and PRs

- Don't commit. Don't open PRs. Don't push. Wait for an explicit request each time. Approval once is approval once — not standing authorization.
- Git-flow always — see [`../AGENTS.md`](../AGENTS.md). Never commit straight to `main` or `develop`; work on a `feature/*` branch.

## Product surface

- No new signal types beyond the [canonical taxonomy](./signals.md). If one genuinely belongs, update `brief.md` first.
- No signal UI without source-conversation receipts. This is the [trust contract](./signals.md) and is non-negotiable.
- No real third-party integrations (Intercom, Zendesk, HubSpot, Salesforce, Slack, analytics, billing, auth, calendar) without an explicit ask. Mock them.
- No invented logos, testimonials, customer counts, or committed prices. The brief's example outputs (Acme Corp, NordicPay) are fictional — fine to use as illustrations, label them as such.
- No customer-data shapes invented from thin air beyond the brief's `ARR / plan / segment / owner` baseline — confirm before extending.
