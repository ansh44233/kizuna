<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { DIALOGUES } from '$lib/constants';
  import { useEngine } from './dialogue-context.svelte';

  const engine = useEngine();

  const currentDialogue = $derived(DIALOGUES[engine.currentIndex]);
</script>

{#if engine.isPlaying && currentDialogue?.choices?.length && engine.isEnded}
  <div
    in:fade={{ duration: 400 }}
    class="pointer-events-none absolute inset-0 z-30 flex h-screen w-screen items-center justify-center p-4"
  >
    <div
      in:fly={{ y: 20, duration: 400 }}
      class="pointer-events-auto fixed bottom-6 flex w-full max-w-md flex-col items-center gap-2.5 px-4"
    >
      {#each currentDialogue.choices as choice (choice.text)}
        <button
          onclick={() => engine.choice()}
          class="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-rose-400/40 bg-black/80 px-5 py-3 text-center text-xs md:text-sm font-bold text-white shadow-[0_4px_20px_rgba(244,63,94,0.3)] backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:border-rose-400 hover:bg-rose-950/60 hover:shadow-[0_0_25px_rgba(244,63,94,0.6)] active:scale-95 cursor-pointer"
        >
          <span class="text-rose-400">✨</span>
          <span>{choice.text}</span>
          <span class="text-rose-400">✨</span>
        </button>
      {/each}
    </div>
  </div>
{/if}
