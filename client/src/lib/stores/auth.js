import { writable, derived } from 'svelte/store';

// Holds the current Supabase session/user. Populate on app load via supabase.auth.getSession()
// and keep in sync with supabase.auth.onAuthStateChange().
export const user = writable(null);
export const session = writable(null);

// Holds the current user's `profiles` row (fetched from GET /api/profile/me after login),
// so the app shell can show/hide the Admin tab etc. without re-fetching on every screen.
export const profile = writable(null);
export const isAdmin = derived(profile, ($profile) => $profile?.role === 'admin');
