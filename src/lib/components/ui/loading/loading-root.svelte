<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';
  import { useEngine } from '../dialogue';
  import { quizFlow } from '$hooks/quiz-engine.svelte';

  interface Props {
    particles: Snippet;
    children: Snippet;
  }

  let { particles, children }: Props = $props();

  const engine = useEngine();

  function handleClick() {
    if (!engine.isShowContinueBtn || !engine.isAllowToPlay) return;
    engine.isRemoveLoadingScreen = true;
    engine.isShowContinueBtn = false;
    // Stop BGM + unmute video1 (which was muted as BG), start full playback
    if (quizFlow.video1) {
      quizFlow.video1.muted = false;
      quizFlow.video1.volume = 1.0;
    }
    quizFlow.startVideo1();
  }
</script>

<button
  type="button"
  onclick={handleClick}
  class={cn(
    'absolute top-0 left-0 h-screen w-screen bg-neutral-800 transition duration-1000',
    engine.isRemoveLoadingScreen ? 'z-0 opacity-0 pointer-events-none' : 'z-40 opacity-100'
  )}
>
  {@render particles()}
  <div class="relative flex min-h-screen justify-center p-[1vw]">
    {@render children()}
  </div>
</button>
