# Conventions

Project-wide rules. Subproject-specific style sits in the relevant subproject's `docs/`.

## Data and integrations

- **Mocked data only.** No real customer data. No production credentials. No live API keys for Intercom, Zendesk, HubSpot, Salesforce, Slack, billing, or auth.
- Forms (1,000-conversations CTA, contact, demo-request) post to mock endpoints — no real CRM/email/HubSpot wiring.
- All copy is draft until the user signs off. Flag claims (logos, customer counts, ROI numbers, committed pricing) before they ship on-screen.

## Vocabulary

- Pull positioning, taglines, ICP, signal names, MVP-wedge phrasing **verbatim** from `brief.md`. Don't invent synonyms.
- Canonical signal taxonomy and the trust contract live in [`signals.md`](./signals.md).

## Code

- Shared types live next to their producer module — not in a global `types/` folder.
- Don't cross-import between `Web/` and `Saas/`. They are independent codebases that happen to share a repo.
- Linters handle style — don't restate lint rules in AGENTS.md files.

## Subproject scope

- `Web/` is the public marketing site. No auth, no dashboards, no in-app data.
- `Saas/` is the signed-in product. No marketing copy that belongs on the public site.
