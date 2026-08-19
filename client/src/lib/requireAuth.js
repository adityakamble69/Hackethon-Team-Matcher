import { goto } from '$app/navigation';
import { supabase } from '$lib/supabaseClient.js';

/**
 * Call from onMount() in any protected route (discover, requests, my-team, profile, onboarding).
 * Redirects to /login if there's no active session. Returns the session when there is one.
 */
export async function requireAuth() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    goto('/login');
    return null;
  }
  return data.session;
}
