<script>
  import { onMount } from 'svelte';
  import { requireAuth } from '$lib/requireAuth.js';
  import { apiFetch } from '$lib/api/client.js';
  import AppShell from '$lib/components/app/AppShell.svelte';
  import FilterSidebar from '$lib/components/discover/FilterSidebar.svelte';
  import StudentCard from '$lib/components/discover/StudentCard.svelte';

  let students = [];
  let loading = true;
  let errorMsg = '';
  let filters = { role: '', skill: '', interest: '', level: '' };
  let sentRequestIds = new Set(); // by student user_id, so buttons flip after sending
  let sendingId = null;

  onMount(async () => {
    const session = await requireAuth();
    if (!session) return;
    await Promise.all([loadStudents(), loadAlreadySent()]);
  });

  async function loadStudents() {
    loading = true;
    errorMsg = '';
    try {
      const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
      students = await apiFetch(`/api/discover?${params.toString()}`);
    } catch (err) {
      errorMsg = err.message;
    } finally {
      loading = false;
    }
  }

  async function loadAlreadySent() {
    try {
      const sent = await apiFetch('/api/requests/sent');
      sentRequestIds = new Set(sent.map((r) => r.to_user_id));
    } catch {
      // non-fatal — worst case the button just doesn't reflect an already-sent request
    }
  }

  async function sendRequest(otherUserId) {
    sendingId = otherUserId;
    try {
      await apiFetch('/api/requests', { method: 'POST', body: JSON.stringify({ toUserId: otherUserId }) });
      sentRequestIds = new Set([...sentRequestIds, otherUserId]);
    } catch (err) {
      errorMsg = err.message;
    } finally {
      sendingId = null;
    }
  }

  function handleFilterChange(e) {
    filters = e.detail;
    loadStudents();
  }
</script>

<svelte:head>
  <title>Discover — Hackathon Team Matcher</title>
</svelte:head>

<AppShell>
  <div class="discover-page">
    <div class="heading">
      <h1>Discover teammates</h1>
      <p class="sub">Sorted by compatibility with your profile.</p>
    </div>

    <div class="layout">
      <FilterSidebar {filters} on:change={handleFilterChange} />

      <div class="results">
        {#if errorMsg}
          <div class="error-banner">{errorMsg}</div>
        {/if}

        {#if loading}
          <div class="grid">
            {#each Array(6) as _}
              <div class="skeleton-card">
                <div class="sk-line sk-title"></div>
                <div class="sk-line sk-sub"></div>
                <div class="sk-line sk-tag"></div>
              </div>
            {/each}
          </div>
        {:else if students.length === 0}
          <div class="empty">
            <p>No students match these filters yet.</p>
            <p class="muted">Try clearing a filter, or check back once more people have signed up.</p>
          </div>
        {:else}
          <div class="grid">
            {#each students as student, i (student.user_id)}
              <div class="anim" style="--d: {Math.min(i * 0.05, 0.3)}s">
                <StudentCard
                  {student}
                  requestSent={sentRequestIds.has(student.user_id)}
                  sending={sendingId === student.user_id}
                  on:request={() => sendRequest(student.user_id)}
                />
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</AppShell>

<style>
  .discover-page {
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

  .layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 720px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  .empty {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 48px 24px;
    text-align: center;
  }
  .empty p {
    margin: 0 0 6px;
  }
  .empty p:first-child {
    font-size: 15px;
    font-weight: 500;
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
    margin-bottom: 4px;
  }

  .skeleton-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .sk-line {
    background: linear-gradient(90deg, var(--surface-alt) 25%, rgba(255,255,255,0.06) 50%, var(--surface-alt) 75%);
    background-size: 200% 100%;
    border-radius: 8px;
    animation: shimmer 1.4s ease-in-out infinite;
  }
  .sk-title { height: 16px; width: 60%; }
  .sk-sub { height: 12px; width: 40%; }
  .sk-tag { height: 24px; width: 80%; margin-top: 8px; }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .sk-line {
      animation: none;
    }
  }
</style>
