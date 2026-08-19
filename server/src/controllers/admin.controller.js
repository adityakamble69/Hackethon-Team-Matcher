import { countAdmins, promoteToAdmin, listAllProfiles, listAllTeams, listAllRequests } from '../models/admin.model.js';

const MAX_ADMINS = 2;

// Dedicated admin-registration endpoint. The user has already signed up via
// normal Supabase Auth (email/password) on the frontend, same as a student —
// this just promotes their profile row to role: 'admin', gated by the cap.
// A DB trigger (enforce_admin_cap in schema.sql) is the real source of truth
// under concurrent requests; this check exists to return a clean 403 + message.
export async function registerAdmin(req, res) {
  try {
    const current = await countAdmins();
    if (current >= MAX_ADMINS) {
      return res.status(403).json({ error: `Admin limit reached (max ${MAX_ADMINS})` });
    }
    const profile = await promoteToAdmin(req.user.id, req.body.name);
    res.status(201).json(profile);
  } catch (err) {
    // Trigger fires this message if two requests race past the count check above.
    if (String(err.message || '').includes('Admin limit reached')) {
      return res.status(403).json({ error: `Admin limit reached (max ${MAX_ADMINS})` });
    }
    res.status(400).json({ error: err.message });
  }
}

export async function getAdminOverview(req, res) {
  try {
    const [profiles, teams, requests] = await Promise.all([
      listAllProfiles(),
      listAllTeams(),
      listAllRequests(),
    ]);
    res.json({
      student_count: profiles.filter((p) => p.role !== 'admin').length,
      admin_count: profiles.filter((p) => p.role === 'admin').length,
      team_count: teams.length,
      request_count: requests.length,
      profiles,
      teams,
      requests,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
