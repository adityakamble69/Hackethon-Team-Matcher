<script>
  import { onMount } from 'svelte';

  const stats = [
    { icon: '<', target: 500, suffix: '', decimals: 0, label: 'Students Matched' },
    { icon: '%', target: 92, suffix: '%', decimals: 0, label: 'Match Satisfaction' },
    { icon: '*', target: 24, suffix: '/7', decimals: 0, label: 'Live Matching' },
    { icon: '#', target: 1.2, suffix: 'K', decimals: 1, label: 'Teams Formed' }
  ];

  let values = stats.map(() => 0);
  let sectionEl;
  let started = false;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateStat(i) {
    const stat = stats[i];
    const duration = 1500 + i * 80;
    const startOffset = 480 + i * 90;
    const startTime = performance.now() + startOffset;

    function tick(now) {
      const elapsed = now - startTime;
      if (elapsed < 0) {
        requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      values[i] = stat.target * eased;
      values = values;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            stats.forEach((_, i) => animateStat(i));
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    if (sectionEl) observer.observe(sectionEl);
    return () => observer.disconnect();
  });

  function formatValue(i) {
    return values[i].toFixed(stats[i].decimals);
  }
</script>

<section class="stats" bind:this={sectionEl}>
  {#each stats as stat, i}
    <div class="stat anim" style="--d: {0.5 + i * 0.08}s">
      <span class="icon">{stat.icon}</span>
      <span class="value">{formatValue(i)}{stat.suffix}</span>
      <span class="label">{stat.label}</span>
    </div>
  {/each}
</section>

<style>
  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: clamp(12px, 2vw, 24px);
    max-width: 920px;
    width: 100%;
    margin: 0 auto;
    flex-shrink: 0;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    text-align: center;
  }

  .icon {
    font-family: var(--font-display);
    color: #fff;
    font-size: clamp(22px, 3vw, 33px);
    line-height: 1;
  }

  .value {
    font-family: var(--font-sans);
    color: #fff;
    font-size: clamp(18px, 2.2vw, 26px);
    letter-spacing: -0.025em;
    font-variant-numeric: tabular-nums;
    font-weight: 500;
  }

  .label {
    font-family: var(--font-sans);
    color: var(--muted);
    font-size: clamp(11px, 1.2vw, 12.5px);
  }

  @media (max-width: 720px) {
    .stats {
      grid-template-columns: repeat(2, 1fr);
      row-gap: 20px;
    }
  }
</style>
