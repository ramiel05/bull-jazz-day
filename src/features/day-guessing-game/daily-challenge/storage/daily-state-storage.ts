import type { DailyGameState } from '~/features/day-guessing-game/types/daily-types';

const STORAGE_KEY = 'daily-game-state';

/**
 * Gets the daily game state from localStorage
 * Returns fresh state if stored date doesn't match current date or if state is corrupted
 * @param currentDate - Current date in YYYY-MM-DD format
 * @returns DailyGameState for the current date
 */
export function getDailyState(currentDate: string): DailyGameState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsedState = JSON.parse(stored);

      // Validate parsed state is an object with required properties
      if (parsedState && typeof parsedState === 'object' && 'date' in parsedState) {
        const state = parsedState as DailyGameState;

        // Return stored state if it's for today
        if (state.date === currentDate) {
          return state;
        }
      }
    }
  } catch (error) {
    // Handle corrupted JSON or other errors
    console.error('Error reading from localStorage:', error);
  }

  // Return fresh state for new day
  return {
    date: currentDate,
    guessedCorrectly: null,
    timestamp: Date.now(),
  };
}

/**
 * Saves the daily game state to localStorage
 * @param state - DailyGameState to save
 */
export function saveDailyState(state: DailyGameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // Handle quota exceeded or other errors
    console.error('Error writing to localStorage:', error);
  }
}
