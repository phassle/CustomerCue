<!--
Branching: feature/* → develop, release/* → main+develop, hotfix/* → main+develop.
Never target main directly unless this is a release or hotfix.
-->

## Summary

<!-- One or two sentences. What changed and why. Link the issue: Closes #N -->

## Scope

- **Subproject:** Web / Saas / docs / tooling
- **Traces to:** brief.md section _or_ PRD #N
- **Out of scope:** <!-- what this PR deliberately does NOT do -->

## Acceptance criteria

<!-- Paste the Given/When/Then from the issue (or reference it). For PRDs, link the PRD instead. -->

## How I tested

<!-- Real flow, not stubs. E2E if applicable. Note the commands you ran. -->

- [ ] Unit / component tests
- [ ] E2E (real pages + real mock endpoints, no system stubbing)
- [ ] Manual walkthrough in browser
- [ ] N/A — docs-only / tooling-only

## Checklist

- [ ] Branched off `develop` (or `main` for hotfix/release).
- [ ] Targets the correct base branch.
- [ ] No secrets, no real customer data — mocked data only (see [`docs/conventions.md`](../docs/conventions.md)).
- [ ] Signals (if any) link back to source conversations (trust contract — see [`docs/signals.md`](../docs/signals.md)).
- [ ] If this PR closes a `feature/*` branch: the matching retro in [`docs/retros/`](../docs/retros/) has its "Lessons for the next PRD" section filled in.

## Screenshots / recordings

<!-- For UI changes. Drag & drop. -->
