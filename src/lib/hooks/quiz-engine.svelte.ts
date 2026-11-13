export type QuizFlowPhase =
  | 'loading'       // 1. Initial Kizu loading screen (BGM playing)
  | 'video-1'       // 2. Video Project 8 with its own audio (BGM faded out)
  | 'ready-prompt'  // 3. Black screen: "ARE YOU READY FOR QUIZ?" (silence)
  | 'video-9'       // 4. Video Project 9 fullscreen with full audio
  | 'quiz-active';  // 5. Video Project 9 loops at low volume, quiz center

export class QuizFlowEngine {
  phase = $state<QuizFlowPhase>('loading');

  video1 = $state<HTMLVideoElement>();
  video2 = $state<HTMLVideoElement>();
  bgm   = $state<HTMLAudioElement>();   // the kizu BGM — set from dialogue-scenes

  // Start Video 1 — stop BGM first
  startVideo1() {
    // 1. Fade out & stop the kizu BGM
    if (this.bgm) {
      this.bgm.pause();
      this.bgm.currentTime = 0;
    }

    this.phase = 'video-1';

    if (this.video1) {
      this.video1.muted = false;
      this.video1.volume = 1.0;
      this.video1.loop = false;
      this.video1.currentTime = 0;
      this.video1.play().catch(() => {
        // Some browsers block unmuted autoplay — we already have user gesture here
      });
    }
  }

  onVideo1Ended() {
    if (this.video1) this.video1.pause();
    this.phase = 'ready-prompt';
  }

  // Start Video 9 fullscreen with full audio
  startVideo9() {
    this.phase = 'video-9';
    if (this.video2) {
      this.video2.muted = false;
      this.video2.volume = 1.0;
      this.video2.loop = false;
      this.video2.currentTime = 0;
      this.video2.play().catch(() => {});
    }
  }

  // Video 9 ends → quiz auto-starts, video 9 loops at reduced volume
  onVideo9Ended() {
    this.phase = 'quiz-active';
    if (this.video2) {
      this.video2.loop = true;
      this.video2.currentTime = 0;
      this.video2.muted = false;
      // Fade volume down gracefully for quiz background
      this.#fadeVolume(this.video2, 1.0, 0.25, 1500);
      this.video2.play().catch(() => {});
    }
  }

  // Simple linear volume fade
  #fadeVolume(el: HTMLVideoElement | HTMLAudioElement, from: number, to: number, durationMs: number) {
    const steps = 30;
    const stepTime = durationMs / steps;
    const delta = (to - from) / steps;
    let current = from;
    el.volume = from;
    const id = setInterval(() => {
      current += delta;
      el.volume = Math.max(0, Math.min(1, current));
      if ((delta > 0 && current >= to) || (delta < 0 && current <= to)) {
        el.volume = to;
        clearInterval(id);
      }
    }, stepTime);
  }
}

export const quizFlow = new QuizFlowEngine();
