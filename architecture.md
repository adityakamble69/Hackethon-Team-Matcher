# architecture.md — Hackathon Team Matcher (PS-03)

## 1. Tech Stack (locked)

| Layer | Choice | Notes |
|---|---|---|
| Frontend | **Svelte (SvelteKit) + Tailwind CSS** | Fast dev, small bundle, matches design system in design.md |
| Routing | SvelteKit file-based routing | No extra router package needed |
| State | Svelte stores (`writable`/`derived`) | Keep it lightweight — no external state lib needed |
| Backend | **Node.js + Express.js** | REST API, separate from frontend (SvelteKit stays frontend-only, calls Express API) |
| Database | **Supabase (PostgreSQL)** | Managed Postgres, built-in auth, realtime available if needed later |
| Auth | **Supabase Auth** (email/password, optional Google OAuth) | Backend verifies Supabase JWT on protected Express routes |
| Hosting | Vercel/Netlify (SvelteKit frontend) + Render/Railway (Express backend) + Supabase (DB/auth, hosted) | Keep deployment simple, 3 pieces |
| Matching Logic | Node.js service function (rule-based scoring), not ML for MVP | Documented in section 5 |

**Decision note (resolved):** Stack is locked as Svelte + Express + Supabase Postgres. Do not mix in React, Mongo, or Firebase later — see `rules.md`.

## 2. App Flow (high level)

```
Landing Page (marketing/hero — see design.md)
        |
        v
  Sign Up / Login
        |
        v
  Create/Edit Profile (skills, role, level, interests, team-size pref)
        |
        v
  Dashboard
   ├── Discover/Search (browse + filter students, see compatibility %)
   ├── My Requests (sent / received, accept / decline)
   ├── My Team (once formed — team composition, missing roles)
   └── My Profile (edit)
```

## 3. Screens (MVP)

1. **Landing Page** — public, marketing hero (per design.md spec: video bg, headline, CTA "Get Started")
2. **Auth** — Sign up / Log in
3. **Onboarding / Profile Setup** — multi-step form (skills → role → interests → team-size)
4. **Discover** — grid/list of student cards with compatibility score, filters sidebar
5. **Student Detail / Profile View** — full profile + "Send Team Request" button
6. **Requests** — tabs: Sent / Received, with Accept/Decline actions
7. **My Team** — shows current team, roles filled vs missing
8. **Profile (self)** — edit own profile

## 4. Folder & File Structure

```
hackathon-team-matcher/
├── PRD.md
├── architecture.md
├── rules.md
├── phases.md
├── design.md
├── memory.md
├── README.md
├── client/                        # Frontend (SvelteKit)
│   ├── static/
│   │   ├── assets/
│   │   │   └── logo.webp
│   │   └── fonts/
│   │       └── GeistPixel-Circle.woff2
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/
│   │   │   │   ├── ui/                # Button.svelte, Pill.svelte, Card.svelte, Input.svelte
│   │   │   │   ├── landing/           # Header.svelte, Hero.svelte, Stats.svelte, VideoBg.svelte
│   │   │   │   ├── profile/           # ProfileForm.svelte, ProfileCard.svelte
│   │   │   │   ├── discover/          # FilterSidebar.svelte, StudentCard.svelte, CompatibilityBadge.svelte
│   │   │   │   └── requests/          # RequestList.svelte, RequestItem.svelte
│   │   │   ├── stores/
│   │   │   │   ├── auth.js            # writable store for current Supabase session/user
│   │   │   │   └── matches.js         # writable/derived store for match results
│   │   │   ├── api/
│   │   │   │   └── client.js          # fetch wrapper to Express backend (attaches Supabase JWT)
│   │   │   ├── supabaseClient.js      # Supabase JS client (frontend, anon key)
│   │   │   └── styles/
│   │   │       └── globals.css        # CSS variables from design.md
│   │   ├── routes/
│   │   │   ├── +layout.svelte
│   │   │   ├── +page.svelte           # Landing
│   │   │   ├── login/+page.svelte
│   │   │   ├── signup/+page.svelte
│   │   │   ├── onboarding/+page.svelte
│   │   │   ├── discover/+page.svelte
│   │   │   ├── requests/+page.svelte
│   │   │   ├── my-team/+page.svelte
│   │   │   └── profile/+page.svelte
│   │   └── app.html
│   ├── svelte.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                        # Backend (Node.js + Express)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── profile.routes.js     # signup/login handled by Supabase Auth directly from frontend
│   │   │   ├── match.routes.js
│   │   │   └── request.routes.js
│   │   ├── controllers/
│   │   │   ├── profile.controller.js
│   │   │   ├── match.controller.js
│   │   │   └── request.controller.js
│   │   ├── models/                    # thin query helpers, not ORM models
│   │   │   ├── profile.model.js       # queries against `profiles` table
│   │   │   ├── request.model.js       # queries against `team_requests` table
│   │   │   └── team.model.js          # queries against `teams` table
│   │   ├── services/
│   │   │   └── matching.service.js    # compatibility score algorithm (pure function)
│   │   ├── middleware/
│   │   │   └── authMiddleware.js      # verifies Supabase JWT from Authorization header
│   │   ├── config/
│   │   │   └── supabaseClient.js      # Supabase JS client (backend, service_role key)
│   │   └── app.js
│   ├── server.js
│   └── package.json
└── .env.example
```

