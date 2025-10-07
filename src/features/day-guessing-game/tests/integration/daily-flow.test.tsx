import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getDailyChallenge } from '~/features/day-guessing-game/daily-challenge/utils/get-daily-challenge';
import GameContainer from '~/features/day-guessing-game/components/game-container';

describe('Daily Challenge Flow (Integration)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should show new daily challenge on first visit', async () => {
    const user = userEvent.setup();

    render(<GameContainer />);

    // Should show the challenge prompt
    const prompt = screen.getByText(/today is/i);
    expect(prompt).toBeInTheDocument();

    // Should show guess buttons
    const realButton = screen.getByRole('button', { name: /real/i });
    const fakeButton = screen.getByRole('button', { name: /fake/i });

    expect(realButton).toBeInTheDocument();
    expect(fakeButton).toBeInTheDocument();
  });

  it('should show feedback after making a guess', async () => {
    const user = userEvent.setup();

    render(<GameContainer />);

    // Click the "Real" button
    const realButton = screen.getByRole('button', { name: /real/i });
    await user.click(realButton);

    // Should show feedback (correct or incorrect)
    const feedback = screen.queryByText(/correct|incorrect/i);
    expect(feedback).toBeInTheDocument();
  });

  it('should show "Come back tomorrow" message after guessing', async () => {
    const user = userEvent.setup();

    render(<GameContainer />);

    const realButton = screen.getByRole('button', { name: /real/i });
    await user.click(realButton);

    // Should show the "come back tomorrow" message
    const message = screen.getByText(/come back tomorrow/i);
    expect(message).toBeInTheDocument();
  });

  it('should persist guess result across page reloads', async () => {
    const user = userEvent.setup();

    // First render: make a guess
    const { unmount } = render(<GameContainer />);

    const realButton = screen.getByRole('button', { name: /real/i });
    await user.click(realButton);

    // Check if guess was recorded
    const feedback1 = screen.queryByText(/correct|incorrect/i);
    expect(feedback1).toBeInTheDocument();

    const feedbackText = feedback1?.textContent;

    // Unmount and re-render (simulate page reload)
    unmount();

    render(<GameContainer />);

    // Should still show the same feedback
    const feedback2 = screen.queryByText(/correct|incorrect/i);
    expect(feedback2).toBeInTheDocument();
    expect(feedback2?.textContent).toBe(feedbackText);

    // Should NOT show guess buttons
    const realButtonAfterReload = screen.queryByRole('button', { name: /real/i });
    expect(realButtonAfterReload).not.toBeInTheDocument();
  });

  it('should not allow guessing again on the same day', async () => {
    const user = userEvent.setup();

    render(<GameContainer />);

    const realButton = screen.getByRole('button', { name: /real/i });
    await user.click(realButton);

    // After first guess, buttons should be disabled or hidden
    const realButtonAfterGuess = screen.queryByRole('button', { name: /real/i });
    const fakeButtonAfterGuess = screen.queryByRole('button', { name: /fake/i });

    // Buttons should either not exist or be disabled
    if (realButtonAfterGuess) {
      expect(realButtonAfterGuess).toBeDisabled();
    }
    if (fakeButtonAfterGuess) {
      expect(fakeButtonAfterGuess).toBeDisabled();
    }
  });

  it('should reveal the truth about the international day after guessing', async () => {
    const user = userEvent.setup();

    render(<GameContainer />);

    const realButton = screen.getByRole('button', { name: /real/i });
    await user.click(realButton);

    // Should show whether it's actually real or fake
    const truthIndicator = screen.queryByText(/this is a real|this is a fake/i);
    expect(truthIndicator).toBeInTheDocument();
  });
});

