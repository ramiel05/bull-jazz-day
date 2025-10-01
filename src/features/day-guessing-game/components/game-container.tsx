'use client';

import { useState, useEffect } from 'react';
import invariant from 'tiny-invariant';
import DayDisplay from './day-display';
import GuessButtons from './guess-buttons';
import FeedbackPanel from './feedback-panel';
import { daysPool } from '../data/days-pool';
import { selectRandomDay } from '../utils/select-random-day';
import { validateGuess } from '../utils/validate-guess';
import type { GameState } from '../types/game-types';

export default function GameContainer() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    setGameState({
      currentDay: selectRandomDay(daysPool),
      phase: 'guessing',
      lastResult: null,
    });
  }, []);

  const handleGuess = (guessedReal: boolean) => {
    invariant(gameState, 'Cannot make a guess when game state is not initialized');
    const result = validateGuess(gameState.currentDay, guessedReal);
    setGameState({
      ...gameState,
      phase: 'feedback',
      lastResult: result,
    });
  };

  const handleContinue = () => {
    setGameState({
      currentDay: selectRandomDay(daysPool),
      phase: 'guessing',
      lastResult: null,
    });
  };

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <main className="w-full max-w-4xl" role="main" aria-label="International Day Guessing Game">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <main className="w-full max-w-4xl" role="main" aria-label="International Day Guessing Game">
        {gameState.phase === 'guessing' ? (
          <div className="space-y-8">
            <DayDisplay dayName={gameState.currentDay.name} />
            <GuessButtons onGuess={handleGuess} disabled={false} />
          </div>
        ) : (
          gameState.lastResult && (
            <FeedbackPanel result={gameState.lastResult} onContinue={handleContinue} />
          )
        )}
      </main>
    </div>
  );
}
