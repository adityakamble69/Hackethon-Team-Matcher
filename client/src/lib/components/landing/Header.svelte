<script>
  const links = [
    { label: 'Home', href: '/', active: true },
    { label: 'Product', href: '/product' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Contact', href: '/contact' }
  ];

  export let mobileMenuOpen = false;

  function toggleMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
</script>

<header class="header anim" style="--d: 0s">
  <a class="logo" href="/" aria-label="Home">
    <img src="/assets/logo.webp" alt="" width="52" height="52" />
  </a>

  <nav class="nav-pill desktop-only" aria-label="Primary">
    {#each links as link}
      <a href={link.href} class:active={link.active}>{link.label}</a>
    {/each}
  </nav>

  <a class="sign-in desktop-only" href="/login">Sign in</a>

  <button
    class="burger mobile-only"
    aria-expanded={mobileMenuOpen}
    aria-label="Menu"
    on:click={toggleMenu}
  >
    <span class:open={mobileMenuOpen}></span>
    <span class:open={mobileMenuOpen}></span>
    <span class:open={mobileMenuOpen}></span>
  </button>
</header>

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(18px, 2.8vw, 28px);
    max-width: 720px;
    width: 100%;
    margin: 0 auto;
    flex-shrink: 0;
  }

  .logo {
    width: clamp(40px, 4.4vw, 46px);
    height: clamp(40px, 4.4vw, 46px);
    border-radius: 50%;
    background: #fff;
    box-shadow: var(--nav-shadow);
    display: grid;
    place-items: center;
    overflow: hidden;
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }
  .logo:hover {
    transform: scale(1.04);
  }
  .logo img {
    width: 72%;
    height: 72%;
    object-fit: contain;
  }

  .nav-pill {
    display: flex;
    align-items: center;
    gap: 4px;
    background: #fff;
    height: clamp(44px, 5.2vw, 48px);
    max-width: 430px;
    flex: 1;
    padding: 4px 8px;
    border-radius: 999px;
    box-shadow: var(--nav-shadow);
  }
  .nav-pill a {
    position: relative;
    flex: 1;
    text-align: center;
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: clamp(13px, 1.4vw, 15px);
    letter-spacing: -0.01em;
    color: var(--nav-text);
    text-decoration: none;
    opacity: 0.5;
    padding: 8px 4px;
    border-radius: 999px;
    transition: opacity 0.2s ease;
  }
  .nav-pill a:hover {
    opacity: 0.75;
  }
  .nav-pill a.active {
    opacity: 1;
  }
  .nav-pill a.active::after {
    content: '';
    position: absolute;
    bottom: 5px;
    left: 50%;
    width: 3px;
    height: 3px;
    background: #000;
    border-radius: 50%;
    box-shadow:
      -5px 0 0 #000,
      5px 0 0 #000;
  }

  .sign-in {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: clamp(44px, 5.2vw, 48px);
    padding: 0 20px;
    background: var(--pill-dark);
    color: var(--sign-in-text);
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: clamp(13px, 1.4vw, 15px);
    text-decoration: none;
    border-radius: 999px;
    box-shadow: var(--nav-shadow);
    white-space: nowrap;
    transition:
      background 0.2s ease,
      color 0.2s ease,
      transform 0.2s ease;
  }
  .sign-in:hover {
    background: #323234;
    color: #fff;
    transform: translateY(-1px);
  }

  .burger {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--pill-dark);
    border: none;
    display: grid;
    place-items: center;
    gap: 4px;
    cursor: pointer;
    margin-left: auto;
    transition: background 0.2s ease;
  }
  .burger span {
    display: block;
    width: 18px;
    height: 1.5px;
    background: #fff;
    transition: all 0.25s ease;
  }
  .burger span.open:nth-child(1) {
    transform: translateY(6.5px) rotate(45deg);
    background: #000;
  }
  .burger span.open:nth-child(2) {
    opacity: 0;
  }
  .burger span.open:nth-child(3) {
    transform: translateY(-6.5px) rotate(-45deg);
    background: #000;
  }

  .mobile-only {
    display: none;
  }

  @media (max-width: 720px) {
    .header {
      justify-content: space-between;
    }
    .desktop-only {
      display: none;
    }
    .mobile-only {
      display: grid;
    }
  }
</style>
