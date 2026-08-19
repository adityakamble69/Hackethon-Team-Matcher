<script>
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabaseClient.js';
  import { PUBLIC_API_URL } from '$env/static/public';

  let name = '';
  let email = '';
  let password = '';
  let loading = false;
  let errorMsg = '';
  let checkEmail = false;

  async function handleSubmit() {
    errorMsg = '';
    loading = true;

    try {
      // Step 1: normal Supabase Auth signup — admins are still real auth.users rows.
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      if (error) throw error;

      if (!data.session) {
        checkEmail = true;
        return;
      }

      // Session store updates async via onAuthStateChange in +layout.svelte — grab the
      // fresh session directly off the signUp response instead of racing that listener.
      const token = data.session.access_token;

      // Step 2: promote to admin. Backend enforces the max-2 cap and returns
      // "Admin limit reached (max 2)" once two admins already exist.
      const res = await fetch(`${PUBLIC_API_URL}/api/admin/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        // Admin cap hit — sign the half-created auth user back out so they don't end up
        // stuck in a signed-in-but-not-admin limbo from this page.
        await supabase.auth.signOut();
        throw new Error(body.error || 'Could not register as admin');
      }

      goto('/admin');
    } catch (err) {
      errorMsg = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Admin sign up — Hackathon Team Matcher</title>
</svelte:head>

<div class="auth-page">
  <a href="/" class="back-link">← Team Matcher</a>

  <div class="auth-card">
    {#if checkEmail}
      <h1>Check your inbox</h1>
      <p class="sub">
        We sent a confirmation link to <strong>{email}</strong>. Click it, then come back and log in — you'll be
        promoted to admin automatically on your next admin-signup attempt if a slot is still open.
      </p>
      <a href="/login" class="btn-primary" style="display:block; text-align:center; text-decoration:none;">
        Go to login
      </a>
    {:else}
      <span class="badge">Admin access</span>
      <h1>Create an admin account</h1>
      <p class="sub">Limited to 2 admins total. Once both slots are taken, this will be closed.</p>

      <form on:submit|preventDefault={handleSubmit}>
        <label>
          Name
          <input type="text" bind:value={name} autocomplete="name" required />
        </label>

        <label>
          Email
          <input type="email" bind:value={email} autocomplete="email" required />
        </label>

        <label>
          Password
          <input type="password" bind:value={password} autocomplete="new-password" minlength="6" required />
        </label>

        {#if errorMsg}
          <p class="error">{errorMsg}</p>
        {/if}

        <button type="submit" class="btn-primary" disabled={loading}>
          {loading ? 'Creating admin account…' : 'Create admin account'}
        </button>
      </form>

      <p class="switch">Not an admin? <a href="/signup">Regular sign up</a></p>
    {/if}
  </div>
</div>

<style>
  .auth-page {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 28px;
    padding: 24px;
    background: transparent;
    position: relative;
  }

  .back-link {
    position: absolute;
    top: 24px;
    left: 24px;
    color: var(--muted);
    font-size: 14px;
    text-decoration: none;
  }
  .back-link:hover {
    color: var(--text);
  }

  .auth-card {
    width: min(380px, 100%);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px 28px;
    box-shadow: var(--nav-shadow);
  }

  .badge {
    display: inline-block;
    background: var(--surface-alt);
    border: 1px solid var(--border);
    color: var(--warning);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 5px 10px;
    border-radius: 999px;
    margin-bottom: 12px;
  }

  h1 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 26px;
    letter-spacing: -0.02em;
    margin: 0 0 6px;
  }

  .sub {
    color: var(--muted);
    font-size: 14px;
    margin: 0 0 24px;
    line-height: 1.5;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
    color: var(--sign-in-text);
  }

  input {
    background: var(--surface-alt);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 11px 14px;
    color: var(--text);
    font-family: var(--font-sans);
    font-size: 15px;
    transition: border-color 0.15s ease;
  }

  input:hover {
    border-color: rgba(255, 255, 255, 0.18);
  }

  input:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 1px;
    border-color: transparent;
  }

  .error {
    color: var(--danger);
    font-size: 13px;
    margin: -6px 0 0;
    background: rgba(248, 113, 113, 0.08);
    border: 1px solid rgba(248, 113, 113, 0.25);
    padding: 10px 12px;
    border-radius: 10px;
  }

  .btn-primary {
    margin-top: 4px;
    background: #fff;
    color: #000;
    font-weight: 600;
    font-size: 15px;
    border: none;
    border-radius: 999px;
    padding: 12px;
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

  .switch {
    margin: 20px 0 0;
    text-align: center;
    font-size: 13px;
    color: var(--muted);
  }
  .switch a {
    color: var(--text);
    font-weight: 500;
  }
</style>
