# rules.md — Hackathon Team Matcher (PS-03)

## Purpose
Keep the build consistent, avoid scope creep, and make sure anyone (or any AI assistant) picking this project up mid-hackathon can continue without breaking things.

## ✅ Do

- **Stack is locked: Svelte (SvelteKit) + Tailwind, Node.js + Express backend, Supabase (PostgreSQL) database/auth.** Do not switch any layer mid-build.
- **Use Supabase Auth directly from the frontend** for signup/login/logout (via the Supabase JS client) — don't build a custom auth system in Express.
- **Enable Row Level Security (RLS) on every Supabase table** before writing any data — see architecture.md §6 for the policies. Never disable RLS "just to test faster."
- **Follow the folder structure in `architecture.md`.** New files go in the matching folder, not wherever's convenient.
- **Use the design system in `design.md`** for every screen — colors, fonts, spacing scale, component patterns. The landing page prompt already defines the visual language; extend it, don't invent a new one for inner app screens.
- **Keep the matching algorithm in one place** (`matching.service.js`), pure and testable — no scoring logic scattered across components.
- **Update `memory.md` after every work session** — what got done, what file you were in, what's next. This is non-negotiable for hackathon hand-offs between teammates.
- **Commit small, working increments.** A broken `main` branch at demo time is the #1 hackathon failure mode.
- **Validate forms client-side AND server-side** (skills, role, email) — don't trust the frontend alone.
- **Use environment variables** for all API keys/secrets (`.env`, never committed — see `.env.example`).
- **Write mobile-first CSS.** Judges/demos often happen on laptops but the design spec explicitly requires mobile behavior — don't bolt it on at the end.
- **Seed the database with 15–20 fake student profiles** early, so matching/discovery can be demoed without needing 20 real signups.

## ❌ Avoid

- **Don't build the ML/AI matching model.** Rule-based scoring (see architecture.md §5) is sufficient and explainable for a hackathon demo. An ML model is a stretch goal at best, and a time sink at worst.
- **Don't add authentication complexity** beyond email/password or one OAuth provider. No multi-factor, no role-based admin panels unless there's spare time at the very end.
- **Don't over-engineer state management.** No external state library for this scope — Svelte's built-in stores (`writable`/`derived`) are enough.
- **Don't add a second database or a custom users table.** `auth.users` (Supabase-managed) is the single source of truth for identity; every other table references it by `user_id`.
- **Don't hardcode the compatibility score display** without running it through the actual scoring function — it should always reflect real profile data, even with seed data.
- **Don't reproduce copyrighted assets** (fonts, icons, video) without checking license terms — the OnlineWebFonts CDN font and stock background video in `design.md` should be double-checked for hackathon/demo use license if this goes beyond a local demo.
- **Don't skip form validation** on skills/role selection — empty profiles break the matching algorithm (division by zero, empty-set comparisons).
- **Don't build the "organizer dashboard" or "real-time chat"** unless MVP (auth, profile, discover, match score, requests, team formation) is fully working and demoed end-to-end first.
- **Don't leave `console.log` / debug UI** in the build shown at demo.

## Code Style

- **Frontend:** SvelteKit, one component = one `.svelte` file, Tailwind utility classes over custom CSS where possible, reactive state kept in stores under `lib/stores/` (not scattered `let` variables across components when shared).
- **Backend:** Express controllers thin, business logic in `services/`, request bodies validated with a schema library (Zod or Joi) before hitting the database.
- **Database access:** use the Supabase JS client (`@supabase/supabase-js`) with the service role key on the backend only — never expose the service role key to the frontend (frontend uses the anon key + RLS).
- **Naming:** camelCase for JS variables/functions, PascalCase for `.svelte` component filenames (e.g., `StudentCard.svelte`), kebab-case/snake_case for everything else (e.g., `matching.service.js`, Postgres columns as `snake_case`).
- **Commits:** `feat:`, `fix:`, `chore:`, `docs:` prefixes.

## Definition of Done (per feature)
1. Works on desktop and mobile viewport
2. No console errors
3. Connected to real backend/DB (not mock data), except explicitly-flagged stretch features
4. `memory.md` updated
