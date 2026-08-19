<script>
  import { createEventDispatcher } from 'svelte';
  import CompatibilityBadge from './CompatibilityBadge.svelte';

  export let student;
  export let requestSent = false;
  export let sending = false;

  const dispatch = createEventDispatcher();
</script>

<article class="card">
  <div class="top">
    <div class="who">
      <h3>{student.name}</h3>
      {#if student.college}<p class="college">{student.college}</p>{/if}
    </div>
    {#if student.compatibility_score !== null && student.compatibility_score !== undefined}
      <CompatibilityBadge score={student.compatibility_score} />
    {/if}
  </div>

  {#if student.preferred_roles?.length}
    <div class="roles">
      {#each student.preferred_roles as role}
        <span class="role-tag">{role}</span>
      {/each}
    </div>
  {/if}

  {#if student.skills?.length}
    <p class="skills"><span class="label">Skills</span> {student.skills.join(', ')}</p>
  {/if}

  {#if student.interests?.length}
    <p class="skills"><span class="label">Interested in</span> {student.interests.join(', ')}</p>
  {/if}

  {#if student.bio}
    <p class="bio">{student.bio}</p>
  {/if}

  <div class="actions">
    {#if requestSent}
      <span class="sent-chip">Request sent</span>
    {:else}
      <button class="btn-primary" disabled={sending} on:click={() => dispatch('request')}>
        {sending ? 'Sending…' : 'Send Team Request'}
      </button>
    {/if}
    {#if student.github_url}
      <a href={student.github_url} target="_blank" rel="noreferrer" class="link">GitHub</a>
    {/if}
    {#if student.linkedin_url}
      <a href={student.linkedin_url} target="_blank" rel="noreferrer" class="link">LinkedIn</a>
    {/if}
  </div>
</article>

<style>
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 20px;
    box-shadow: var(--nav-shadow);
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;
  }
  .card:hover {
    border-color: rgba(255, 255, 255, 0.16);
    background: var(--surface-alt);
    transform: translateY(-2px);
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }

  h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
  }

  .college {
    margin: 2px 0 0;
    color: var(--muted);
    font-size: 13px;
  }

  .roles {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .role-tag {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border);
    color: var(--sign-in-text);
    font-size: 12px;
    padding: 5px 10px;
    border-radius: 999px;
    transition: border-color 0.15s ease;
  }
  .card:hover .role-tag {
    border-color: rgba(255, 255, 255, 0.14);
  }

  .skills {
    margin: 0;
    font-size: 13px;
    color: var(--sign-in-text);
    line-height: 1.5;
  }
  .skills .label {
    color: var(--muted);
    margin-right: 4px;
  }

  .bio {
    margin: 0;
    font-size: 13px;
    color: var(--muted);
    line-height: 1.5;
  }

  .actions {
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .btn-primary {
    background: #fff;
    color: #000;
    font-weight: 600;
    font-size: 13px;
    border: none;
    border-radius: 999px;
    padding: 10px 18px;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15), 0 0 16px rgba(255, 255, 255, 0.22);
  }
  .btn-primary:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
  .btn-primary:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .sent-chip {
    background: var(--surface-alt);
    color: var(--warning);
    font-size: 13px;
    font-weight: 500;
    padding: 9px 16px;
    border-radius: 999px;
  }

  .link {
    color: var(--muted);
    font-size: 12px;
    text-decoration: underline;
  }
  .link:hover {
    color: var(--text);
  }
</style>
