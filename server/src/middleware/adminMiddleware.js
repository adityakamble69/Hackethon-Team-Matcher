import { getProfileByUserId } from '../models/profile.model.js';

// Must run after authMiddleware (needs req.user). Blocks non-admins from admin-only routes.
export async function adminMiddleware(req, res, next) {
  try {
    const profile = await getProfileByUserId(req.user.id);
    if (profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access only' });
    }
    req.profile = profile;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Admin access only' });
  }
}
