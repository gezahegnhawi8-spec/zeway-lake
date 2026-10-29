// Web Audio API synthesizer for luxury resort bell & alert chimes

class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  // Soft high-end resort service bell (two harmonious sine tones like a Tibetan singing bowl or luxury hotel desk bell)
  playChime() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      
      // Tone 1: High crisp harmonic (C6 ~ 1046 Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.5, now);
      osc1.frequency.exponentialRampToValueAtTime(1040, now + 1.2);

      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);

      // Tone 2: Warm fundamental (G5 ~ 783.99 Hz)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(783.99, now + 0.08);

      gain2.gain.setValueAtTime(0.2, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 1.2);
      osc2.start(now + 0.08);
      osc2.stop(now + 1.6);
    } catch (e) {
      console.warn("Audio chime prevented or unsupported", e);
    }
  }

  // Emergency Alert tone (urgent dual pulse)
  playEmergencyAlert() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      [0, 0.25, 0.5].forEach((offset) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now + offset);
        osc.frequency.linearRampToValueAtTime(440, now + offset + 0.18);

        gain.gain.setValueAtTime(0.2, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.2);
      });
    } catch (e) {
      console.warn("Audio emergency alert prevented or unsupported", e);
    }
  }
}

export const soundFX = new SoundFX();

