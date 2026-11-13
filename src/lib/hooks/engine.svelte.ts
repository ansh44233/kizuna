import { SvelteMap } from 'svelte/reactivity';
import { on } from 'svelte/events';
import { Tween } from 'svelte/motion';
import { cubicInOut, cubicOut } from 'svelte/easing';
import { loadBasic } from '@tsparticles/basic';
import { tsParticles } from '@tsparticles/engine';
import { ASSETS, DIALOGUES, PARTICLES_CONFIG } from '$lib/constants';
import { AssetsLoader } from './assets.svelte';
import { QuoteManager } from './quotes.svelte';

export interface EngineProps {
  volume?: number;
}

export class Engine {
  quote = new QuoteManager();
  assets = new AssetsLoader();
  #events = new SvelteMap();

  videoIntro = $state<HTMLVideoElement>();
  videoLoop = $state<HTMLVideoElement>();
  audio = $state<HTMLAudioElement>();
  bgm = $state<HTMLAudioElement>();

  isPlaying = $state<boolean>(false);
  isAutoplay = $state<boolean>(false);
  isEnded = $state<boolean>(false);
  isReady = $state<boolean>(false);
  isShowContinueBtn = $state<boolean>(false);
  isRemoveLoadingScreen = $state<boolean>(false);
  #isParticlesLoaded = $state<boolean>(false);
  isShowParticles = $state<boolean>(false);
  isAllowToPlay = $state<boolean>(false);
  isSkipLoading = $derived(this.assets.allCached);

  currentIndex = $state<number>(0);
  #defaultBgmVolume = $state<number>(0.85);

  loadingWidth: Tween<number>;
  #bgmAudio: Tween<number>;

  constructor({ volume }: EngineProps = {}) {
    this.#defaultBgmVolume = volume || 0.85;

    this.#bgmAudio = new Tween(this.#defaultBgmVolume, {
      duration: 1500,
      easing: cubicOut
    });

    this.loadingWidth = new Tween(0, {
      duration: 200,
      easing: cubicInOut
    });

    $effect(() => {
      if (this.bgm) this.bgm.volume = this.#bgmAudio.current;
    });

    $effect(() => {
      this.loadingWidth.set(Math.round(this.assets.percent));
    });

    $effect(() => {
      if (this.assets.percent >= 100) {
        this.quote.destroy();
      }
    });

    $effect(() => {
      this.#loadParticles();

      const { items: assets } = this.assets;

      if (assets.length === ASSETS.length) {
        const bgmAsset = assets.find((e) => e.type === 'bgm');
        if (this.bgm && bgmAsset) {
          this.bgm.src = bgmAsset.src;
          this.bgm.loop = true;
          this.bgm.volume = this.#defaultBgmVolume;
        } else if (bgmAsset && !this.bgm) {
          this.bgm = new Audio(bgmAsset.src);
          this.bgm.loop = true;
          this.bgm.volume = this.#defaultBgmVolume;
        }

        const loopAsset = assets.find((e) => e.type === 'video-loop');
        if (this.videoLoop && loopAsset) {
          this.videoLoop.src = loopAsset.src;
          this.videoLoop.loop = true;
        }

        this.isShowParticles = false;
      }
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('click', () => {
        // Only re-play BGM during the loading screen phase.
        // Once quizFlow has taken over (video-1, ready-prompt, video-9, quiz-active),
        // we must NOT restart the BGM — it was intentionally stopped.
        import('./quiz-engine.svelte').then(({ quizFlow }) => {
          if (this.isRemoveLoadingScreen && this.bgm && this.bgm.paused && quizFlow.phase === 'loading') {
            this.bgm.play().catch(() => {});
          }
        });
      });
    }
  }

  /**
   * Play the animation scenes when user clicks continue.
   */
  play() {
    if (!this.isShowContinueBtn || !this.isAllowToPlay) return;

    this.isRemoveLoadingScreen = true;
    this.isShowContinueBtn = false;

    // Start background video loop (muted ensures 100% autoplay compliance)
    if (this.videoLoop) {
      this.videoLoop.loop = true;
      this.videoLoop.muted = true;
      this.videoLoop.currentTime = 0;
      const playPromise = this.videoLoop.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => console.warn('Video play prevented:', e));
      }
    }

    // Start background music (user gesture triggered)
    if (this.bgm) {
      this.bgm.loop = true;
      this.bgm.volume = this.#defaultBgmVolume;
      this.bgm.currentTime = 0;
      const bgmPromise = this.bgm.play();
      if (bgmPromise !== undefined) {
        bgmPromise.catch((e) => console.warn('BGM play prevented:', e));
      }
    }

    setTimeout(() => {
      this.isReady = true;
    }, 500);
  }

  cycle() {}
  next() {}
  choice() {}
  toggleAuto() {
    this.isAutoplay = !this.isAutoplay;
  }

  #loadParticles() {
    if (this.assets.totalSize > 0 && !this.#isParticlesLoaded) {
      loadBasic(tsParticles);
      tsParticles.load({ id: 'particles', options: PARTICLES_CONFIG });
      this.#isParticlesLoaded = true;
      this.isShowParticles = true;
    }
  }

  /**
   * Preload assets smoothly
   */
  async preload() {
    this.quote.start();
    await this.assets.preload(ASSETS);
  }

  #register(id: string, func: () => void) {
    this.#events.set(id, func);
  }

  destroy() {
    this.#events.clear();
    if (this.bgm) {
      this.bgm.pause();
    }
    if (this.audio) {
      this.audio.pause();
    }
  }

  registerOrientationEvent() {
    if (typeof window === 'undefined') return;
    const handleOrientation = () => {};
    if (typeof window.screen !== 'undefined' && window.screen.orientation) {
      this.#register('orientation:change', on(window.screen.orientation, 'change', handleOrientation));
    } else {
      this.#register('window:orientationchange', on(window, 'orientationchange', handleOrientation));
    }
  }

  registerAudioEvent() {}

  registerVideoEvent() {}
}
