import { useState, useEffect, useCallback } from "react";
import type {
  DailyChallenge,
  DailyGameState,
} from "~/features/day-guessing-game/types/daily-types";
import { getCurrentLocalDate } from "~/features/day-guessing-game/daily-challenge/utils/timezone-utils";
import { getDailyChallenge } from "~/features/day-guessing-game/daily-challenge/utils/get-daily-challenge";
import { getDailyState, saveDailyState } from "~/features/day-guessing-game/daily-challenge/storage/daily-state-storage";

export function useDailyState() {
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(
    null
  );
  const [gameState, setGameState] = useState<DailyGameState | null>(null);

  // Initialize state only on client-side to avoid hydration mismatch
  useEffect(() => {
    const currentDate = getCurrentLocalDate();
    setDailyChallenge(getDailyChallenge(currentDate));
    setGameState(getDailyState(currentDate));
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (gameState) {
      saveDailyState(gameState);
    }
  }, [gameState]);

  const submitGuess = useCallback(
    (guessedReal: boolean) => {
      if (!dailyChallenge || !gameState) return;

      // Only allow submitting if not already guessed
      if (gameState.guessedCorrectly !== null) {
        return;
      }

      const isCorrect = guessedReal === dailyChallenge.internationalDay.isReal;

      setGameState({
        date: gameState.date,
        guessedCorrectly: isCorrect,
        timestamp: Date.now(),
      });
    },
    [dailyChallenge, gameState]
  );

  return {
    dailyChallenge,
    gameState,
    submitGuess,
  };
}
