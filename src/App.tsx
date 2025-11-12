/**
 * Main Application Component
 */

import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RadioPlayer } from './components/RadioPlayer';
import { AudiobookPlayer } from './components/AudiobookPlayer';
import { RADIO_PLAYER_URL, AUDIOBOOK_TRACKS } from './constants';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center p-4">
        <main className="w-full max-w-2xl space-y-6">
          <RadioPlayer src={RADIO_PLAYER_URL} />
          <AudiobookPlayer tracks={AUDIOBOOK_TRACKS} />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
