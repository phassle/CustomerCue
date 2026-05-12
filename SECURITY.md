# Security Policy

## Demo status

CustomerCue is a **live agentic-development workshop demo** — visual-first, mocked data, no production deployment. It is not intended to handle real customer data and must not be deployed to production. The `POST /api/lead` endpoint validates input and returns a synthetic id without storing anything.

## Supported versions

Only the latest `main` is supported. There are no maintenance branches.

| Version | Supported          |
| ------- | ------------------ |
| `main`  | :white_check_mark: |
| Other   | :x:                |

## Reporting a vulnerability

Please **do not file public GitHub issues** for security vulnerabilities.

Email **per.hassle@monterro.com** with:

- A description of the issue
- Steps to reproduce (or a proof-of-concept)
- The affected file paths / commits / endpoints
- Your assessment of impact

You should expect an acknowledgement within **5 business days**. Because this is a demo repo with no production deployment, fixes ship as ordinary `hotfix/*` PRs into `main` and `develop` — there is no embargoed-release process.

## Scope

In scope:

- Code in this repository (`Web/`, `Saas/`, supporting tooling).
- GitHub Actions workflows in `.github/workflows/`.
- Dependencies declared in this repo's `package.json` files.

Out of scope:

- Issues that require a non-default deployment of the demo.
- Social engineering of workshop participants.
- Findings that depend on running with deliberately broken or modified mocked data.
