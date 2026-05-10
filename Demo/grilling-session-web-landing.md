# Grilling session — CustomerCue Web landing page

**Date:** 2026-05-10
**Skill used:** `grill-with-docs`
**Starting prompt (Swedish):** *"jag vill att vi tar fram en enkel men snygg landningssida till CustomerCue läs brief.md och /grill-with-docs obs detta är websidan inte själva saas appen"*

Translation: "I want us to build a simple but nice landing page for CustomerCue. Read brief.md and /grill-with-docs. Note: this is the website, not the SaaS app itself."

This file captures the full grilling: what was read first, every question asked, the options offered, the assistant's recommendation, the user's choice, and the artifacts produced. Reproducible for live demos.

---

## 0. Pre-grilling — what was read

Before asking the first question, the assistant read the existing context:

- `brief.md` — already in context from the project's `CLAUDE.md` reference.
- `Web/AGENTS.md` — agent entry point for `Web/`. Stack listed as TBD (Astro or Next.js).
- `Web/docs/page-scope.md` — lists seven full marketing sections (hero / how-it-works / signals / differentiation / ICP / pricing / social proof / footer).
- `docs/signals.md` — canonical 10-signal taxonomy + trust contract.
- `docs/conventions.md` — mocked-data rule, verbatim-vocabulary rule, no cross-import between `Web/` and `Saas/`.
- `docs/stop-rules.md` — when to stop and ask.

Looked for but did not find:

- `CONTEXT.md` or `CONTEXT-MAP.md` (no glossary yet).
- `docs/adr/` (no recorded architectural decisions yet — created lazily later in the session).

**Tension identified up front:** the user asked for "*a* simple landing page" (singular, focused) while `Web/docs/page-scope.md` describes a full seven-section marketing site. That tension framed the first question.

---

## 1. Question 1 — Scope: focused landing page or full marketing site?

### Options offered

**A. Focused single landing page** — one scrollable `/`. Hero + how-it-works + signals + CTA + footer. No pricing, no social proof, no separate ICP section. ~4–5 sections total.

**B. Full marketing site** — all seven sections from `page-scope.md`, optionally with navigation and sub-pages (`/pricing`, `/about`). ~1500–2500 words of copy.

**C. Hybrid** — all sections, but all on a single page. Dense single-scroll.

### Assistant's recommendation: **A**

