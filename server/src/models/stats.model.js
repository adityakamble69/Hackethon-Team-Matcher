import { supabase } from '../config/supabaseClient.js';

// Aggregated, anonymous counts only — safe to expose on an unauthenticated
// endpoint since no row-level data (names, emails, skills, etc.) is returned.
export async function getPublicStats() {
  const [
    { count: studentCount, error: studentErr },
    { data: requests, error: requestErr },
    { count: teamCount, error: teamErr }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('team_requests').select('status'),
    supabase.from('teams').select('*', { count: 'exact', head: true })
  ]);

  if (studentErr) throw studentErr;
  if (requestErr) throw requestErr;
  if (teamErr) throw teamErr;

  const totalRequests = requests.length;
  const acceptedRequests = requests.filter((r) => r.status === 'accepted').length;
  const pendingRequests = requests.filter((r) => r.status === 'pending').length;

  // Students matched = distinct students on either side of an accepted request.
  const { data: matchedRows, error: matchedErr } = await supabase
    .from('team_requests')
    .select('from_user_id, to_user_id')
    .eq('status', 'accepted');
  if (matchedErr) throw matchedErr;
  const matchedUserIds = new Set();
  matchedRows.forEach((r) => {
    matchedUserIds.add(r.from_user_id);
    matchedUserIds.add(r.to_user_id);
  });

  return {
    students_matched: matchedUserIds.size,
    student_count: studentCount ?? 0,
    match_satisfaction_pct: totalRequests > 0 ? Math.round((acceptedRequests / totalRequests) * 100) : 0,
    open_requests: pendingRequests,
    teams_formed: teamCount ?? 0
  };
}
