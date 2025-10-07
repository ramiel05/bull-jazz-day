'use client';

import { useEffect } from 'react';
import DayDisplay from './day-display';
import GuessButtons from './guess-buttons';
import FeedbackPanel from './feedback-panel';
import { validateGuess } from '~/features/day-guessing-game/utils/validate-guess';
import { useStreakCounter } from '~/features/day-guessing-game/streak/hooks/use-streak-counter';
import { StreakDisplay } from '~/features/day-guessing-game/streak/components/streak-display';
import { useDailyState } from '~/features/day-guessing-game/daily-challenge/hooks/use-daily-state';

export default function GameContainer() {
  const { dailyChallenge, gameState, submitGuess } = useDailyState();
  const { streakState, incrementStreak, resetStreak } = useStreakCounter();

  const handleGuess = (guessedReal: boolean) => {
    if (!dailyChallenge) return;

    // Submit the guess through daily state hook
    submitGuess(guessedReal);

    // Update streak based on result
    const result = validateGuess(dailyChallenge.internationalDay, guessedReal);
    if (result.correct) {
      incrementStreak();
    } else {
      resetStreak();
    }
  };

  // Show loading state while initializing
  if (!dailyChallenge || !gameState) {
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
        </main>
      </div>
    );
  }

  const hasGuessed = gameState.guessedCorrectly !== null;
  const result = hasGuessed
    ? validateGuess(dailyChallenge.internationalDay, dailyChallenge.internationalDay.isReal)
    : null;

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
        {!hasGuessed ? (
          <div className="space-y-8">
            <DayDisplay dayName={dailyChallenge.internationalDay.name} />
            <GuessButtons onGuess={handleGuess} disabled={false} />
          </div>
        ) : (
          result && <FeedbackPanel result={result} />
        )}
      </main>
    </div>
  );
}
