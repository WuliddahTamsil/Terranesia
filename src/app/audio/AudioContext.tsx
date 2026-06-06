import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { audioManager } from '../audioManager';

interface AudioContextProps {
  isPlaying: boolean;
  isMuted: boolean;
  activeSongKey: string;
  analyserNode: AnalyserNode | null;
  togglePlay: () => void;
  toggleMute: () => void;
  playTribeMusic: (region: string, coords: [number, number]) => void;
  stopTribeMusic: () => void;
  updateSpatialAudio: (mapCenter: [number, number], zoom: number) => void;
  playSynthNote: (instrument: string, noteName: string) => void;
  unlockAudio: () => void;
}

const AudioContext = createContext<AudioContextProps | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(audioManager.getPlaybackState().isMuted);
  const [activeSongKey, setActiveSongKey] = useState('general');
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  
  // Track active tribe location coordinates for spatial panner updating
  const activeTribeCoordsRef = useRef<[number, number] | null>(null);

  // Sync state with singleton manager
  const syncStates = () => {
    const state = audioManager.getPlaybackState();
    setIsPlaying(state.isPlaying);
    setIsMuted(state.isMuted);
    setActiveSongKey(state.activeSongKey);
    setAnalyserNode(state.analyser);
  };

  const unlockAudio = () => {
    // Resume context if suspended
    audioManager.start().then(() => {
      syncStates();
    }).catch(e => {
      console.warn("Error unlocking AudioContext:", e);
    });
  };

  const togglePlay = () => {
    const state = audioManager.getPlaybackState();
    if (state.isPlaying) {
      audioManager.stop();
    } else {
      audioManager.start().then(() => {
        // Spatial coordinate update if there's an active tribe selected
        if (activeTribeCoordsRef.current) {
          // Trigger spatial mapping immediately
          audioManager.updatePanning(
            activeTribeCoordsRef.current,
            [-2.5489, 118.0149], // Fallback center
            5
          );
        }
      });
    }
    syncStates();
  };

  const toggleMute = () => {
    audioManager.toggleMute();
    syncStates();
  };

  const playTribeMusic = (region: string, coords: [number, number]) => {
    activeTribeCoordsRef.current = coords;
    
    // Map regions to defined song keys
    let songKey = 'general';
    const lowerRegion = region.toLowerCase();
    if (lowerRegion.includes('jawa')) songKey = 'jawa';
    else if (lowerRegion.includes('bali')) songKey = 'bali';
    else if (lowerRegion.includes('nusa') || lowerRegion.includes('tenggara')) songKey = 'nusatenggara';
    else if (lowerRegion.includes('papua')) songKey = 'papua';
    else if (lowerRegion.includes('sumatera') || lowerRegion.includes('sumatra')) songKey = 'sumatera';
    else if (lowerRegion.includes('sulawesi')) songKey = 'sulawesi';

    // Transition to the target song
    audioManager.fadeToSong(songKey);
    syncStates();
  };

  const stopTribeMusic = () => {
    activeTribeCoordsRef.current = null;
    audioManager.fadeToSong('general');
    audioManager.updatePanning(null, [0, 0], 5); // Reset panning/volume to center/max
    syncStates();
  };

  const updateSpatialAudio = (mapCenter: [number, number], zoom: number) => {
    if (activeTribeCoordsRef.current) {
      audioManager.updatePanning(activeTribeCoordsRef.current, mapCenter, zoom);
    } else {
      audioManager.updatePanning(null, mapCenter, zoom);
    }
  };

  const playSynthNote = (instrument: string, noteName: string) => {
    audioManager.triggerPlayroomSound(instrument, noteName);
  };

  // Ensure cleanup on unmount
  useEffect(() => {
    return () => {
      audioManager.stop();
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isMuted,
        activeSongKey,
        analyserNode,
        togglePlay,
        toggleMute,
        playTribeMusic,
        stopTribeMusic,
        updateSpatialAudio,
        playSynthNote,
        unlockAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
