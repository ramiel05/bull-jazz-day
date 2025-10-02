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
import { useStreakCounter } from '../streak/hooks/use-streak-counter';
import { initialStreakState } from '../streak/types/streak-types';
import { StreakDisplay } from '../streak/components/streak-display';

export default function GameContainer() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const { streakState, incrementStreak, resetStreak } = useStreakCounter();

  useEffect(() => {
    setGameState({
      currentDay: selectRandomDay(daysPool),
      phase: 'guessing',
      lastResult: null,
      streak: initialStreakState,
    });
  }, []);

  // Sync streak state from hook to game state
  useEffect(() => {
    if (gameState) {
      setGameState((prev) => prev ? { ...prev, streak: streakState } : null);
    }
  }, [streakState]);

  const handleGuess = (guessedReal: boolean) => {
    invariant(gameState, 'Cannot make a guess when game state is not initialized');
    const result = validateGuess(gameState.currentDay, guessedReal);

    // Update streak based on result
    if (result.correct) {
      incrementStreak();
    } else {
      resetStreak();
    }

    setGameState({
      ...gameState,
      phase: 'feedback',
      lastResult: result,
    });
  };

  const handleContinue = () => {
    setGameState((prev) => ({
      currentDay: selectRandomDay(daysPool),
      phase: 'guessing',
      lastResult: null,
      streak: prev?.streak || streakState,
    }));
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
        <div className="mb-6">
          <StreakDisplay
            currentStreak={streakState.currentStreak}
            bestStreak={streakState.bestStreak}
            milestoneColor={streakState.currentMilestoneColor}
          />
        </div>
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
