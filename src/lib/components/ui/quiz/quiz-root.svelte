<script lang="ts">
  import { fade } from 'svelte/transition';
  import { quizFlow } from '$hooks/quiz-engine.svelte';
</script>

<!-- ═══════════════════════════════════════════════
     PHASE 3: "ARE YOU READY FOR QUIZ?" black screen
     ═══════════════════════════════════════════════ -->
{#if quizFlow.phase === 'ready-prompt'}
  <div
    role="button"
    tabindex="0"
    onclick={() => quizFlow.startVideo9()}
    onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') quizFlow.startVideo9(); }}
    transition:fade={{ duration: 600 }}
    class="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer select-none"
  >
    <div class="animate-pulse text-center text-[4vw] md:text-[2vw] font-semibold uppercase tracking-wider text-blue-300">
      Are you ready for the quiz?
    </div>
  </div>
{/if}

<!-- ═══════════════════════════════════════════════
     VIDEO PROJECT 9
     — Fullscreen during 'video-9'
     — Looping bg (low volume) during 'quiz-active'
     ═══════════════════════════════════════════════ -->
<video
  bind:this={quizFlow.video2}
  src="/video/quiz-bg.mp4"
  preload="auto"
  playsinline
  onended={() => { if (quizFlow.phase === 'video-9') quizFlow.onVideo9Ended(); }}
  class="fixed inset-0 h-screen w-screen object-cover transition-all duration-700
    {quizFlow.phase === 'video-9'
      ? 'z-20 opacity-100 brightness-100'
      : quizFlow.phase === 'quiz-active'
        ? 'z-20 opacity-100 brightness-50'
        : 'z-0 opacity-0 pointer-events-none'}"
>
  <track kind="captions" />
</video>

<!-- ═══════════════════════════════════════════════
     PHASE 5: QUIZ ACTIVE
     — iframe of quiz.html centered as big rounded card
     — video-9 visible in background (corners)
     ═══════════════════════════════════════════════ -->
{#if quizFlow.phase === 'quiz-active'}
  <div
    transition:fade={{ duration: 800 }}
    class="fixed inset-0 z-30 flex items-center justify-center p-4 sm:p-8"
  >
    <!-- Centered big rounded quiz card — covers most of the viewport -->
    <div class="relative w-full max-w-4xl h-[92dvh] rounded-[36px] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.85)] ring-1 ring-white/20 bg-neutral-900/40">
      <iframe
        src="/quiz.html"
        title="Love Quiz"
        class="w-full h-full border-0"
        allow="autoplay"
        scrolling="auto"
      ></iframe>
    </div>
  </div>
{/if}
