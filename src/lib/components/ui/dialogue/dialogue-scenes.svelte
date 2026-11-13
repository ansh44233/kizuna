<script lang="ts">
  import { useEngine } from '../dialogue/dialogue-context.svelte';
  import { quizFlow } from '$hooks/quiz-engine.svelte';

  const engine = useEngine();

  // Wire the kizu bgm element into quizFlow so it can be stopped on click-continue
  $effect(() => {
    if (engine.bgm) {
      quizFlow.bgm = engine.bgm;
    }
  });

  function handleVideo1TimeUpdate(e: Event) {
    const v = e.currentTarget as HTMLVideoElement;
    if (v.currentTime >= 30.2 && quizFlow.phase === 'video-1') {
      quizFlow.onVideo1Ended();
    }
  }

  function handleVideo1Ended() {
    if (quizFlow.phase === 'video-1') {
      quizFlow.onVideo1Ended();
    }
  }
</script>

<!-- Video 1: love-loop-v2.mp4 (Chainsaw Man, ends on "I Love You, Aryaveer") -->
<!-- Visible during 'loading' phase (as the BG behind the loading screen) and 'video-1' (fullscreen with audio) -->
<video
  bind:this={quizFlow.video1}
  src="/video/love-loop-v2.mp4"
  preload="auto"
  playsinline
  muted
  ontimeupdate={handleVideo1TimeUpdate}
  onended={handleVideo1Ended}
  class="fixed inset-0 h-screen w-screen object-cover brightness-90 transition-opacity duration-700 {quizFlow.phase === 'loading' || quizFlow.phase === 'video-1' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}"
>
  <track kind="captions" />
</video>

<!-- The kizu BGM audio — controlled by engine, stopped by quizFlow on continue -->
<audio bind:this={engine.bgm} src="/audio/love-bgm-v2.mp3" preload="auto" loop></audio>
