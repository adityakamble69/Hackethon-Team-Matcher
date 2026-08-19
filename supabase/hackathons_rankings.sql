-- Hackathon Team Matcher — Hackathons + Rankers schema
-- Run this AFTER schema.sql in the Supabase SQL editor.
-- Adds: (1) a hackathons table (which college is hosting which hackathon,
-- and when), and (2) a hackathon_rankings table (leaderboard for a given
-- hackathon, one row per ranked team).

-- ── Hackathons ───────────────────────────────────────────────────────────
create table if not exists hackathons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  college text not null,
  location text,
  start_date date,
  end_date date,
  status text check (status in ('upcoming', 'ongoing', 'completed')) default 'upcoming',
  description text,
  created_at timestamptz default now()
);

-- Optional: link an existing team to a structured hackathon row instead of
-- (or alongside) the free-text teams.hackathon column already in schema.sql.
alter table teams
  add column if not exists hackathon_id uuid references hackathons(id);

-- ── Rankers / leaderboard ────────────────────────────────────────────────
create table if not exists hackathon_rankings (
  id uuid primary key default gen_random_uuid(),
  hackathon_id uuid references hackathons(id) not null,
  team_id uuid references teams(id) not null,
  rank int not null,
  score numeric,
  created_at timestamptz default now(),
  unique (hackathon_id, team_id),
  unique (hackathon_id, rank)
);

-- ── Row Level Security ───────────────────────────────────────────────────
alter table hackathons enable row level security;
alter table hackathon_rankings enable row level security;

-- Hackathons and rankings are read-only, non-sensitive data — safe to expose
-- to any authenticated user (mirrors the "profiles are viewable by any
-- authenticated user" policy already in schema.sql).
create policy "Hackathons are viewable by any authenticated user"
  on hackathons for select to authenticated using (true);

create policy "Rankings are viewable by any authenticated user"
  on hackathon_rankings for select to authenticated using (true);

-- Only admins should create/edit hackathons and rankings (mirrors the
-- role check already used for the 2-admin cap in schema.sql).
create policy "Admins can insert hackathons"
  on hackathons for insert to authenticated
  with check (exists (select 1 from profiles where user_id = auth.uid() and role = 'admin'));

create policy "Admins can update hackathons"
  on hackathons for update to authenticated
  using (exists (select 1 from profiles where user_id = auth.uid() and role = 'admin'));

create policy "Admins can insert rankings"
  on hackathon_rankings for insert to authenticated
  with check (exists (select 1 from profiles where user_id = auth.uid() and role = 'admin'));

create policy "Admins can update rankings"
  on hackathon_rankings for update to authenticated
  using (exists (select 1 from profiles where user_id = auth.uid() and role = 'admin'));

-- ── Sample seed data (optional — safe to delete) ────────────────────────
-- insert into hackathons (name, college, location, start_date, end_date, status)
-- values
--   ('CodeStorm 2026', 'IIT Bombay', 'Mumbai, MH', '2026-09-12', '2026-09-14', 'upcoming'),
--   ('HackVerse', 'VIT Pune', 'Pune, MH', '2026-07-05', '2026-07-07', 'completed'),
--   ('Innothon', 'BITS Pilani', 'Pilani, RJ', '2026-08-20', '2026-08-22', 'ongoing');
