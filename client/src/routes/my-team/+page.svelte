<script>
  import { onMount } from 'svelte';
  import { requireAuth } from '$lib/requireAuth.js';
  import { apiFetch } from '$lib/api/client.js';
  import AppShell from '$lib/components/app/AppShell.svelte';

  let loading = true;
  let errorMsg = '';
  let data = null; // { team, members, filled_roles, missing_roles } or null

  onMount(async () => {
    const session = await requireAuth();
    if (!session) return;
    try {
      data = await apiFetch('/api/team/me');
    } catch (err) {
      errorMsg = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>My Team — Hackathon Team Matcher</title>
</svelte:head>

<AppShell>
  <div class="team-page">
    <div class="heading">
      <h1>My team</h1>
      <p class="sub">Formed automatically once a team request is accepted.</p>
    </div>

    {#if errorMsg}
      <div class="error-banner">{errorMsg}</div>
    {/if}

    {#if loading}
      <p class="muted">Loading…</p>
    {:else if !data}
      <div class="empty">
        <p>No team yet.</p>
        <p class="muted">Send or accept a team request from Discover / Requests to form one.</p>
        <a class="btn-primary" href="/discover">Find teammates</a>
      </div>
    {:else}
      <div class="team-card">
        <h2>{data.team?.name || 'Unnamed team'}</h2>
        {#if data.team?.hackathon}<p class="hackathon">{data.team.hackathon}</p>{/if}

        <div class="members">
          {#each data.members as member}
            <div class="member">
              <p class="name">{member.name}</p>
              {#if member.preferred_roles?.length}
                <div class="roles">
                  {#each member.preferred_roles as role}
                    <span class="role-tag">{role}</span>
                  {/each}
                </div>
              {/if}
              {#if member.skills?.length}
                <p class="skills">{member.skills.join(', ')}</p>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <div class="roles-status">
        <div class="col">
          <h3>Roles filled</h3>
          {#if data.filled_roles.length === 0}
            <p class="muted">None yet.</p>
          {:else}
            <div class="pills">
              {#each data.filled_roles as role}
                <span class="pill filled">{role}</span>
              {/each}
            </div>
          {/if}
        </div>
        <div class="col">
          <h3>Roles missing</h3>
          {#if data.missing_roles.length === 0}
            <p class="muted">Fully covered! 🎉</p>
          {:else}
            <div class="pills">
              {#each data.missing_roles as role}
                <span class="pill missing">{role}</span>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</AppShell>

<style>
  .team-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 720px;
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

  .btn-primary {
    margin-top: 10px;
    display: inline-block;
    background: #fff;
    color: #000;
    font-weight: 600;
    font-size: 14px;
    text-decoration: none;
    border-radius: 999px;
    padding: 11px 22px;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15), 0 0 16px rgba(255, 255, 255, 0.22);
  }

  .team-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 24px;
  }
  .team-card h2 {
    margin: 0 0 2px;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 22px;
    letter-spacing: -0.01em;
  }
  .hackathon {
    color: var(--muted);
    font-size: 13px;
    margin: 0 0 20px;
  }

  .members {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }
  .member {
    background: var(--surface-alt);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px;
    transition: border-color 0.2s ease;
  }
  .member:hover {
    border-color: rgba(255, 255, 255, 0.16);
  }
  .member .name {
    margin: 0 0 8px;
    font-weight: 600;
    font-size: 14px;
  }
  .roles {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 8px;
  }
  .role-tag {
    font-size: 11px;
    color: var(--sign-in-text);
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 3px 8px;
    border-radius: 999px;
  }
  .skills {
    margin: 0;
    font-size: 12px;
    color: var(--muted);
  }

  .roles-status {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 560px) {
    .roles-status {
      grid-template-columns: 1fr;
    }
  }

  .col {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 18px;
  }
  .col h3 {
    margin: 0 0 10px;
    font-size: 13px;
    color: var(--muted);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .pills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .pill {
    font-size: 12px;
    font-weight: 500;
    padding: 5px 12px;
    border-radius: 999px;
  }
  .pill.filled {
    color: var(--success);
    background: rgba(74, 222, 128, 0.12);
  }
  .pill.missing {
    color: var(--warning);
    background: rgba(251, 191, 36, 0.12);
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
