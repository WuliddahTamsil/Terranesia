// Traditional Indonesian Music Synthesizer & Audio Manager
// Built using Web Audio API for zero-latency, zero-dependency, procedural audio.

export interface Note {
  pitch: string;
  duration: number; // in beats
}

const NOTES: Record<string, number> = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50, REST: 0
};

// Song Melodies
export const TRADITIONAL_SONGS: Record<string, { name: string; bpm: number; instrument: string; melody: Note[] }> = {
  general: {
    name: 'Terranesia Ambient',
    bpm: 65,
    instrument: 'suling',
    melody: [
      { pitch: 'C4', duration: 2 }, { pitch: 'E4', duration: 2 }, { pitch: 'G4', duration: 4 },
      { pitch: 'A4', duration: 2 }, { pitch: 'G4', duration: 2 }, { pitch: 'E4', duration: 4 },
      { pitch: 'D4', duration: 2 }, { pitch: 'E4', duration: 2 }, { pitch: 'C4', duration: 4 },
      { pitch: 'REST', duration: 2 }, { pitch: 'G4', duration: 2 }, { pitch: 'C5', duration: 4 },
      { pitch: 'B4', duration: 2 }, { pitch: 'A4', duration: 2 }, { pitch: 'G4', duration: 4 }
    ]
  },
  jawa: {
    name: 'Lir Ilir',
    bpm: 90,
    instrument: 'gamelan',
    melody: [
      { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'A4', duration: 1 },
      { pitch: 'A4', duration: 0.5 }, { pitch: 'G4', duration: 0.5 }, { pitch: 'E4', duration: 0.5 }, { pitch: 'D4', duration: 0.5 },
      { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2 },
      { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'A4', duration: 1 },
      { pitch: 'A4', duration: 0.5 }, { pitch: 'G4', duration: 0.5 }, { pitch: 'E4', duration: 0.5 }, { pitch: 'D4', duration: 0.5 },
      { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2 },
      { pitch: 'D4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 1 }, { pitch: 'C4', duration: 2 },
      { pitch: 'C4', duration: 1 }, { pitch: 'D4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2 }
    ]
  },
  bali: {
    name: 'Janger / Rindik Bali',
    bpm: 120,
    instrument: 'rindik',
    melody: [
      { pitch: 'A4', duration: 0.5 }, { pitch: 'C5', duration: 0.5 }, { pitch: 'D5', duration: 0.5 }, { pitch: 'E5', duration: 0.5 },
      { pitch: 'D5', duration: 0.5 }, { pitch: 'C5', duration: 0.5 }, { pitch: 'A4', duration: 1 },
      { pitch: 'A4', duration: 0.5 }, { pitch: 'C5', duration: 0.5 }, { pitch: 'D5', duration: 0.5 }, { pitch: 'E5', duration: 0.5 },
      { pitch: 'D5', duration: 0.5 }, { pitch: 'C5', duration: 0.5 }, { pitch: 'A4', duration: 1 },
      { pitch: 'E5', duration: 0.5 }, { pitch: 'E5', duration: 0.5 }, { pitch: 'D5', duration: 0.5 }, { pitch: 'C5', duration: 0.5 },
      { pitch: 'D5', duration: 0.5 }, { pitch: 'D5', duration: 0.5 }, { pitch: 'C5', duration: 0.5 }, { pitch: 'A4', duration: 0.5 }
    ]
  },
  nusatenggara: {
    name: 'Bolelebo',
    bpm: 80,
    instrument: 'sasando',
    melody: [
      { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'F4', duration: 0.5 }, { pitch: 'G4', duration: 0.5 },
      { pitch: 'C5', duration: 1 }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 2 },
      { pitch: 'F4', duration: 1 }, { pitch: 'D4', duration: 1 }, { pitch: 'E4', duration: 0.5 }, { pitch: 'F4', duration: 0.5 },
      { pitch: 'B4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'C5', duration: 2 }
    ]
  },
  papua: {
    name: 'Apuse',
    bpm: 100,
    instrument: 'tifa',
    melody: [
      { pitch: 'C4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 2 },
      { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'F4', duration: 1 }, { pitch: 'E4', duration: 1 },
      { pitch: 'D4', duration: 2 }, { pitch: 'REST', duration: 1 },
      { pitch: 'D4', duration: 1 }, { pitch: 'F4', duration: 1 }, { pitch: 'A4', duration: 2 },
      { pitch: 'B4', duration: 1 }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'F4', duration: 1 },
      { pitch: 'E4', duration: 2 }, { pitch: 'REST', duration: 1 }
    ]
  },
  sumatera: {
    name: 'Kampung Nan Jauh Di Mato',
    bpm: 105,
    instrument: 'angklung',
    melody: [
      { pitch: 'C4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 2 },
      { pitch: 'C5', duration: 1 }, { pitch: 'C5', duration: 1 }, { pitch: 'B4', duration: 1 }, { pitch: 'A4', duration: 1 },
      { pitch: 'G4', duration: 2 }, { pitch: 'REST', duration: 1 },
      { pitch: 'F4', duration: 1 }, { pitch: 'A4', duration: 1 }, { pitch: 'C5', duration: 2 },
      { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'F4', duration: 1 }, { pitch: 'E4', duration: 1 },
      { pitch: 'D4', duration: 2 }, { pitch: 'REST', duration: 1 }
    ]
  },
  sulawesi: {
    name: 'Anging Mammiri',
    bpm: 75,
    instrument: 'suling',
    melody: [
      { pitch: 'C4', duration: 1.5 }, { pitch: 'F4', duration: 0.5 }, { pitch: 'G4', duration: 1 }, { pitch: 'A4', duration: 1 },
      { pitch: 'C5', duration: 1 }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 2 },
      { pitch: 'A4', duration: 1 }, { pitch: 'C5', duration: 1 }, { pitch: 'D5', duration: 1.5 }, { pitch: 'C5', duration: 0.5 },
      { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'F4', duration: 2 }
    ]
  }
};

export class AudioManager {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private tribeGain: GainNode | null = null;
  private pannerNode: StereoPannerNode | null = null;
  private analyser: AnalyserNode | null = null;

  private isMuted: boolean = false;
  private isPlaying: boolean = false;
  private activeSongKey: string = 'general';

  // Scheduling states
  private schedulerInterval: any = null;
  private currentBeatIndex: number = 0;
  private nextNoteTime: number = 0;
  private tempoBpm: number = 70;
  private noteQueue: Note[] = [];
  private activeDroneOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];

  constructor() {
    // Lazily initialized upon user gesture
    if (typeof window !== 'undefined') {
      try {
        const savedMute = localStorage.getItem('terranesia_audio_muted');
        this.isMuted = savedMute === 'true';
      } catch (e) {}
    }
  }

  // Lazy initializer to bypass autoplay policies
  private initContext() {
    if (this.audioCtx) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    this.audioCtx = ctx;

    // Master chain setup
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, ctx.currentTime);

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 128; // Compact size for clean wave visuals

    this.pannerNode = ctx.createStereoPanner();
    this.pannerNode.pan.setValueAtTime(0, ctx.currentTime);

    // Submix chains
    this.bgmGain = ctx.createGain();
    this.bgmGain.gain.setValueAtTime(1.0, ctx.currentTime);

    this.tribeGain = ctx.createGain();
    this.tribeGain.gain.setValueAtTime(0.0, ctx.currentTime); // Default silent

    // Route: BGM / Tribe -> Panner -> Analyser -> Master -> Output
    this.bgmGain.connect(this.pannerNode);
    this.tribeGain.connect(this.pannerNode);
    this.pannerNode.connect(this.analyser);
    this.analyser.connect(this.masterGain);
    this.masterGain.connect(ctx.destination);
  }

  public async start() {
    this.initContext();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    if (this.isPlaying) return;

    this.isPlaying = true;
    this.nextNoteTime = this.audioCtx.currentTime + 0.1;
    this.currentBeatIndex = 0;
    this.loadSong(this.activeSongKey);

    // Trigger ambient background drone chord
    this.triggerDrone(this.activeSongKey);

    // Note Scheduler Loop (running every 100ms with a 250ms lookahead window)
    this.schedulerInterval = setInterval(() => {
      this.schedulerLoop();
    }, 100);
  }

  public stop() {
    this.isPlaying = false;
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = null;
    }
    this.stopDrone();
  }

  private loadSong(key: string) {
    const song = TRADITIONAL_SONGS[key] || TRADITIONAL_SONGS.general;
    this.tempoBpm = song.bpm;
    this.noteQueue = song.melody;
  }

  private schedulerLoop() {
    if (!this.audioCtx || !this.isPlaying) return;

    const lookahead = 0.25; // 250ms ahead
    const secondsPerBeat = 60.0 / this.tempoBpm;

    while (this.nextNoteTime < this.audioCtx.currentTime + lookahead) {
      const note = this.noteQueue[this.currentBeatIndex];
      if (note) {
        this.playScheduledNote(note, this.nextNoteTime);
        this.nextNoteTime += note.duration * secondsPerBeat;
      } else {
        this.nextNoteTime += 1.0 * secondsPerBeat; // Fallback
      }

      this.currentBeatIndex++;
      if (this.currentBeatIndex >= this.noteQueue.length) {
        this.currentBeatIndex = 0; // Loop melody
      }
    }
  }

  private playScheduledNote(note: Note, time: number) {
    if (!this.audioCtx) return;
    const freq = NOTES[note.pitch] || 0;
    if (freq === 0) return; // Rest note

    const song = TRADITIONAL_SONGS[this.activeSongKey] || TRADITIONAL_SONGS.general;
    const isTribeNode = this.activeSongKey !== 'general';
    const targetGainNode = isTribeNode ? this.tribeGain : this.bgmGain;

    if (!targetGainNode) return;

    const secondsPerBeat = 60.0 / this.tempoBpm;
    const durationSec = note.duration * secondsPerBeat;

    this.synthesizeInstrument(song.instrument, freq, durationSec, time, targetGainNode);
  }

  private triggerDrone(songKey: string) {
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const fadeTime = 2.0;

    // Fade out active drones
    this.activeDroneOscillators.forEach(d => {
      try {
        d.gain.gain.setValueAtTime(d.gain.gain.value, now);
        d.gain.gain.linearRampToValueAtTime(0.0, now + fadeTime);
        d.osc.stop(now + fadeTime + 0.1);
      } catch (e) {}
    });
    this.activeDroneOscillators = [];

    // Define drone chords for each song (warm, low, pleasant pad chords)
    const DRONE_CHORDS: Record<string, number[]> = {
      general: [130.81, 196.00, 261.63, 329.63], // C3, G3, C4, E4
      jawa: [164.81, 246.94, 329.63, 392.00],    // E3, B3, E4, G4
      bali: [110.00, 220.00, 261.63, 329.63],    // A2, A3, C4, E4
      nusatenggara: [130.81, 174.61, 261.63, 349.23], // C3, F3, C4, F4
      papua: [130.81, 196.00, 261.63, 329.63],   // C3, G3, C4, E4
      sumatera: [130.81, 196.00, 261.63, 329.63], // C3, G3, C4, E4
      sulawesi: [174.61, 220.00, 349.23, 440.00]  // F3, A3, F4, A4
    };

    const freqs = DRONE_CHORDS[songKey] || DRONE_CHORDS.general;
    const isTribe = songKey !== 'general';
    const destination = isTribe ? this.tribeGain : this.bgmGain;

    if (!destination) return;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, now);

      const noteGain = 0.035 / (idx + 1); // Very soft volume
      
      gainNode.gain.setValueAtTime(0.0, now);
      gainNode.gain.linearRampToValueAtTime(noteGain, now + fadeTime);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(destination);

      osc.start(now);
      this.activeDroneOscillators.push({ osc, gain: gainNode });
    });
  }

  private stopDrone() {
    const now = this.audioCtx ? this.audioCtx.currentTime : 0;
    this.activeDroneOscillators.forEach(d => {
      try {
        d.gain.gain.setValueAtTime(d.gain.gain.value, now);
        d.gain.gain.linearRampToValueAtTime(0.0, now + 0.5);
        d.osc.stop(now + 0.6);
      } catch (e) {}
    });
    this.activeDroneOscillators = [];
  }

  // Procedural Instrument Synthesizer
  public synthesizeInstrument(
    inst: string,
    freq: number,
    duration: number,
    time: number,
    destination: AudioNode
  ) {
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;

    if (inst === 'gamelan' || inst === 'rindik') {
      // FM / Additive synthesis mimicking bronze / bamboo resonant chime bars
      const carrier = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      carrier.type = 'sine';
      carrier.frequency.setValueAtTime(freq, time);

      const isRindik = inst === 'rindik';
      const partials = isRindik ? [2.0, 3.0, 4.0] : [2.0, 3.0, 4.0];
      const partialGains = isRindik ? [0.12, 0.06, 0.02] : [0.1, 0.05, 0.01];

      // Smooth envelope to avoid clicks
      gainNode.gain.setValueAtTime(0.0, time);
      gainNode.gain.linearRampToValueAtTime(0.22, time + 0.008);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration * 1.5);

      // Lowpass filter to cut out high-end harshness/spookiness
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isRindik ? 900 : 800, time);

      carrier.connect(filter);

      const oscillators = [carrier];

      partials.forEach((ratio, i) => {
        const partial = ctx.createOscillator();
        const pGain = ctx.createGain();
        partial.type = 'sine';
        partial.frequency.setValueAtTime(freq * ratio, time);
        
        pGain.gain.setValueAtTime(0, time);
        pGain.gain.linearRampToValueAtTime(0.1 * partialGains[i], time + 0.006);
        pGain.gain.exponentialRampToValueAtTime(0.001, time + duration * (1.2 - i * 0.2));

        partial.connect(pGain);
        pGain.connect(filter);
        oscillators.push(partial);
      });

      filter.connect(gainNode);
      gainNode.connect(destination);

      oscillators.forEach(osc => {
        osc.start(time);
        osc.stop(time + duration * 2.2);
      });

    } else if (inst === 'suling') {
      // Gentle woodwind: Sine + soft warm triangle blending (no noisy hiss) + extremely gentle vibrato
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, time);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2.0, time); // Second harmonic adds warmth

      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.015, time); // Very subtle blend of triangle

      // Extremely gentle vibrato (pitch modulation) to sound organic, not scary
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(3.5, time); // Slower, calmer vibrato (3.5 Hz)
      lfoGain.gain.setValueAtTime(freq * 0.001, time); // Extremely subtle (0.1% depth)

      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);

      // Amplitude Envelope (scaled to note duration to avoid overlaps)
      const attackTime = Math.min(0.12, duration * 0.25);
      
      gainNode.gain.setValueAtTime(0.0, time);
      gainNode.gain.linearRampToValueAtTime(0.20, time + attackTime); // Slightly lower gain for smoothness
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration + 0.1);

      // Lowpass filter to ensure sweet, warm tone
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, time);

      osc1.connect(filter);
      osc2.connect(gain2);
      gain2.connect(filter);
      
      filter.connect(gainNode);
      gainNode.connect(destination);

      lfo.start(time);
      osc1.start(time);
      osc2.start(time);

      lfo.stop(time + duration + 0.2);
      osc1.stop(time + duration + 0.2);
      osc2.stop(time + duration + 0.2);

    } else if (inst === 'sasando') {
      // Plucked string: crisp but warm harp tone
      const carrier = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      carrier.type = 'triangle';
      carrier.frequency.setValueAtTime(freq, time);

      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 2.0, time); // Warm octave overtone

      const overtoneGain = ctx.createGain();
      overtoneGain.gain.setValueAtTime(0.015, time);
      overtoneGain.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.8);

      // Envelope with quick pluck attack and long sweet decay
      const attackTime = 0.005;
      gainNode.gain.setValueAtTime(0.0, time);
      gainNode.gain.linearRampToValueAtTime(0.22, time + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration * 1.6);

      // Lowpass filter for warm, sweet nylon string pluck
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, time);

      carrier.connect(filter);
      overtone.connect(overtoneGain);
      overtoneGain.connect(filter);

      filter.connect(gainNode);
      gainNode.connect(destination);

      carrier.start(time);
      overtone.start(time);

      carrier.stop(time + duration * 1.8);
      overtone.stop(time + duration * 1.8);

    } else if (inst === 'angklung') {
      // Angklung: warm shaking bamboo tubes (octave combination with rapid organic tremolo)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Standard angklung tubes are tuned in octaves
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, time);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.0, time);

      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.02, time);

      // Create tremolo LFO (organic bamboo shake at 12Hz)
      const tremoloLfo = ctx.createOscillator();
      const tremoloGain = ctx.createGain();
      
      tremoloLfo.frequency.setValueAtTime(12.0, time); // 12Hz shake
      tremoloGain.gain.setValueAtTime(0.35, time); 

      // Connect LFO to gainNode gain to modulate volume
      const tremoloNode = ctx.createGain();
      tremoloNode.gain.setValueAtTime(0.6, time); // base volume

      tremoloLfo.connect(tremoloGain);
      tremoloGain.connect(tremoloNode.gain);

      // Rattle shake envelope
      gainNode.gain.setValueAtTime(0.0, time);
      gainNode.gain.linearRampToValueAtTime(0.22, time + 0.02); // soft shake attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration * 1.2);

      // Bandpass filter centered at 1.2 * freq to emulate bamboo chamber resonance
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.2, time);
      filter.Q.setValueAtTime(4.0, time);

      osc1.connect(filter);
      osc2.connect(osc2Gain);
      osc2Gain.connect(filter);

      filter.connect(tremoloNode);
      tremoloNode.connect(gainNode);
      gainNode.connect(destination);

      tremoloLfo.start(time);
      osc1.start(time);
      osc2.start(time);

      tremoloLfo.stop(time + duration * 1.4);
      osc1.stop(time + duration * 1.4);
      osc2.stop(time + duration * 1.4);

    } else if (inst === 'tifa') {
      // Pitched Tifa / Log Drum: deep organic wooden percussion that plays the melody pitches
      const osc = ctx.createOscillator();
      const mallet = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Deep membrane body sweep (harmonic relative to the pitch)
      osc.type = 'sine';
      const baseFreq = freq * 0.25; // 2 octaves below melody pitch for sub weight
      osc.frequency.setValueAtTime(Math.max(50, Math.min(180, baseFreq * 1.5)), time);
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, Math.min(100, baseFreq)), time + 0.08);

      // Pitched wooden mallet strike
      mallet.type = 'triangle';
      mallet.frequency.setValueAtTime(freq, time);

      const malletGain = ctx.createGain();
      malletGain.gain.setValueAtTime(0.04, time);
      malletGain.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.3); // rapid decay for woody feel

      // Drum body gain envelope
      gainNode.gain.setValueAtTime(0.0, time);
      gainNode.gain.linearRampToValueAtTime(0.25, time + 0.004);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.8);

      // Warm lowpass filter to remove harsh clicking
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, time);

      osc.connect(filter);
      mallet.connect(malletGain);
      malletGain.connect(filter);
      
      filter.connect(gainNode);
      gainNode.connect(destination);

      osc.start(time);
      mallet.start(time);

      osc.stop(time + duration);
      mallet.stop(time + duration);
    }
  }

  // Cross-fade between general background BGM and specific tribe regional BGM
  public fadeToSong(songKey: string) {
    this.initContext();
    if (!this.audioCtx || !this.bgmGain || !this.tribeGain) return;

    this.activeSongKey = songKey;
    const isTribe = songKey !== 'general';
    const now = this.audioCtx.currentTime;
    const fadeDuration = 1.2; // 1.2s smooth fading cross-overs

    if (isTribe) {
      // Fade OUT general BGM, Fade IN tribe song
      this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, now);
      this.bgmGain.gain.linearRampToValueAtTime(0.0, now + fadeDuration);

      this.tribeGain.gain.setValueAtTime(this.tribeGain.gain.value, now);
      this.tribeGain.gain.linearRampToValueAtTime(1.0, now + fadeDuration);
    } else {
      // Fade IN general BGM, Fade OUT tribe song
      this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, now);
      this.bgmGain.gain.linearRampToValueAtTime(1.0, now + fadeDuration);

      this.tribeGain.gain.setValueAtTime(this.tribeGain.gain.value, now);
      this.tribeGain.gain.linearRampToValueAtTime(0.0, now + fadeDuration);
    }

    // Load new notes and restart beat scheduler immediately
    this.currentBeatIndex = 0;
    this.loadSong(songKey);
    this.triggerDrone(songKey);
    this.nextNoteTime = this.audioCtx.currentTime + 0.1;
  }

  // Spatial audio panning and zoom scale updating
  public updatePanning(coords: [number, number] | null, mapCenter: [number, number], zoom: number) {
    this.initContext();
    if (!this.audioCtx || !this.pannerNode || !this.masterGain) return;

    const now = this.audioCtx.currentTime;

    if (!coords) {
      // Reset panning and volume to full
      this.pannerNode.pan.setTargetAtTime(0.0, now, 0.1);
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0.0 : 0.8, now, 0.1);
      return;
    }

    // 1. Calculate Horizontal Panning (Stereo)
    // Compare longitude coordinates: target relative to current center
    const dLng = coords[1] - mapCenter[1];
    
    // Normalize panning between -1.0 (Left) and 1.0 (Right)
    const panFactor = Math.max(-1.0, Math.min(1.0, dLng * 0.12)); 
    this.pannerNode.pan.setTargetAtTime(panFactor, now, 0.1);

    // 2. Calculate Zoom Volume Scaling
    // Faint at zoom 5 (15% volume), Full at zoom 12+ (100% volume)
    const zoomPct = Math.max(0.15, Math.min(1.0, (zoom - 4) / 8.0));
    const targetMasterVolume = this.isMuted ? 0.0 : 0.8 * zoomPct;

    this.masterGain.gain.setTargetAtTime(targetMasterVolume, now, 0.1);
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    const now = this.audioCtx ? this.audioCtx.currentTime : 0;
    
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0.0 : 0.8, now, 0.1);
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('terranesia_audio_muted', this.isMuted ? 'true' : 'false');
      } catch (e) {}
    }
  }

  public getPlaybackState() {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      activeSongKey: this.activeSongKey,
      analyser: this.analyser
    };
  }

  // Playroom node trigger
  public triggerPlayroomSound(inst: string, noteName: string) {
    this.initContext();
    if (!this.audioCtx) return;

    // Direct immediate synthesis
    const now = this.audioCtx.currentTime;
    const freq = NOTES[noteName] || NOTES.C4;
    
    // Connect to output destination
    this.synthesizeInstrument(inst, freq, 0.6, now, this.audioCtx.destination);
  }
}

// Singleton export
export const audioManager = new AudioManager();
