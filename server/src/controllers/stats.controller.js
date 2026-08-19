import { getPublicStats } from '../models/stats.model.js';

// No auth — this powers the public landing page stat counters, and only
// ever returns aggregate numbers, never row-level data.
export async function getPublicStatsHandler(req, res) {
  try {
    const stats = await getPublicStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
