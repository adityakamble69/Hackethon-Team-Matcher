import { supabase } from '../config/supabaseClient.js';

// All hackathons, soonest-starting first, each with its formed teams (and
// members) nested in — powers the "Hackathons" browse page, which shows
// which teams are competing at which hackathon.
export async function getAllHackathons() {
  const { data: hackathons, error } = await supabase
    .from('hackathons')
    .select('*')
    .order('start_date', { ascending: true, nullsFirst: false });
  if (error) throw error;
  if (hackathons.length === 0) return [];

  const hackathonIds = hackathons.map((h) => h.id);
  const { data: teams, error: teamsError } = await supabase
    .from('teams')
    .select('*')
    .in('hackathon_id', hackathonIds);
  if (teamsError) throw teamsError;

  let members = [];
  let profileByUserId = {};
  if (teams.length > 0) {
    const teamIds = teams.map((t) => t.id);
    const { data: memberRows, error: membersError } = await supabase
      .from('team_members')
      .select('team_id, user_id, role')
      .in('team_id', teamIds);
    if (membersError) throw membersError;
    members = memberRows;

    const memberIds = [...new Set(members.map((m) => m.user_id))];
    if (memberIds.length > 0) {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, name, college, preferred_roles')
        .in('user_id', memberIds);
      if (profileError) throw profileError;
      profileByUserId = Object.fromEntries(profiles.map((p) => [p.user_id, p]));
    }
  }

  const teamsByHackathonId = {};
  teams.forEach((team) => {
    const teamMembers = members
      .filter((m) => m.team_id === team.id)
      .map((m) => ({
        user_id: m.user_id,
        role: m.role,
        name: profileByUserId[m.user_id]?.name,
        college: profileByUserId[m.user_id]?.college,
        preferred_roles: profileByUserId[m.user_id]?.preferred_roles || [],
      }));
    const enrichedTeam = { ...team, members: teamMembers };
    (teamsByHackathonId[team.hackathon_id] ??= []).push(enrichedTeam);
  });

  return hackathons.map((h) => ({ ...h, teams: teamsByHackathonId[h.id] || [] }));
}

// Most recently *completed* hackathon — used as the default for the
// "Rankers" leaderboard page ("rankers of the last hackathon").
export async function getLatestCompletedHackathon() {
  const { data, error } = await supabase
    .from('hackathons')
    .select('*')
    .eq('status', 'completed')
    .order('end_date', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}
