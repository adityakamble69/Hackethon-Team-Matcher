<script>
  // Circular pill, white bg, black display-font numeral. Glow kicks in above 80% per design.md §7.
  export let score = 0;
</script>

<div class="badge" class:high={score > 80}>
  <span class="num">{score}</span><span class="pct">%</span>
</div>

<style>
  .badge {
    display: inline-flex;
    align-items: baseline;
    justify-content: center;
    background: #fff;
    color: #000;
    border-radius: 999px;
    padding: 6px 12px;
    flex-shrink: 0;
    transition: box-shadow 0.2s ease;
  }
  .badge.high {
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.15),
      0 0 14px rgba(255, 255, 255, 0.32);
  }
  .num {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 17px;
    letter-spacing: -0.02em;
  }
  .pct {
    font-family: var(--font-sans);
    font-weight: 600;
    font-size: 11px;
    margin-left: 1px;
  }
</style>
