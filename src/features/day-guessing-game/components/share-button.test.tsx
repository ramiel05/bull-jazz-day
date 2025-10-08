import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareButton from './share-button';
import type { GuessResult } from '~/features/day-guessing-game/types/game-types';
import type { StreakState } from '~/features/day-guessing-game/streak/types/streak-types';

vi.mock('~/features/day-guessing-game/share/utils/format-share-message', () => ({
  formatShareMessage: vi.fn((data) => `Formatted message for ${data.dayName}`),
}));

vi.mock('~/features/day-guessing-game/share/utils/copy-to-clipboard', () => ({
  copyToClipboard: vi.fn(),
}));

describe('ShareButton', () => {
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

  afterEach(() => {
    vi.useRealTimers();
  });

  const createMockGuessResult = (correct: boolean, isReal: boolean): GuessResult => ({
    correct,
    day: {
      id: '1',
      name: 'International Day of Peace',
      isReal,
      date: 'September 21',
      description: 'A day for peace',
      sourceUrl: 'https://example.com',
    },
  });

  const createMockStreakState = (currentStreak: number, bestStreak: number): StreakState => ({
    currentStreak,
    bestStreak,
    currentMilestoneColor: null,
    lastGuessDate: '2025-10-07',
  });

  it('should render with "Share" button initially', () => {
    const guessResult = createMockGuessResult(true, true);
    const streakState = createMockStreakState(0, 0);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
  });

  it('should assemble correct ShareMessageData for correct guess', async () => {
    const { formatShareMessage } = await import('~/features/day-guessing-game/share/utils/format-share-message');
    const { copyToClipboard } = await import('~/features/day-guessing-game/share/utils/copy-to-clipboard');

    const user = userEvent.setup();
    const guessResult = createMockGuessResult(true, true);
    const streakState = createMockStreakState(5, 8);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    await user.click(screen.getByRole('button', { name: /share/i }));

    expect(formatShareMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        dayName: 'International Day of Peace',
        dayType: 'real',
        playerGuess: 'real',
        isCorrect: true,
        currentStreak: 5,
      })
    );
    expect(copyToClipboard).toHaveBeenCalled();
  });

  it('should assemble correct ShareMessageData for incorrect guess', async () => {
    const { formatShareMessage } = await import('~/features/day-guessing-game/share/utils/format-share-message');

    const user = userEvent.setup();
    const guessResult = createMockGuessResult(false, true);
    const streakState = createMockStreakState(0, 5);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    await user.click(screen.getByRole('button', { name: /share/i }));

    expect(formatShareMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        dayName: 'International Day of Peace',
        dayType: 'real',
        playerGuess: 'fake',
        isCorrect: false,
        currentStreak: 0,
      })
    );
  });

  it('should show "Copied!" after successful copy', async () => {
    const { copyToClipboard } = await import('~/features/day-guessing-game/share/utils/copy-to-clipboard');
    vi.mocked(copyToClipboard).mockResolvedValue();

    const user = userEvent.setup();
    const guessResult = createMockGuessResult(true, true);
    const streakState = createMockStreakState(0, 0);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    await user.click(screen.getByRole('button', { name: /share/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
    });
  });

  it('should show "Copy failed" after failed copy', async () => {
    const { copyToClipboard } = await import('~/features/day-guessing-game/share/utils/copy-to-clipboard');
    vi.mocked(copyToClipboard).mockRejectedValue(new Error('Permission denied'));

    const user = userEvent.setup();
    const guessResult = createMockGuessResult(true, true);
    const streakState = createMockStreakState(0, 0);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    await user.click(screen.getByRole('button', { name: /share/i }));

    await waitFor(() => {
      expect(screen.getByText('Copy failed')).toBeInTheDocument();
    });
  });

  it('should revert "Copied!" to "Share" after 5 seconds', async () => {
    const { copyToClipboard } = await import('~/features/day-guessing-game/share/utils/copy-to-clipboard');
    vi.mocked(copyToClipboard).mockResolvedValue();

    vi.useFakeTimers();

    const guessResult = createMockGuessResult(true, true);
    const streakState = createMockStreakState(0, 0);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    const button = screen.getByRole('button', { name: /share/i });
    fireEvent.click(button);

    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
  });

  it('should revert "Copy failed" to "Share" after 5 seconds', async () => {
    const { copyToClipboard } = await import('~/features/day-guessing-game/share/utils/copy-to-clipboard');
    vi.mocked(copyToClipboard).mockRejectedValue(new Error('Permission denied'));

    vi.useFakeTimers();

    const guessResult = createMockGuessResult(true, true);
    const streakState = createMockStreakState(0, 0);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    const button = screen.getByRole('button', { name: /share/i });
    fireEvent.click(button);

    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    expect(screen.getByText('Copy failed')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
  });

  it('should include milestone text when at milestone', async () => {
    const { formatShareMessage } = await import('~/features/day-guessing-game/share/utils/format-share-message');

    const user = userEvent.setup();
    const guessResult = createMockGuessResult(true, true);
    const streakState = createMockStreakState(5, 5);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    await user.click(screen.getByRole('button', { name: /share/i }));

    expect(formatShareMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        milestoneText: expect.stringContaining('5-day streak'),
      })
    );
  });

  it('should include new best text when current > best', async () => {
    const { formatShareMessage } = await import('~/features/day-guessing-game/share/utils/format-share-message');

    const user = userEvent.setup();
    const guessResult = createMockGuessResult(true, true);
    const streakState = createMockStreakState(8, 5);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    await user.click(screen.getByRole('button', { name: /share/i }));

    expect(formatShareMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        newBestText: expect.stringContaining('8-day streak'),
      })
    );
  });

  it('should not include milestone text when not at milestone', async () => {
    const { formatShareMessage } = await import('~/features/day-guessing-game/share/utils/format-share-message');

    const user = userEvent.setup();
    const guessResult = createMockGuessResult(true, true);
    const streakState = createMockStreakState(7, 10);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    await user.click(screen.getByRole('button', { name: /share/i }));

    expect(formatShareMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        milestoneText: null,
      })
    );
  });

  it('should have accessibility attributes', () => {
    const guessResult = createMockGuessResult(true, true);
    const streakState = createMockStreakState(0, 0);

    render(<ShareButton guessResult={guessResult} streakState={streakState} />);

    const button = screen.getByRole('button', { name: /share/i });
    expect(button).toHaveAttribute('aria-label');
  });
});
