/**
 * Audiobook Player Component - Original Design
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import type { AudiobookPlayerProps } from '../types';

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const PrevIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const RepeatOneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 2l4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="M7 22l-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    <polyline points="10.5,11.5 12,10 12,14" strokeWidth="1.25" />
  </svg>
);

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

const formatTime = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds) || timeInSeconds === Infinity) return '00:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const AudiobookPlayer: React.FC<AudiobookPlayerProps> = ({ tracks }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => storage.get('audiobook-track', 0));
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRepeating, setIsRepeating] = useState(() => storage.get('audiobook-repeat', false));
  const [volume, setVolume] = useState(() => storage.get('audiobook-volume', 100));
  const totalPlayTimeRef = useRef(0);
  const [playedHours, setPlayedHours] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<number | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isRepeating;
    }
    storage.set('audiobook-repeat', isRepeating);
  }, [isRepeating]);

  const handleTrackEnd = useCallback(() => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
      setIsPlaying(false);
    } else {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  }, [currentTrackIndex, tracks.length]);

  const handleRewindOrPrev = useCallback(() => {
    if (audioRef.current) {
      if (audioRef.current.currentTime > 3) {
        audioRef.current.currentTime = 0;
      } else {
        const prevIndex = currentTrackIndex - 1;
        if (prevIndex >= 0) {
          setCurrentTrackIndex(prevIndex);
        }
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Playback failed", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
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
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.source;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Playback failed on track change", e);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      if (!isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleTrackEnd);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, [handleTrackEnd]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    storage.set('audiobook-volume', volume);
  }, [volume]);

  useEffect(() => {
    storage.set('audiobook-track', currentTrackIndex);
  }, [currentTrackIndex]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) {
      return;
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: 'Dr. Ryke Geerd Hamer',
      album: 'Mein Studentenmädchen & Das ideale Krankenhaus',
    });

    navigator.mediaSession.setActionHandler('play', handlePlayPause);
    navigator.mediaSession.setActionHandler('pause', handlePlayPause);
    navigator.mediaSession.setActionHandler('previoustrack', handleRewindOrPrev);

    const handleNextTrack = () => {
      if (currentTrackIndex < tracks.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      }
    };

    if (currentTrackIndex < tracks.length - 1) {
      navigator.mediaSession.setActionHandler('nexttrack', handleNextTrack);
    } else {
      navigator.mediaSession.setActionHandler('nexttrack', null);
    }

    return () => {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    }
  }, [currentTrack, handleRewindOrPrev, currentTrackIndex, tracks.length, handlePlayPause]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  const handleToggleRepeat = () => {
    setIsRepeating(prev => !prev);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = Number(e.target.value);
      if (newTime < currentTime) {
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="rounded-2xl shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-brand-orange/40 overflow-hidden">
      <div className="p-6 space-y-4">
        <audio ref={audioRef} preload="metadata" />

        <div className="text-center h-14 flex items-center justify-center">
          <h2 className="text-xl font-medium text-orange-400 tracking-wide">{currentTrack?.title || 'Wählen Sie einen Titel'}</h2>
        </div>

        <div className="flex items-center justify-center space-x-8">
          <button
            onClick={handleRewindOrPrev}
            className="text-orange-400 hover:text-orange-300 transition-colors"
            aria-label="Anfang / Vorheriger Titel"
          >
            <PrevIcon className="w-8 h-8" />
          </button>
          <button
            onClick={handlePlayPause}
            className="text-white bg-brand-orange rounded-full p-4 shadow-lg transform hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-800"
            aria-label={isPlaying ? 'Pause' : 'Wiedergabe'}
          >
            {isPlaying ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10" />}
          </button>
          <button
            onClick={handleToggleRepeat}
            className={`transition-colors ${isRepeating ? 'text-orange-400' : 'text-slate-400 hover:text-slate-300'}`}
            aria-label="Titel wiederholen"
          >
            <RepeatOneIcon className="w-10 h-10" />
          </button>
        </div>

        <div className="space-y-1 pt-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full"
            aria-label="Fortschrittsanzeige"
          />
          <div className="flex justify-between text-sm text-orange-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <VolumeIcon className="w-9 h-9 text-orange-400" />
          <input
            type="range"
            min="0"
            max="100"
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
};

AudiobookPlayer.displayName = 'AudiobookPlayer';
