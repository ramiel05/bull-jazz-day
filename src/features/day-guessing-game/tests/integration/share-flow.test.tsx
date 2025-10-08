import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ShareButton from '~/features/day-guessing-game/components/share-button';
import type { GuessResult } from '~/features/day-guessing-game/types/game-types';
import type { StreakState } from '~/features/day-guessing-game/streak/types/streak-types';

describe('Share Flow Integration', () => {
  let mockWriteText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
      configurable: true,
    });
  });

  const createGuessResult = (correct: boolean, isReal: boolean, dayName: string): GuessResult => ({
    correct,
    day: {
      id: '1',
      name: dayName,
      isReal,
      date: 'September 21',
      description: 'Test description',
      sourceUrl: 'https://example.com',
    },
  });

  const createStreakState = (currentStreak: number, bestStreak: number): StreakState => ({
    currentStreak,
    bestStreak,
    currentMilestoneColor: null,
    lastGuessDate: '2025-10-07',
  });

  it('should copy complete message for correct guess with no streak', async () => {
    const guessResult = createGuessResult(true, true, 'International Day of Peace');
    const streakState = createStreakState(0, 0);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    fireEvent.click(screen.getByRole('button', { name: /share/i }));

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalled();
    });

    const copiedText = mockWriteText.mock.calls[0][0];
    expect(copiedText).toContain('🎉 Correct!');
    expect(copiedText).toContain('International Day of Peace is real!');
    expect(copiedText).toContain('My guess: Real');
    expect(copiedText).toContain('https://bull-jazz-day.vercel.app');
    expect(copiedText).not.toContain('Current streak');
  });

  it('should copy message with milestone for streak = 5', async () => {
    const guessResult = createGuessResult(true, true, 'International Day of Friendship');
    const streakState = createStreakState(5, 5);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    fireEvent.click(screen.getByRole('button', { name: /share/i }));

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalled();
    });

    const copiedText = mockWriteText.mock.calls[0][0];
    expect(copiedText).toContain('Current streak: 5');
    expect(copiedText).toContain('Milestone reached: 5-day streak!');
  });

  it('should copy message without streak for incorrect guess', async () => {
    const guessResult = createGuessResult(false, false, 'International Day of Jazz');
    const streakState = createStreakState(0, 5);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    fireEvent.click(screen.getByRole('button', { name: /share/i }));

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalled();
    });

    const copiedText = mockWriteText.mock.calls[0][0];
    expect(copiedText).toContain('❌ Incorrect!');
    expect(copiedText).toContain('International Day of Jazz is fake!');
    expect(copiedText).not.toContain('Current streak');
  });

  it('should include new best text when current exceeds best', async () => {
    const guessResult = createGuessResult(true, true, 'World Food Day');
    const streakState = createStreakState(10, 8);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    fireEvent.click(screen.getByRole('button', { name: /share/i }));

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalled();
    });

    const copiedText = mockWriteText.mock.calls[0][0];
    expect(copiedText).toContain('Current streak: 10');
    expect(copiedText).toContain('Milestone reached: 10-day streak!');
    expect(copiedText).toContain('New personal best: 10-day streak!');
  });

  it('should show error message when clipboard fails', async () => {
    mockWriteText.mockRejectedValue(new Error('Permission denied'));

    const guessResult = createGuessResult(true, true, 'International Day of Peace');
    const streakState = createStreakState(0, 0);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    fireEvent.click(screen.getByRole('button', { name: /share/i }));

    await waitFor(() => {
      expect(screen.getByText('Copy failed')).toBeInTheDocument();
    });
  });

  it('should allow multiple shares in succession', async () => {
    const guessResult = createGuessResult(true, true, 'International Day of Peace');
    const streakState = createStreakState(3, 3);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    // First share
    fireEvent.click(screen.getByRole('button', { name: /share/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
    });
    expect(mockWriteText).toHaveBeenCalledTimes(1);

    // Second share (while still showing "Copied!")
    fireEvent.click(screen.getByRole('button', { name: /copied/i }));
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledTimes(2);
    });

    // Both calls should have copied the same message
    expect(mockWriteText.mock.calls[0][0]).toBe(mockWriteText.mock.calls[1][0]);
  });
});
