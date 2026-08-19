<script>
  import { onMount } from 'svelte';
  import { requireAuth } from '$lib/requireAuth.js';
  import { apiFetch } from '$lib/api/client.js';
  import AppShell from '$lib/components/app/AppShell.svelte';
  import RequestList from '$lib/components/requests/RequestList.svelte';

  let tab = 'received';
  let sent = [];
  let received = [];
  let loading = true;
  let errorMsg = '';
  let respondingId = null;

  onMount(async () => {
    const session = await requireAuth();
    if (!session) return;
    await loadAll();
  });

  async function loadAll() {
    loading = true;
    errorMsg = '';
    try {
      [sent, received] = await Promise.all([apiFetch('/api/requests/sent'), apiFetch('/api/requests/received')]);
    } catch (err) {
      errorMsg = err.message;
    } finally {
      loading = false;
    }
  }

  async function respond(e) {
    const { id, status } = e.detail;
    respondingId = id;
    errorMsg = '';
    try {
      await apiFetch(`/api/requests/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
      await loadAll(); // refresh both tabs — accept can also change My Team
    } catch (err) {
      errorMsg = err.message;
    } finally {
      respondingId = null;
    }
  }

  $: pendingReceivedCount = received.filter((r) => r.status === 'pending').length;
</script>

<svelte:head>
  <title>Requests — Hackathon Team Matcher</title>
</svelte:head>

<AppShell>
  <div class="requests-page">
    <div class="heading">
      <h1>Team requests</h1>
      <p class="sub">Accepting a request forms or joins a team automatically.</p>
    </div>

    <div class="tabs">
      <button class:active={tab === 'received'} on:click={() => (tab = 'received')}>
        Received
        {#if pendingReceivedCount > 0}<span class="count">{pendingReceivedCount}</span>{/if}
      </button>
      <button class:active={tab === 'sent'} on:click={() => (tab = 'sent')}>Sent</button>
    </div>

    {#if errorMsg}
      <div class="error-banner">{errorMsg}</div>
    {/if}

    {#if loading}
      <p class="muted">Loading requests…</p>
    {:else if tab === 'received'}
      <RequestList
        requests={received}
        direction="received"
        {respondingId}
        emptyLabel="No requests received yet — get discovered by completing your profile."
        on:respond={respond}
      />
    {:else}
      <RequestList
        requests={sent}
        direction="sent"
        {respondingId}
        emptyLabel="You haven't sent any team requests yet — head to Discover."
        on:respond={respond}
      />
    {/if}
  </div>
</AppShell>

<style>
  .requests-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
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
    display: flex;
    align-items: center;
    gap: 6px;
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
  .count {
    background: var(--danger);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    border-radius: 999px;
    padding: 1px 6px;
  }
  .tabs button.active .count {
    background: #000;
    color: #fff;
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
