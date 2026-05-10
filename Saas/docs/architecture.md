# Architecture entry points

Fill in as built. Most are TBD until the stack is chosen.

| Concern                           | Location                                |
| --------------------------------- | --------------------------------------- |
| View state hub                    | _TBD_                                   |
| Render switch / nav               | _TBD_                                   |
| Mock conversation data            | `src/data/conversations.ts`             |
| Mock account data                 | `src/data/accounts.ts` — must include `arr`, `plan`, `segment`, `owner` |
| Signal classifier (mocked)        | `src/lib/signals/classify.ts`           |
| Signal → source-conversation link | _TBD_ — this is the [trust contract](../../docs/signals.md). Every signal renders with at least one linked ticket. |
| API routes (server-only)          | `src/app/api/*` — never `'use client'` (assumes Next.js App Router; revisit if stack changes) |

## Data layout

All seed data hardcoded in `src/data/` or `src/lib/constants.ts`. No database, no ORM, no migrations. Edit source files; no schema changes needed.
