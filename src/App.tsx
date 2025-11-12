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
      <div className="min-h-screen text-white flex items-center justify-center p-4 font-sans">
        <main className="max-w-[600px] flex flex-col space-y-8">
          <RadioPlayer src={RADIO_PLAYER_URL} />
          <AudiobookPlayer tracks={AUDIOBOOK_TRACKS} />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
