'use client';

import DayDisplay from './day-display';
import GuessButtons from './guess-buttons';
import FeedbackPanel from './feedback-panel';
import { validateGuess } from '~/features/day-guessing-game/utils/validate-guess';
import { useStreakCounter } from '~/features/day-guessing-game/streak/hooks/use-streak-counter';
import { StreakDisplay } from '~/features/day-guessing-game/streak/components/streak-display';
import { useDailyState } from '~/features/day-guessing-game/daily-challenge/hooks/use-daily-state';

export default function GameContainer() {
  const { dailyChallenge, gameState, submitGuess } = useDailyState();
  const { streakState, recordCorrectGuess, recordIncorrectGuess } = useStreakCounter();

  const handleGuess = (guessedReal: boolean) => {
    if (!dailyChallenge) return;

    // Submit the guess through daily state hook
    submitGuess(guessedReal);

    // Update streak based on result, using the daily challenge date
    const result = validateGuess(dailyChallenge.internationalDay, guessedReal);
    if (result.correct) {
      recordCorrectGuess(dailyChallenge.date);
    } else {
      recordIncorrectGuess(dailyChallenge.date);
    }
  };

  // Show loading state while initializing
  if (!dailyChallenge || !gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <main className="w-full max-w-4xl" role="main" aria-label="International Day Guessing Game">
          <div className="mb-8 flex justify-center animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg px-8 py-4 border border-slate-200 dark:border-slate-700">
              <StreakDisplay
                currentStreak={streakState.currentStreak}
                bestStreak={streakState.bestStreak}
                milestoneColor={streakState.currentMilestoneColor}
              />
            </div>
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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <main className="w-full max-w-4xl" role="main" aria-label="International Day Guessing Game">
        <div className="mb-8 flex justify-center animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg px-8 py-4 border border-slate-200 dark:border-slate-700">
            <StreakDisplay
              currentStreak={streakState.currentStreak}
              bestStreak={streakState.bestStreak}
              milestoneColor={streakState.currentMilestoneColor}
            />
          </div>
        </div>
        {!hasGuessed ? (
          <div className="space-y-10 animate-fade-in">
            <DayDisplay dayName={dailyChallenge.internationalDay.name} />
            <GuessButtons onGuess={handleGuess} disabled={false} />
          </div>
        ) : (
          result && <div className="animate-fade-in"><FeedbackPanel result={result} /></div>
        )}
      </main>
    </div>
  );
}
