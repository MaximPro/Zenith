/**
 * Custom hook for audio player functionality
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';

interface UseAudioPlayerOptions {
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
  volumeKey?: string;
  defaultVolume?: number;
}

export const useAudioPlayer = ({
  src,
  autoPlay = false,
  loop = false,
  volumeKey = 'volume',
  defaultVolume = 0.2
}: UseAudioPlayerOptions) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => storage.get(volumeKey, defaultVolume));
  const [error, setError] = useState<Error | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = volume;

    if (autoPlay) {
      audio.autoplay = true;
      audio.play().catch((err) => {
        console.warn('Autoplay prevented:', err);
        setError(err);
      });
    }

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [src, loop, autoPlay]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      storage.set(volumeKey, volume);
    }
  }, [volume, volumeKey]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleError = (e: ErrorEvent) => setError(new Error('Audio playback error'));

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError as EventListener);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError as EventListener);
    };
  }, []);

  const play = useCallback(() => {
    audioRef.current?.play().catch((err) => {
      setError(err);
      console.error('Play failed:', err);
    });
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    error,
    play,
    pause,
    togglePlay,
    seek,
    setVolume
  };
};
