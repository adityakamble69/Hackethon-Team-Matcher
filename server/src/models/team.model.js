import { supabase } from '../config/supabaseClient.js';

export async function getTeamForUser(userId) {
  const { data, error } = await supabase
    .from('team_members')
    .select('team_id, role, teams(*)')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function addMemberToTeam(teamId, userId, role = null) {
  const { error } = await supabase.from('team_members').insert({ team_id: teamId, user_id: userId, role });
  if (error) throw error;
}

export async function createTeamWithMembers(name, hackathon, memberIds) {
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({ name, hackathon })
    .select()
    .single();
  if (teamError) throw teamError;

  const rows = memberIds.map((userId) => ({ team_id: team.id, user_id: userId }));
  const { error: memberError } = await supabase.from('team_members').insert(rows);
  if (memberError) throw memberError;

  return team;
}

// All formed teams, newest first, with member profiles stitched in — powers
// the public "Teams" browse page (as opposed to /team/me, which is just the
// current user's own team).
export async function getAllTeams() {
  const { data: teams, error: teamsError } = await supabase
    .from('teams')
    .select('*')
    .order('created_at', { ascending: false });
  if (teamsError) throw teamsError;
  if (teams.length === 0) return [];

  const teamIds = teams.map((t) => t.id);
  const { data: members, error: membersError } = await supabase
    .from('team_members')
    .select('team_id, user_id, role')
    .in('team_id', teamIds);
  if (membersError) throw membersError;

  const memberIds = [...new Set(members.map((m) => m.user_id))];
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('user_id, name, college, preferred_roles')
    .in('user_id', memberIds);
  if (profileError) throw profileError;
  const profileByUserId = Object.fromEntries(profiles.map((p) => [p.user_id, p]));

  return teams.map((team) => {
    const teamMembers = members
      .filter((m) => m.team_id === team.id)
      .map((m) => ({
        user_id: m.user_id,
        role: m.role,
        name: profileByUserId[m.user_id]?.name,
        college: profileByUserId[m.user_id]?.college,
        preferred_roles: profileByUserId[m.user_id]?.preferred_roles || [],
      }));
    return { ...team, members: teamMembers };
  });
}
