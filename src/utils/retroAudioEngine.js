// ============================================================================
// RETRO COMPUTING WEB AUDIO CHIPTUNE & SYNTH ENGINE
// Authentic, audible 80s analog synth with chords, bass pulse & arpeggiator
// Zero external files needed — 100% reliable, zero network latency
// ============================================================================

class RetroAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.filter = null;
    this.isPlaying = false;
    this.currentTrackIndex = 0;
    this.loopTimer = null;
    this.arpTimer = null;
    this.activeNodes = [];
    this.isMuted = false;
    this.volume = 0.38; // Clearly audible volume
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();

    // Warm Analog Low-Pass Filter
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(2200, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

    this.filter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  // Tactile vintage mechanical key click / beep
  playBeep(freq = 640, duration = 0.06) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  // Play continuous 80s retro synth track
  playTrack(trackIndex = 0) {
    this.ensureContext();
    if (!this.ctx) return;

    this.stopTrack();
    this.currentTrackIndex = trackIndex;
    this.isPlaying = true;

    // 3 Unique Retro Musical Themes
    const tracks = [
      // Track 0: "amber terminal" — Warm nostalgic D minor retro synthwave
      {
        rootBpm: 96,
        chords: [
          { bass: 73.42, notes: [146.83, 220.00, 261.63, 329.63] }, // Dm9
          { bass: 58.27, notes: [116.54, 174.61, 220.00, 261.63] }, // Bbmaj7
          { bass: 87.31, notes: [174.61, 220.00, 261.63, 329.63] }, // Fmaj7
          { bass: 65.41, notes: [130.81, 196.00, 246.94, 293.66] }, // Cadd9
        ],
        arpNotes: [220.00, 261.63, 329.63, 440.00, 329.63, 261.63, 220.00, 174.61],
      },
      // Track 1: "analog frequency" — Uplifting 80s arcade arpeggio
      {
        rootBpm: 110,
        chords: [
          { bass: 55.00, notes: [220.00, 261.63, 329.63, 392.00] }, // Am7
          { bass: 43.65, notes: [174.61, 220.00, 261.63, 349.23] }, // Fmaj7
          { bass: 49.00, notes: [196.00, 246.94, 293.66, 392.00] }, // G
          { bass: 41.20, notes: [164.81, 196.00, 246.94, 329.63] }, // Em7
        ],
        arpNotes: [329.63, 392.00, 440.00, 523.25, 440.00, 392.00, 329.63, 261.63],
      },
      // Track 2: "phosphor dreams" — Deep moody Blade Runner cyberpunk ambient
      {
        rootBpm: 84,
        chords: [
          { bass: 65.41, notes: [130.81, 196.00, 233.08, 293.66] }, // Cm9
          { bass: 51.91, notes: [103.83, 155.56, 207.65, 261.63] }, // Abmaj7
          { bass: 77.78, notes: [155.56, 196.00, 233.08, 311.13] }, // Ebmaj7
          { bass: 58.27, notes: [116.54, 174.61, 233.08, 293.66] }, // Bb
        ],
        arpNotes: [196.00, 233.08, 293.66, 392.00, 311.13, 293.66, 233.08, 196.00],
      },
    ];

    const currentTrack = tracks[trackIndex % tracks.length];
    let chordIdx = 0;
    let arpStep = 0;

    const chordDuration = 3.6; // Seconds per chord

    // Play Chord + Bass layer
    const playChordLayer = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const chord = currentTrack.chords[chordIdx % currentTrack.chords.length];
      chordIdx++;

      // 1. Deep Analog Sub-Bass Note
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(chord.bass, now);
      bassGain.gain.setValueAtTime(0.001, now);
      bassGain.gain.linearRampToValueAtTime(0.18, now + 0.15);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + chordDuration - 0.1);

      bassOsc.connect(bassGain);
      bassGain.connect(this.filter);
      bassOsc.start(now);
      bassOsc.stop(now + chordDuration);
      this.activeNodes.push(bassOsc);

      // 2. Polyphonic Analog Synth Pad
      chord.notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // Warm blend of sawtooth and sine for authentic 80s synthesizer brass
        osc.type = i % 2 === 0 ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Subtle analog tape chorus detune
        const detune = (i - 1.5) * 4;
        osc.detune.setValueAtTime(detune, now);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.09, now + 0.6);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + chordDuration - 0.05);

        osc.connect(noteGain);
        noteGain.connect(this.filter);
        osc.start(now);
        osc.stop(now + chordDuration);
        this.activeNodes.push(osc);
      });
    };

    // Play Rhythmic Arpeggiator note
    const playArpNote = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const freq = currentTrack.arpNotes[arpStep % currentTrack.arpNotes.length];
      arpStep++;

      const arpOsc = this.ctx.createOscillator();
      const arpGain = this.ctx.createGain();

      arpOsc.type = 'square';
      arpOsc.frequency.setValueAtTime(freq, now);

      // Quick 80s plucky envelope
      arpGain.gain.setValueAtTime(0.045, now);
      arpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      arpOsc.connect(arpGain);
      arpGain.connect(this.filter);

      arpOsc.start(now);
      arpOsc.stop(now + 0.2);
      this.activeNodes.push(arpOsc);
    };

    // Trigger initial chord & arp
    playChordLayer();
    playArpNote();

    // Intervals
    this.loopTimer = setInterval(playChordLayer, chordDuration * 1000 - 50);
    this.arpTimer = setInterval(playArpNote, (60 / currentTrack.rootBpm / 2) * 1000);
  }

  stopTrack() {
    this.isPlaying = false;
    if (this.loopTimer) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    if (this.arpTimer) {
      clearInterval(this.arpTimer);
      this.arpTimer = null;
    }
    this.activeNodes.forEach((node) => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
  }
}

export const retroAudio = new RetroAudioEngine();
