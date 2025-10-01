import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedbackPanel from '../../components/feedback-panel';
import type { GuessResult } from '../../types/game-types';
import type { InternationalDay } from '../../types/international-day';

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

  describe('Correct guess feedback', () => {
    it('should display "Correct" message when guess is correct', () => {
      const correctResult: GuessResult = { correct: true, day: realDay };

      render(<FeedbackPanel result={correctResult} onContinue={vi.fn()} />);

      expect(screen.getByText(/correct/i)).toBeInTheDocument();
    });
  });

  describe('Incorrect guess feedback', () => {
    it('should display "Incorrect" message when guess is incorrect', () => {
      const incorrectResult: GuessResult = { correct: false, day: realDay };

      render(<FeedbackPanel result={incorrectResult} onContinue={vi.fn()} />);

      expect(screen.getByText(/incorrect/i)).toBeInTheDocument();
    });
  });

  describe('Day details display', () => {
    it('should display day description', () => {
      const result: GuessResult = { correct: true, day: realDay };

      render(<FeedbackPanel result={result} onContinue={vi.fn()} />);

      expect(screen.getByText(realDay.description)).toBeInTheDocument();
    });

    it('should display date for real days', () => {
      const result: GuessResult = { correct: true, day: realDay };

      render(<FeedbackPanel result={result} onContinue={vi.fn()} />);

      expect(screen.getByText(/january 1/i)).toBeInTheDocument();
    });

    it('should display source link for real days', () => {
      const result: GuessResult = { correct: true, day: realDay };

      render(<FeedbackPanel result={result} onContinue={vi.fn()} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', realDay.sourceUrl);
    });

    it('should not display date for fake days', () => {
      const result: GuessResult = { correct: true, day: fakeDay };

      render(<FeedbackPanel result={result} onContinue={vi.fn()} />);

      expect(screen.queryByText(/january/i)).not.toBeInTheDocument();
    });

    it('should not display source link for fake days', () => {
      const result: GuessResult = { correct: true, day: fakeDay };

      render(<FeedbackPanel result={result} onContinue={vi.fn()} />);

      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('Continue button', () => {
    it('should render Continue button', () => {
      const result: GuessResult = { correct: true, day: realDay };

      render(<FeedbackPanel result={result} onContinue={vi.fn()} />);

      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });

    it('should call onContinue when Continue button is clicked', async () => {
      const user = userEvent.setup();
      const onContinueMock = vi.fn();
      const result: GuessResult = { correct: true, day: realDay };

      render(<FeedbackPanel result={result} onContinue={onContinueMock} />);

      await user.click(screen.getByRole('button', { name: /continue/i }));

      expect(onContinueMock).toHaveBeenCalledTimes(1);
    });
  });
});
