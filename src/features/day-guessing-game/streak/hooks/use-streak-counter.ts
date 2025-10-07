/**
 * useStreakCounter Hook
 * Feature: 002-streak-counter-consecutive
 *
 * Custom React hook for managing streak counter state with localStorage persistence.
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import invariant from "tiny-invariant";
import type { StreakState } from "~/features/day-guessing-game/streak/types/streak-types";
import { initialStreakState } from "~/features/day-guessing-game/streak/types/streak-types";
import { getMilestoneColor } from "~/features/day-guessing-game/streak/utils/get-milestone-color";
import {
  getStreakState,
  saveStreakState,
} from "~/features/day-guessing-game/streak/storage/streak-storage";

/**
 * Hook return type
 */
export type UseStreakCounterReturn = {
  /** Current streak state */
  streakState: StreakState;
  /** Record a correct guess on a specific date (handles date-based logic) */
  recordCorrectGuess: (guessDate: string) => void;
  /** Record an incorrect guess on a specific date (resets streak, updates lastGuessDate) */
  recordIncorrectGuess: (guessDate: string) => void;
};

/**
 * Calculates the number of days between two YYYY-MM-DD date strings.
 * @param date1 - Earlier date (YYYY-MM-DD)
 * @param date2 - Later date (YYYY-MM-DD)
 * @returns Number of days between dates (always positive)
 */
function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Custom hook to manage streak counter state with localStorage persistence and date-based logic.
 * Handles daily streak tracking, persistence, best streak tracking, and milestone color updates.
 *
 * @returns Object with streakState and functions to record guesses
 *
 * @example
 * const { streakState, recordCorrectGuess, recordIncorrectGuess } = useStreakCounter();
 *
 * // On correct guess for today:
 * recordCorrectGuess('2025-10-07');
 *
 * // On incorrect guess:
 * recordIncorrectGuess('2025-10-07');
 */
export function useStreakCounter(): UseStreakCounterReturn {
  const [streakState, setStreakState] =
    useState<StreakState>(initialStreakState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after hydration
  useEffect(() => {
    setStreakState(getStreakState());
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever state changes (but only after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveStreakState(streakState);
    }
  }, [streakState, isHydrated]);

  const recordCorrectGuess = useCallback((guessDate: string) => {
    setStreakState((prevState) => {
      // If same day, don't change anything (prevent double-counting)
      if (prevState.lastGuessDate === guessDate) {
        return prevState;
      }

      let newCurrentStreak: number;

      if (prevState.lastGuessDate === null) {
        // First ever guess
        newCurrentStreak = 1;
      } else {
        const daysDiff = daysBetween(prevState.lastGuessDate, guessDate);

        if (daysDiff === 1) {
          // Consecutive day: increment streak
          newCurrentStreak = prevState.currentStreak + 1;
        } else {
          // Days were skipped: reset streak to 1
          newCurrentStreak = 1;
        }
      }

      const newBestStreak = Math.max(prevState.bestStreak, newCurrentStreak);
      const newMilestoneColor = getMilestoneColor(newCurrentStreak);

      // Validate invariants
      invariant(
        newCurrentStreak >= 0,
        "Streak cannot be negative after increment"
      );
      invariant(
        newBestStreak >= newCurrentStreak,
        "Best streak must be >= current streak"
      );

      return {
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak,
        currentMilestoneColor: newMilestoneColor,
        lastGuessDate: guessDate,
      };
    });
  }, []);

  const recordIncorrectGuess = useCallback((guessDate: string) => {
    setStreakState((prevState) => {
      return {
        currentStreak: 0,
        bestStreak: prevState.bestStreak, // Preserve best streak
        currentMilestoneColor: null,
        lastGuessDate: guessDate,
      };
    });
  }, []);

  return {
    streakState,
    recordCorrectGuess,
    recordIncorrectGuess,
  };
}
