import { getProfileByUserId, upsertProfile, listProfiles } from '../models/profile.model.js';

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
    const profiles = await listProfiles(req.query);
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
