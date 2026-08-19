<script>
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api/client.js';
  import Header from '$lib/components/landing/Header.svelte';
  import MobileMenu from '$lib/components/landing/MobileMenu.svelte';

  let mobileMenuOpen = false;
  let loading = true;
  let errorMsg = '';
  let hackathons = [];

  function formatDateRange(start, end) {
    if (!start && !end) return '';
    const opts = { day: 'numeric', month: 'short' };
    const s = start ? new Date(start).toLocaleDateString('en-IN', opts) : '';
    const e = end ? new Date(end).toLocaleDateString('en-IN', opts) : '';
    return s && e ? `${s} – ${e}` : s || e;
  }

  onMount(async () => {
    try {
      hackathons = await apiFetch('/api/hackathons');
    } catch (err) {
      errorMsg = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Hackathons — Hackathon Team Matcher</title>
</svelte:head>

<div class="public-page">
  <Header bind:mobileMenuOpen />

  <main class="content">
    <div class="hack-page">
      <div class="heading">
        <h1>Hackathons</h1>
        <p class="sub">Which colleges are running which hackathon, and when.</p>
      </div>

      {#if errorMsg}
        <div class="error-banner">{errorMsg}</div>
      {/if}

      {#if loading}
        <p class="muted">Loading…</p>
      {:else if hackathons.length === 0}
        <div class="empty">
          <p>No hackathons listed yet.</p>
        </div>
      {:else}
        <div class="hack-grid">
          {#each hackathons as h}
            <div class="card">
              <div class="card-top">
                <h2>{h.name}</h2>
                <span class="status status-{h.status}">{h.status}</span>
              </div>
              <p class="college">{h.college}</p>
              <div class="meta">
                {#if h.location}<span>📍 {h.location}</span>{/if}
                {#if h.start_date || h.end_date}<span>🗓 {formatDateRange(h.start_date, h.end_date)}</span>{/if}
              </div>
              {#if h.description}<p class="desc">{h.description}</p>{/if}

              <div class="teams-block">
                <h3>Teams competing ({h.teams.length})</h3>
                {#if h.teams.length === 0}
                  <p class="no-teams">No teams formed for this hackathon yet.</p>
                {:else}
                  <div class="teams-list">
                    {#each h.teams as team}
                      <div class="mini-team">
                        <span class="mini-team-name">{team.name || 'Unnamed team'}</span>
                        <div class="mini-members">
                          {#each team.members as m}
                            <span class="mini-member">{m.name}</span>
                          {/each}
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
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

  .hack-page {
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
  }

  .hack-grid {
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
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 4px;
  }
  .card-top h2 {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 18px;
    letter-spacing: -0.01em;
  }

  .status {
    flex-shrink: 0;
    font-size: 10.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    padding: 3px 9px;
    border-radius: 999px;
  }
  .status-upcoming {
    color: var(--warning);
    background: rgba(251, 191, 36, 0.12);
  }
  .status-ongoing {
    color: var(--success);
    background: rgba(74, 222, 128, 0.12);
  }
  .status-completed {
    color: var(--muted);
    background: rgba(255, 255, 255, 0.06);
  }

  .college {
    margin: 0 0 10px;
    font-size: 13px;
    color: var(--sign-in-text);
    font-weight: 500;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .desc {
    margin: 8px 0 0;
    font-size: 12.5px;
    color: var(--muted);
    line-height: 1.5;
  }

  .teams-block {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
  }
  .teams-block h3 {
    margin: 0 0 8px;
    font-size: 11.5px;
    color: var(--muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .no-teams {
    margin: 0;
    font-size: 12px;
    color: var(--muted);
    font-style: italic;
  }
  .teams-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .mini-team {
    background: var(--surface-alt);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px 12px;
  }
  .mini-team-name {
    display: block;
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 5px;
  }
  .mini-members {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .mini-member {
    font-size: 11px;
    color: var(--sign-in-text);
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 2px 8px;
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