## 5. Matching Algorithm (rule-based, MVP)

Compatibility score between User A and User B (0–100):

```
score =
    (role_gap_fill_weight * roleComplementScore)     // 35%
  + (skill_complement_weight * skillGapScore)        // 30%
  + (interest_overlap_weight * interestOverlapScore) // 20%
  + (level_balance_weight * levelBalanceScore)       // 10%
  + (team_size_match_weight * teamSizeMatchScore)    // 5%
```

- `roleComplementScore`: 1 if B's preferred role is NOT already covered by A (or A's current team), else lower
- `skillGapScore`: proportion of B's skills that A does NOT have (fills gaps, avoids duplicate skillsets)
- `interestOverlapScore`: Jaccard similarity of interest tags between A and B
- `levelBalanceScore`: penalize if both are beginners on the same skill; reward mentor/mentee or matched levels
- `teamSizeMatchScore`: 1 if both are looking for compatible team sizes, else 0

Implement as a pure function in `matching.service.js` (backend) so it can be unit tested and reused for both 1:1 scores and future "suggest full team" feature.

## 6. Database Schema (Supabase Postgres)

Auth/users are handled entirely by **Supabase Auth** (`auth.users` table, built-in — do not create a custom `users` table). All app tables reference `auth.users.id` via `user_id uuid`.

```sql
-- profiles
create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null unique,
  name text not null,
  college text,
  skills text[] default '{}',
  preferred_roles text[] default '{}',
  skill_levels jsonb default '{}',       -- { "React": "Intermediate", "Figma": "Beginner" }
  interests text[] default '{}',
  team_size_pref int,
  bio text,
  github_url text,
  linkedin_url text,
  hackathon text,
  created_at timestamptz default now()
);

-- team_requests
create table team_requests (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references auth.users(id) not null,
  to_user_id uuid references auth.users(id) not null,
  status text check (status in ('pending','accepted','declined')) default 'pending',
  created_at timestamptz default now()
);

-- teams
create table teams (
  id uuid primary key default gen_random_uuid(),
  name text,
  hackathon text,
  created_at timestamptz default now()
);

-- team_members (join table)
create table team_members (
  team_id uuid references teams(id) not null,
  user_id uuid references auth.users(id) not null,
  role text,
  primary key (team_id, user_id)
);
```

**Row Level Security (RLS):** enable RLS on all tables. Policies:
- `profiles`: any authenticated user can `select`; a user can `insert`/`update` only their own row (`user_id = auth.uid()`)
- `team_requests`: a user can `select`/`insert` rows where they are `from_user_id` or `to_user_id`; only `to_user_id` can `update` status
- `teams` / `team_members`: members of a team can `select`; inserts happen via backend service role when a request is accepted

## 7. API Endpoints (draft)

> Note: signup/login/logout are **not** proxied through Express — the SvelteKit frontend talks to Supabase Auth directly via the Supabase JS client. Express only handles app logic that needs server-side trust (matching score, request/team writes with validation).

```
GET    /api/profile/me
PUT    /api/profile/me
GET    /api/discover?role=&skill=&interest=&level=
GET    /api/match/score/:otherUserId
POST   /api/requests            (send request)
PATCH  /api/requests/:id        (accept/decline)
GET    /api/requests/sent
GET    /api/requests/received
GET    /api/team/me
```

Every Express route (except health checks) runs through `authMiddleware.js`, which verifies the Supabase-issued JWT sent in the `Authorization: Bearer <token>` header (via `supabase.auth.getUser(token)`) before proceeding.
