<script>
  import { createEventDispatcher } from 'svelte';
  import RequestItem from './RequestItem.svelte';

  export let requests = [];
  export let direction; // 'sent' | 'received'
  export let respondingId = null;
  export let emptyLabel = 'Nothing here yet.';

  const dispatch = createEventDispatcher();
</script>

{#if requests.length === 0}
  <div class="empty">
    <p>{emptyLabel}</p>
  </div>
{:else}
  <div class="list">
    {#each requests as request (request.id)}
      <RequestItem
        {request}
        {direction}
        responding={respondingId === request.id}
        on:respond={(e) => dispatch('respond', { id: request.id, status: e.detail })}
      />
    {/each}
  </div>
{/if}

<style>
  .list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .empty {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 32px 20px;
    text-align: center;
  }
  .empty p {
    color: var(--muted);
    font-size: 14px;
    margin: 0;
  }
</style>
