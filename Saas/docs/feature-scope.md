# MVP feature scope

From the brief's "First Product Version." Mocked end-to-end — no real integrations.

1. **Mock Intercom / Zendesk integration** — read-only ingest of conversations. Pick one (open question in `../../brief.md`).
2. **Historical conversation import** — seed dataset of mocked tickets across ~20 fictional accounts.
3. **Customer data import** — CSV / mocked HubSpot / mocked Salesforce → account records with **ARR, plan, segment, account owner**. These are first-class fields, not optional. Signals are prioritized and filtered by them.
4. **AI classification** — assign signals from the [canonical taxonomy](../../docs/signals.md). Mocked classifier output is fine.
5. **Signals dashboard** — list/board of prioritized signals, filterable by type, account, ARR-weight, owner.
6. **Account drilldown** — every signal links to its source conversations. *Trust contract — see [`../../docs/signals.md`](../../docs/signals.md).*
7. **Slack / email alert mock** — "send to owner" UI that surfaces a preview, doesn't actually send.
8. **Weekly report mock** — printable / shareable summary view for CS / Product / Support leadership.

## Open scope questions (from the brief)

- Intercom or Zendesk first?
- Dashboard, Slack alerts, or weekly report as the first output?
- Which signal first: churn, expansion, or product friction?
