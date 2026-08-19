<script>
  import { createEventDispatcher } from 'svelte';

  // `initial` matches a row shape from the `profiles` table (architecture.md §6).
  export let initial = {};
  export let submitLabel = 'Save profile';
  export let saving = false;

  const dispatch = createEventDispatcher();

  const ROLES = ['Frontend', 'Backend', 'Full-stack', 'Designer', 'ML/Data', 'PM/Ideation'];
  const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

  let name = initial.name ?? '';
  let college = initial.college ?? '';
  let hackathon = initial.hackathon ?? '';
  let bio = initial.bio ?? '';
  let githubUrl = initial.github_url ?? '';
  let linkedinUrl = initial.linkedin_url ?? '';
  let teamSizePref = initial.team_size_pref ?? 4;
  let overallLevel = LEVELS[1];

  let skillsText = (initial.skills ?? []).join(', ');
  let interestsText = (initial.interests ?? []).join(', ');
  let preferredRoles = new Set(initial.preferred_roles ?? []);

  function toggleRole(role) {
    if (preferredRoles.has(role)) preferredRoles.delete(role);
    else preferredRoles.add(role);
    preferredRoles = preferredRoles; // trigger reactivity
  }

  function parseList(text) {
    return text
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function handleSubmit() {
    const skills = parseList(skillsText);
    const skillLevels = Object.fromEntries(skills.map((s) => [s, overallLevel]));

    dispatch('submit', {
      name,
      college,
      hackathon,
      bio,
      github_url: githubUrl,
      linkedin_url: linkedinUrl,
      team_size_pref: Number(teamSizePref) || null,
      skills,
      interests: parseList(interestsText),
      preferred_roles: [...preferredRoles],
      skill_levels: skillLevels
    });
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <label>
    Name
    <input type="text" bind:value={name} required />
  </label>

  <div class="row">
    <label>
      College / org
      <input type="text" bind:value={college} />
    </label>
    <label>
      Hackathon
      <input type="text" bind:value={hackathon} placeholder="e.g. PS-03 Hack 2026" />
    </label>
  </div>

  <label>
    Skills <span class="hint">comma-separated, e.g. React, Figma, Postgres</span>
    <input type="text" bind:value={skillsText} required />
  </label>

  <label>
    Overall skill level
    <select bind:value={overallLevel}>
      {#each LEVELS as level}
        <option value={level}>{level}</option>
      {/each}
    </select>
  </label>

  <fieldset>
    <legend>Preferred role(s)</legend>
    <div class="pill-group">
      {#each ROLES as role}
        <button
          type="button"
          class="pill"
          class:selected={preferredRoles.has(role)}
          on:click={() => toggleRole(role)}
        >
          {role}
        </button>
      {/each}
    </div>
  </fieldset>

  <label>
    Interests / domains <span class="hint">comma-separated, e.g. FinTech, HealthTech</span>
    <input type="text" bind:value={interestsText} />
  </label>

  <label>
    Team-size preference
    <input type="number" min="2" max="6" bind:value={teamSizePref} />
  </label>

  <label>
    Bio <span class="hint">optional</span>
    <textarea bind:value={bio} rows="3"></textarea>
  </label>

  <div class="row">
    <label>
      GitHub <span class="hint">optional</span>
      <input type="url" bind:value={githubUrl} placeholder="https://github.com/…" />
    </label>
    <label>
      LinkedIn <span class="hint">optional</span>
      <input type="url" bind:value={linkedinUrl} placeholder="https://linkedin.com/in/…" />
    </label>
  </div>

  <button type="submit" class="btn-primary" disabled={saving}>
    {saving ? 'Saving…' : submitLabel}
  </button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }
  @media (max-width: 560px) {
    .row {
      grid-template-columns: 1fr;
    }
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
    color: var(--sign-in-text);
  }

  .hint {
    color: var(--muted);
    font-weight: 400;
    font-size: 12px;
  }

  input,
  select,
  textarea {
    background: var(--surface-alt);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 11px 14px;
    color: var(--text);
    font-family: var(--font-sans);
    font-size: 15px;
    resize: vertical;
    transition: border-color 0.15s ease;
  }

  input:hover,
  select:hover,
  textarea:hover {
    border-color: rgba(255, 255, 255, 0.18);
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 1px;
    border-color: transparent;
  }

  fieldset {
    border: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  legend {
    font-size: 13px;
    color: var(--sign-in-text);
    padding: 0;
    margin: 0 0 8px;
  }

  .pill-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .pill {
    background: var(--surface-alt);
    border: 1px solid var(--border);
    color: var(--sign-in-text);
    border-radius: 999px;
    padding: 8px 16px;
    font-size: 13px;
    font-family: var(--font-sans);
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .pill:hover:not(.selected) {
    border-color: rgba(255, 255, 255, 0.24);
    color: var(--text);
  }
  .pill.selected {
    background: #fff;
    color: #000;
    border-color: #fff;
    font-weight: 600;
  }
  .pill:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  .btn-primary {
    margin-top: 6px;
    background: #fff;
    color: #000;
    font-weight: 600;
    font-size: 15px;
    border: none;
    border-radius: 999px;
    padding: 13px;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15), 0 0 20px rgba(255, 255, 255, 0.25);
  }
  .btn-primary:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
  .btn-primary:disabled {
    opacity: 0.6;
    cursor: default;
  }
</style>
