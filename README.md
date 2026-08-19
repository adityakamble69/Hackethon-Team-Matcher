# Hackathon Team Matcher (PS-03)

A platform to help students find compatible hackathon teammates based on skills, roles, experience, and interests.

## Docs (read in this order)
1. `PRD.md` — what we're building and why
2. `architecture.md` — tech stack, folder structure, API, DB schema
3. `design.md` — colors, fonts, typography, component patterns
4. `rules.md` — do's and don'ts
5. `phases.md` — build plan broken into phases
6. `memory.md` — living progress log (update every session!)

## Stack
- Frontend: Svelte (SvelteKit) + Tailwind CSS
- Backend: Node.js + Express.js
- Database/Auth: Supabase (PostgreSQL)

## Getting Started

### 1. Supabase
- Create a project at supabase.com
- Run the SQL in `architecture.md` §6 to create tables and enable RLS
- Copy your Project URL, anon key, and service_role key

### 2. Backend
```bash
cd server
cp .env.example .env   # fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PORT
npm install
npm run dev
```

### 3. Frontend
```bash
cd client
cp .env.example .env   # fill in PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, PUBLIC_API_URL
npm install
npm run dev
```

Frontend runs on http://localhost:5173, backend on http://localhost:3000 by default.
