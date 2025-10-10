import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameContainer from './game-container';

// Mock the days pool to have predictable data for testing
vi.mock('~/features/day-guessing-game/data/days-pool', () => ({
  daysPool: [
    {
      id: 'mock-real',
      name: 'Mock Real Day',
      isReal: true,
      date: '01-01',
      description: 'A mock real day',
      sourceUrl: 'https://example.com',
    },
    {
      id: 'mock-fake',
      name: 'Mock Fake Day',
      isReal: false,
      date: null,
      description: 'A mock fake day',
      sourceUrl: null,
    },
  ],
}));

describe('GameContainer - Daily Mode', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should render "Today is" prompt with day name', () => {
      render(<GameContainer />);

      expect(screen.getByText(/today is/i)).toBeInTheDocument();

      // Should show the daily challenge day name
      const heading = screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
    });

    it('should render guess buttons on initial load', () => {
      render(<GameContainer />);

      expect(screen.getByRole('button', { name: /real/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /fake/i })).toBeInTheDocument();
    });

    it('should not show feedback panel on initial load', () => {
      render(<GameContainer />);

      expect(screen.queryByText(/correct/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/incorrect/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/come back tomorrow/i)).not.toBeInTheDocument();
    });
  });

  describe('Guess flow - Daily mode', () => {
    it('should show feedback after making a guess', async () => {
      const user = userEvent.setup();
      render(<GameContainer />);

      await user.click(screen.getByRole('button', { name: /real/i }));

      // Should show either "Correct" or "Incorrect"
      expect(
        screen.getByText(/correct/i) || screen.getByText(/incorrect/i)
      ).toBeInTheDocument();
    });

    it('should hide guess buttons after making a guess', async () => {
      const user = userEvent.setup();
      render(<GameContainer />);

      await user.click(screen.getByRole('button', { name: /real/i }));

      // Guess buttons should not be visible after guessing
      expect(screen.queryByRole('button', { name: /real/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /fake/i })).not.toBeInTheDocument();
    });

    it('should show "Come back tomorrow" message after guessing', async () => {
      const user = userEvent.setup();
      render(<GameContainer />);

      await user.click(screen.getByRole('button', { name: /real/i }));

      expect(screen.getByText(/come back tomorrow/i)).toBeInTheDocument();
    });

    it('should show day description after making a guess', async () => {
      const user = userEvent.setup();
      render(<GameContainer />);

      await user.click(screen.getByRole('button', { name: /real/i }));

      expect(screen.getByText(/mock (real|fake) day/i)).toBeInTheDocument();
    });

    it('should reveal whether the day is real or fake', async () => {
      const user = userEvent.setup();
      render(<GameContainer />);

      await user.click(screen.getByRole('button', { name: /real/i }));

      expect(screen.getByText(/this is a (real|fake) international day/i)).toBeInTheDocument();
    });
  });

  describe('Daily challenge persistence', () => {
    it('should show the same challenge after page reload', () => {
      const { unmount } = render(<GameContainer />);

      const dayName1 = screen.getByRole('heading').textContent;

      unmount();

      render(<GameContainer />);

      const dayName2 = screen.getByRole('heading').textContent;

      expect(dayName1).toBe(dayName2);
    });

    it('should persist guess result after page reload', async () => {
      const user = userEvent.setup();

      const { unmount } = render(<GameContainer />);

      await user.click(screen.getByRole('button', { name: /real/i }));

      const feedbackText = screen.getByText(/correct|incorrect/i).textContent;

      unmount();

      render(<GameContainer />);

      // Should still show the same feedback
      expect(screen.getByText(/correct|incorrect/i).textContent).toBe(feedbackText);

      // Should not show guess buttons
      expect(screen.queryByRole('button', { name: /real/i })).not.toBeInTheDocument();
    });
  });

  describe('No continue button in daily mode', () => {
    it('should not show Continue button after guessing', async () => {
      const user = userEvent.setup();
      render(<GameContainer />);

      await user.click(screen.getByRole('button', { name: /real/i }));

      // Continue button should not exist in daily mode
      expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument();
    });
  });

  // Gap 3: Comprehensive real/fake day feedback scenarios
  describe('Real vs Fake day feedback', () => {
    it('should show correct real/fake status regardless of guess outcome', async () => {
      const user = userEvent.setup();
      render(<GameContainer />);

      // Make a guess (either button)
      await user.click(screen.getByRole('button', { name: /real/i }));

      // Should always reveal the truth: "This is a real international day" or "This is a fake international day"
      const truthText = screen.getByText(/this is a (real|fake) international day/i);
      expect(truthText).toBeInTheDocument();

      // The text should match one of our mocked days
      expect(
        truthText.textContent?.includes('real') || truthText.textContent?.includes('fake')
      ).toBe(true);
    });

    it('should show appropriate feedback and truth for fake button guess', async () => {
      const user = userEvent.setup();
      render(<GameContainer />);

      await user.click(screen.getByRole('button', { name: /fake/i }));

      // Should show feedback (correct or incorrect)
      expect(
        screen.getByText(/correct/i) || screen.getByText(/incorrect/i)
      ).toBeInTheDocument();

      // Should reveal the actual status
      expect(screen.getByText(/this is a (real|fake) international day/i)).toBeInTheDocument();
    });
  });
});
