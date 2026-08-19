import { supabase } from '../config/supabaseClient.js';
import { getLatestCompletedHackathon } from './hackathon.model.js';

// Leaderboard (rank + score per team) for the most recently completed
// hackathon. Returns { hackathon: null, rankings: [] } if none have been
// marked "completed" yet.
export async function getLatestRankings() {
  const hackathon = await getLatestCompletedHackathon();
  if (!hackathon) return { hackathon: null, rankings: [] };

  const { data: rankings, error } = await supabase
    .from('hackathon_rankings')
    .select('rank, score, team_id, teams(name, hackathon)')
    .eq('hackathon_id', hackathon.id)
    .order('rank', { ascending: true });
  if (error) throw error;

  return { hackathon, rankings };
}
