<script>
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api/client.js';

  export let initialTab = 'teams';

  // Which tab is showing — 'teams', 'hackathons', or 'rankers'. No login required for
  // any of them; all three hit public backend routes (see server/src/routes/team.routes.js,
  // hackathon.routes.js, ranking.routes.js — none has authMiddleware attached).
  let activeTab = initialTab;

  let teamsLoading = true;
  let teamsError = '';
  let teams = [];

  let hackathonsLoading = true;
  let hackathonsError = '';
  let hackathons = [];

  let rankersLoading = true;
  let rankersError = '';
  let rankersHackathon = null;
  let rankings = [];

  const medal = { 1: '/assets/ranks/legend.png', 2: '/assets/ranks/titan.png', 3: '/assets/ranks/elite.png' };
  const medalLabel = { 1: 'Legend', 2: 'Titan', 3: 'Elite' };

  function formatDateRange(start, end) {
    if (!start && !end) return '';
    const opts = { day: 'numeric', month: 'short' };
    const s = start ? new Date(start).toLocaleDateString('en-IN', opts) : '';
    const e = end ? new Date(end).toLocaleDateString('en-IN', opts) : '';
    return s && e ? `${s} – ${e}` : s || e;
  }

  async function loadTeams() {
    teamsLoading = true;
    teamsError = '';
    try {
      teams = await apiFetch('/api/teams');
    } catch (err) {
      teamsError = err.message;
    } finally {
      teamsLoading = false;
    }
  }

  async function loadHackathons() {
    hackathonsLoading = true;
    hackathonsError = '';
    try {
      hackathons = await apiFetch('/api/hackathons');
    } catch (err) {
      hackathonsError = err.message;
    } finally {
      hackathonsLoading = false;
    }
  }

  async function loadRankers() {
    rankersLoading = true;
    rankersError = '';
    try {
      const data = await apiFetch('/api/rankings/latest');
      rankersHackathon = data.hackathon;
      rankings = data.rankings;
    } catch (err) {
      rankersError = err.message;
    } finally {
      rankersLoading = false;
    }
  }

  function setTab(tab) {
    if (activeTab === tab) return;
    activeTab = tab;
  }

  onMount(() => {
    // All three load up front so switching tabs feels instant — no login gate on any call.
    loadTeams();
    loadHackathons();
    loadRankers();
  });
</script>

<div class="public-browse">
  <div class="tab-switch" role="tablist" aria-label="Browse">
    <button
      role="tab"
      aria-selected={activeTab === 'teams'}
      class:active={activeTab === 'teams'}
      on:click={() => setTab('teams')}
    >
      Teams
    </button>
    <button
      role="tab"
      aria-selected={activeTab === 'hackathons'}
      class:active={activeTab === 'hackathons'}
      on:click={() => setTab('hackathons')}
    >
      Hackathons
    </button>
    <button
      role="tab"
      aria-selected={activeTab === 'rankers'}
      class:active={activeTab === 'rankers'}
      on:click={() => setTab('rankers')}
    >
      Rankers
    </button>
  </div>

  {#if activeTab === 'teams'}
    <div class="panel">
      <div class="heading">
        <h1>Teams</h1>
        <p class="sub">Every team formed on the platform so far.</p>
      </div>

      {#if teamsError}
        <div class="error-banner">{teamsError}</div>
      {/if}

      {#if teamsLoading}
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
  {:else if activeTab === 'hackathons'}
    <div class="panel">
      <div class="heading">
        <h1>Hackathons</h1>
        <p class="sub">Which colleges are running which hackathon, and when.</p>
      </div>

      {#if hackathonsError}
        <div class="error-banner">{hackathonsError}</div>
      {/if}

      {#if hackathonsLoading}
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
  {:else}
    <div class="panel">
      <div class="heading">
        <h1>Rankers</h1>
        <p class="sub">
          {#if rankersHackathon}
            Final leaderboard — {rankersHackathon.name} ({rankersHackathon.college})
          {:else}
            Leaderboard for the most recently completed hackathon.
          {/if}
        </p>
      </div>

      {#if rankersError}
        <div class="error-banner">{rankersError}</div>
      {/if}

      {#if rankersLoading}
        <p class="muted">Loading…</p>
      {:else if !rankersHackathon}
        <div class="empty">
          <p>No completed hackathon yet.</p>
          <p class="muted">Rankers show up here once a hackathon is marked completed and scored.</p>
        </div>
      {:else if rankings.length === 0}
        <div class="empty">
          <p>No rankings published yet for {rankersHackathon.name}.</p>
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
  {/if}
</div>

<style>
  .public-browse {
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 960px;
  }

  .tab-switch {
    display: inline-flex;
    gap: 4px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 4px;
    width: fit-content;
  }
  .tab-switch button {
    border: none;
    background: transparent;
    color: var(--muted);
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: 14px;
    padding: 8px 18px;
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.18s ease;
  }
  .tab-switch button:hover {
    color: var(--text);
  }
  .tab-switch button.active {
    background: #fff;
    color: #000;
  }

  .panel {
    display: flex;
    flex-direction: column;
    gap: 24px;
    animation: fadeIn 0.25s ease both;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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

  .team-grid,
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