- "Simple but nice" + workshop demo + no real customers → pricing and social proof shouldn't be on the page now. The brief's pricing is a hypothesis, and social proof without real logos becomes empty placeholders that reduce the visual quality.
- Differentiation and ICP are positioning copy — they can be woven into hero and how-it-works rather than getting dedicated sections.
- The 1,000-conversations offer (the brief's validation play) becomes the only secondary CTA, which is more honest for a pre-revenue demo.
- Picking A means `Web/docs/page-scope.md` is wrong about scope and gets rewritten.

### User picked: **A**

### Artifact: `Web/docs/page-scope.md` was rewritten

Top of new file: *"A single focused landing page. One scrollable `/`. All copy pulls from `../../brief.md` verbatim."*

Sections: hero → how it works → signals → CTA → footer.

Explicit "out of scope (deferred)" section names pricing and social proof so future agents don't re-add them.

---

## Side decision A — Git-flow as a project rule

Mid-grilling, the user requested: *"kan du lägga till i agent att vi alltid kör gitflow"* — "add to AGENTS that we always run gitflow."

The assistant identified a contradiction in the existing docs: `docs/stop-rules.md` line 12 said *"Default branch is `main`. Switch to git-flow only if the project grows multiple parallel tracks."* That line had to be replaced for consistency.

### Artifacts

- `AGENTS.md` — added a `## Branching` section listing the five gitflow branch types and the rule "Work happens on `feature/*`. Never commit straight to `main` or `develop`."
- `docs/stop-rules.md` — line 12 replaced with: *"Git-flow always — see `../AGENTS.md`. Never commit straight to `main` or `develop`; work on a `feature/*` branch."*

---

## 2. Question 2 — Primary CTA: which ask leads?

### Options offered

**A. Follow the brief literally** — "Book a demo" big, "Send 1,000 conversations" smaller. Form: name + work email + company.

**B. Invert** — "Send 1,000 conversations" big (anchored as the hero CTA), "Book a demo" smaller. More honest for a pre-revenue product. Form: name + work email + upload field (mocked).

**C. Single CTA, no secondary** — pick one. Recommended pick if going C: "Book a demo" (the conventional one).

### Assistant's recommendation: **A**

- The brief is the source of truth and isn't ambiguous about hierarchy.
- The workshop-demo audience argument cuts both ways — developers also learn from seeing "what a real B2B SaaS landing page does."
- Flagged that B is *more honest* for the product's actual stage and would suit a positioning bet — but A is the conservative read.

### User picked: **A**

### Artifact: `Web/docs/page-scope.md` already had A's hierarchy

No further doc change needed.

---

## 3. Question 3 — Stack: Astro or Next.js?

### Options offered

**A. Astro** — static-first, ships almost no JS, `.astro` components, framework islands only where needed.

**B. Next.js App Router** — heavier React framework. Familiar; matches sibling Monterro/InfuseAI demos. Easier evolution path to a richer marketing site.

### Assistant's recommendation: **A (Astro)**

- Right tool for the job: static landing page with one mocked form is Astro's sweet spot.
- Performance honesty: a pitch about "intelligence layer" lands harder when the page is sub-1s with perfect Lighthouse.
- Workshop pedagogy: Web in Astro + Saas in (probably) Next.js demonstrates real architectural judgement.
- `docs/conventions.md` already forbids cross-import between `Web/` and `Saas/`, so stack divergence is consistent with the existing convention.

Counter-arguments named:
- Team-familiarity argument for Next.js (mental-model homogeneity).
- If `Web/` ever shares components with `Saas/`, both must be React.

Also offered to write an ADR if A was picked, on the grounds that the decision is hard to reverse, surprising-without-context (default for sibling demos is Next.js), and the result of a real trade-off.

### User picked: **A**

### Artifacts

- `Web/AGENTS.md` — `Stack` table updated. Framework: **Astro**, hosting: Vercel or Cloudflare Pages.
- `Web/README.md` — same update.
- `docs/adr/0001-astro-for-web.md` — new ADR with context, decision, considered alternatives, consequences.

---

## Side decision B — All output in English

Mid-grilling, the user added: *"kom även ihåg att altl ska vara på engelska även fast jag skriver på andra språk"* — "remember that everything should be in English even though I write in other languages."

### Artifact: memory entry

Saved as a `feedback`-type memory: *"All assistant output stays in English regardless of the language the user writes in. Covers chat replies, code, comments, doc files, commit messages, PR descriptions, file names. The codebase itself is English, and workshop demos need to be readable by an international audience."*

---

## Side decision C — Branches created

User requested: *"skapa en feature branch frpn develop som heter web-1-0"* — "create a feature branch from develop called web-1-0."

The assistant noted that `develop` didn't yet exist (only `main`) and created both. Branch name was set to `feature/web-1-0` to match the gitflow convention recorded earlier, with a flag offered to rename if the literal `web-1-0` was preferred.

### Artifact: local branches

```
main
develop                ← created from main, no commits yet
feature/web-1-0   *    ← created from develop, holds session's uncommitted work
```

Nothing pushed to remote — gitflow rule says push only on explicit request.

---

## 4. Question 4 — Visual identity: whose brand?

### Options offered

**A. Monterro brand identity** — pull colours and typography from the Monterro visual system (there's a `monterro-pptx` skill suggesting brand assets exist). Treats CustomerCue as a Monterro-owned property. Honest about workshop context.

**B. Distinct CustomerCue identity** — invent a wordmark, palette, and typography for "CustomerCue, Inc." Treats CustomerCue as a fictional standalone B2B SaaS company. Most product-realistic.

**C. Generic-but-tasteful B2B SaaS** — clean sans, one accent, neutral palette, no real wordmark. Cheapest, most polished-for-the-time.

### Assistant's recommendation: **B**

- The brief positions CustomerCue as a standalone company with its own ICP and pricing. A visual-first demo has to *feel* like that.
- Workshop audiences notice when a "product page" looks like a corporate brochure — it breaks the demo's premise.
- B isn't much more work than C: a wordmark, one colour family, a type pairing. Afternoon, not week.
- A is interesting but risks reading as "Monterro internal tooling" rather than "B2B SaaS pitch."

### User picked: **B**

(No doc artifact at this step — the *direction* was set, but the concrete tokens needed the next question.)

---

## 5. Question 5 — Visual mood: which register?

### Options offered

**A. Editorial-analytical** — dark/calm. Deep neutral background, one warm accent, monospace numerals for example-output metrics, optional serif display + sans body. Reference: Linear, Cursor, Anthropic.

**B. Signal-clinical** — bright, data-product. Light background, multi-colour signal palette (each of the 10 signal types gets a recurring hue used on the page and later in the app). Reference: Vercel, PostHog, Mixpanel.

**C. Editorial-warm** — confident, warm, conversational. Cream background, dark text, one bold colour, serif headlines. Reference: Stripe articles, Notion marketing, Sanity.

### Assistant's recommendation: **A (editorial-analytical)**

- The brief frames CustomerCue as an *intelligence layer* surfacing hidden signal — calm/analytical reads more honest than bright/clinical for "we find the things you missed."
- B's signal palette is technically elegant but commits the team to defining 10 distinct harmonious hues — that's a design-system project, not a landing page. Defer to `Saas/`.
- Dark/calm is the current B2B-SaaS-for-serious-buyers idiom (Linear, Cursor, Anthropic, Arc). Workshop audiences recognise it as "real product."
- Monospace numerals on Acme/NordicPay illustrations make them look like real telemetry.

### User picked: **A**

### Artifacts

- `Web/docs/design-system.md` — new file. Direction, principles, token table (deep neutral / warm accent / monospace numerals), component shape (wordmark, hero metric strip, signal grid, CTA section, footer), and explicit "what this is not" anti-list.
- `docs/adr/0002-editorial-analytical-visual-direction.md` — context, decision, considered alternatives (signal-clinical and editorial-warm both rejected with reasons), consequences.
- `Web/AGENTS.md` — `Read these on demand` section now points at `design-system.md` and `../docs/adr/`.

---

## Final summary

| # | Topic | Decision | Recorded in |
|---|---|---|---|
| 1 | Scope | Focused single-page landing (hero / how-it-works / signals / CTA / footer) | `Web/docs/page-scope.md` |
| 2 | CTA | "Book a demo" primary, "Send 1,000 conversations" secondary | `Web/docs/page-scope.md` |
| 3 | Stack | Astro (Web and Saas allowed to diverge) | `Web/AGENTS.md`, `Web/README.md`, ADR-0001 |
| 4 | Brand | Distinct CustomerCue identity (not Monterro-branded) | ADR-0002 |
| 5 | Mood | Editorial-analytical — dark, calm, monospace numerals, no signal palette in v1 | `Web/docs/design-system.md`, ADR-0002 |

### Side decisions

- Git-flow always (`AGENTS.md` § Branching, `docs/stop-rules.md`)
- All assistant output in English (memory entry)
- `develop` + `feature/web-1-0` branches created locally (no push)

### Deferred to implementation

- Exact hex values, type pairing, spacing scale, wordmark treatment — landed visually during scaffolding, recorded back into `design-system.md`.

### Total artifacts produced

5 new / changed files:

- `AGENTS.md` (added Branching)
- `docs/stop-rules.md` (replaced "main as default" line)
- `Web/AGENTS.md` (stack table + reading list)
- `Web/README.md` (stack table)
- `Web/docs/page-scope.md` (rewritten for option A)
- `Web/docs/design-system.md` (new)
- `docs/adr/0001-astro-for-web.md` (new)
- `docs/adr/0002-editorial-analytical-visual-direction.md` (new)

Plus memory entry: `feedback_output_language.md`.

---

## How to re-run this grilling

If demoing the skill again from scratch:

1. Start with: *"I want a simple but nice landing page for CustomerCue. Read `brief.md`."*
2. Invoke `/grill-with-docs`.
3. The skill will read context, then ask five branch-by-branch questions: scope → CTA → stack → brand → mood.
4. Each question comes with 2–4 options, an assistant recommendation, and the reasoning behind it.
5. Decisions get recorded in real time — `page-scope.md` updates, ADRs get written, AGENTS.md gets edited — so the artifact is the documentation, not a chat transcript.

The grilling produces both *aligned decisions* and *durable records of those decisions* in one pass.
