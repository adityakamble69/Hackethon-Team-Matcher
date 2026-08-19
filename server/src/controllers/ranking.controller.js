import { getLatestRankings } from '../models/ranking.model.js';

export async function getLatestRankingsHandler(req, res) {
  try {
    const result = await getLatestRankings();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
