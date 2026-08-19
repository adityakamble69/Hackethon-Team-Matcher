<script>
  import { createEventDispatcher } from 'svelte';

  export let filters = { role: '', skill: '', interest: '', level: '' };

  const ROLES = ['Frontend', 'Backend', 'Full-stack', 'Designer', 'ML/Data', 'PM/Ideation'];
  const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

  const dispatch = createEventDispatcher();

  function update() {
    dispatch('change', filters);
  }

  function clearAll() {
    filters = { role: '', skill: '', interest: '', level: '' };
    update();
  }

  $: hasActiveFilters = Object.values(filters).some(Boolean);
</script>

<aside class="sidebar">
  <div class="head">
    <h2>Filters</h2>
    {#if hasActiveFilters}
      <button class="clear" on:click={clearAll}>Clear</button>
    {/if}
  </div>

  <label>
    Role
    <select bind:value={filters.role} on:change={update}>
      <option value="">Any role</option>
      {#each ROLES as role}
        <option value={role}>{role}</option>
      {/each}
    </select>
  </label>

  <label>
    Skill
    <input type="text" placeholder="e.g. React" bind:value={filters.skill} on:input={update} />
  </label>

  <label>
    Interest / domain
    <input type="text" placeholder="e.g. FinTech" bind:value={filters.interest} on:input={update} />
  </label>

  <label>
    Skill level
    <select bind:value={filters.level} on:change={update}>
      <option value="">Any level</option>
      {#each LEVELS as level}
        <option value={level}>{level}</option>
      {/each}
    </select>
  </label>
</aside>

<style>
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 20px;
    height: fit-content;
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  h2 {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 18px;
    letter-spacing: -0.01em;
  }

  .clear {
    background: none;
    border: none;
    color: var(--muted);
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
  }
  .clear:hover {
    color: var(--text);
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
    color: var(--sign-in-text);
  }

  input,
  select {
    background: var(--surface-alt);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px 12px;
    color: var(--text);
    font-family: var(--font-sans);
    font-size: 14px;
    transition: border-color 0.15s ease;
  }
  input:hover,
  select:hover {
    border-color: rgba(255, 255, 255, 0.18);
  }
  input:focus,
  select:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 1px;
    border-color: transparent;
  }
  select {
    cursor: pointer;
  }
</style>
