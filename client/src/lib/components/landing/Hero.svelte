<script>
  export let headlineLine1 = 'Team Up';
  export let headlineLine2 = 'Built To Evolve';
  export let subhead =
    'Find teammates who reason, adapt and collaborate using a matching platform designed for hackathon teams.';
  export let ctaLabel = 'Get Started';
  export let ctaHref = '/signup';
</script>

<section class="hero">
  <div class="trust-row anim" style="--d: 0.05s">
    <div class="avatars">
      <span class="avatar" style="z-index: 1;">
        <span class="avatar-inner"><i class="fa-solid fa-graduation-cap" aria-hidden="true"></i></span>
      </span>
      <span class="avatar" style="z-index: 2;">
        <span class="avatar-inner"><i class="fa-solid fa-code" aria-hidden="true"></i></span>
      </span>
      <span class="avatar" style="z-index: 4;">
        <span class="avatar-inner"><i class="fa-solid fa-trophy" aria-hidden="true"></i></span>
      </span>
    </div>
    <span class="trust-pill">Built for Campus Hackathon Teams</span>
  </div>

  <h1 class="headline anim">
    <span class="line" style="--ld: 0.12s">{headlineLine1}</span>
    <span class="line" style="--ld: 0.3s">{headlineLine2}</span>
  </h1>

  <p class="subhead anim" style="--d: 0.28s">{subhead}</p>

  <a class="cta anim reveal-pulse" style="--d: 0.4s" href={ctaHref}>{ctaLabel}</a>
</section>

<style>
  .hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
  }

  /* --- Trust row --- */
  .trust-row {
    --trust-size: clamp(36px, 4.5vw, 42px);
    display: inline-flex;
    align-items: center;
    margin-bottom: clamp(16px, 2.5vh, 26px);
  }

  .avatars {
    display: flex;
    align-items: center;
  }

  .avatar {
    width: var(--trust-size);
    height: var(--trust-size);
    border-radius: 50%;
    background: var(--trust-bg);
    border: 1px solid var(--trust-border);
    padding: 5px;
    box-sizing: border-box;
    display: grid;
    place-items: center;
    transition: transform 0.35s ease;
  }
  .avatar:not(:first-child) {
    margin-left: calc(var(--trust-size) * -0.42);
  }
  .avatar:hover {
    transform: translateY(-2px);
  }
  .avatars .avatar:nth-child(2):hover {
    transform: translateY(-4px);
  }

  .avatar-inner {
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 50%;
    display: grid;
    place-items: center;
  }
  .avatar-inner i {
    color: #111;
    font-size: calc(var(--trust-size) * 0.34);
  }

  .trust-pill {
    height: var(--trust-size);
    display: inline-flex;
    align-items: center;
    background: var(--trust-bg);
    border: 1px solid var(--trust-border);
    border-radius: 999px;
    margin-left: calc(var(--trust-size) * -0.42);
    padding-left: calc(var(--trust-size) * 0.58);
    padding-right: 16px;
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: clamp(12px, 1.4vw, 13.5px);
    color: var(--trust-text);
    white-space: nowrap;
  }

  /* --- Headline --- */
  .headline {
    font-family: var(--font-display);
    color: #fff;
    font-weight: 400;
    font-size: clamp(28px, 6.2vw, 80px);
    letter-spacing: -0.04em;
    line-height: 1.12;
    margin: 0;
  }
  .headline .line {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    opacity: 0;
    transform: translateY(14px);
    animation: headlineFade 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    animation-delay: var(--ld);
  }

  /* --- Subhead --- */
  .subhead {
    max-width: min(500px, 92%);
    margin: clamp(14px, 2vh, 20px) auto 0;
    font-family: var(--font-sans);
    font-size: clamp(calc(13.5px + 2pt), calc(1.55vw + 2pt), calc(16.5px + 2pt));
    color: #d0d0d0;
    opacity: 0.8;
    line-height: 1.55;
    font-weight: 400;
  }

  /* --- CTA --- */
  .cta {
    display: inline-block;
    margin-top: clamp(20px, 3vh, 30px);
    background: #fff;
    color: #000;
    font-family: var(--font-sans);
    font-weight: 600;
    font-size: clamp(13.5px, 1.5vw, 14.5px);
    text-decoration: none;
    padding: clamp(11px, 1.6vh, 13px) clamp(22px, 3vw, 28px);
    border-radius: 999px;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.15),
      0 0 22px rgba(255, 255, 255, 0.32),
      0 0 44px rgba(255, 255, 255, 0.12);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }
  .cta:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.22),
      0 0 30px rgba(255, 255, 255, 0.42),
      0 0 60px rgba(255, 255, 255, 0.18);
  }

  @keyframes headlineFade {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 720px) {
    .headline {
      letter-spacing: -0.08em;
      line-height: 1.05;
    }
  }
  @media (max-width: 420px) {
    .trust-row {
      --trust-size: 34px;
    }
    .trust-pill {
      font-size: 12px;
    }
    .headline {
      letter-spacing: -0.09em;
      line-height: 1.04;
    }
  }
  @media (max-height: 700px) {
    .hero {
      gap: 0;
    }
    .trust-row {
      margin-bottom: 12px;
    }
    .subhead {
      margin-top: 10px;
    }
    .cta {
      margin-top: 16px;
    }
  }
</style>
