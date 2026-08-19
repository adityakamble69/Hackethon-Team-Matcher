<script>
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabaseClient.js';
  import { PUBLIC_API_URL } from '$env/static/public';

  let email = '';
  let password = '';
  let loading = false;
  let errorMsg = '';

  async function handleSubmit() {
    errorMsg = '';
    loading = true;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      errorMsg = error.message;
      loading = false;
      return;
    }

    // Route admins straight to the admin dashboard instead of Discover.
    try {
      const res = await fetch(`${PUBLIC_API_URL}/api/profile/me`, {
        headers: { Authorization: `Bearer ${data.session.access_token}` }
      });
      const profile = res.ok ? await res.json() : null;
      goto(profile?.role === 'admin' ? '/admin' : '/discover');
    } catch {
      goto('/discover');
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Log in — Hackathon Team Matcher</title>
</svelte:head>

<div class="auth-page">
  <a href="/" class="back-link">← Team Matcher</a>

  <div class="auth-card">
    <h1>Welcome back</h1>
    <p class="sub">Log in to see your matches and requests.</p>

    <form on:submit|preventDefault={handleSubmit}>
      <label>
        Email
        <input type="email" bind:value={email} autocomplete="email" required />
      </label>

      <label>
        Password
        <input type="password" bind:value={password} autocomplete="current-password" required />
      </label>

      {#if errorMsg}
        <p class="error">{errorMsg}</p>
      {/if}

      <button type="submit" class="btn-primary" disabled={loading}>
        {loading ? 'Logging in…' : 'Log in'}
      </button>
    </form>

    <p class="switch">No account yet? <a href="/signup">Sign up</a></p>
    <p class="admin-link"><a href="/admin-signup">Admin sign up →</a></p>
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

  .admin-link {
    margin: 10px 0 0;
    text-align: center;
    font-size: 12px;
  }
  .admin-link a {
    color: var(--muted);
    text-decoration: none;
  }
  .admin-link a:hover {
    color: var(--text);
  }
</style>
