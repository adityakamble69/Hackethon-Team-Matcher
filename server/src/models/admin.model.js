import { supabase } from '../config/supabaseClient.js';

export async function countAdmins() {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'admin');
  if (error) throw error;
  return count;
}

export async function promoteToAdmin(userId, name) {
  // Row may or may not exist yet (admin-signup can happen before onboarding),
  // so upsert on user_id and set role: 'admin'.
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ user_id: userId, name: name || 'Admin', role: 'admin' }, { onConflict: 'user_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listAllProfiles() {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function listAllTeams() {
  const { data: teams, error } = await supabase.from('teams').select('*').order('created_at', { ascending: false });
  if (error) throw error;

  const { data: members, error: memberError } = await supabase.from('team_members').select('team_id, user_id, role');
  if (memberError) throw memberError;

  const { data: profiles, error: profileError } = await supabase.from('profiles').select('user_id, name');
  if (profileError) throw profileError;
  const nameByUserId = Object.fromEntries(profiles.map((p) => [p.user_id, p.name]));

  return teams.map((team) => ({
    ...team,
    members: members
      .filter((m) => m.team_id === team.id)
      .map((m) => ({ user_id: m.user_id, role: m.role, name: nameByUserId[m.user_id] || null })),
  }));
}

export async function listAllRequests() {
  const { data, error } = await supabase
    .from('team_requests')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
