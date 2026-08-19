# memory.md — Hackathon Team Matcher (PS-03)

Living log. Update this **every work session** — what's done, what's in progress, what file/screen you're currently in, and what's next. Anyone (teammate or AI assistant) should be able to read this file alone and know exactly where the project stands.

---

## Status Summary
- **Current Phase:** Phase 3 (Matching) done, Phase 4 (Discover) done, Phase 5 (Requests/Team) done, admin system live end-to-end (verified via real login) — starting frontend polish work next
- **Last updated:** 2026-08-19
- **Last updated by:** Claude (AI assistant session)

## Currently Working On
- File/Screen: n/a — session just wrapped up debugging Supabase auth for the admin flow; frontend work starting next
- Task: about to start frontend work (see "Next Session Should Start With")
- Blocker (if any): none currently open — see Known Issues for non-blocking items

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
- [x] **Phase 1 QA'd:** ran real `npm install` + `npm run build`, fixed 2 a11y warnings in `MobileMenu.svelte`, added placeholder `logo.webp`
- [x] **Fixed bug:** global `body { overflow: hidden; height: 100vh }` was scoped to the whole app instead of just the landing page — would've broken scrolling on every other screen. Scoped to `body:has(.page)`.
- [x] `+layout.svelte` initializes Supabase session on load + syncs `auth.js` store via `onAuthStateChange`
- [x] `login/+page.svelte` and `signup/+page.svelte` — real forms calling `supabase.auth.signInWithPassword` / `signUp` directly from the frontend (per rules.md)
- [x] `lib/requireAuth.js` — client-side route guard, redirects to `/login` if no session; wired into onboarding/discover/requests/my-team/profile
- [x] `lib/components/profile/ProfileForm.svelte` — reusable form (skills, preferred roles as toggle pills, interests, team-size, bio, GitHub/LinkedIn), used by both onboarding and profile-edit
- [x] `onboarding/+page.svelte` — `PUT /api/profile/me` via `apiFetch`, redirects to `/discover` on success
- [x] `profile/+page.svelte` — `GET` + `PUT /api/profile/me`, shows saved confirmation
- [x] Server verified: `npm install` succeeds, every file syntax-checked, boots and `/health` returns `{"status":"ok"}`
- [x] Full DB reset: dropped and recreated `profiles`, `team_requests`, `teams`, `team_members` + `enforce_admin_cap` trigger + RLS policies from scratch via `supabase/reset_schema.sql` (kept `auth.users` intact)
- [x] Fixed Supabase Auth `429 email rate limit exceeded` blocking admin signup — root cause was the **"Confirm email"** toggle under Dashboard → Authentication → Sign In / Providers → Supabase Auth being ON, which fires a confirmation email (and its rate limit) on every signup attempt; turned OFF for dev/testing
- [x] Fixed `Failed to fetch` on `/admin-signup` after the above — root cause was the local Express backend (`server/`) not running, so the frontend's `POST ${PUBLIC_API_URL}/api/admin/register` call had nothing to connect to
- [x] **Admin flow verified end-to-end for real:** signup → Supabase Auth user created → backend promotes profile → login → admin dashboard access confirmed working (1 of 2 admin slots now used)

## In Progress
- [ ] `client/static/assets/hero.mp4` — file not sourced yet (fallback in place, see Known Issues)
- [ ] Seed data — 15-20 fake profiles still needed per rules.md for a fuller demo (matching/discover work correctly against real signups, just thin on data)

## Not Started
- Phase 6 (Polish & Demo Prep), Phase 7 (Stretch) — see phases.md
- No stretch features (chat, auto-team-suggest, notifications) started; not needed pre-Phase-6 per rules.md

