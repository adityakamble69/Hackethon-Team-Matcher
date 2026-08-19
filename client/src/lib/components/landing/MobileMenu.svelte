<script>
  import { page } from '$app/stores';
  import { navLinks, isLinkActive } from '$lib/config/nav.js';
  import { user, profile } from '$lib/stores/auth.js';

  export let open = false;
  export let onClose = () => {};

  $: accountLabel = $profile?.name ?? $user?.email ?? '';

  function handleKeydown(e) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div class="overlay" on:click={onClose} role="presentation">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="sheet" on:click|stopPropagation>
      {#each navLinks as link, i}
        <a
          href={link.href}
          class:active={isLinkActive(link.href, $page.url.pathname)}
          style="--d: {i * 0.06}s"
          on:click={onClose}
        >
          {link.label}
        </a>
      {/each}
      {#if $user}
        <a class="sign-in-link" href="/my-team" on:click={onClose}>
          {accountLabel ? `My Team · ${accountLabel}` : 'My Team'}
        </a>
      {:else}
        <a class="sign-in-link" href="/login" on:click={onClose}>Sign in</a>
      {/if}
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.62);
    backdrop-filter: blur(6px);
    z-index: 10;
    animation: overlayIn 0.28s ease both;
    display: flex;
    justify-content: center;
    padding-top: clamp(70px, 14vh, 100px);
  }

  .sheet {
    background: #fff;
    border-radius: 28px;
    padding: 22px 18px 20px;
    width: min(320px, 88vw);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
    display: flex;
    flex-direction: column;
    animation: menuIn 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
    height: fit-content;
  }

  .sheet a {
    position: relative;
    text-align: center;
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: 15px;
    color: var(--nav-text);
    text-decoration: none;
    padding: 14px 8px;
    opacity: 0;
    animation: linkIn 0.4s ease forwards;
    animation-delay: var(--d);
  }

  .sheet a.active::after {
    content: '';
    position: absolute;
    bottom: 8px;
    left: 50%;
    width: 3px;
    height: 3px;
    background: #000;
    border-radius: 50%;
    box-shadow:
      -5px 0 0 #000,
      5px 0 0 #000;
  }

  .sign-in-link {
    margin-top: 6px;
    background: var(--pill-dark);
    color: var(--sign-in-text) !important;
    border-radius: 999px;
    font-weight: 600 !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @keyframes overlayIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes menuIn {
    from {
      opacity: 0;
      transform: translateY(-14px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  @keyframes linkIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
