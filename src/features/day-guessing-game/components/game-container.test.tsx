import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameContainer from '../../components/game-container';

// Mock the days pool to have predictable data for testing
vi.mock('../../data/days-pool', () => ({
  daysPool: [
    {
      id: 'mock-real',
      name: 'Mock Real Day',
      isReal: true,
      date: 'January 1',
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

describe('GameContainer', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    vi.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should render a day name on initial load', () => {
      render(<GameContainer />);

      // Should show either "Mock Real Day" or "Mock Fake Day"
      const heading = screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toMatch(/Mock (Real|Fake) Day/);
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
      expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument();
    });
  });

  describe('Guess flow', () => {
    it('should show feedback after making a guess', async () => {
      const user = userEvent.setup();
      render(<GameContainer />);

      await user.click(screen.getByRole('button', { name: /real/i }));

      // Should show either "Correct" or "Incorrect" based on the day
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

    it('should show Continue button after making a guess', async () => {
      const user = userEvent.setup();
      render(<GameContainer />);

      await user.click(screen.getByRole('button', { name: /real/i }));

      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });

    it('should show day description after making a guess', async () => {
      const user = userEvent.setup();
      render(<GameContainer />);

      await user.click(screen.getByRole('button', { name: /real/i }));

      expect(screen.getByText(/mock (real|fake) day/i)).toBeInTheDocument();
    });
  });

  describe('Continue flow', () => {
    it('should return to guessing state after clicking Continue', async () => {
      const user = userEvent.setup();
      render(<GameContainer />);

      // Make a guess
      await user.click(screen.getByRole('button', { name: /real/i }));

      // Click Continue
      await user.click(screen.getByRole('button', { name: /continue/i }));

      // Should be back to guessing state
      expect(screen.getByRole('button', { name: /real/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /fake/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument();
    });

    it('should show a day name after continuing', async () => {
      const user = userEvent.setup();
      render(<GameContainer />);

      // Make a guess
      await user.click(screen.getByRole('button', { name: /real/i }));

      // Click Continue
      await user.click(screen.getByRole('button', { name: /continue/i }));

      // Should show a day name
      const heading = screen.getByRole('heading');
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toMatch(/Mock (Real|Fake) Day/);
    });
  });

  describe('Multiple rounds', () => {
    it('should handle multiple guess-continue cycles', async () => {
      const user = userEvent.setup();
      render(<GameContainer />);

      // Round 1
      await user.click(screen.getByRole('button', { name: /real/i }));
      await user.click(screen.getByRole('button', { name: /continue/i }));

      // Round 2
      await user.click(screen.getByRole('button', { name: /fake/i }));
      await user.click(screen.getByRole('button', { name: /continue/i }));

      // Round 3
      await user.click(screen.getByRole('button', { name: /real/i }));

      // Should still show feedback
      expect(
        screen.getByText(/correct/i) || screen.getByText(/incorrect/i)
      ).toBeInTheDocument();
    });
  });
});
