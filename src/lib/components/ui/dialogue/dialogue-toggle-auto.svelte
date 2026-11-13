<script lang="ts">
  import { fade } from 'svelte/transition';
  import { cn } from '$lib/utils';
  import { useEngine } from './dialogue-context.svelte';

  const engine = useEngine();
</script>

<div class="pointer-events-none absolute top-4 right-4 z-40">
  <div class="flex justify-end">
    {#if engine.isReady && engine.isPlaying}
      <button
        in:fade={{ duration: 400 }}
        onclick={() => engine.toggleAuto()}
        class={cn(
          'pointer-events-auto flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md transition-all duration-300 shadow-md cursor-pointer',
          engine.isAutoplay
            ? 'border border-amber-400 bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.5)]'
            : 'border border-white/20 bg-black/50 text-white hover:bg-black/70'
        )}
      >
        <span>{engine.isAutoplay ? '▶ Auto On' : '⏸ Auto'}</span>
      </button>
    {/if}
  </div>
</div>
