<script>
  export let src = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4';
</script>

<div class="bg">
  <video class="bg-video" autoplay muted loop playsinline>
    <source {src} type="video/mp4" />
  </video>
</div>

<style>
  .bg {
    position: absolute;
    inset: 0;
    background: #000;
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
