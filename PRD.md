# PRD.md — Hackathon Team Matcher (PS-03)

## 1. Overview
**Problem Statement ID:** PS-03
**Category:** Team Formation / Matching
**One-liner:** A platform that helps students find compatible hackathon teammates based on skills, roles, experience, and interests — instead of relying on random WhatsApp groups and last-minute scrambling.

## 2. Problem
Students struggle to find teammates whose skills, preferred roles, and interests complement their own. This leads to:
- Unbalanced teams (e.g., 4 frontend devs, no backend/design)
- Last-minute, low-quality team formation
- Missed opportunities for good collaborations because there's no structured discovery mechanism

## 3. Objective
Build a web platform that:
- Lets students create a profile describing their skills, roles, experience, and interests
- Recommends compatible teammates using a matching/compatibility algorithm
- Lets students search, filter, and send/accept team requests
- Helps form balanced, complementary hackathon teams

## 4. Target Users
- Hackathon participants (individuals looking for a team)
- Small existing teams looking for 1–2 more complementary members
- Hackathon organizers (optional, secondary) who want visibility into team formation

## 5. Core Features (MVP scope)

### 5.1 Authentication
- Sign up / log in (email + password, optionally Google OAuth)
- Basic profile creation on first login

### 5.2 Student Profile
- Name, college/organization, year/experience level
- Skills (multi-select/tag input, e.g., React, Python, ML, UI/UX, Figma)
- Preferred role(s): Frontend, Backend, Full-stack, Designer, ML/Data, PM/Ideation
- Skill level per domain (Beginner / Intermediate / Advanced)
- Interests / domains (e.g., FinTech, HealthTech, AI, Sustainability)
- Team-size preference (e.g., looking for 2 more, want team of 4)
- Availability / hackathon(s) currently looking for a team for
- Short bio / portfolio link (GitHub, LinkedIn) — optional

### 5.3 Matching Algorithm
- Compatibility score between two users based on:
  - Complementary skills (not identical — fills gaps in a team)
  - Role fit (does the other person's preferred role fill a missing slot?)
  - Shared interests/domain overlap
  - Skill-level balance (avoid all-beginner or all-expert imbalance)
  - Team-size compatibility
- Score displayed as a percentage or star rating on each suggested match

### 5.4 Discovery & Search
- Browse/search all available students
- Filters: role, skill, skill level, interest/domain, team-size preference
- Sort by compatibility score (relative to current user)

### 5.5 Team Requests
- Send a "Team Request" to another student
- Accept / decline incoming requests
- View sent/received requests status (pending, accepted, declined)
- Once enough members accept, a "Team" entity is formed (team name, members list)

### 5.6 Team Dashboard (post-formation)
- View current team composition (roles filled, roles still missing)
- Basic team info page (team name, members, combined skill set)

## 6. Stretch Features (post-MVP, if time permits)
- Real-time chat between matched teammates
- AI-generated ideal team suggestions (auto-suggest a full balanced team of 3–4)
- Hackathon-specific rooms (filter by which hackathon you're forming a team for)
- Notifications (email/in-app) for new requests
- Organizer dashboard: view all teams, unmatched students

## 7. Non-Functional Requirements
- Responsive (mobile + desktop)
- Fast search/filter (client-side filtering for MVP scale, or indexed DB queries)
- Simple, low-friction onboarding (profile creation under 2 minutes)
- Secure auth (hashed passwords, protected routes)

## 8. Success Metrics
- % of users who complete a profile
- Average time to first team request sent
- % of team requests that convert into an accepted match
- % of users who end up in a "balanced" team (covers at least Frontend + Backend + Design/PM)

## 9. Tech Scope (summary — see architecture.md for detail)
Web development, database, matching algorithm, team formation logic, search & filtering.

## 10. Out of Scope (for hackathon timeline)
- Payment/monetization
- Mobile native apps
- Advanced ML-based matching (rule-based scoring is enough for MVP)
- Multi-hackathon marketplace at scale
