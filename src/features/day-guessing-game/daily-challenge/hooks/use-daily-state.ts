import { useState, useEffect, useCallback } from 'react';
import type { DailyChallenge, DailyGameState } from '~/features/day-guessing-game/types/daily-types';
import { getCurrentLocalDate } from '../utils/timezone-utils';
import { getDailyChallenge } from '../utils/get-daily-challenge';
import { getDailyState, saveDailyState } from '../storage/daily-state-storage';

export function useDailyState() {
  const [currentDate] = useState(() => getCurrentLocalDate());
  const [dailyChallenge] = useState<DailyChallenge>(() => getDailyChallenge(currentDate));
  const [gameState, setGameState] = useState<DailyGameState>(() => getDailyState(currentDate));

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveDailyState(gameState);
  }, [gameState]);

  const submitGuess = useCallback(
    (guessedReal: boolean) => {
      // Only allow submitting if not already guessed
      if (gameState.guessedCorrectly !== null) {
        return;
      }

      const isCorrect = guessedReal === dailyChallenge.internationalDay.isReal;

      setGameState({
        date: currentDate,
        guessedCorrectly: isCorrect,
        timestamp: Date.now(),
      });
    },
    [currentDate, dailyChallenge.internationalDay.isReal, gameState.guessedCorrectly]
  );

  return {
    dailyChallenge,
    gameState,
    submitGuess,
  };
}
