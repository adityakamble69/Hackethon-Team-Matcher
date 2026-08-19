# phases.md — Hackathon Team Matcher (PS-03)

Break the build into phases so progress is trackable and there's always a demoable state. Update checkboxes and note dates in `memory.md`, not here — this file defines the plan, `memory.md` tracks actual status.

## Phase 0 — Setup (Day 1, first 1–2 hrs)
- [x] Finalize tech stack (per architecture.md decision note)
- [x] Init repo, folder structure per architecture.md
- [x] Set up client (Vite + React + Tailwind) and server (Express) skeletons
- [x] Set up database (Supabase/Mongo Atlas/Firebase) and connect
- [x] Add `.env.example`, confirm `.env` is gitignored
- [ ] Deploy a "hello world" of both frontend and backend to confirm pipeline works end-to-end early

## Phase 1 — Design System & Landing Page
- [x] Implement `design.md` tokens (colors, fonts, spacing) as CSS variables / Tailwind theme
- [x] Build Landing Page per the UI design prompt (video bg, header, hero, stats footer, mobile menu)
- [x] Confirm fonts load correctly (Inter, BubbledotICG-FinePos, Font Awesome) — note: `GeistPixel-Circle.woff2` fallback file still missing, see memory.md

## Phase 2 — Auth + Profile
- [x] Sign up / Login flow
- [x] Protected routes (redirect unauthenticated users)
- [x] Profile creation form (skills, roles, level, interests, team-size pref)
- [x] Profile edit screen
- [ ] Seed 15–20 fake profiles for demo/testing

## Phase 3 — Matching Algorithm
- [x] Implement `matching.service.js` scoring function (architecture.md §5)
- [x] Unit-test scoring with a few known input pairs
- [x] Expose `/api/match/score/:otherUserId` endpoint

## Phase 4 — Discover & Search
- [x] Discover page: list/grid of profiles with compatibility % (relative to logged-in user)
- [x] Filters: role, skill, interest, level
- [x] Sort by compatibility score
- [x] Student detail view — folded into StudentCard (full profile) rather than a separate route

## Phase 5 — Team Requests
- [x] Send request from student detail view
- [x] Received/Sent request tabs with Accept/Decline
- [x] On accept, create/update `Team` entity
- [x] My Team page — show composition, roles filled vs missing

## Phase 6 — Polish & Demo Prep
- [ ] Mobile responsiveness pass on every screen
- [ ] Loading states / empty states (no matches yet, no requests yet)
- [ ] Error handling (failed API calls shown gracefully)
- [ ] Remove debug code/console logs
- [ ] Final deploy, test full flow: signup → profile → discover → request → accept → team formed
- [ ] Prepare demo script / pitch narrative

## Phase 7 — Stretch (only if ahead of schedule)
- [ ] Real-time chat between matched teammates
- [ ] "Auto-suggest a full balanced team" feature
- [ ] Notifications
- [ ] Organizer dashboard
- [x] Admin login/dashboard (max 2 admins) — done ahead of schedule, out-of-plan user request; verified end-to-end (signup → login → dashboard access) this session; see memory.md decisions log

## Suggested Time Allocation (typical 24–36 hr hackathon)
| Phase | % of time |
|---|---|
| 0 — Setup | 5% |
| 1 — Design/Landing | 10% |
| 2 — Auth/Profile | 20% |
| 3 — Matching Algorithm | 15% |
| 4 — Discover/Search | 15% |
| 5 — Team Requests | 15% |
| 6 — Polish/Demo | 15% |
| 7 — Stretch | remaining time only |
