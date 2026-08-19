<script>
  import { onMount } from 'svelte';
  import { requireAdmin } from '$lib/requireAdmin.js';
  import { apiFetch } from '$lib/api/client.js';
  import AppShell from '$lib/components/app/AppShell.svelte';

  let loading = true;
  let errorMsg = '';
  let overview = null;
  let tab = 'students';

  onMount(async () => {
    const session = await requireAdmin();
    if (!session) return;
    try {
      overview = await apiFetch('/api/admin/overview');
    } catch (err) {
      errorMsg = err.message;
    } finally {
      loading = false;
    }
  });

  $: students = overview?.profiles.filter((p) => p.role !== 'admin') || [];
  $: admins = overview?.profiles.filter((p) => p.role === 'admin') || [];
</script>

<svelte:head>
  <title>Admin — Hackathon Team Matcher</title>
</svelte:head>

<AppShell>
  <div class="admin-page">
    <div class="heading">
      <h1>Admin overview</h1>
      <p class="sub">Visibility into signups, teams, and requests. {admins.length}/2 admin slots used.</p>
    </div>

    {#if errorMsg}
      <div class="error-banner">{errorMsg}</div>
    {/if}

    {#if loading}
      <p class="muted">Loading…</p>
    {:else if overview}
      <div class="stat-row">
        <div class="stat-card">
          <span class="num">{overview.student_count}</span>
          <span class="label">Students</span>
        </div>
        <div class="stat-card">
          <span class="num">{overview.team_count}</span>
          <span class="label">Teams formed</span>
        </div>
        <div class="stat-card">
          <span class="num">{overview.request_count}</span>
          <span class="label">Requests sent</span>
        </div>
        <div class="stat-card">
          <span class="num">{overview.admin_count}/2</span>
          <span class="label">Admins</span>
        </div>
      </div>

      <div class="tabs">
        <button class:active={tab === 'students'} on:click={() => (tab = 'students')}>Students</button>
        <button class:active={tab === 'teams'} on:click={() => (tab = 'teams')}>Teams</button>
        <button class:active={tab === 'requests'} on:click={() => (tab = 'requests')}>Requests</button>
      </div>

      {#if tab === 'students'}
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>College</th>
                <th>Roles</th>
                <th>Skills</th>
                <th>Hackathon</th>
              </tr>
            </thead>
            <tbody>
              {#each students as s}
                <tr>
                  <td>{s.name}</td>
                  <td>{s.college || '—'}</td>
                  <td>{(s.preferred_roles || []).join(', ') || '—'}</td>
                  <td>{(s.skills || []).join(', ') || '—'}</td>
                  <td>{s.hackathon || '—'}</td>
                </tr>
              {/each}
            </tbody>
          </table>
          {#if students.length === 0}<p class="muted">No students yet.</p>{/if}
        </div>
      {:else if tab === 'teams'}
        <div class="table-wrap">
          {#if overview.teams.length === 0}
            <p class="muted">No teams formed yet.</p>
          {:else}
            {#each overview.teams as team}
              <div class="team-row">
                <p class="team-name">{team.name || 'Unnamed team'}</p>
                <p class="team-members">
                  {(team.members || []).map((m) => m.name).filter(Boolean).join(', ') || 'No members'}
                </p>
              </div>
            {/each}
          {/if}
        </div>
      {:else}
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Sent</th>
              </tr>
            </thead>
            <tbody>
              {#each overview.requests as r}
                <tr>
                  <td><span class="status {r.status}">{r.status}</span></td>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              {/each}
            </tbody>
          </table>
          {#if overview.requests.length === 0}<p class="muted">No requests yet.</p>{/if}
        </div>
      {/if}
    {/if}
  </div>
</AppShell>

<style>
  .admin-page {
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

  .stat-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  @media (max-width: 560px) {
    .stat-row {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: border-color 0.2s ease, transform 0.2s ease;
  }
  .stat-card:hover {
    border-color: rgba(255, 255, 255, 0.16);
    transform: translateY(-2px);
  }
  .stat-card .num {
    font-family: var(--font-display);
    font-size: 26px;
    letter-spacing: -0.02em;
  }
  .stat-card .label {
    color: var(--muted);
    font-size: 12px;
  }

  .tabs {
    display: flex;
    gap: 6px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 4px;
    width: fit-content;
  }
  .tabs button {
    background: none;
    border: none;
    color: var(--muted);
    font-family: var(--font-sans);
    font-size: 13px;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .tabs button:hover:not(.active) {
    color: var(--text);
  }
  .tabs button.active {
    background: #fff;
    color: #000;
  }
  .tabs button:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  .table-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 8px;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  th {
    text-align: left;
    color: var(--muted);
    font-weight: 500;
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }
  td {
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
    color: var(--sign-in-text);
  }
  tr:last-child td {
    border-bottom: none;
  }
  tbody tr {
    transition: background 0.15s ease;
  }
  tbody tr:hover {
    background: var(--surface-alt);
  }

  .status {
    font-size: 11px;
    font-weight: 600;
    text-transform: capitalize;
    padding: 4px 10px;
    border-radius: 999px;
  }
  .status.pending {
    color: var(--warning);
    background: rgba(251, 191, 36, 0.12);
  }
  .status.accepted {
    color: var(--success);
    background: rgba(74, 222, 128, 0.12);
  }
  .status.declined {
    color: var(--danger);
    background: rgba(248, 113, 113, 0.12);
  }

  .team-row {
    padding: 12px;
    border-bottom: 1px solid var(--border);
    border-radius: 10px;
    transition: background 0.15s ease;
  }
  .team-row:hover {
    background: var(--surface-alt);
  }
  .team-row:last-child {
    border-bottom: none;
  }
  .team-name {
    margin: 0 0 3px;
    font-weight: 600;
    font-size: 14px;
  }
  .team-members {
    margin: 0;
    font-size: 12px;
    color: var(--muted);
  }

  .muted {
    color: var(--muted);
    font-size: 14px;
    padding: 16px;
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
