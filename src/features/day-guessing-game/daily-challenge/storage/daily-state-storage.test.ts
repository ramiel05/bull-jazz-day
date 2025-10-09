import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getDailyState, saveDailyState } from './daily-state-storage';

describe('getDailyState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return fresh state when localStorage is empty', () => {
    const currentDate = '2025-10-05';
    const state = getDailyState(currentDate);

    expect(state).toEqual({
      date: currentDate,
      guessedCorrectly: null,
      guessedReal: null,
      timestamp: expect.any(Number),
    });
  });

  it('should return stored state when date matches', () => {
    const currentDate = '2025-10-05';
    const storedState = {
      date: currentDate,
      guessedCorrectly: true,
      guessedReal: true,
      timestamp: Date.now(),
    };

    localStorage.setItem('daily-game-state', JSON.stringify(storedState));

    const state = getDailyState(currentDate);

    expect(state).toEqual(storedState);
  });

  it('should return fresh state when stored date is different', () => {
    const storedState = {
      date: '2025-10-04',
      guessedCorrectly: true,
      guessedReal: true,
      timestamp: Date.now() - 86400000, // Yesterday's timestamp
    };

    localStorage.setItem('daily-game-state', JSON.stringify(storedState));

    const currentDate = '2025-10-05';
    const state = getDailyState(currentDate);

    expect(state.date).toBe(currentDate);
    expect(state.guessedCorrectly).toBe(null);
    expect(state.timestamp).toBeGreaterThan(storedState.timestamp);
  });

  it('should handle corrupted JSON gracefully', () => {
    localStorage.setItem('daily-game-state', 'invalid-json{{{');

    const currentDate = '2025-10-05';
    const state = getDailyState(currentDate);

    expect(state).toEqual({
      date: currentDate,
      guessedCorrectly: null,
      guessedReal: null,
      timestamp: expect.any(Number),
    });
  });

  it('should handle null value in localStorage', () => {
    localStorage.setItem('daily-game-state', 'null');

    const currentDate = '2025-10-05';
    const state = getDailyState(currentDate);

    expect(state).toEqual({
      date: currentDate,
      guessedCorrectly: null,
      guessedReal: null,
      timestamp: expect.any(Number),
    });
  });

  it('should set timestamp to current time for fresh state', () => {
    vi.useFakeTimers();
    const now = 1728086400000;
    vi.setSystemTime(now);

    const currentDate = '2025-10-05';
    const state = getDailyState(currentDate);

    expect(state.timestamp).toBe(now);

    vi.useRealTimers();
  });

  it('should preserve guessedCorrectly when it is false', () => {
    const currentDate = '2025-10-05';
    const storedState = {
      date: currentDate,
      guessedCorrectly: false,
      guessedReal: false,
      timestamp: Date.now(),
    };

    localStorage.setItem('daily-game-state', JSON.stringify(storedState));

    const state = getDailyState(currentDate);

    expect(state.guessedCorrectly).toBe(false);
  });

  it('should handle missing fields in stored state gracefully', () => {
    const currentDate = '2025-10-05';
    const incompleteState = { date: currentDate };

    localStorage.setItem('daily-game-state', JSON.stringify(incompleteState));

    const state = getDailyState(currentDate);

    // Should still return valid state structure
    expect(state.date).toBe(currentDate);
  });
});

describe('saveDailyState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save state to localStorage', () => {
    const state = {
      date: '2025-10-05',
      guessedCorrectly: true,
      guessedReal: true,
      timestamp: Date.now(),
    };

    saveDailyState(state);

    const stored = localStorage.getItem('daily-game-state');
    expect(stored).toBeDefined();
    expect(JSON.parse(stored!)).toEqual(state);
  });

  it('should overwrite existing state', () => {
    const oldState = {
      date: '2025-10-04',
      guessedCorrectly: false,
      guessedReal: false,
      timestamp: 1000,
    };

    const newState = {
      date: '2025-10-05',
      guessedCorrectly: true,
      guessedReal: true,
      timestamp: 2000,
    };

    localStorage.setItem('daily-game-state', JSON.stringify(oldState));

    saveDailyState(newState);

    const stored = localStorage.getItem('daily-game-state');
    expect(JSON.parse(stored!)).toEqual(newState);
  });

  it('should save state with guessedCorrectly as null', () => {
    const state = {
      date: '2025-10-05',
      guessedCorrectly: null,
      guessedReal: null,
      timestamp: Date.now(),
    };

    saveDailyState(state);

    const stored = localStorage.getItem('daily-game-state');
    const parsed = JSON.parse(stored!);

    expect(parsed.guessedCorrectly).toBe(null);
  });

  it('should save state with guessedCorrectly as false', () => {
    const state = {
      date: '2025-10-05',
      guessedCorrectly: false,
      guessedReal: false,
      timestamp: Date.now(),
    };

    saveDailyState(state);

    const stored = localStorage.getItem('daily-game-state');
    const parsed = JSON.parse(stored!);

    expect(parsed.guessedCorrectly).toBe(false);
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage.setItem to throw an error
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn(() => {
      throw new Error('QuotaExceededError');
    });

    const state = {
      date: '2025-10-05',
      guessedCorrectly: true,
      guessedReal: true,
      timestamp: Date.now(),
    };

    // Should not throw
    expect(() => saveDailyState(state)).not.toThrow();

    // Restore original
    localStorage.setItem = originalSetItem;
  });

  it('should serialize and deserialize timestamps correctly', () => {
    const timestamp = 1728086400000;
    const state = {
      date: '2025-10-05',
      guessedCorrectly: true,
      guessedReal: true,
      timestamp,
    };

    saveDailyState(state);

    const stored = localStorage.getItem('daily-game-state');
    const parsed = JSON.parse(stored!);

    expect(parsed.timestamp).toBe(timestamp);
    expect(typeof parsed.timestamp).toBe('number');
  });
});

describe('getDailyState and saveDailyState integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save and retrieve the same state', () => {
    const currentDate = '2025-10-05';
    const state = {
      date: currentDate,
      guessedCorrectly: true,
      guessedReal: true,
      timestamp: Date.now(),
    };

    saveDailyState(state);
    const retrieved = getDailyState(currentDate);

    expect(retrieved).toEqual(state);
  });

  it('should handle day transition correctly', () => {
    // Save state for yesterday
    const yesterdayState = {
      date: '2025-10-04',
      guessedCorrectly: true,
      guessedReal: true,
      timestamp: Date.now(),
    };

    saveDailyState(yesterdayState);

    // Get state for today - should return fresh state
    const todayDate = '2025-10-05';
    const todayState = getDailyState(todayDate);

    expect(todayState.date).toBe(todayDate);
    expect(todayState.guessedCorrectly).toBe(null);
  });
});
