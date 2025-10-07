/**
 * Contract Tests: useStreakCounter Hook
 * Feature: 002-streak-counter-consecutive
 *
 * These tests define the contract for the useStreakCounter React hook.
 * Tests MUST fail before implementation (TDD).
 */

import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useStreakCounter } from "./use-streak-counter";

describe("useStreakCounter", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("has initial state with currentStreak: 0, bestStreak: 0, currentMilestoneColor: null, lastGuessDate: null", () => {
    const { result } = renderHook(() => useStreakCounter());

    expect(result.current.streakState).toEqual({
      currentStreak: 0,
      bestStreak: 0,
      currentMilestoneColor: null,
      lastGuessDate: null,
    });
  });

  it("increments currentStreak from 0 to 1 on first correct guess", () => {
    const { result } = renderHook(() => useStreakCounter());

    act(() => {
      result.current.recordCorrectGuess('2025-10-07');
    });

    expect(result.current.streakState.currentStreak).toBe(1);
  });

  it("updates bestStreak when current exceeds it", () => {
    const { result } = renderHook(() => useStreakCounter());

    act(() => {
      result.current.recordCorrectGuess('2025-10-07');
      result.current.recordCorrectGuess('2025-10-08');
      result.current.recordCorrectGuess('2025-10-09');
    });

    expect(result.current.streakState.currentStreak).toBe(3);
    expect(result.current.streakState.bestStreak).toBe(3);
  });

  it("sets currentMilestoneColor to 'text-blue-500' when reaching milestone 3", () => {
    const { result } = renderHook(() => useStreakCounter());

    act(() => {
      result.current.recordCorrectGuess('2025-10-07'); // 1
      result.current.recordCorrectGuess('2025-10-08'); // 2
      result.current.recordCorrectGuess('2025-10-09'); // 3
    });

    expect(result.current.streakState.currentMilestoneColor).toBe("text-blue-500");
  });

  it("retains milestone color when incrementing past milestone", () => {
    const { result } = renderHook(() => useStreakCounter());

    act(() => {
      result.current.recordCorrectGuess('2025-10-07'); // 1
      result.current.recordCorrectGuess('2025-10-08'); // 2
      result.current.recordCorrectGuess('2025-10-09'); // 3 - milestone
      result.current.recordCorrectGuess('2025-10-10'); // 4
    });

    expect(result.current.streakState.currentStreak).toBe(4);
    expect(result.current.streakState.currentMilestoneColor).toBe("text-blue-500");
  });

  it("resets currentStreak to 0 on incorrect guess", () => {
    const { result } = renderHook(() => useStreakCounter());

    act(() => {
      result.current.recordCorrectGuess('2025-10-07');
      result.current.recordCorrectGuess('2025-10-08');
      result.current.recordIncorrectGuess('2025-10-09');
    });

    expect(result.current.streakState.currentStreak).toBe(0);
  });

  it("preserves bestStreak when recording incorrect guess", () => {
    const { result } = renderHook(() => useStreakCounter());

    act(() => {
      result.current.recordCorrectGuess('2025-10-07'); // 1
      result.current.recordCorrectGuess('2025-10-08'); // 2
      result.current.recordCorrectGuess('2025-10-09'); // 3
      result.current.recordCorrectGuess('2025-10-10'); // 4
      result.current.recordCorrectGuess('2025-10-11'); // 5
    });

    const bestStreakBefore = result.current.streakState.bestStreak;

    act(() => {
      result.current.recordIncorrectGuess('2025-10-12');
    });

    expect(result.current.streakState.bestStreak).toBe(bestStreakBefore);
    expect(result.current.streakState.bestStreak).toBe(5);
  });

  it("clears currentMilestoneColor when recording incorrect guess", () => {
    const { result } = renderHook(() => useStreakCounter());

    act(() => {
      result.current.recordCorrectGuess('2025-10-07'); // 1
      result.current.recordCorrectGuess('2025-10-08'); // 2
      result.current.recordCorrectGuess('2025-10-09'); // 3 - milestone
    });

    expect(result.current.streakState.currentMilestoneColor).toBe("text-blue-500");

    act(() => {
      result.current.recordIncorrectGuess('2025-10-10');
    });

    expect(result.current.streakState.currentMilestoneColor).toBeNull();
  });

  it("correctly tracks streak through consecutive days (0→1→2→3)", () => {
    const { result } = renderHook(() => useStreakCounter());

    expect(result.current.streakState.currentStreak).toBe(0);

    act(() => {
      result.current.recordCorrectGuess('2025-10-07');
    });
    expect(result.current.streakState.currentStreak).toBe(1);

    act(() => {
      result.current.recordCorrectGuess('2025-10-08');
    });
    expect(result.current.streakState.currentStreak).toBe(2);

    act(() => {
      result.current.recordCorrectGuess('2025-10-09');
    });
    expect(result.current.streakState.currentStreak).toBe(3);
  });

  it("best streak never decreases across correct/incorrect guess cycles", () => {
    const { result } = renderHook(() => useStreakCounter());

    // First cycle: reach 5
    act(() => {
      result.current.recordCorrectGuess('2025-10-01'); // 1
      result.current.recordCorrectGuess('2025-10-02'); // 2
      result.current.recordCorrectGuess('2025-10-03'); // 3
      result.current.recordCorrectGuess('2025-10-04'); // 4
      result.current.recordCorrectGuess('2025-10-05'); // 5
    });

    expect(result.current.streakState.bestStreak).toBe(5);

    // Incorrect guess
    act(() => {
      result.current.recordIncorrectGuess('2025-10-06');
    });

    expect(result.current.streakState.bestStreak).toBe(5);

    // Second cycle: reach only 3
    act(() => {
      result.current.recordCorrectGuess('2025-10-07'); // 1
      result.current.recordCorrectGuess('2025-10-08'); // 2
      result.current.recordCorrectGuess('2025-10-09'); // 3
    });

    // Best should still be 5, not decrease to 3
    expect(result.current.streakState.bestStreak).toBe(5);
    expect(result.current.streakState.currentStreak).toBe(3);

    // Third cycle: reach 7 (new best)
    act(() => {
      result.current.recordCorrectGuess('2025-10-10'); // 4
      result.current.recordCorrectGuess('2025-10-11'); // 5
      result.current.recordCorrectGuess('2025-10-12'); // 6
      result.current.recordCorrectGuess('2025-10-13'); // 7
    });

    // Best should now be 7
    expect(result.current.streakState.bestStreak).toBe(7);
  });

  describe("localStorage persistence", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("loads initial state from localStorage on mount", () => {
      const storedState = {
        currentStreak: 7,
        bestStreak: 10,
        currentMilestoneColor: 'text-purple-500',
        lastGuessDate: '2025-10-07',
      };
      localStorage.setItem('streak-state', JSON.stringify(storedState));

      const { result } = renderHook(() => useStreakCounter());

      expect(result.current.streakState).toEqual(storedState);
    });

    it("saves state to localStorage after recordCorrectGuess", () => {
      const { result } = renderHook(() => useStreakCounter());

      act(() => {
        result.current.recordCorrectGuess('2025-10-07');
      });

      const stored = localStorage.getItem('streak-state');
      expect(stored).toBeTruthy();
      const parsedState = JSON.parse(stored!);
      expect(parsedState.currentStreak).toBe(1);
      expect(parsedState.bestStreak).toBe(1);
    });

    it("saves state to localStorage after recordIncorrectGuess", () => {
      const { result } = renderHook(() => useStreakCounter());

      act(() => {
        result.current.recordCorrectGuess('2025-10-07');
        result.current.recordCorrectGuess('2025-10-08');
        result.current.recordIncorrectGuess('2025-10-09');
      });

      const stored = localStorage.getItem('streak-state');
      expect(stored).toBeTruthy();
      const parsedState = JSON.parse(stored!);
      expect(parsedState.currentStreak).toBe(0);
      expect(parsedState.bestStreak).toBe(2);
    });
  });

  describe("daily date-based streak logic", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("increments streak when guess is on a new consecutive day (Day 1 -> Day 2)", () => {
      const { result } = renderHook(() => useStreakCounter());

      // Day 1: first correct guess
      act(() => {
        result.current.recordCorrectGuess('2025-10-07');
      });

      expect(result.current.streakState.currentStreak).toBe(1);
      expect(result.current.streakState.lastGuessDate).toBe('2025-10-07');

      // Day 2: consecutive day
      act(() => {
        result.current.recordCorrectGuess('2025-10-08');
      });

      expect(result.current.streakState.currentStreak).toBe(2);
      expect(result.current.streakState.lastGuessDate).toBe('2025-10-08');
    });

    it("does NOT increment streak when returning same day (prevents double-counting)", () => {
      const { result } = renderHook(() => useStreakCounter());

      // Day 1: first correct guess
      act(() => {
        result.current.recordCorrectGuess('2025-10-07');
      });

      expect(result.current.streakState.currentStreak).toBe(1);

      // Same day: return later the same day
      act(() => {
        result.current.recordCorrectGuess('2025-10-07');
      });

      expect(result.current.streakState.currentStreak).toBe(1); // unchanged
      expect(result.current.streakState.lastGuessDate).toBe('2025-10-07');
    });

    it("resets streak when days are skipped (Day 1 -> Day 3, skipped Day 2)", () => {
      const { result } = renderHook(() => useStreakCounter());

      // Day 1: first correct guess
      act(() => {
        result.current.recordCorrectGuess('2025-10-07');
      });

      expect(result.current.streakState.currentStreak).toBe(1);

      // Day 3: skipped day 2
      act(() => {
        result.current.recordCorrectGuess('2025-10-09');
      });

      expect(result.current.streakState.currentStreak).toBe(1); // reset to 1 (new streak)
      expect(result.current.streakState.lastGuessDate).toBe('2025-10-09');
    });

    it("resets streak to 0 on incorrect guess while preserving bestStreak", () => {
      const { result } = renderHook(() => useStreakCounter());

      // Build up streak
      act(() => {
        result.current.recordCorrectGuess('2025-10-07');
        result.current.recordCorrectGuess('2025-10-08');
        result.current.recordCorrectGuess('2025-10-09');
      });

      expect(result.current.streakState.currentStreak).toBe(3);
      expect(result.current.streakState.bestStreak).toBe(3);

      // Incorrect guess on Day 4
      act(() => {
        result.current.recordIncorrectGuess('2025-10-10');
      });

      expect(result.current.streakState.currentStreak).toBe(0);
      expect(result.current.streakState.bestStreak).toBe(3); // preserved
      expect(result.current.streakState.lastGuessDate).toBe('2025-10-10');
    });

    it("updates bestStreak when current exceeds it", () => {
      const { result } = renderHook(() => useStreakCounter());

      // First streak cycle: reach 3
      act(() => {
        result.current.recordCorrectGuess('2025-10-01');
        result.current.recordCorrectGuess('2025-10-02');
        result.current.recordCorrectGuess('2025-10-03');
      });

      expect(result.current.streakState.bestStreak).toBe(3);

      // Incorrect guess, reset
      act(() => {
        result.current.recordIncorrectGuess('2025-10-04');
      });

      // Second streak cycle: reach 5 (new best)
      act(() => {
        result.current.recordCorrectGuess('2025-10-05');
        result.current.recordCorrectGuess('2025-10-06');
        result.current.recordCorrectGuess('2025-10-07');
        result.current.recordCorrectGuess('2025-10-08');
        result.current.recordCorrectGuess('2025-10-09');
      });

      expect(result.current.streakState.currentStreak).toBe(5);
      expect(result.current.streakState.bestStreak).toBe(5); // updated
    });

    it("persists streak across hook unmount/remount", () => {
      const { result: result1, unmount } = renderHook(() => useStreakCounter());

      act(() => {
        result1.current.recordCorrectGuess('2025-10-07');
        result1.current.recordCorrectGuess('2025-10-08');
      });

      expect(result1.current.streakState.currentStreak).toBe(2);

      unmount();

      // Remount hook (simulates page reload)
      const { result: result2 } = renderHook(() => useStreakCounter());

      expect(result2.current.streakState.currentStreak).toBe(2);
      expect(result2.current.streakState.lastGuessDate).toBe('2025-10-08');
    });
  });
});
