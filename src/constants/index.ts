/**
 * Application constants
 */

import type { AudioTrack } from '../types';

// Audio sources
export const RADIO_PLAYER_URL = 'https://dl.dropboxusercontent.com/scl/fi/ypmhhq64oawkr2jvzgj0v/Mein-Studentenm-dchen-432Hz.mp3?rlkey=x4qtzfxjkp47vl7p0f00dh9r0&st=xxfbkgnr&dl=0';

export const AUDIOBOOK_TRACKS: AudioTrack[] = [
  {
    title: 'Track 1',
    source: 'https://dl.dropboxusercontent.com/scl/fi/8vhwqmxj0h4ow0d2rffnn/H-rbuch-Track-1.mp3?rlkey=s7wfwl4hbyh3mq1hva55f12rv&st=03kd1wsh&dl=0'
  },
  {
    title: 'Track 2',
    source: 'https://dl.dropboxusercontent.com/scl/fi/xk7x7h54nfqj67rrxf6ff/H-rbuch-Track-2.mp3?rlkey=vl63jvxwedq4tlnhgzg0s0m7l&st=z7rmglhw&dl=0'
  },
  {
    title: 'Track 3',
    source: 'https://dl.dropboxusercontent.com/scl/fi/jnbf8iwdqhtmvrcahsb6q/H-rbuch-Track-3.mp3?rlkey=cfjpwxl9y2rzsb3gmuvgwb3yw&st=bqyp6upx&dl=0'
  },
  {
    title: 'Track 4',
    source: 'https://dl.dropboxusercontent.com/scl/fi/t01efjlv6dexvcfmg0k3i/H-rbuch-Track-4.mp3?rlkey=ug7lrgbnc3c4yymcbr47uc19g&st=6zvtqbjc&dl=0'
  },
  {
    title: 'Track 5',
    source: 'https://dl.dropboxusercontent.com/scl/fi/laxiofsbxm55krhcr0zms/H-rbuch-Track-5.mp3?rlkey=6z9l5qh95pwb3b2lpvn3l5rzf&st=87bsirr8&dl=0'
  }
];

// Player settings
export const DEFAULT_VOLUME = 0.2; // 20%
export const MAX_VOLUME_RADIO = 0.4; // 40%
export const MAX_VOLUME_AUDIOBOOK = 1.0; // 100%
export const VOLUME_STEP = 0.01;

// Cache settings
export const CACHE_NAME = 'radio-ms-cache-v2';
export const CACHE_URLS = [
  '/',
  '/index.html',
  RADIO_PLAYER_URL,
  ...AUDIOBOOK_TRACKS.map(track => track.source)
];

// Accessibility labels
export const ARIA_LABELS = {
  play: 'Play audio',
  pause: 'Pause audio',
  previous: 'Previous track',
  next: 'Next track',
  repeat: 'Toggle repeat',
  volume: 'Volume control',
  progress: 'Seek to position'
} as const;
