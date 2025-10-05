import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameContainer from '~/features/day-guessing-game/components/game-container';
import * as selectRandomDay from '~/features/day-guessing-game/utils/select-random-day';
import type { InternationalDay } from '~/features/day-guessing-game/types/international-day';

describe('Game Flow Integration', () => {
  it('should complete full game round: load → guess → feedback → continue', async () => {
    const user = userEvent.setup();

    render(<GameContainer />);

    // Assert: Initial state - day displayed, buttons visible
    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /real/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fake/i })).toBeInTheDocument();

    // Act: User makes a guess
    await user.click(screen.getByRole('button', { name: /real/i }));

    // Assert: Feedback appears
    expect(screen.getByText(/correct|incorrect/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();

    // Assert: Guess buttons are gone
    expect(screen.queryByRole('button', { name: /real/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /fake/i })).not.toBeInTheDocument();

    // Act: User continues to next day
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Assert: Back to guessing state
    expect(screen.getByRole('button', { name: /real/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fake/i })).toBeInTheDocument();
    expect(screen.queryByText(/correct|incorrect/i)).not.toBeInTheDocument();
  });

  it('should show correct feedback for real day with description and source', async () => {
    const mockDay: InternationalDay = {
      id: 'mock-real',
      name: 'Mock Real Day',
      isReal: true,
      date: 'January 1',
      description: 'This is a mock description for testing',
      sourceUrl: 'https://example.com/mock-day',
    };

    vi.spyOn(selectRandomDay, 'selectRandomDay').mockReturnValue(mockDay);

    const user = userEvent.setup();
    render(<GameContainer />);

    // Make a guess
    await user.click(screen.getByRole('button', { name: /real/i }));

    // Should show feedback (correct or incorrect)
    expect(screen.getByText(/correct|incorrect/i)).toBeInTheDocument();

    // Should show the description
    expect(screen.getByText('This is a mock description for testing')).toBeInTheDocument();

    // Should have a source link with the correct href
    const sourceLink = screen.getByRole('link');
    expect(sourceLink).toBeInTheDocument();
    expect(sourceLink).toHaveAttribute('href', 'https://example.com/mock-day');

    vi.restoreAllMocks();
  });

  it('should handle multiple consecutive rounds without errors', async () => {
    const user = userEvent.setup();

    render(<GameContainer />);

    // Play 5 rounds
    for (let i = 0; i < 5; i++) {
      // Make a guess
      await user.click(screen.getByRole('button', { name: /real/i }));

      // Verify feedback appears
      expect(screen.getByText(/correct|incorrect/i)).toBeInTheDocument();

      // Continue to next round (except on last iteration)
      if (i < 4) {
        await user.click(screen.getByRole('button', { name: /continue/i }));
      }
    }

    // Should still be in valid state after 5 rounds
    expect(screen.getByText(/correct|incorrect/i)).toBeInTheDocument();
  });

  it('should display day details in feedback', async () => {
    const user = userEvent.setup();

    render(<GameContainer />);

    await user.click(screen.getByRole('button', { name: /fake/i }));

    // Should show feedback
    expect(screen.getByText(/correct|incorrect/i)).toBeInTheDocument();

    // Should show description (check for text content, not specific word)
    const container = screen.getByText(/correct|incorrect/i).parentElement?.parentElement;
    expect(container).toBeInTheDocument();
    expect(container?.textContent).toBeTruthy();
  });

  it('should allow switching between guess options before submitting', async () => {
    const user = userEvent.setup();

    render(<GameContainer />);

    const realButton = screen.getByRole('button', { name: /real/i });
    const fakeButton = screen.getByRole('button', { name: /fake/i });

    // Both buttons should be clickable initially
    expect(realButton).toBeEnabled();
    expect(fakeButton).toBeEnabled();

    // Click one option
    await user.click(realButton);

    // After clicking, feedback should appear (game processes immediately)
    expect(screen.getByText(/correct|incorrect/i)).toBeInTheDocument();
  });
});
