<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { DIALOGUES } from '$lib/constants';
  import { useEngine } from './dialogue-context.svelte';

  const engine = useEngine();

  const currentDialogue = $derived(DIALOGUES[engine.currentIndex]);
</script>

<div class="pointer-events-none absolute inset-0 z-20 flex h-screen w-screen items-center justify-center p-4">
  {#if engine.isPlaying && currentDialogue}
    <div
      in:fly={{ y: 20, duration: 400 }}
      class="pointer-events-auto fixed bottom-20 md:bottom-24 flex w-full max-w-xl flex-col items-center px-4"
    >
      <button
        onclick={() => engine.next()}
        class="group relative flex w-full flex-col gap-2 rounded-2xl border border-white/20 bg-black/75 p-5 text-left shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 hover:border-pink-400/50 hover:bg-black/85 active:scale-[0.99] cursor-pointer"
      >
        <!-- Speaker Tag -->
        <div class="flex items-center gap-2">
          {#if currentDialogue.speaker === 'Jimjam'}
            <span
              class="inline-flex items-center gap-1.5 rounded-full border border-rose-400/50 bg-rose-500/20 px-3 py-0.5 text-xs font-bold text-rose-300 tracking-wider uppercase shadow-[0_0_12px_rgba(244,63,94,0.3)]"
            >
              <span>🌸</span>
              <span>Jimjam</span>
            </span>
          {:else if currentDialogue.speaker === 'Aryaveer'}
            <span
              class="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-300 tracking-wider uppercase shadow-[0_0_12px_rgba(251,191,36,0.3)]"
            >
              <span>⚡</span>
              <span>Aryaveer</span>
            </span>
          {:else}
            <span
              class="inline-flex items-center gap-1.5 rounded-full border border-pink-400/50 bg-pink-500/20 px-3 py-0.5 text-xs font-bold text-pink-300 tracking-wider uppercase"
            >
              <span>❤️</span>
              <span>Love Story</span>
            </span>
          {/if}
        </div>

        <!-- Dialogue Content -->
        <div class="text-sm md:text-base font-medium leading-relaxed text-white drop-shadow-sm">
          {currentDialogue.text}
        </div>

        <!-- Next Indicator Arrow -->
        {#if engine.isEnded && (!currentDialogue.choices || currentDialogue.choices.length === 0)}
          <div class="mt-1 flex w-full items-center justify-between text-xs text-pink-300/70">
            <span class="text-[11px] font-light italic">Tap to continue</span>
            <div class="flex items-center gap-1 font-bold text-rose-400 animate-bounce">
              <span>Next</span>
              <span>▼</span>
            </div>
          </div>
        {/if}
      </button>
    </div>
  {/if}
</div>
