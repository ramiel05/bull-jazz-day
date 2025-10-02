/**
 * Integration Tests: Full Streak Flow
 * Feature: 002-streak-counter-consecutive
 *
 * These tests verify the complete streak counter flow with all components integrated.
 * Tests MUST fail before implementation (TDD).
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import { useStreakCounter } from "../../hooks/use-streak-counter";
import { StreakDisplay } from "../../components/streak-display";

describe("Streak Flow Integration", () => {
  it("scenario: user makes consecutive correct guesses and reaches milestone", () => {
    const { result } = renderHook(() => useStreakCounter());

    // Initial state
    expect(result.current.streakState.currentStreak).toBe(0);
    expect(result.current.streakState.bestStreak).toBe(0);
    expect(result.current.streakState.currentMilestoneColor).toBeNull();

    // User makes first correct guess
    act(() => {
      result.current.incrementStreak();
    });
    expect(result.current.streakState.currentStreak).toBe(1);

    // User makes second correct guess
    act(() => {
      result.current.incrementStreak();
    });
    expect(result.current.streakState.currentStreak).toBe(2);

    // User reaches milestone 3
    act(() => {
      result.current.incrementStreak();
    });
    expect(result.current.streakState.currentStreak).toBe(3);
    expect(result.current.streakState.bestStreak).toBe(3);
    expect(result.current.streakState.currentMilestoneColor).toBe("text-blue-500");
  });

  it("scenario: user makes incorrect guess and streak resets", () => {
    const { result } = renderHook(() => useStreakCounter());

    // Build up a streak
    act(() => {
      result.current.incrementStreak(); // 1
      result.current.incrementStreak(); // 2
      result.current.incrementStreak(); // 3
      result.current.incrementStreak(); // 4
      result.current.incrementStreak(); // 5
    });

    expect(result.current.streakState.currentStreak).toBe(5);
    expect(result.current.streakState.bestStreak).toBe(5);
    expect(result.current.streakState.currentMilestoneColor).toBe("text-green-500");

    // User makes incorrect guess
    act(() => {
      result.current.resetStreak();
    });

    expect(result.current.streakState.currentStreak).toBe(0);
    expect(result.current.streakState.bestStreak).toBe(5); // Preserved
    expect(result.current.streakState.currentMilestoneColor).toBeNull(); // Reset
  });

  it("scenario: user exceeds previous best streak", () => {
    const { result } = renderHook(() => useStreakCounter());

    // First attempt: reach 3
    act(() => {
      result.current.incrementStreak(); // 1
      result.current.incrementStreak(); // 2
      result.current.incrementStreak(); // 3
    });
    expect(result.current.streakState.bestStreak).toBe(3);

    // Reset
    act(() => {
      result.current.resetStreak();
    });

    // Second attempt: reach 5 (new best)
    act(() => {
      result.current.incrementStreak(); // 1
      result.current.incrementStreak(); // 2
      result.current.incrementStreak(); // 3
      result.current.incrementStreak(); // 4
      result.current.incrementStreak(); // 5
    });

    expect(result.current.streakState.currentStreak).toBe(5);
    expect(result.current.streakState.bestStreak).toBe(5); // Updated
  });

  it("scenario: milestone color persists between milestones", () => {
    const { result } = renderHook(() => useStreakCounter());

    // Reach milestone 3 (blue)
    act(() => {
      result.current.incrementStreak(); // 1
      result.current.incrementStreak(); // 2
      result.current.incrementStreak(); // 3
    });
    expect(result.current.streakState.currentMilestoneColor).toBe("text-blue-500");

    // Continue to 4 (color should persist)
    act(() => {
      result.current.incrementStreak(); // 4
    });
    expect(result.current.streakState.currentMilestoneColor).toBe("text-blue-500");

    // Reach milestone 5 (green)
    act(() => {
      result.current.incrementStreak(); // 5
    });
    expect(result.current.streakState.currentMilestoneColor).toBe("text-green-500");
  });

  it("scenario: StreakDisplay shows correct values throughout flow", () => {
    const { result } = renderHook(() => useStreakCounter());

    // Render StreakDisplay with initial state
    const { rerender } = render(
      <StreakDisplay
        currentStreak={result.current.streakState.currentStreak}
        bestStreak={result.current.streakState.bestStreak}
        milestoneColor={result.current.streakState.currentMilestoneColor}
      />
    );

    expect(screen.getByText(/Current:\s*0/)).toBeInTheDocument();
    expect(screen.getByText(/Best:\s*0/)).toBeInTheDocument();

    // Increment to 3
    act(() => {
      result.current.incrementStreak();
      result.current.incrementStreak();
      result.current.incrementStreak();
    });

    rerender(
      <StreakDisplay
        currentStreak={result.current.streakState.currentStreak}
        bestStreak={result.current.streakState.bestStreak}
        milestoneColor={result.current.streakState.currentMilestoneColor}
      />
    );

    expect(screen.getByText(/Current:\s*3/)).toBeInTheDocument();
    expect(screen.getByText(/Best:\s*3/)).toBeInTheDocument();

    // Reset
    act(() => {
      result.current.resetStreak();
    });

    rerender(
      <StreakDisplay
        currentStreak={result.current.streakState.currentStreak}
        bestStreak={result.current.streakState.bestStreak}
        milestoneColor={result.current.streakState.currentMilestoneColor}
      />
    );

    expect(screen.getByText(/Current:\s*0/)).toBeInTheDocument();
    expect(screen.getByText(/Best:\s*3/)).toBeInTheDocument();
  });

  it("scenario: streak continues beyond milestone 100", () => {
    const { result } = renderHook(() => useStreakCounter());

    // Simulate reaching 100
    act(() => {
      for (let i = 0; i < 100; i++) {
        result.current.incrementStreak();
      }
    });

    expect(result.current.streakState.currentStreak).toBe(100);
    expect(result.current.streakState.currentMilestoneColor).toBe("text-magenta-500");

    // Continue beyond 100
    act(() => {
      result.current.incrementStreak(); // 101
    });

    expect(result.current.streakState.currentStreak).toBe(101);
    expect(result.current.streakState.currentMilestoneColor).toBe("text-magenta-500"); // Color persists
  });

  it("scenario: best streak never decreases", () => {
    const { result } = renderHook(() => useStreakCounter());

    // Reach 10
    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.incrementStreak();
      }
    });
    expect(result.current.streakState.bestStreak).toBe(10);

    // Reset and reach only 5
    act(() => {
      result.current.resetStreak();
      for (let i = 0; i < 5; i++) {
        result.current.incrementStreak();
      }
    });

    expect(result.current.streakState.currentStreak).toBe(5);
    expect(result.current.streakState.bestStreak).toBe(10); // Still 10, not 5
  });
});
