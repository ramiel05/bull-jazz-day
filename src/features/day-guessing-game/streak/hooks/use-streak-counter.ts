/**
 * useStreakCounter Hook
 * Feature: 002-streak-counter-consecutive
 *
 * Custom React hook for managing streak counter state.
 */

"use client";

import { useState, useCallback } from "react";
import invariant from "tiny-invariant";
import type { StreakState } from "../types/streak-types";
import { initialStreakState } from "../types/streak-types";
import { getMilestoneColor } from "../utils/get-milestone-color";

/**
 * Hook return type
 */
export type UseStreakCounterReturn = {
  /** Current streak state */
  streakState: StreakState;
  /** Increment the current streak by 1 */
  incrementStreak: () => void;
  /** Reset the current streak to 0 */
  resetStreak: () => void;
};

/**
 * Custom hook to manage streak counter state.
 * Handles increment, reset, best streak tracking, and milestone color updates.
 *
 * @returns Object with streakState, incrementStreak, and resetStreak
 *
 * @example
 * const { streakState, incrementStreak, resetStreak } = useStreakCounter();
 *
 * // On correct guess:
 * incrementStreak();
 *
 * // On incorrect guess:
 * resetStreak();
 */
export function useStreakCounter(): UseStreakCounterReturn {
  const [streakState, setStreakState] = useState<StreakState>(initialStreakState);

  const incrementStreak = useCallback(() => {
    setStreakState((prevState) => {
      const newCurrentStreak = prevState.currentStreak + 1;
      const newBestStreak = Math.max(prevState.bestStreak, newCurrentStreak);
      const newMilestoneColor = getMilestoneColor(newCurrentStreak);

      // Validate invariants
      invariant(newCurrentStreak >= 0, "Streak cannot be negative after increment");
      invariant(
        newBestStreak >= newCurrentStreak,
        "Best streak must be >= current streak"
      );

      return {
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak,
        currentMilestoneColor: newMilestoneColor,
      };
    });
  }, []);

  const resetStreak = useCallback(() => {
    setStreakState((prevState) => {
      return {
        currentStreak: 0,
        bestStreak: prevState.bestStreak, // Preserve best streak
        currentMilestoneColor: null,
      };
    });
  }, []);

  return {
    streakState,
    incrementStreak,
    resetStreak,
  };
}
