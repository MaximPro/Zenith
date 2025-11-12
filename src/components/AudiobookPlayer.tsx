/**
 * Optimized Audiobook Player Component
 */

import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { VolumeControl } from './VolumeControl';
import { TimeDisplay } from './TimeDisplay';
import { formatTime, formatHours } from '../utils/formatTime';
import { storage } from '../utils/storage';
import { ARIA_LABELS, MAX_VOLUME_AUDIOBOOK } from '../constants';
import type { AudiobookPlayerProps } from '../types';

// Player control icons
const PlayIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

const PauseIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
  </svg>
);

const PreviousIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M9.195 18.44c1.25.713 2.805-.19 2.805-1.629v-2.34l6.945 3.968c1.25.714 2.805-.188 2.805-1.628V8.688c0-1.44-1.555-2.342-2.805-1.628L12 11.03v-2.34c0-1.44-1.555-2.343-2.805-1.629l-7.108 4.062c-1.26.72-1.26 2.536 0 3.256l7.108 4.061z" />
  </svg>
);

const NextIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v8.123c0 1.44 1.555 2.342 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L14.805 7.06C13.555 6.346 12 7.25 12 8.688v2.34L5.055 7.06z" />
  </svg>
);

const RepeatIcon: React.FC<{ className?: string; active?: boolean }> = ({ className = '', active = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 2} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
  </svg>
);

export const AudiobookPlayer: React.FC<AudiobookPlayerProps> = memo(({
  tracks,
  title = 'Audiobook Player'
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState(() => storage.get('audiobook-track', 0));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => storage.get('audiobook-volume', 0.5));
  const [repeat, setRepeat] = useState(() => storage.get('audiobook-repeat', false));
  const [totalPlayTime, setTotalPlayTime] = useState(() => storage.get('audiobook-playtime', 0));

  // Update Media Session API
  useEffect(() => {
    if ('mediaSession' in navigator && tracks[currentTrack]) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: tracks[currentTrack].title,
        artist: 'Audiobook',
        album: title
      });

      navigator.mediaSession.setActionHandler('play', () => audioRef.current?.play());
      navigator.mediaSession.setActionHandler('pause', () => audioRef.current?.pause());
      navigator.mediaSession.setActionHandler('previoustrack', handlePrevious);
      navigator.mediaSession.setActionHandler('nexttrack', handleNext);
    }

    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
      }
    };
  }, [currentTrack, tracks, title]);

  // Track play time
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setTotalPlayTime(prev => {
          const newTime = prev + 1;
          storage.set('audiobook-playtime', newTime);
          return newTime;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Persist settings
  useEffect(() => {
    storage.set('audiobook-track', currentTrack);
  }, [currentTrack]);

  useEffect(() => {
    storage.set('audiobook-volume', volume);
  }, [volume]);

  useEffect(() => {
    storage.set('audiobook-repeat', repeat);
  }, [repeat]);

  const handlePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Playback failed:', error);
      });
    }
  }, [isPlaying]);

  const handlePrevious = useCallback(() => {
    setCurrentTrack(prev => (prev > 0 ? prev - 1 : tracks.length - 1));
    setCurrentTime(0);
  }, [tracks.length]);

  const handleNext = useCallback(() => {
    setCurrentTrack(prev => (prev < tracks.length - 1 ? prev + 1 : 0));
    setCurrentTime(0);
  }, [tracks.length]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    // Only allow rewind (seeking backwards)
    if (newTime < currentTime && audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, [currentTime]);

  const handleTrackEnd = useCallback(() => {
    if (repeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (currentTrack < tracks.length - 1) {
      handleNext();
    } else {
      setIsPlaying(false);
    }
  }, [repeat, currentTrack, tracks.length, handleNext]);

  const hours = formatHours(totalPlayTime);

  if (!tracks || tracks.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700/50">
        <p className="text-slate-400">No tracks available</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700/50">
      <audio
        ref={audioRef}
        src={tracks[currentTrack]?.source}
        onTimeUpdate={(e) => setCurrentTime((e.target as HTMLAudioElement).currentTime)}
        onDurationChange={(e) => setDuration((e.target as HTMLAudioElement).duration)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleTrackEnd}
        preload="metadata"
      />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-orange-500 text-sm font-medium">
          {tracks[currentTrack]?.title || 'Unknown Track'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full"
          aria-label={ARIA_LABELS.progress}
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        />
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={handlePrevious}
          className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          aria-label={ARIA_LABELS.previous}
          title="Previous track"
        >
          <PreviousIcon className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={handlePlayPause}
          className="p-4 bg-orange-500 hover:bg-orange-600 rounded-full transition-colors shadow-lg"
          aria-label={isPlaying ? ARIA_LABELS.pause : ARIA_LABELS.play}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <PauseIcon className="w-8 h-8 text-white" />
          ) : (
            <PlayIcon className="w-8 h-8 text-white" />
          )}
        </button>

        <button
          onClick={handleNext}
          className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          aria-label={ARIA_LABELS.next}
          title="Next track"
        >
          <NextIcon className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={() => setRepeat(!repeat)}
          className={`p-2 rounded-full transition-colors ${
            repeat ? 'bg-orange-500 text-white' : 'hover:bg-slate-700 text-slate-400'
          }`}
          aria-label={ARIA_LABELS.repeat}
          aria-pressed={repeat}
          title={repeat ? 'Repeat on' : 'Repeat off'}
        >
          <RepeatIcon className="w-6 h-6" active={repeat} />
        </button>
      </div>

      {/* Volume and Stats */}
      <div className="space-y-4">
        <VolumeControl
          volume={volume}
          onChange={setVolume}
          label="Audiobook volume"
        />
        <TimeDisplay hours={hours} label="Total listening time" />
      </div>

      {/* Track Info */}
      <div className="mt-4 text-xs text-slate-400 text-center">
        Track {currentTrack + 1} of {tracks.length}
      </div>
    </div>
  );
});

AudiobookPlayer.displayName = 'AudiobookPlayer';