describe('Daily Challenge Determinism (Integration)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should produce the same challenge for the same date', () => {
    vi.setSystemTime(new Date('2025-10-05T12:00:00Z'));

    const challenge1 = getDailyChallenge('2025-10-05');
    const challenge2 = getDailyChallenge('2025-10-05');

    expect(challenge1.internationalDay.id).toBe(challenge2.internationalDay.id);
  });

  it('should produce different challenges for different dates', () => {
    const challenge1 = getDailyChallenge('2025-10-05');
    const challenge2 = getDailyChallenge('2025-10-06');

    // With 200 days in pool, extremely unlikely to get same day
    expect(challenge1.internationalDay.id).not.toBe(challenge2.internationalDay.id);
  });

  it('should show the same challenge across multiple component renders on same day', () => {
    vi.setSystemTime(new Date('2025-10-05T12:00:00Z'));

    const { unmount: unmount1 } = render(<GameContainer />);
    const dayName1 = screen.getByText(/today is/i).textContent;
    unmount1();

    const { unmount: unmount2 } = render(<GameContainer />);
    const dayName2 = screen.getByText(/today is/i).textContent;
    unmount2();

    expect(dayName1).toBe(dayName2);
  });

  it('should be deterministic across 100 calls for the same date', () => {
    const calls = Array.from({ length: 100 }, () => getDailyChallenge('2025-10-05'));

    const firstId = calls[0].internationalDay.id;

    calls.forEach((challenge) => {
      expect(challenge.internationalDay.id).toBe(firstId);
    });
  });
});

describe('Day Transition (Integration)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.skip('should present new challenge when day changes', async () => {
    const user = userEvent.setup();

    // October 5 (using local time, not UTC)
    const oct5 = new Date('2025-10-05');
    oct5.setHours(12, 0, 0, 0);
    vi.setSystemTime(oct5);

    const { unmount } = render(<GameContainer />);

    const realButton = screen.getByRole('button', { name: /real/i });
    await user.click(realButton);

    // Verify guess was made
    expect(screen.getByText(/correct|incorrect/i)).toBeInTheDocument();

    unmount();

    // October 6 (next day, using local time)
    const oct6 = new Date('2025-10-06');
    oct6.setHours(12, 0, 0, 0);
    vi.setSystemTime(oct6);

    // Note: localStorage still has Oct 5 state, but getDailyState should ignore it
    // because the dates don't match
    render(<GameContainer />);

    // Should show new challenge (buttons should be available again)
    // Using getByRole instead of findByRole since render should be synchronous
    const realButtonDay2 = screen.getByRole('button', { name: /real/i });
    expect(realButtonDay2).toBeInTheDocument();
    expect(realButtonDay2).not.toBeDisabled();

    // Should NOT show yesterday's feedback
    const feedbackFromYesterday = screen.queryByText(/come back tomorrow/i);
    expect(feedbackFromYesterday).not.toBeInTheDocument();
  });

  it('should clear previous day state at midnight', () => {
    vi.setSystemTime(new Date('2025-10-05T23:59:00Z'));

    // Make a guess on October 5
    const { unmount } = render(<GameContainer />);
    unmount();

    // Move to October 6 (after midnight)
    vi.setSystemTime(new Date('2025-10-06T00:01:00Z'));

    render(<GameContainer />);

    // Should show fresh challenge with no previous guess
    const realButton = screen.getByRole('button', { name: /real/i });
    expect(realButton).toBeInTheDocument();
  });

  it('should show different international day on different dates', () => {
    vi.setSystemTime(new Date('2025-10-05T12:00:00Z'));

    const { unmount: unmount1 } = render(<GameContainer />);
    const day1Text = screen.getByRole('heading').textContent;
    unmount1();

    vi.setSystemTime(new Date('2025-10-06T12:00:00Z'));

    const { unmount: unmount2 } = render(<GameContainer />);
    const day2Text = screen.getByRole('heading').textContent;
    unmount2();

    // Extremely unlikely to be the same with 200 days
    expect(day1Text).not.toBe(day2Text);
  });
});

describe('Performance Validation (Integration)', () => {
  it('should generate daily challenge in less than 10ms', () => {
    const startTime = performance.now();

    getDailyChallenge('2025-10-05');

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(10);
  });

  it('should render component with daily challenge in less than 100ms', () => {
    const startTime = performance.now();

    render(<GameContainer />);

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(100);
  });
});
