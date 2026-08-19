<script>
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api/client.js';

  // Static shape (icon/label/suffix) stays here; the actual numeric targets
  // are filled in from GET /api/stats/public once it resolves.
  const statMeta = [
    { icon: 'fa-solid fa-user-graduate', suffix: '', decimals: 0, label: 'Students Matched' },
    { icon: 'fa-solid fa-face-smile', suffix: '%', decimals: 0, label: 'Match Satisfaction' },
    { icon: 'fa-solid fa-envelope-open-text', suffix: '', decimals: 0, label: 'Open Requests' },
    { icon: 'fa-solid fa-people-group', suffix: '', decimals: 0, label: 'Teams Formed' }
  ];

  let targets = [0, 0, 0, 0];
  let values = [0, 0, 0, 0];
  let sectionEl;
  let started = false;
  let dataLoaded = false;
  let loadFailed = false;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateStat(i) {
    const duration = 1500 + i * 80;
    const startOffset = 480 + i * 90;
    const startTime = performance.now() + startOffset;

    function tick(now) {
      const elapsed = now - startTime;
      if (elapsed < 0) {
        requestAnimationFrame(tick);
        return;
      }
      const duration_ = duration;
      const progress = Math.min(elapsed / duration_, 1);
      const eased = easeOutCubic(progress);
      values[i] = targets[i] * eased;
      values = values;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function maybeStart() {
    // Only animate once the section is on screen AND real numbers have arrived
    // (or the fetch failed, in which case we just settle on zeros rather than
    // spinning forever).
    if (started || !(dataLoaded || loadFailed)) return;
    started = true;
    statMeta.forEach((_, i) => animateStat(i));
  }

  async function loadStats() {
    try {
      const stats = await apiFetch('/api/stats/public');
      targets = [
        stats.students_matched ?? 0,
        stats.match_satisfaction_pct ?? 0,
        stats.open_requests ?? 0,
        stats.teams_formed ?? 0
      ];
      dataLoaded = true;
    } catch (err) {
      // Landing page must still render fine if the API is unreachable —
      // counters just settle on 0 instead of breaking the page.
      loadFailed = true;
    }
    maybeStart();
  }

  onMount(() => {
    loadStats();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            maybeStart();
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
    const v = values[i];
    // Scale large "teams formed"-style counts into K once real usage grows;
    // small hackathon-scale numbers just show as-is.
    if (v >= 1000) {
      return (v / 1000).toFixed(1) + 'K';
    }
    return v.toFixed(statMeta[i].decimals) + statMeta[i].suffix;
  }
</script>

<section class="stats" bind:this={sectionEl}>
  {#each statMeta as stat, i}
    <div class="stat anim" style="--d: {0.5 + i * 0.08}s">
      <span class="icon"><i class={stat.icon} aria-hidden="true"></i></span>
      <span class="value">{formatValue(i)}</span>
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
    color: #fff;
    font-size: clamp(18px, 2.4vw, 26px);
    line-height: 1;
    opacity: 0.85;
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
