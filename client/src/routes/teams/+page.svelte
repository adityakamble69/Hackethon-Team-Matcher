<script>
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api/client.js';
  import Header from '$lib/components/landing/Header.svelte';
  import MobileMenu from '$lib/components/landing/MobileMenu.svelte';

  let mobileMenuOpen = false;
  let loading = true;
  let errorMsg = '';
  let teams = [];

  onMount(async () => {
    try {
      teams = await apiFetch('/api/teams');
    } catch (err) {
      errorMsg = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Teams — Hackathon Team Matcher</title>
</svelte:head>

<div class="public-page">
  <Header bind:mobileMenuOpen />

  <main class="content">
    <div class="teams-page">
      <div class="heading">
        <h1>Teams</h1>
        <p class="sub">Every team formed on the platform so far.</p>
      </div>

      {#if errorMsg}
        <div class="error-banner">{errorMsg}</div>
      {/if}

      {#if loading}
        <p class="muted">Loading…</p>
      {:else if teams.length === 0}
        <div class="empty">
          <p>No teams formed yet.</p>
          <p class="muted">Once a team request is accepted, the team shows up here.</p>
        </div>
      {:else}
        <div class="team-grid">
          {#each teams as team}
            <div class="card">
              <div class="card-top">
                <h2>{team.name || 'Unnamed team'}</h2>
                {#if team.hackathon}<span class="tag">{team.hackathon}</span>{/if}
              </div>
              <div class="members">
                {#each team.members as member}
                  <div class="member">
                    <span class="name">{member.name}</span>
                    {#if member.college}<span class="college">{member.college}</span>{/if}
                    {#if member.preferred_roles?.length}
                      <div class="roles">
                        {#each member.preferred_roles as role}
                          <span class="role-tag">{role}</span>
                        {/each}
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </main>
</div>

<MobileMenu open={mobileMenuOpen} onClose={() => (mobileMenuOpen = false)} />

<style>
  .public-page {
    min-height: 100vh;
    min-height: 100dvh;
    background: transparent;
    display: flex;
    flex-direction: column;
    padding: clamp(16px, 2.4vh, 28px) clamp(14px, 3vw, 32px);
    box-sizing: border-box;
  }
  .content {
    width: 100%;
    max-width: 1120px;
    margin: 40px auto 60px;
  }

  .teams-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .heading h1 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 28px;
    letter-spacing: -0.02em;
    margin: 0 0 4px;
  }
  .heading .sub {
    color: var(--muted);
    font-size: 14px;
    margin: 0;
  }

  .empty {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 40px 24px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 20px;
    transition: border-color 0.2s ease;
  }
  .card:hover {
    border-color: rgba(255, 255, 255, 0.16);
  }

  .card-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 14px;
  }
  .card-top h2 {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 18px;
    letter-spacing: -0.01em;
  }
  .tag {
    font-size: 11px;
    color: var(--muted);
    white-space: nowrap;
  }

  .members {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .member {
    background: var(--surface-alt);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px 12px;
  }
  .member .name {
    display: block;
    font-weight: 600;
    font-size: 13px;
  }
  .member .college {
    display: block;
    font-size: 11px;
    color: var(--muted);
    margin-top: 1px;
  }
  .roles {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 6px;
  }
  .role-tag {
    font-size: 10.5px;
    color: var(--sign-in-text);
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 2px 7px;
    border-radius: 999px;
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
  }
</style>
