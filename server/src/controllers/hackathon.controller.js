import { getAllHackathons } from '../models/hackathon.model.js';

export async function getAllHackathonsHandler(req, res) {
  try {
    const hackathons = await getAllHackathons();
    res.json(hackathons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
