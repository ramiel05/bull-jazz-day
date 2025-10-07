import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDailyState } from './use-daily-state';

describe('useDailyState hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return initial state with a daily challenge', () => {
    const { result } = renderHook(() => useDailyState());

    expect(result.current.dailyChallenge).toBeDefined();
    expect(result.current.dailyChallenge).toHaveProperty('date');
    expect(result.current.dailyChallenge).toHaveProperty('internationalDay');
    expect(result.current.dailyChallenge).toHaveProperty('timezone');
  });

  it('should return initial game state', () => {
    const { result } = renderHook(() => useDailyState());

    expect(result.current.gameState).toBeDefined();
    expect(result.current.gameState).toHaveProperty('date');
    expect(result.current.gameState).toHaveProperty('guessedCorrectly');
    expect(result.current.gameState).toHaveProperty('timestamp');
  });

  it('should initialize with guessedCorrectly as null for new day', () => {
    const { result } = renderHook(() => useDailyState());

    expect(result.current.gameState.guessedCorrectly).toBe(null);
  });

  it('should provide a submitGuess function', () => {
    const { result } = renderHook(() => useDailyState());

    expect(typeof result.current.submitGuess).toBe('function');
  });

  it('should update gameState when submitGuess is called with correct guess', () => {
    const { result } = renderHook(() => useDailyState());

    const isReal = result.current.dailyChallenge.internationalDay.isReal;

    act(() => {
      result.current.submitGuess(isReal);
    });

    expect(result.current.gameState.guessedCorrectly).toBe(true);
  });

  it('should update gameState when submitGuess is called with incorrect guess', () => {
    const { result } = renderHook(() => useDailyState());

    const isReal = result.current.dailyChallenge.internationalDay.isReal;
    const wrongGuess = !isReal;

    act(() => {
      result.current.submitGuess(wrongGuess);
    });

    expect(result.current.gameState.guessedCorrectly).toBe(false);
  });

  it('should persist state to localStorage when submitting guess', () => {
    const { result } = renderHook(() => useDailyState());

    act(() => {
      result.current.submitGuess(true);
    });

    const stored = localStorage.getItem('daily-game-state');
    expect(stored).toBeDefined();

    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveProperty('guessedCorrectly');
    expect(typeof parsed.guessedCorrectly).toBe('boolean');
  });

  it('should restore state from localStorage on mount', () => {
    // First render: make a guess
    const { result: firstRender } = renderHook(() => useDailyState());

    act(() => {
      firstRender.current.submitGuess(true);
    });

    const firstGuessResult = firstRender.current.gameState.guessedCorrectly;

    // Second render: should restore from localStorage
    const { result: secondRender } = renderHook(() => useDailyState());

    expect(secondRender.current.gameState.guessedCorrectly).toBe(firstGuessResult);
  });

  it('should maintain the same daily challenge across re-renders on same day', () => {
    const { result: firstRender } = renderHook(() => useDailyState());
    const firstChallengeId = firstRender.current.dailyChallenge.internationalDay.id;

    const { result: secondRender } = renderHook(() => useDailyState());
    const secondChallengeId = secondRender.current.dailyChallenge.internationalDay.id;

    expect(firstChallengeId).toBe(secondChallengeId);
  });

  it('should update timestamp when submitting guess', () => {
    const { result } = renderHook(() => useDailyState());

    const initialTimestamp = result.current.gameState.timestamp;

    act(() => {
      result.current.submitGuess(true);
    });

    const updatedTimestamp = result.current.gameState.timestamp;

    expect(updatedTimestamp).toBeGreaterThanOrEqual(initialTimestamp);
  });

  it('should not allow changing guess after it has been submitted', () => {
    const { result } = renderHook(() => useDailyState());

    act(() => {
      result.current.submitGuess(true);
    });

    const firstResult = result.current.gameState.guessedCorrectly;

    act(() => {
      result.current.submitGuess(false);
    });

    const secondResult = result.current.gameState.guessedCorrectly;

    // Should remain the same (first guess locked in)
    expect(secondResult).toBe(firstResult);
  });

  it('should have consistent date between challenge and game state', () => {
    const { result } = renderHook(() => useDailyState());

    expect(result.current.dailyChallenge.date).toBe(result.current.gameState.date);
  });

  it('should handle transition to new day', () => {
    vi.useFakeTimers();

    // Start on October 5
    vi.setSystemTime(new Date('2025-10-05T12:00:00Z'));

    const { result: day1Render } = renderHook(() => useDailyState());

    act(() => {
      day1Render.current.submitGuess(true);
    });

    const day1ChallengeId = day1Render.current.dailyChallenge.internationalDay.id;

    // Move to October 6
    vi.setSystemTime(new Date('2025-10-06T12:00:00Z'));

    const { result: day2Render } = renderHook(() => useDailyState());

    // Should have new challenge
    expect(day2Render.current.dailyChallenge.internationalDay.id).not.toBe(day1ChallengeId);

    // Should have fresh state
    expect(day2Render.current.gameState.guessedCorrectly).toBe(null);

    vi.useRealTimers();
  });
});
