import { supabase } from '../config/supabaseClient.js';

export async function createRequest(fromUserId, toUserId) {
  const { data, error } = await supabase
    .from('team_requests')
    .insert({ from_user_id: fromUserId, to_user_id: toUserId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getRequestById(requestId) {
  const { data, error } = await supabase.from('team_requests').select('*').eq('id', requestId).single();
  if (error) throw error;
  return data;
}

export async function updateRequestStatus(requestId, status) {
  const { data, error } = await supabase
    .from('team_requests')
    .update({ status })
    .eq('id', requestId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// team_requests references auth.users directly (not profiles), so there's no FK path
// PostgREST can auto-embed on — fetch requests, then look up the other party's name
// with a second query keyed off user_id, and stitch it in as `other_name`.
async function attachOtherName(requests, otherIdKey) {
  const otherIds = [...new Set(requests.map((r) => r[otherIdKey]))];
  if (otherIds.length === 0) return requests;

  const { data: profiles, error } = await supabase.from('profiles').select('user_id, name').in('user_id', otherIds);
  if (error) throw error;

  const nameByUserId = Object.fromEntries(profiles.map((p) => [p.user_id, p.name]));
  return requests.map((r) => ({ ...r, other_name: nameByUserId[r[otherIdKey]] || null }));
}

export async function listSentRequests(userId) {
  const { data, error } = await supabase
    .from('team_requests')
    .select('*')
    .eq('from_user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return attachOtherName(data, 'to_user_id');
}

export async function listReceivedRequests(userId) {
  const { data, error } = await supabase
    .from('team_requests')
    .select('*')
    .eq('to_user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return attachOtherName(data, 'from_user_id');
}
