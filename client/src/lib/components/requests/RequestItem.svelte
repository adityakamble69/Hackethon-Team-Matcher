<script>
  import { createEventDispatcher } from 'svelte';

  export let request; // { id, from_user_id, to_user_id, status, created_at, other_name? }
  export let direction; // 'sent' | 'received'
  export let responding = false;

  const dispatch = createEventDispatcher();

  $: statusClass =
    request.status === 'accepted' ? 'accepted' : request.status === 'declined' ? 'declined' : 'pending';
</script>

<div class="item">
  <div class="info">
    <p class="name">{request.other_name || 'Student'}</p>
    <p class="meta">{direction === 'sent' ? 'You requested them' : 'They requested you'}</p>
  </div>

  <div class="right">
    <span class="status {statusClass}">{request.status}</span>

    {#if direction === 'received' && request.status === 'pending'}
      <div class="actions">
        <button class="accept" disabled={responding} on:click={() => dispatch('respond', 'accepted')}>
          Accept
        </button>
        <button class="decline" disabled={responding} on:click={() => dispatch('respond', 'declined')}>
          Decline
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px 18px;
    flex-wrap: wrap;
    transition: border-color 0.2s ease, background 0.2s ease;
  }
  .item:hover {
    border-color: rgba(255, 255, 255, 0.14);
    background: var(--surface-alt);
  }

  .name {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
  }
  .meta {
    margin: 2px 0 0;
    font-size: 12px;
    color: var(--muted);
  }

  .right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .status {
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
    padding: 5px 12px;
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

  .actions {
    display: flex;
    gap: 8px;
  }
  .actions button {
    border: none;
    border-radius: 999px;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--font-sans);
    transition: transform 0.15s ease;
  }
  .actions button:hover:not(:disabled) {
    transform: translateY(-1px);
  }
  .actions button:disabled {
    opacity: 0.6;
    cursor: default;
  }
  .accept {
    background: #fff;
    color: #000;
  }
  .decline {
    background: var(--pill-dark);
    color: var(--sign-in-text);
  }
  .decline:hover:not(:disabled) {
    background: #323234;
    color: #fff;
  }
  .actions button:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
</style>
