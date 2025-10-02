/**
 * Contract Tests: useStreakCounter Hook
 * Feature: 002-streak-counter-consecutive
 *
 * These tests define the contract for the useStreakCounter React hook.
 * Tests MUST fail before implementation (TDD).
 */

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useStreakCounter } from "./use-streak-counter";

describe("useStreakCounter", () => {
  it("has initial state with currentStreak: 0, bestStreak: 0, currentMilestoneColor: null", () => {
    const { result } = renderHook(() => useStreakCounter());

    expect(result.current.streakState).toEqual({
      currentStreak: 0,
      bestStreak: 0,
      currentMilestoneColor: null,
    });
  });

  it("increments currentStreak from 0 to 1", () => {
    const { result } = renderHook(() => useStreakCounter());

    act(() => {
      result.current.incrementStreak();
    });

    expect(result.current.streakState.currentStreak).toBe(1);
  });

  it("updates bestStreak when current exceeds it", () => {
    const { result } = renderHook(() => useStreakCounter());

    act(() => {
      result.current.incrementStreak();
      result.current.incrementStreak();
      result.current.incrementStreak();
    });

    expect(result.current.streakState.currentStreak).toBe(3);
    expect(result.current.streakState.bestStreak).toBe(3);
  });

  it("sets currentMilestoneColor to 'text-blue-500' when reaching milestone 3", () => {
    const { result } = renderHook(() => useStreakCounter());

    act(() => {
      result.current.incrementStreak(); // 1
      result.current.incrementStreak(); // 2
      result.current.incrementStreak(); // 3
    });

    expect(result.current.streakState.currentMilestoneColor).toBe("text-blue-500");
  });

  it("retains milestone color when incrementing past milestone", () => {
    const { result } = renderHook(() => useStreakCounter());

    act(() => {
      result.current.incrementStreak(); // 1
      result.current.incrementStreak(); // 2
      result.current.incrementStreak(); // 3 - milestone
      result.current.incrementStreak(); // 4
    });

    expect(result.current.streakState.currentStreak).toBe(4);
    expect(result.current.streakState.currentMilestoneColor).toBe("text-blue-500");
  });

  it("resets currentStreak to 0", () => {
    const { result } = renderHook(() => useStreakCounter());

    act(() => {
      result.current.incrementStreak();
      result.current.incrementStreak();
      result.current.resetStreak();
    });

    expect(result.current.streakState.currentStreak).toBe(0);
  });

  it("preserves bestStreak when resetting currentStreak", () => {
    const { result } = renderHook(() => useStreakCounter());

    act(() => {
      result.current.incrementStreak(); // 1
      result.current.incrementStreak(); // 2
      result.current.incrementStreak(); // 3
      result.current.incrementStreak(); // 4
      result.current.incrementStreak(); // 5
    });

    const bestBefore = result.current.streakState.bestStreak;

    act(() => {
      result.current.resetStreak();
    });

    expect(result.current.streakState.bestStreak).toBe(bestBefore);
    expect(result.current.streakState.bestStreak).toBe(5);
  });

  it("clears currentMilestoneColor when resetting", () => {
    const { result } = renderHook(() => useStreakCounter());

    act(() => {
      result.current.incrementStreak(); // 1
      result.current.incrementStreak(); // 2
      result.current.incrementStreak(); // 3 - milestone
    });

    expect(result.current.streakState.currentMilestoneColor).toBe("text-blue-500");

    act(() => {
      result.current.resetStreak();
    });

    expect(result.current.streakState.currentMilestoneColor).toBeNull();
  });

  it("correctly tracks streak through multiple increments (0→1→2→3)", () => {
    const { result } = renderHook(() => useStreakCounter());

    expect(result.current.streakState.currentStreak).toBe(0);

    act(() => {
      result.current.incrementStreak();
    });
    expect(result.current.streakState.currentStreak).toBe(1);

    act(() => {
      result.current.incrementStreak();
    });
    expect(result.current.streakState.currentStreak).toBe(2);

    act(() => {
      result.current.incrementStreak();
    });
    expect(result.current.streakState.currentStreak).toBe(3);
  });

  it("best streak never decreases across increment/reset cycles", () => {
    const { result } = renderHook(() => useStreakCounter());

    // First cycle: reach 5
    act(() => {
      result.current.incrementStreak(); // 1
      result.current.incrementStreak(); // 2
      result.current.incrementStreak(); // 3
      result.current.incrementStreak(); // 4
      result.current.incrementStreak(); // 5
    });

    expect(result.current.streakState.bestStreak).toBe(5);

    // Reset
    act(() => {
      result.current.resetStreak();
    });

    expect(result.current.streakState.bestStreak).toBe(5);

    // Second cycle: reach only 3
    act(() => {
      result.current.incrementStreak(); // 1
      result.current.incrementStreak(); // 2
      result.current.incrementStreak(); // 3
    });

    // Best should still be 5, not decrease to 3
    expect(result.current.streakState.bestStreak).toBe(5);
    expect(result.current.streakState.currentStreak).toBe(3);

    // Third cycle: reach 7 (new best)
    act(() => {
      result.current.incrementStreak(); // 4
      result.current.incrementStreak(); // 5
      result.current.incrementStreak(); // 6
      result.current.incrementStreak(); // 7
    });

    // Best should now be 7
    expect(result.current.streakState.bestStreak).toBe(7);
  });
});
