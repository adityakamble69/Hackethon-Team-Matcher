<script>
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabaseClient.js';

  let name = '';
  let email = '';
  let password = '';
  let loading = false;
  let errorMsg = '';
  let checkEmail = false;

  async function handleSubmit() {
    errorMsg = '';
    loading = true;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });

    loading = false;

    if (error) {
      errorMsg = error.message;
      return;
    }

    // If email confirmation is on, Supabase returns a user but no session yet.
    if (!data.session) {
      checkEmail = true;
      return;
    }

    goto('/onboarding');
  }
</script>

<svelte:head>
  <title>Sign up — Hackathon Team Matcher</title>
</svelte:head>

<div class="auth-page">
  <a href="/" class="back-link">← Team Matcher</a>

  <div class="auth-card">
    {#if checkEmail}
      <h1>Check your inbox</h1>
      <p class="sub">
        We sent a confirmation link to <strong>{email}</strong>. Click it, then come back and log in.
      </p>
      <a href="/login" class="btn-primary" style="display:block; text-align:center; text-decoration:none;">
        Go to login
      </a>
    {:else}
      <h1>Create your profile</h1>
      <p class="sub">Find teammates whose skills complement yours.</p>

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
          <input
            type="password"
            bind:value={password}
            autocomplete="new-password"
            minlength="6"
            required
          />
        </label>

        {#if errorMsg}
          <p class="error">{errorMsg}</p>
        {/if}

        <button type="submit" class="btn-primary" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
      </form>

      <p class="switch">Already have an account? <a href="/login">Log in</a></p>
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
