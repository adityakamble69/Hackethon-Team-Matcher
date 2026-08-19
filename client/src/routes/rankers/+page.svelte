<script>
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api/client.js';
  import Header from '$lib/components/landing/Header.svelte';
  import MobileMenu from '$lib/components/landing/MobileMenu.svelte';

  let mobileMenuOpen = false;
  let loading = true;
  let errorMsg = '';
  let hackathon = null;
  let rankings = [];

  const medal = { 1: '/assets/ranks/legend.png', 2: '/assets/ranks/titan.png', 3: '/assets/ranks/elite.png' };
  const medalLabel = { 1: 'Legend', 2: 'Titan', 3: 'Elite' };

  onMount(async () => {
    try {
      const data = await apiFetch('/api/rankings/latest');
      hackathon = data.hackathon;
      rankings = data.rankings;
    } catch (err) {
      errorMsg = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Rankers — Hackathon Team Matcher</title>
</svelte:head>

<div class="public-page">
  <Header bind:mobileMenuOpen />

  <main class="content">
    <div class="rankers-page">
      <div class="heading">
        <h1>Rankers</h1>
        <p class="sub">
          {#if hackathon}
            Final leaderboard — {hackathon.name} ({hackathon.college})
          {:else}
            Leaderboard for the most recently completed hackathon.
          {/if}
        </p>
      </div>

      {#if errorMsg}
        <div class="error-banner">{errorMsg}</div>
      {/if}

      {#if loading}
        <p class="muted">Loading…</p>
      {:else if !hackathon}
        <div class="empty">
          <p>No completed hackathon yet.</p>
          <p class="muted">Rankers show up here once a hackathon is marked completed and scored.</p>
        </div>
      {:else if rankings.length === 0}
        <div class="empty">
          <p>No rankings published yet for {hackathon.name}.</p>
        </div>
      {:else}
        <div class="leaderboard">
          {#each rankings as r}
            <div class="row" class:top={r.rank <= 3}>
              <span class="rank">
                {#if medal[r.rank]}
                  <img class="rank-badge" src={medal[r.rank]} alt={medalLabel[r.rank]} />
                {:else}
                  <span class="rank-number">#{r.rank}</span>
                {/if}
              </span>
              <span class="team-name">{r.teams?.name || 'Unnamed team'}</span>
              <span class="score">{r.score ?? '—'}</span>
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

  .rankers-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 640px;
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

  .leaderboard {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .row {
    display: grid;
    grid-template-columns: 48px 1fr auto;
    align-items: center;
    gap: 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px 18px;
    transition: border-color 0.2s ease;
  }
  .row:hover {
    border-color: rgba(255, 255, 255, 0.16);
  }
  .row.top {
    background: var(--surface-alt);
  }

  .rank {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .rank-badge {
    width: 34px;
    height: 34px;
    object-fit: contain;
  }
  .rank-number {
    font-family: var(--font-display);
    font-size: 16px;
    color: var(--muted);
  }
  .row.top .rank-badge {
    width: 40px;
    height: 40px;
  }

  .team-name {
    font-weight: 600;
    font-size: 14px;
  }

  .score {
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    font-size: 14px;
    color: var(--success);
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
