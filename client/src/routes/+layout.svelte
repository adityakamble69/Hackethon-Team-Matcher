<script>
  import { onMount } from 'svelte';
  import '../lib/styles/globals.css';
  import { supabase } from '$lib/supabaseClient.js';
  import { user, session, profile } from '$lib/stores/auth.js';
  import { apiFetch } from '$lib/api/client.js';
  import VideoBg from '$lib/components/landing/VideoBg.svelte';

  async function refreshProfile() {
    try {
      profile.set(await apiFetch('/api/profile/me'));
    } catch {
      profile.set(null); // no profile row yet (pre-onboarding) — fine
    }
  }

  onMount(() => {
    supabase.auth.getSession().then(({ data }) => {
      session.set(data.session);
      user.set(data.session?.user ?? null);
      if (data.session) refreshProfile();
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      session.set(newSession);
      user.set(newSession?.user ?? null);
      if (newSession) refreshProfile();
      else profile.set(null);
    });

    return () => authListener.subscription.unsubscribe();
  });
</script>

<VideoBg />

<slot />
