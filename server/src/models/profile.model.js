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
  let query = supabase.from('profiles').select('*');
  // TODO: apply filters (role, skill, interest, level) as query params
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
