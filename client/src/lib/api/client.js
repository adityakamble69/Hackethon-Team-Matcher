import { PUBLIC_API_URL } from '$env/static/public';
import { get } from 'svelte/store';
import { session } from '$lib/stores/auth.js';

// Thin fetch wrapper — attaches the Supabase access token to every request to the Express backend.
export async function apiFetch(path, options = {}) {
  const currentSession = get(session);
  const token = currentSession?.access_token;

  const res = await fetch(`${PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}
