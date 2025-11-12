/**
 * Radio Player Component - Original Design
 */

import React, { memo, useEffect, useState, useCallback, useRef } from 'react';
import { storage } from '../utils/storage';
import type { RadioPlayerProps } from '../types';

const VolumeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const RadioPlayer: React.FC<RadioPlayerProps> = memo(({
  src,
  title = 'Mein Studentenmädchen',
  subtitle = '432Hz, Tag- und Nacht-Version'
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(() => storage.get('radio-volume', 2));
  const totalPlayTimeRef = useRef(0);
  const [playedHours, setPlayedHours] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume / 100;

    const startTimer = () => {
      if (intervalRef.current) return;
      intervalRef.current = window.setInterval(() => {
        totalPlayTimeRef.current += 1;
        const currentHours = Math.floor(totalPlayTimeRef.current / 3600);
        setPlayedHours(prevPlayedHours => {
          if (currentHours > prevPlayedHours) {
            return currentHours;
          }
          return prevPlayedHours;
        });
      }, 1000);
    };

    const stopTimer = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    audio.addEventListener('play', startTimer);
    audio.addEventListener('pause', stopTimer);

    const attemptPlay = () => {
      audio.play().catch(error => {
        console.warn("Autoplay was prevented. Waiting for user interaction to start playback.", error);

        const onInteraction = () => {
          attemptPlay();
        };

        document.addEventListener('click', onInteraction, { once: true });
        document.addEventListener('touchstart', onInteraction, { once: true });
      });
    };

    attemptPlay();

    return () => {
      stopTimer();
      audio.removeEventListener('play', startTimer);
      audio.removeEventListener('pause', stopTimer);
    };
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    storage.set('radio-volume', newVolume);
  }, []);

  return (
    <div className="rounded-2xl shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-brand-orange/40 overflow-hidden">
      <div className="p-6 space-y-4">
        <audio ref={audioRef} src={src} loop preload="auto" />

        <div className="text-center">
          <h2 className="text-2xl font-medium text-orange-400 tracking-wide">{title}</h2>
          <p className="text-lg font-light text-orange-300/90 tracking-wide">{subtitle}</p>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <VolumeIcon className="w-9 h-9 text-orange-400" />
          <input
            type="range"
            min="1"
            max="40"
            value={volume}
            onChange={handleVolumeChange}
            className="w-2/3"
            aria-label="Lautstärkeregler"
          />
          <span className="text-sm text-orange-400 w-10 text-right">{volume}%</span>
          <div className="flex-grow" />
          <div className="flex items-center space-x-1.5 text-sm text-orange-400">
            <ClockIcon className="w-10 h-10" />
            <span className="font-medium">{playedHours} h</span>
          </div>
        </div>
      </div>
    </div>
  );
});

RadioPlayer.displayName = 'RadioPlayer';
