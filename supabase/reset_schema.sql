-- Hackathon Team Matcher — FULL RESET
-- WARNING: this permanently deletes all data in these tables (profiles,
-- team_requests, teams, team_members) and everything in them. There is no
-- undo. Only run this if you're okay losing all existing rows.
-- Run in the Supabase SQL editor.

-- ============================================================
-- 1. DROP everything (reverse dependency order)
-- ============================================================

drop trigger if exists trg_enforce_admin_cap on profiles;
drop function if exists enforce_admin_cap();

drop table if exists team_members cascade;
drop table if exists teams cascade;
drop table if exists team_requests cascade;
drop table if exists profiles cascade;

-- ============================================================
-- 2. RECREATE schema
-- ============================================================

create extension if not exists "pgcrypto";

create table profiles (
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
  role text check (role in ('student', 'admin')) default 'student',
  created_at timestamptz default now()
);

-- Hard cap of 2 admins, enforced at the DB level (belt-and-suspenders alongside
-- the backend check in admin.controller.js — this is what actually stops a
-- race condition). Change the "2" here AND MAX_ADMINS in admin.controller.js
-- together if you ever want to raise the cap.
create or replace function enforce_admin_cap()
returns trigger as $$
begin
  if new.role = 'admin' and (old.role is null or old.role <> 'admin') then
    if (select count(*) from profiles where role = 'admin') >= 2 then
      raise exception 'Admin limit reached (max 2)';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_enforce_admin_cap
  before insert or update on profiles
  for each row execute function enforce_admin_cap();

create table team_requests (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references auth.users(id) not null,
  to_user_id uuid references auth.users(id) not null,
  status text check (status in ('pending','accepted','declined')) default 'pending',
  created_at timestamptz default now()
);

create table teams (
  id uuid primary key default gen_random_uuid(),
  name text,
  hackathon text,
  created_at timestamptz default now()
);

create table team_members (
  team_id uuid references teams(id) not null,
  user_id uuid references auth.users(id) not null,
  role text,
  primary key (team_id, user_id)
);

-- ============================================================
-- 3. Row Level Security
-- ============================================================

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
