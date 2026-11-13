import type { Asset } from '$types';
import type { SingleOrMultiple, RecursivePartial, IOptions } from '@tsparticles/engine';

export const ASSETS_CACHE_KEY = 'assets/v3';

export interface DialogueItem {
  speaker?: string;
  text: string;
  audio?: string;
  playAfter?: number;
  choices?: { text: string; selected?: boolean }[];
}

// dialogue assets data (empty for loading screen experience)
export const DIALOGUES: DialogueItem[] = [];

// define all assets.
export const ASSETS: Asset[] = [
  {
    type: 'video-loop',
    src: '/video/love-loop-v2.mp4'
  },
  {
    type: 'bgm',
    src: '/audio/love-bgm-v2.mp3'
  }
];

export const PARTICLES_CONFIG = {
  particles: {
    number: {
      value: 29,
      density: {
        enable: true,
        value_area: 6573.989449548644
      }
    },
    color: {
      value: '#ffffff'
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 0,
        color: '#000000'
      },
      polygon: {
        nb_sides: 3
      },
      image: {
        src: '',
        width: 0,
        height: 0
      }
    },
    opacity: {
      value: 1,
      random: true,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 1,
      random: true,
      anim: {
        enable: false,
        speed: 1,
        size_min: 4.87246327380807,
        sync: false
      }
    },
    line_linked: {
      enable: false,
      distance: 0,
      color: '#ffffff',
      opacity: 0,
      width: 0
    },
    move: {
      enable: true,
      speed: 6,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: true,
        mode: 'repulse'
      },
      onclick: {
        enable: true,
        mode: 'push'
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1
        }
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3
      },
      repulse: {
        distance: 200,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: true
} as unknown as SingleOrMultiple<RecursivePartial<IOptions>>;

/**
 * @description the loading quotes displayed on the loading screen (Aryaveer & Jimjam).
 */
export const LOADING_QUOTES = [
  {
    name: 'Jimjam',
    quote: `Aryaveer... would you run away with me? Just the two of us?`,
    length: 7000
  },
  {
    name: 'Aryaveer',
    quote: `Even if the whole world turns against us, Jimjam, my heart already chose you.`,
    length: 7500
  },
  {
    name: 'Jimjam',
    quote: `You really are an idiot, Aryaveer. But you're my idiot.`,
    length: 6500
  },
  {
    name: 'Aryaveer',
    quote: `Teaching me to swim, smiling under the summer festival lanterns... every moment with Jimjam is unforgettable.`,
    length: 8000
  },
  {
    name: 'Jimjam',
    quote: `Let's forget about the world tonight, Aryaveer. Just you, me, and the festival.`,
    length: 7000
  },
  {
    name: 'Aryaveer',
    quote: `I don't need anything else anymore, Jimjam. I just need you.`,
    length: 6500
  },
  {
    name: 'Jimjam',
    quote: `Promise me, Aryaveer... no matter what happens, you won't forget this night.`,
    length: 7000
  },
  {
    name: 'Aryaveer & Jimjam',
    quote: `Under the glowing lanterns, where our story continues...`,
    length: 6500
  }
];
