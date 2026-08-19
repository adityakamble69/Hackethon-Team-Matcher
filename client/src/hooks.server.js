// Supabase's realtime-js client checks for a native `WebSocket` global at import time and
// throws immediately if it's missing. Node 20 doesn't expose WebSocket globally — only
// Node 22+ does — so every SSR request was crashing with "Node.js detected but native
// WebSocket not found" before any page code even ran. Polyfilling it here fixes that.
import { WebSocket } from 'ws';

if (!globalThis.WebSocket) {
  globalThis.WebSocket = WebSocket;
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  return resolve(event);
}