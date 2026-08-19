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
