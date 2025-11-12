/**
 * Type definitions for the audio player application
 */

export interface AudioTrack {
  title: string;
  source: string;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  error: Error | null;
}

export interface RadioPlayerProps {
  src: string;
  title?: string;
  subtitle?: string;
}

export interface AudiobookPlayerProps {
  tracks: AudioTrack[];
  title?: string;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
  label?: string;
}

export interface TimeDisplayProps {
  hours: number;
  label?: string;
}

export interface IconProps {
  className?: string;
  'aria-label'?: string;
}
