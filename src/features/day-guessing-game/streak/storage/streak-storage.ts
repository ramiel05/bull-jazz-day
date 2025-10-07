/**
 * Streak State Storage Utilities
 * Feature: 002-streak-counter-consecutive
 *
 * Handles localStorage persistence for streak state.
 */

import type { StreakState } from '~/features/day-guessing-game/streak/types/streak-types';
import { initialStreakState } from '~/features/day-guessing-game/streak/types/streak-types';

const STORAGE_KEY = 'streak-state';

/**
 * Gets the streak state from localStorage
 * Returns fresh state if stored data is corrupted or missing required fields
 * @returns StreakState
 */
export function getStreakState(): StreakState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsedState = JSON.parse(stored);

      // Validate parsed state is an object with all required properties
      if (
        parsedState &&
        typeof parsedState === 'object' &&
        'currentStreak' in parsedState &&
        'bestStreak' in parsedState &&
        'currentMilestoneColor' in parsedState &&
        'lastGuessDate' in parsedState
      ) {
        return parsedState as StreakState;
      }
    }
  } catch (error) {
    // Handle corrupted JSON or other errors
    console.error('Error reading streak state from localStorage:', error);
  }

  // Return fresh state if not found or corrupted
  return initialStreakState;
}

/**
 * Saves the streak state to localStorage
 * @param state - StreakState to save
 */
export function saveStreakState(state: StreakState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // Handle quota exceeded or other errors
    console.error('Error writing streak state to localStorage:', error);
  }
}
