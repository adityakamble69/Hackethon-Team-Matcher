<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabaseClient.js';
  import { isAdmin } from '$lib/stores/auth.js';

  const navLinks = [
    { label: 'Discover', href: '/discover' },
    { label: 'Requests', href: '/requests' },
    { label: 'My Team', href: '/my-team' },
    { label: 'Profile', href: '/profile' }
  ];

  $: currentPath = $page.url.pathname;

  async function handleLogout() {
    await supabase.auth.signOut();
    goto('/login');
  }
</script>

<div class="shell">
  <header class="topbar">
    <a class="brand" href="/discover">
      <img src="/assets/logo.webp" alt="" width="32" height="32" />
      <span>Team Matcher</span>
    </a>

    <nav class="tabs" aria-label="Primary">
      {#each navLinks as link}
        <a href={link.href} class:active={currentPath.startsWith(link.href)}>{link.label}</a>
      {/each}
      {#if $isAdmin}
        <a href="/admin" class:active={currentPath.startsWith('/admin')}>Admin</a>
      {/if}
    </nav>

    <button class="logout" on:click={handleLogout}>Log out</button>
  </header>

  <main class="content">
    <slot />
  </main>
</div>

<style>
  .shell {
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
  }

  .topbar {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 16px clamp(16px, 3vw, 32px);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(10px);
    z-index: 10;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text);
    text-decoration: none;
    font-family: var(--font-display);
    font-size: 16px;
    letter-spacing: -0.01em;
    flex-shrink: 0;
  }
  .brand img {
    border-radius: 50%;
  }
  .brand span {
    display: none;
  }
  @media (min-width: 560px) {
    .brand span {
      display: inline;
    }
  }

  .tabs {
    display: flex;
    gap: 4px;
    flex: 1;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tabs::-webkit-scrollbar {
    display: none;
  }
  .tabs a {
    color: var(--muted);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    padding: 8px 14px;
    border-radius: 999px;
    white-space: nowrap;
    transition: all 0.15s ease;
  }
  .tabs a:hover {
    color: var(--text);
    background: var(--surface-alt);
  }
  .tabs a.active {
    color: #000;
    background: #fff;
  }

  .logout {
    background: var(--pill-dark);
    color: var(--sign-in-text);
    border: none;
    border-radius: 999px;
    padding: 9px 16px;
    font-size: 13px;
    font-weight: 500;
    font-family: var(--font-sans);
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s ease;
  }
  .logout:hover {
    background: #323234;
    color: #fff;
  }

  .content {
    flex: 1;
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
    padding: clamp(20px, 3vw, 36px) clamp(16px, 3vw, 32px) 60px;
    box-sizing: border-box;
  }
</style>
