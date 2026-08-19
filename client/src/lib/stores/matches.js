import { writable } from 'svelte/store';

// Holds the current discover/match results returned from GET /api/discover
export const matches = writable([]);
