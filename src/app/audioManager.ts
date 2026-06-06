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
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.45, ctx.currentTime);

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

      carrier.type = 'sine';
      carrier.frequency.setValueAtTime(freq, time);

      // Overtones for metallic ring (inharmonic for Gamelan, harmonic for Rindik)
      const isRindik = inst === 'rindik';
      const partials = isRindik ? [2.0, 3.0, 4.0] : [2.01, 2.76, 5.4];
      const partialGains = isRindik ? [0.3, 0.1, 0.05] : [0.4, 0.2, 0.1];

      gainNode.gain.setValueAtTime(0.0, time);
      gainNode.gain.linearRampToValueAtTime(0.18, time + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration * 1.5);

      carrier.connect(gainNode);

      const oscillators = [carrier];

      partials.forEach((ratio, i) => {
        const partial = ctx.createOscillator();
        const pGain = ctx.createGain();
        partial.type = isRindik ? 'triangle' : 'sine';
        partial.frequency.setValueAtTime(freq * ratio, time);
        
        pGain.gain.setValueAtTime(0, time);
        pGain.gain.linearRampToValueAtTime(0.12 * partialGains[i], time + 0.004);
        pGain.gain.exponentialRampToValueAtTime(0.001, time + duration * (1.2 - i * 0.2));

        partial.connect(pGain);
        pGain.connect(gainNode);
        oscillators.push(partial);
      });

      gainNode.connect(destination);

      oscillators.forEach(osc => {
        osc.start(time);
        osc.stop(time + duration * 2.0);
      });

    } else if (inst === 'suling') {
      // Gentle woodwind: Sine + lowpass-filtered breath noise + vibrato LFO
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      // Vibrato (pitch modulation)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(5.5, time); // 5.5 Hz vibrato
      lfoGain.gain.setValueAtTime(freq * 0.012, time);

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      // Breath noise component
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0, time);
      noiseGain.gain.linearRampToValueAtTime(0.012, time + 0.15);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(freq * 1.5, time);
      noiseFilter.Q.setValueAtTime(5, time);

      // White Noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      // Amplitude Envelope
      gainNode.gain.setValueAtTime(0.0, time);
      gainNode.gain.linearRampToValueAtTime(0.15, time + 0.12); // Soft woodwind attack
      gainNode.gain.setValueAtTime(0.15, time + duration - 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration + 0.1);

      osc.connect(gainNode);
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(gainNode);

      gainNode.connect(destination);

      lfo.start(time);
      osc.start(time);
      noise.start(time);

      lfo.stop(time + duration + 0.2);
      osc.stop(time + duration + 0.2);
      noise.stop(time + duration + 0.2);

    } else if (inst === 'sasando') {
      // Plucked harp string: sharp attack, rich partials, quick decay transient
      const osc = ctx.createOscillator();
      const pluck = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      pluck.type = 'sine';
      pluck.frequency.setValueAtTime(freq * 5.0, time); // Ringing high transient

      const pluckGain = ctx.createGain();
      pluckGain.gain.setValueAtTime(0.08, time);
      pluckGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05); // Rapid snap

      gainNode.gain.setValueAtTime(0.0, time);
      gainNode.gain.linearRampToValueAtTime(0.2, time + 0.004);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration * 1.8);

      osc.connect(gainNode);
      pluck.connect(pluckGain);
      pluckGain.connect(gainNode);

      gainNode.connect(destination);

      osc.start(time);
      pluck.start(time);

      osc.stop(time + duration * 2.0);
      pluck.stop(time + 0.1);

    } else if (inst === 'angklung') {
      // Angklung: rattling bamboo frames. We simulate with 4 rapid wood rattle strikes
      const numStrikes = 4;
      const strikeInterval = 0.045; // 45ms rattle clicks
      
      const masterStrikeGain = ctx.createGain();
      masterStrikeGain.gain.setValueAtTime(1.0, time);
      masterStrikeGain.connect(destination);

      for (let i = 0; i < numStrikes; i++) {
        const strikeTime = time + i * strikeInterval;
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        const clickFilter = ctx.createBiquadFilter();

        // Rattle envelope
        clickGain.gain.setValueAtTime(0, strikeTime);
        clickGain.gain.linearRampToValueAtTime(0.09 / (i + 1), strikeTime + 0.002);
        clickGain.gain.exponentialRampToValueAtTime(0.001, strikeTime + 0.035);

        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(freq * (1.0 + Math.random() * 0.05), strikeTime);

        clickFilter.type = 'bandpass';
        clickFilter.frequency.setValueAtTime(freq * 2.0, strikeTime);
        clickFilter.Q.setValueAtTime(10, strikeTime);

        clickOsc.connect(clickFilter);
        clickFilter.connect(clickGain);
        clickGain.connect(masterStrikeGain);

        clickOsc.start(strikeTime);
        clickOsc.stop(strikeTime + 0.05);
      }

    } else if (inst === 'tifa') {
      // Tifa Drum: Deep hand drum hit with rapid pitch glide downwards
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      // Pitch sweep: starts higher, glides down rapidly to hit skin resonance
      osc.frequency.setValueAtTime(freq * 1.5, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, time + 0.08);

      gainNode.gain.setValueAtTime(0.0, time);
      gainNode.gain.linearRampToValueAtTime(0.25, time + 0.002);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.8);

      // Add high slap transient (filtered noise burst)
      const slapGain = ctx.createGain();
      slapGain.gain.setValueAtTime(0.12, time);
      slapGain.gain.exponentialRampToValueAtTime(0.001, time + 0.015);

      const slapFilter = ctx.createBiquadFilter();
      slapFilter.type = 'highpass';
      slapFilter.frequency.setValueAtTime(1000, time);

      // Noise source
      const bufferSize = ctx.sampleRate * 0.05; // 50ms buffer
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const slapNoise = ctx.createBufferSource();
      slapNoise.buffer = noiseBuffer;

      slapNoise.connect(slapFilter);
      slapFilter.connect(slapGain);
      slapGain.connect(gainNode);

      osc.connect(gainNode);
      gainNode.connect(destination);

      osc.start(time);
      slapNoise.start(time);

      osc.stop(time + duration);
      slapNoise.stop(time + 0.06);
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
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0.0 : 0.45, now, 0.1);
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
    const targetMasterVolume = this.isMuted ? 0.0 : 0.45 * zoomPct;

    this.masterGain.gain.setTargetAtTime(targetMasterVolume, now, 0.1);
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    const now = this.audioCtx ? this.audioCtx.currentTime : 0;
    
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0.0 : 0.45, now, 0.1);
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
