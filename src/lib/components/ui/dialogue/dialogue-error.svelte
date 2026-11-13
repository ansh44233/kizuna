<script lang="ts">
  // Cute aesthetic landscape orientation blocker
</script>

<div
  class="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-neutral-950/95 text-center px-6 text-pink-200 select-none backdrop-blur-md landscape:hidden"
>
  <!-- Animated Phone Rotation Icon -->
  <div class="relative mb-6 flex items-center justify-center">
    <div class="h-20 w-12 rounded-2xl border-4 border-pink-400/80 bg-neutral-900/60 shadow-lg shadow-pink-500/20 animate-bounce flex flex-col items-center justify-between py-2">
      <div class="h-1 w-4 rounded-full bg-pink-300/60"></div>
      <svg
        class="h-6 w-6 text-pink-400 animate-spin"
        style="animation-duration: 3s;"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      <div class="h-2 w-2 rounded-full border border-pink-300/80"></div>
    </div>
  </div>

  <div class="text-2xl font-bold tracking-wide text-pink-300 md:text-3xl uppercase font-sans drop-shadow">
    Rotate your screen ♡
  </div>
  <p class="mt-2 text-sm font-medium text-pink-200/80 max-w-xs sm:text-base">
    Please turn your phone or iPad to landscape mode for the best cinematic experience!
  </p>
  <div class="mt-4 inline-flex items-center gap-2 rounded-full bg-pink-500/20 px-4 py-1.5 text-xs text-pink-300 border border-pink-500/30">
    <span>↻ Switch to Landscape</span>
  </div>
</div>
