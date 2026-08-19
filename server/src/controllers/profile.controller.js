import { getProfileByUserId, upsertProfile, listProfiles } from '../models/profile.model.js';
import { computeCompatibilityScore } from '../services/matching.service.js';

export async function getMyProfile(req, res) {
  try {
    const profile = await getProfileByUserId(req.user.id);
    res.json(profile);
  } catch (err) {
    res.status(404).json({ error: 'Profile not found' });
  }
}

export async function updateMyProfile(req, res) {
  try {
    const profile = await upsertProfile(req.user.id, req.body);
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function discoverProfiles(req, res) {
  try {
    const [me, profiles] = await Promise.all([
      getProfileByUserId(req.user.id).catch(() => null),
      listProfiles(req.query),
    ]);

    const withScores = profiles
      .filter((p) => p.user_id !== req.user.id) // never show yourself in discover
      .filter((p) => p.role !== 'admin') // admins aren't teammates — keep them out of discover
      .map((p) => ({
        ...p,
        compatibility_score: me ? computeCompatibilityScore(me, p) : null,
      }));

    withScores.sort((a, b) => (b.compatibility_score ?? -1) - (a.compatibility_score ?? -1));

    res.json(withScores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
