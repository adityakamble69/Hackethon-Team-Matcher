<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { requireAuth } from '$lib/requireAuth.js';
  import { apiFetch } from '$lib/api/client.js';
  import ProfileForm from '$lib/components/profile/ProfileForm.svelte';

  let saving = false;
  let errorMsg = '';

  onMount(requireAuth);

  async function handleSubmit(e) {
    errorMsg = '';
    saving = true;
    try {
      await apiFetch('/api/profile/me', { method: 'PUT', body: JSON.stringify(e.detail) });
      goto('/discover');
    } catch (err) {
      errorMsg = err.message;
    } finally {
      saving = false;
    }
  }
</script>

<svelte:head>
  <title>Set up your profile — Hackathon Team Matcher</title>
</svelte:head>

<div class="onboarding-page">
  <div class="onboarding-card">
    <h1>Set up your profile</h1>
    <p class="sub">Takes under 2 minutes. This is what teammates will see about you.</p>

    {#if errorMsg}
      <div class="error-banner">{errorMsg}</div>
    {/if}

    <ProfileForm submitLabel="Finish & find teammates" {saving} on:submit={handleSubmit} />
  </div>
</div>

<style>
  .onboarding-page {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    justify-content: center;
    padding: 48px 24px;
    background: var(--bg);
  }

  .onboarding-card {
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

  .error-banner {
    background: rgba(248, 113, 113, 0.08);
    border: 1px solid rgba(248, 113, 113, 0.25);
    color: var(--danger);
    font-size: 13px;
    padding: 12px 16px;
    border-radius: 12px;
    margin: 0 0 16px;
  }
</style>
