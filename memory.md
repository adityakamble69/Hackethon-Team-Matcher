# memory.md — Hackathon Team Matcher (PS-03)

Living log. Update this **every work session** — what's done, what's in progress, what file/screen you're currently in, and what's next. Anyone (teammate or AI assistant) should be able to read this file alone and know exactly where the project stands.

---

## Status Summary
- **Current Phase:** Phase 1 — Design System & Landing Page (almost done — needs asset files + QA)
- **Last updated:** 2026-08-19
- **Last updated by:** _(fill in name)_

## Currently Working On
- File/Screen: Landing page QA — need to drop real `logo.webp` and `GeistPixel-Circle.woff2` into `client/static/`
- Task: Verify landing page renders correctly (desktop + mobile) before moving to Phase 2
- Blocker (if any): logo/font asset files not yet added (using placeholders)

## Completed
- [x] Planning docs created (PRD.md, architecture.md, rules.md, phases.md, design.md, memory.md)
- [x] Tech stack locked: Svelte (SvelteKit) + Tailwind / Node.js + Express / Supabase (PostgreSQL)
- [x] Project scaffold generated (client + server folder structure, configs, placeholder routes)
- [x] Fixed `vite.config.js` — `sveltekit` import corrected to `@sveltejs/kit/vite`
- [x] Supabase project created, schema.sql run, RLS policies enabled
- [x] Backend running locally, `/health` returns `{"status":"ok"}`
- [x] Frontend running locally on `localhost:5173`, placeholder landing page loads
- [x] **Phase 0 — Setup: complete**
- [x] Landing page built: `VideoBg.svelte`, `Header.svelte`, `MobileMenu.svelte`, `Hero.svelte`, `Stats.svelte` — wired into `routes/+page.svelte`
- [x] Fonts (Inter, BubbledotICG-FinePos) + Font Awesome 6.5.2 added to `app.html`
- [x] Shared `.anim`/`reveal`/`revealPulse` entrance animations + `prefers-reduced-motion` handling added to `globals.css`

## In Progress
- [ ] Need real `assets/logo.webp` and `fonts/GeistPixel-Circle.woff2` files dropped into `client/static/` (currently placeholders/missing — logo will 404 until added)
- [ ] Visual QA: test in browser at desktop + mobile (≤720px burger menu) + ≤420px + short viewports (≤700px height)

## Not Started
- Phase 2 (Auth + Profile) through Phase 7 (see phases.md)

## Decisions Log
| Date | Decision | Reason |
|---|---|---|
| 2026-08-19 | Planning docs created before writing code | Keep hackathon build organized, per rules.md |
| 2026-08-19 | **Tech stack locked:** Frontend = Svelte (SvelteKit) + Tailwind; Backend = Node.js + Express.js; Database/Auth = Supabase (PostgreSQL) | User's explicit choice — updated architecture.md, rules.md accordingly |
| 2026-08-19 | Fixed `vite.config.js`: import `sveltekit` from `@sveltejs/kit/vite` instead of `@sveltejs/vite-plugin-svelte` | Original scaffold had wrong import source, caused "Cannot GET /" / SyntaxError on `npm run dev` |

## Known Issues / Tech Debt
- _(none yet)_

## Next Session Should Start With
1. Add real `assets/logo.webp` and `fonts/GeistPixel-Circle.woff2` to `client/static/`
2. Run `npm run dev` and visually check landing page at desktop, ≤720px (mobile menu), ≤420px, and short viewport heights
3. Once QA'd, mark Phase 1 complete and start Phase 2 — Auth + Profile (login/signup pages using Supabase Auth, profile creation form)

---

### How to update this file
- At the **start** of a session: note what you're about to work on under "Currently Working On"
- At the **end** of a session: move finished items to "Completed", update "Status Summary", and leave a clear note in "Next Session Should Start With"
- Never delete history from "Decisions Log" — append only
