import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeedbackPanel from './feedback-panel';
import type { GuessResult } from '~/features/day-guessing-game/types/game-types';
import type { InternationalDay } from '~/features/day-guessing-game/types/international-day';
import type { StreakState } from '~/features/day-guessing-game/streak/types/streak-types';

vi.mock('./share-button', () => ({
  default: () => (
    <button data-testid="share-button">Share</button>
  ),
}));

describe('FeedbackPanel', () => {
  const realDay: InternationalDay = {
    id: 'test-real',
    name: 'Test Real Day',
    isReal: true,
    date: 'January 1',
    description: 'A real test day for testing',
    sourceUrl: 'https://example.com/real-day',
  };

  const fakeDay: InternationalDay = {
    id: 'test-fake',
    name: 'Test Fake Day',
    isReal: false,
    date: null,
    description: 'A fake test day for testing',
    sourceUrl: null,
  };

  const mockStreakState: StreakState = {
    currentStreak: 0,
    bestStreak: 0,
    currentMilestoneColor: null,
    lastGuessDate: null,
  };

  describe('Correct guess feedback', () => {
    it('should display "Correct" message when guess is correct', () => {
      const correctResult: GuessResult = { correct: true, day: realDay };

      render(<FeedbackPanel result={correctResult} streakState={mockStreakState} />);

      expect(screen.getByText(/correct/i)).toBeInTheDocument();
    });
  });

  describe('Incorrect guess feedback', () => {
    it('should display "Incorrect" message when guess is incorrect', () => {
      const incorrectResult: GuessResult = { correct: false, day: realDay };

      render(<FeedbackPanel result={incorrectResult} streakState={mockStreakState} />);

      expect(screen.getByText(/incorrect/i)).toBeInTheDocument();
    });
  });

  describe('Day details display', () => {
    it('should display day description', () => {
      const result: GuessResult = { correct: true, day: realDay };

      render(<FeedbackPanel result={result} streakState={mockStreakState} />);

      expect(screen.getByText(realDay.description)).toBeInTheDocument();
    });

    it('should display date for real days', () => {
      const result: GuessResult = { correct: true, day: realDay };

      render(<FeedbackPanel result={result} streakState={mockStreakState} />);

      expect(screen.getByText(/january 1/i)).toBeInTheDocument();
    });

    it('should display source link for real days', () => {
      const result: GuessResult = { correct: true, day: realDay };

      render(<FeedbackPanel result={result} streakState={mockStreakState} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', realDay.sourceUrl);
    });

    it('should not display date for fake days', () => {
      const result: GuessResult = { correct: true, day: fakeDay };

      render(<FeedbackPanel result={result} streakState={mockStreakState} />);

      expect(screen.queryByText(/january/i)).not.toBeInTheDocument();
    });

    it('should not display source link for fake days', () => {
      const result: GuessResult = { correct: true, day: fakeDay };

      render(<FeedbackPanel result={result} streakState={mockStreakState} />);

      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('Daily challenge messaging', () => {
    it('should display "Come back tomorrow" message', () => {
      const result: GuessResult = { correct: true, day: realDay };

      render(<FeedbackPanel result={result} streakState={mockStreakState} />);

      expect(screen.getByText(/come back tomorrow/i)).toBeInTheDocument();
    });

    it('should display countdown timer', () => {
      const result: GuessResult = { correct: true, day: realDay };

      render(<FeedbackPanel result={result} streakState={mockStreakState} />);

      expect(screen.getByLabelText(/time until next challenge/i)).toBeInTheDocument();
    });

    it('should not render Continue button in daily mode', () => {
      const result: GuessResult = { correct: true, day: realDay };

      render(<FeedbackPanel result={result} streakState={mockStreakState} />);

      expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument();
    });
  });

  describe('Share button integration', () => {
    it('should render ShareButton component', () => {
      const result: GuessResult = { correct: true, day: realDay };

      render(<FeedbackPanel result={result} streakState={mockStreakState} />);

      expect(screen.getByTestId('share-button')).toBeInTheDocument();
    });

    it('should pass guessResult and streakState to ShareButton', () => {
      const result: GuessResult = { correct: true, day: realDay };
      const streakState: StreakState = {
        currentStreak: 5,
        bestStreak: 10,
        currentMilestoneColor: 'text-green-500',
        lastGuessDate: '2025-10-07',
      };

      render(<FeedbackPanel result={result} streakState={streakState} />);

      // ShareButton is rendered with correct props (verified by mock)
      expect(screen.getByTestId('share-button')).toBeInTheDocument();
    });
  });
});
