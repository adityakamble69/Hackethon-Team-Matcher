import { goto } from '$app/navigation';
import { requireAuth } from '$lib/requireAuth.js';
import { apiFetch } from '$lib/api/client.js';

/**
 * Call from onMount() in /admin. Ensures a session exists AND the profile's
 * role is 'admin' — non-admins get bounced to /discover, not just logged out.
 */
export async function requireAdmin() {
  const session = await requireAuth();
  if (!session) return null;

  try {
    const profile = await apiFetch('/api/profile/me');
    if (profile?.role !== 'admin') {
      goto('/discover');
      return null;
    }
    return session;
  } catch {
    goto('/discover');
    return null;
  }
}
