import { getProfileByUserId } from '../models/profile.model.js';
import { computeCompatibilityScore } from '../services/matching.service.js';

export async function getMatchScore(req, res) {
  try {
    const [me, other] = await Promise.all([
      getProfileByUserId(req.user.id),
      getProfileByUserId(req.params.otherUserId)
    ]);
    const score = computeCompatibilityScore(me, other);
    res.json({ score });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
