<script>
  import VideoBg from '$lib/components/landing/VideoBg.svelte';
  import Header from '$lib/components/landing/Header.svelte';
  import MobileMenu from '$lib/components/landing/MobileMenu.svelte';
  import Hero from '$lib/components/landing/Hero.svelte';
  import Stats from '$lib/components/landing/Stats.svelte';

  let mobileMenuOpen = false;
</script>

<VideoBg />

<div class="page" class:menu-open={mobileMenuOpen}>
  <Header bind:mobileMenuOpen />
  <Hero />
  <Stats />
</div>

<MobileMenu open={mobileMenuOpen} onClose={() => (mobileMenuOpen = false)} />

<style>
  .page {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    height: 100dvh;
    width: 100%;
    padding: clamp(16px, 2.4vh, 28px) clamp(14px, 3vw, 32px);
    overflow: hidden;
    box-sizing: border-box;
  }
</style>
