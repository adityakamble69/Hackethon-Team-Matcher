import { writable } from 'svelte/store';

// Holds the current Supabase session/user. Populate on app load via supabase.auth.getSession()
// and keep in sync with supabase.auth.onAuthStateChange().
export const user = writable(null);
export const session = writable(null);
