-- Hackathon Team Matcher — Supabase Postgres schema
-- Run this in the Supabase SQL editor. See architecture.md §6 for full context.

create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null unique,
  name text not null,
  college text,
  skills text[] default '{}',
  preferred_roles text[] default '{}',
  skill_levels jsonb default '{}',
  interests text[] default '{}',
  team_size_pref int,
  bio text,
  github_url text,
  linkedin_url text,
  hackathon text,
  created_at timestamptz default now()
);

create table if not exists team_requests (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references auth.users(id) not null,
  to_user_id uuid references auth.users(id) not null,
  status text check (status in ('pending','accepted','declined')) default 'pending',
  created_at timestamptz default now()
);

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text,
  hackathon text,
  created_at timestamptz default now()
);

create table if not exists team_members (
  team_id uuid references teams(id) not null,
  user_id uuid references auth.users(id) not null,
  role text,
  primary key (team_id, user_id)
);

-- Row Level Security
alter table profiles enable row level security;
alter table team_requests enable row level security;
alter table teams enable row level security;
alter table team_members enable row level security;

create policy "Profiles are viewable by any authenticated user"
  on profiles for select to authenticated using (true);

create policy "Users can insert their own profile"
  on profiles for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on profiles for update to authenticated using (auth.uid() = user_id);

create policy "Users can view requests they sent or received"
  on team_requests for select to authenticated
  using (auth.uid() = from_user_id or auth.uid() = to_user_id);

create policy "Users can send requests"
  on team_requests for insert to authenticated
  with check (auth.uid() = from_user_id);

create policy "Recipient can update request status"
  on team_requests for update to authenticated
  using (auth.uid() = to_user_id);

create policy "Team members can view their team"
  on teams for select to authenticated
  using (id in (select team_id from team_members where user_id = auth.uid()));

create policy "Team members can view membership"
  on team_members for select to authenticated
  using (user_id = auth.uid() or team_id in (select team_id from team_members where user_id = auth.uid()));
