<script lang="ts">
  import { fade } from 'svelte/transition';
  import { cn } from '$lib/utils';
  import { useEngine } from './dialogue-context.svelte';

  const engine = useEngine();
</script>

<button
  in:fade={{ duration: 1000 }}
  onclick={() => engine.cycle()}
  class={cn(
    'absolute top-0 left-0 h-screen w-screen select-none',
    !engine.isPlaying ? 'z-20 cursor-pointer' : 'z-0 pointer-events-none'
  )}
>
  <div class="relative flex min-h-screen justify-center p-4">
    <div class="flex w-screen items-end justify-center pb-12 md:pb-16">
      {#if engine.isReady && !engine.isPlaying}
        <div
          in:fade={{ duration: 800 }}
          class={cn(
            'flex flex-col items-center gap-1.5 px-6 py-3 rounded-2xl border border-rose-500/40 bg-black/60 backdrop-blur-md shadow-[0_0_25px_rgba(244,63,94,0.3)] transition-all duration-300 hover:scale-105 active:scale-95',
            'animate-pulse text-center uppercase tracking-widest text-pink-200'
          )}
        >
          <span class="text-xs md:text-sm font-bold text-rose-400">✨ Click anywhere on screen to begin ✨</span>
          <span class="text-[10px] md:text-xs text-amber-300/80 normal-case font-medium">Aryaveer & Jimjam's conversation awaits!</span>
        </div>
      {/if}
    </div>
  </div>
</button>
