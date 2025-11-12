/**
 * Optimized Radio Player Component
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import { VolumeControl } from './VolumeControl';
import { TimeDisplay } from './TimeDisplay';
import { MAX_VOLUME_RADIO } from '../constants';
import { formatHours } from '../utils/formatTime';
import { storage } from '../utils/storage';
import type { RadioPlayerProps } from '../types';

export const RadioPlayer: React.FC<RadioPlayerProps> = memo(({
  src,
  title = 'Mein Studentenmädchen',
  subtitle = '432Hz'
}) => {
  const [volume, setVolume] = useState(() => storage.get('radio-volume', 0.2));
  const [playTime, setPlayTime] = useState(() => storage.get('radio-playtime', 0));
  const [audioElement] = useState(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.autoplay = true;
    return audio;
  });

  // Persist volume changes
  useEffect(() => {
    audioElement.volume = Math.min(volume, MAX_VOLUME_RADIO);
    storage.set('radio-volume', volume);
  }, [volume, audioElement]);

  // Track play time
  useEffect(() => {
    const interval = setInterval(() => {
      if (!audioElement.paused) {
        setPlayTime(prev => {
          const newTime = prev + 1;
          storage.set('radio-playtime', newTime);
          return newTime;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [audioElement]);

  // Handle autoplay restriction
  useEffect(() => {
    const playAudio = () => {
      audioElement.play().catch(error => {
        console.warn('Autoplay prevented, waiting for user interaction:', error);
      });
    };

    // Try to play immediately
    playAudio();

    // Add click listener as fallback
    const handleInteraction = () => {
      playAudio();
      document.removeEventListener('click', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      audioElement.pause();
      audioElement.src = '';
    };
  }, [audioElement]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(Math.min(newVolume, MAX_VOLUME_RADIO));
  }, []);

  const hours = formatHours(playTime);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700/50">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
        <p className="text-orange-500 text-sm">{subtitle}</p>
      </div>

      <div className="space-y-4">
        <VolumeControl
          volume={volume}
          onChange={handleVolumeChange}
          label="Radio volume (max 40%)"
        />
        <TimeDisplay hours={hours} label="Total play time" />
      </div>

      <div className="mt-4 text-xs text-slate-400 text-center">
        Streaming live audio
      </div>
    </div>
  );
});

RadioPlayer.displayName = 'RadioPlayer';
