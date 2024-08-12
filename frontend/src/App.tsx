// src/App.tsx

import React, { useState } from 'react';
import FlashcardsView from './components/FlashcardView';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<'flashcards' | 'dashboard'>('flashcards');

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => setView('flashcards')}>Flashcards</button>
      <button onClick={() => setView('dashboard')}>Dashboard</button>

      {view === 'flashcards' && <FlashcardsView />}
      {view === 'dashboard' && <Dashboard />}
    </div>
  );
};

export default App;
