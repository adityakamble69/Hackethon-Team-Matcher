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

export async function listSentRequests(userId) {
  const { data, error } = await supabase.from('team_requests').select('*').eq('from_user_id', userId);
  if (error) throw error;
  return data;
}

export async function listReceivedRequests(userId) {
  const { data, error } = await supabase.from('team_requests').select('*').eq('to_user_id', userId);
  if (error) throw error;
  return data;
}