## Decisions Log
| Date | Decision | Reason |
|---|---|---|
| 2026-08-19 | Planning docs created before writing code | Keep hackathon build organized, per rules.md |
| 2026-08-19 | **Tech stack locked:** Frontend = Svelte (SvelteKit) + Tailwind; Backend = Node.js + Express.js; Database/Auth = Supabase (PostgreSQL) | User's explicit choice — updated architecture.md, rules.md accordingly |
| 2026-08-19 | Fixed `vite.config.js`: import `sveltekit` from `@sveltejs/kit/vite` instead of `@sveltejs/vite-plugin-svelte` | Original scaffold had wrong import source, caused "Cannot GET /" / SyntaxError on `npm run dev` |
| 2026-08-19 | Scoped the landing page's `overflow: hidden; height: 100vh` to `body:has(.page)` instead of the global `body` selector | It was locking scroll on every route, not just the single-viewport landing page — would've broken discover/profile/etc. |
| 2026-08-19 | `ProfileForm.svelte` uses one "overall skill level" dropdown applied to every entered skill, rather than a per-skill level picker | `skill_levels` jsonb (architecture.md §6) supports per-skill granularity, but a full per-skill UI is more form-building than an MVP needs; simplification documented here in case it needs revisiting for Phase 3 matching quality |
| 2026-08-19 | Skills/interests entered as comma-separated text inputs, not a tag-picker component | Avoids building a custom tag-input widget for MVP; can upgrade later if there's spare time (see rules.md — don't over-engineer) |
| 2026-08-19 | Added `role` column (`student`/`admin`) to `profiles`, capped at max 2 admins via a Postgres trigger (`enforce_admin_cap`) + a backend count-check in `admin.controller.js` | User's explicit request — admins register through a dedicated `/admin-signup` route (still normal Supabase Auth signup underneath), which returns "Admin limit reached (max 2)" once both slots are taken |
| 2026-08-19 | Built a shared `AppShell.svelte` (top nav: Discover/Requests/My Team/Profile/Admin + logout) and wrapped every authenticated route in it | Placeholder pages (just an `<h1>`) didn't read as one connected product; rules.md §"Use the design system... for every screen" |
| 2026-08-19 | `VideoBg.svelte` now points at local `/assets/hero.mp4` (not yet provided) with a graceful dark-gradient fallback on video error, instead of the placeholder CloudFront clip | User has their own hero video but hasn't uploaded it yet — this avoids a broken/mismatched video shipping in the meantime |
| 2026-08-19 | Reset all app-data tables (`profiles`, `team_requests`, `teams`, `team_members`) from scratch via a new `supabase/reset_schema.sql`, leaving `auth.users` untouched | User wanted a clean slate on app data (stale/duplicate test admin rows) without losing real auth accounts |
| 2026-08-19 | Disabled Supabase's "Confirm email" setting for this project (dev/testing phase) | Was causing `429 email rate limit exceeded` on every signup attempt including `/admin-signup`, since Supabase's default email sender has a low rate limit; re-enable before real users sign up if verified emails matter for the demo |

## Known Issues / Tech Debt
- `static/assets/logo.webp` is a generated placeholder (two overlapping circles) — swap for the real logo
- `static/fonts/GeistPixel-Circle.woff2` still doesn't exist as a file — nobody has provided it. `globals.css` references it but it'll silently fail to load and fall through to the CDN `BubbledotICG-FinePos` or `monospace`. Not a blocker, just cosmetic.
- `static/assets/hero.mp4` doesn't exist yet — landing page shows a dark gradient instead of the video background until it's added (see `static/assets/HERO_VIDEO_README.txt`)
- No seed data — discover/matching work against real signups but there's not much to browse with only a couple of test accounts
- **"Confirm email" is currently OFF** in Supabase (see decisions log) — fine for dev, but remember to revisit before a public/real demo signup flow if email verification matters
- Local dev requires **both** `server` (Express, :3000) and `client` (SvelteKit, :5173) running simultaneously — easy to forget the backend and get a misleading "Failed to fetch" on any API-backed action (admin register, profile save, discover, requests, etc.)

## Next Session Should Start With
1. **Frontend work session starting now** — pick up polish/UI tasks (this is the "next session" this entry was written for)
2. Drop the real `hero.mp4` into `client/static/assets/hero.mp4` — no code change needed, VideoBg.svelte already points at it
3. Seed 15-20 fake profiles (rules.md) so discover/matching has more to show in a demo
4. Phase 6: mobile responsiveness pass, loading/empty states review, remove any leftover debug code, full end-to-end test (signup → profile → discover → request → accept → team formed → admin overview)
5. If time allows: Phase 7 stretch features (chat, auto-team-suggest, notifications)

---

### How to update this file
- At the **start** of a session: note what you're about to work on under "Currently Working On"
- At the **end** of a session: move finished items to "Completed", update "Status Summary", and leave a clear note in "Next Session Should Start With"
- Never delete history from "Decisions Log" — append only
