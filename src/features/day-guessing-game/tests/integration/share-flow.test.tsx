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

  // Gap 1: Clipboard API completely unavailable
  it('should show error when clipboard API is unavailable', async () => {
    // Simulate browser without clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const guessResult = createGuessResult(true, true, 'International Day of Peace');
    const streakState = createStreakState(0, 0);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    fireEvent.click(screen.getByRole('button', { name: /share/i }));

    await waitFor(() => {
      expect(screen.getByText('Copy failed')).toBeInTheDocument();
    });
  });

  // Gap 2: Share after failure should work
  it('should allow retry after copy failure', async () => {
    // First attempt fails
    mockWriteText.mockRejectedValueOnce(new Error('Permission denied'));

    const guessResult = createGuessResult(true, true, 'International Day of Peace');
    const streakState = createStreakState(2, 2);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    // First share fails
    fireEvent.click(screen.getByRole('button', { name: /share/i }));
    await waitFor(() => {
      expect(screen.getByText('Copy failed')).toBeInTheDocument();
    });

    // Second attempt succeeds (mock now resolves)
    mockWriteText.mockResolvedValueOnce(undefined);
    fireEvent.click(screen.getByText('Copy failed'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
    });
  });

  // Gap 3: Correct guess on FAKE day
  it('should copy message for correct guess on fake day', async () => {
    const guessResult = createGuessResult(true, false, 'International Day of Unicorns');
    const streakState = createStreakState(3, 3);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    fireEvent.click(screen.getByRole('button', { name: /share/i }));

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalled();
    });

    const copiedText = mockWriteText.mock.calls[0][0];
    expect(copiedText).toContain('🎉 Correct!');
    expect(copiedText).toContain('International Day of Unicorns is fake!');
    expect(copiedText).toContain('My guess: Fake');
    expect(copiedText).toContain('Current streak: 3');
  });

  // Gap 3: Incorrect guess on REAL day (guessed fake, was real)
  it('should copy message for incorrect guess on real day', async () => {
    const guessResult = createGuessResult(false, true, 'World Food Day');
    const streakState = createStreakState(0, 5);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    fireEvent.click(screen.getByRole('button', { name: /share/i }));

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalled();
    });

    const copiedText = mockWriteText.mock.calls[0][0];
    expect(copiedText).toContain('❌ Incorrect!');
    expect(copiedText).toContain('World Food Day is real!');
    expect(copiedText).toContain('My guess: Fake');
    expect(copiedText).not.toContain('Current streak');
  });

  // Gap 4: All milestone values tested
  it.each([3, 15, 20, 30, 50, 100])(
    'should show milestone text for streak = %i',
    async (milestone) => {
      const guessResult = createGuessResult(true, true, 'International Day of Test');
      const streakState = createStreakState(milestone, milestone);

      render(<ShareButton guessResult={guessResult} streakState={streakState} />);

      fireEvent.click(screen.getByRole('button', { name: /share/i }));

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalled();
      });

      const copiedText = mockWriteText.mock.calls[0][0];
      expect(copiedText).toContain(`Current streak: ${milestone}`);
      expect(copiedText).toContain(`Milestone reached: ${milestone}-day streak!`);
    }
  );

  // Gap 5: Message formatting validation
  it('should format message with proper line breaks', async () => {
    const guessResult = createGuessResult(true, true, 'International Day of Peace');
    const streakState = createStreakState(5, 5);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    fireEvent.click(screen.getByRole('button', { name: /share/i }));

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalled();
    });

    const copiedText = mockWriteText.mock.calls[0][0];

    // Should contain newlines between sections
    expect(copiedText).toMatch(/🎉 Correct!\n\n/);
    expect(copiedText).toMatch(/My guess: Real\n\n/);
    expect(copiedText).toMatch(/Milestone reached.*\n\n/);

    // Should not have trailing whitespace on lines
    const lines = copiedText.split('\n');
    lines.forEach((line: string) => {
      if (line.length > 0) {
        expect(line).toBe(line.trimEnd());
      }
    });
  });

  // Gap 10: Concurrent share clicks
  it('should handle rapid successive shares without race conditions', async () => {
    const guessResult = createGuessResult(true, true, 'International Day of Peace');
    const streakState = createStreakState(2, 2);

    // Simulate slow clipboard API
    let resolveFirstCopy: () => void;
    const firstCopyPromise = new Promise<void>((resolve) => {
      resolveFirstCopy = resolve;
    });

    mockWriteText.mockImplementationOnce(() => firstCopyPromise);
    mockWriteText.mockResolvedValue(undefined);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    const button = screen.getByRole('button', { name: /share/i });

    // Click multiple times rapidly
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    // Resolve first copy
    resolveFirstCopy!();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
    });

    // Should have attempted copy for each click
    expect(mockWriteText.mock.calls.length).toBeGreaterThanOrEqual(3);
  });
});
