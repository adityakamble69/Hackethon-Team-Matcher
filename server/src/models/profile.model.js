import { supabase } from '../config/supabaseClient.js';

export async function getProfileByUserId(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
  if (error) throw error;
  return data;
}

export async function upsertProfile(userId, profileData) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ user_id: userId, ...profileData }, { onConflict: 'user_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listProfiles(filters = {}) {
  const { role, skill, interest, level } = filters;
  let query = supabase.from('profiles').select('*');

  if (role) {
    query = query.contains('preferred_roles', [role]);
  }
  if (skill) {
    query = query.contains('skills', [skill]);
  }
  if (interest) {
    query = query.contains('interests', [interest]);
  }

  const { data, error } = await query;
  if (error) throw error;

  // skill_levels is jsonb keyed by skill name, e.g. { React: "Advanced" } — Postgres
  // can't easily filter "does any value in this jsonb equal X" via the JS client,
  // so filter that one in memory once we already have the (already-filtered) rows.
  if (level) {
    return data.filter((p) => Object.values(p.skill_levels || {}).includes(level));
  }
  return data;
}
