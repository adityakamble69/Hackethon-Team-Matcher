# memory.md — Hackathon Team Matcher (PS-03)

Living log. Update this **every work session** — what's done, what's in progress, what file/screen you're currently in, and what's next. Anyone (teammate or AI assistant) should be able to read this file alone and know exactly where the project stands.

---

## Status Summary
- **Current Phase:** Phase 0 — Setup (not started)
- **Last updated:** _(fill in date/time)_
- **Last updated by:** _(name)_

## Currently Working On
- File/Screen: _(none yet — project not started)_
- Task: _(none)_
- Blocker (if any): _(none)_

## Completed
- [ ] Nothing yet — planning docs created (PRD.md, architecture.md, rules.md, phases.md, design.md, memory.md)

## In Progress
- _(empty)_

## Not Started
- All of Phase 0 through Phase 7 (see phases.md)

## Decisions Log
| Date | Decision | Reason |
|---|---|---|
| _(today)_ | Planning docs created before writing code | Keep hackathon build organized, per rules.md |
| _(today)_ | **Tech stack locked:** Frontend = Svelte (SvelteKit) + Tailwind; Backend = Node.js + Express.js; Database/Auth = Supabase (PostgreSQL) | User's explicit choice — updated architecture.md, rules.md accordingly |

## Known Issues / Tech Debt
- _(none yet)_

## Next Session Should Start With
1. Begin Phase 0 setup checklist (phases.md) — stack is now locked, no more decision needed
2. Init SvelteKit project (`client/`) and Express project (`server/`) per architecture.md folder structure
3. Create Supabase project, run schema SQL from architecture.md §6, enable RLS policies before writing any data

---

### How to update this file
- At the **start** of a session: note what you're about to work on under "Currently Working On"
- At the **end** of a session: move finished items to "Completed", update "Status Summary", and leave a clear note in "Next Session Should Start With"
- Never delete history from "Decisions Log" — append only
