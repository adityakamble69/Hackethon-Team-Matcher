<script>
  // Local hero video — see static/assets/hero.mp4. Not sourced yet, so we fail
  // gracefully to a plain dark background instead of showing a broken video / the
  // old placeholder CloudFront clip. Drop the real file in client/static/assets/hero.mp4
  // and this will pick it up automatically, no code change needed.
  export let src = '/assets/hero.mp4';

  let videoFailed = false;
</script>

<div class="bg">
  {#if !videoFailed}
    <video
      class="bg-video"
      autoplay
      muted
      loop
      playsinline
      on:error={() => (videoFailed = true)}
    >
      <source {src} type="video/mp4" />
    </video>
  {/if}
</div>

<style>
  .bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(120% 120% at 50% 0%, #141414 0%, #000 60%);
    overflow: hidden;
    z-index: 0;
  }
  .bg-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }
</style>
