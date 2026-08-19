<script>
  import { onMount } from 'svelte';
  import { requireAuth } from '$lib/requireAuth.js';
  import { apiFetch } from '$lib/api/client.js';
  import ProfileForm from '$lib/components/profile/ProfileForm.svelte';
  import AppShell from '$lib/components/app/AppShell.svelte';

  let loading = true;
  let saving = false;
  let errorMsg = '';
  let savedMsg = '';
  let profile = {};

  onMount(async () => {
    const session = await requireAuth();
    if (!session) return;

    try {
      profile = await apiFetch('/api/profile/me');
    } catch (err) {
      // No profile yet is fine here — form just starts blank.
      profile = {};
    } finally {
      loading = false;
    }
  });

  async function handleSubmit(e) {
    errorMsg = '';
    savedMsg = '';
    saving = true;
    try {
      await apiFetch('/api/profile/me', { method: 'PUT', body: JSON.stringify(e.detail) });
      savedMsg = 'Saved.';
    } catch (err) {
      errorMsg = err.message;
    } finally {
      saving = false;
    }
  }
</script>

<svelte:head>
  <title>My Profile — Hackathon Team Matcher</title>
</svelte:head>

<AppShell>
  <div class="profile-page">
    <div class="profile-card">
      <h1>My profile</h1>
      <p class="sub">Update your skills, roles, and interests any time.</p>

      {#if loading}
        <p class="muted">Loading…</p>
      {:else}
        {#if errorMsg}
          <div class="error-banner">{errorMsg}</div>
        {/if}
        {#if savedMsg}
          <div class="success-banner">{savedMsg}</div>
        {/if}
        <ProfileForm initial={profile} submitLabel="Save changes" {saving} on:submit={handleSubmit} />
      {/if}
    </div>
  </div>
</AppShell>

<style>
  .profile-page {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    justify-content: center;
    padding: 48px 24px;
    background: transparent;
  }

  .profile-card {
    width: min(560px, 100%);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 36px 32px;
    box-shadow: var(--nav-shadow);
    height: fit-content;
  }

  h1 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 28px;
    letter-spacing: -0.02em;
    margin: 0 0 6px;
  }

  .sub {
    color: var(--muted);
    font-size: 14px;
    margin: 0 0 28px;
  }

  .muted {
    color: var(--muted);
    font-size: 14px;
  }

  .error-banner {
    background: rgba(248, 113, 113, 0.08);
    border: 1px solid rgba(248, 113, 113, 0.25);
    color: var(--danger);
    font-size: 13px;
    padding: 12px 16px;
    border-radius: 12px;
    margin: 0 0 16px;
  }

  .success-banner {
    background: rgba(74, 222, 128, 0.08);
    border: 1px solid rgba(74, 222, 128, 0.25);
    color: var(--success);
    font-size: 13px;
    padding: 12px 16px;
    border-radius: 12px;
    margin: 0 0 16px;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
