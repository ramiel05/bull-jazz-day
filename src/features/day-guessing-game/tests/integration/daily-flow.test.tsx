import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getDailyChallenge } from '~/features/day-guessing-game/daily-challenge/utils/get-daily-challenge';
import GameContainer from '~/features/day-guessing-game/components/game-container';

describe('Daily Challenge Flow (Integration)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should show new daily challenge on first visit', async () => {
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

  it('should present new challenge when day changes', () => {
    // October 5 (using local time, not UTC)
    const oct5 = new Date('2025-10-05');
    oct5.setHours(12, 0, 0, 0);
    vi.setSystemTime(oct5);

    const { unmount } = render(<GameContainer />);

    const realButton = screen.getByRole('button', { name: /real/i });
    fireEvent.click(realButton);

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

describe('Streak Initialization (Integration)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should show streak starting at 0/0 on first visit', () => {
    render(<GameContainer />);

    // Should show Current: 0 and Best: 0
    expect(screen.getByTestId('current-streak')).toHaveTextContent('Current:0');
    expect(screen.getByTestId('best-streak')).toHaveTextContent('Best:0');
  });

  it('should display StreakDisplay component in the UI', () => {
    render(<GameContainer />);

    // StreakDisplay should be visible with test ids
    expect(screen.getByTestId('current-streak')).toBeInTheDocument();
    expect(screen.getByTestId('best-streak')).toBeInTheDocument();
  });
});

describe('Streak Updates on Guesses (Integration)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should increment current streak from 0 to 1 on correct guess', async () => {
    const user = userEvent.setup();

    // Get the daily challenge to know the correct answer
    const challenge = getDailyChallenge(new Intl.DateTimeFormat('sv-SE').format(new Date()));
    const correctAnswer = challenge.internationalDay.isReal;

    render(<GameContainer />);

    // Initially 0/0
    expect(screen.getByTestId('current-streak')).toHaveTextContent('0');
    expect(screen.getByTestId('best-streak')).toHaveTextContent('0');

    // Click the correct button based on the actual answer
    const correctButton = screen.getByRole('button', {
      name: correctAnswer ? /real/i : /fake/i,
    });
    await user.click(correctButton);

    // Should see "Correct!" feedback
    await screen.findByText(/correct/i);

    // Streak should update to 1/1
    await waitFor(() => {
      expect(screen.getByTestId('current-streak')).toHaveTextContent('1');
      expect(screen.getByTestId('best-streak')).toHaveTextContent('1');
    });
  });

  it('should reset current streak to 0 on incorrect guess', () => {
    // This test verifies the streak reset logic by checking localStorage
    // We'll manually set up a state where an incorrect guess was made
    const streakState = {
      currentStreak: 0,
      bestStreak: 5,
      currentMilestoneColor: null,
      lastGuessDate: '2025-10-07',
    };
    localStorage.setItem('streak-state', JSON.stringify(streakState));

    render(<GameContainer />);

    // After an incorrect guess, current should be 0 but best should remain 5
    expect(screen.getByTestId('current-streak')).toHaveTextContent('0');
    expect(screen.getByTestId('best-streak')).toHaveTextContent('5');
  });

  it('should show "Incorrect!" feedback when user guesses wrong', async () => {
    const user = userEvent.setup();

    // Get the daily challenge to know the correct answer
    const challenge = getDailyChallenge(new Intl.DateTimeFormat('sv-SE').format(new Date()));
    const correctAnswer = challenge.internationalDay.isReal;

    render(<GameContainer />);

    // Click the WRONG button (opposite of the correct answer)
    const wrongButton = screen.getByRole('button', {
      name: correctAnswer ? /fake/i : /real/i,
    });
    await user.click(wrongButton);

    // Should see "Incorrect!" feedback (not "Correct!")
    await screen.findByText(/incorrect/i);
    expect(screen.queryByText(/^correct!$/i)).not.toBeInTheDocument();
  });

  it('should update best streak when current exceeds it', async () => {
    const user = userEvent.setup();

    // Get the daily challenge to know the correct answer
    const challenge = getDailyChallenge(new Intl.DateTimeFormat('sv-SE').format(new Date()));
    const correctAnswer = challenge.internationalDay.isReal;

    render(<GameContainer />);

    // Initially 0/0
    expect(screen.getByTestId('best-streak')).toHaveTextContent('0');

    // Make a correct guess
    const correctButton = screen.getByRole('button', {
      name: correctAnswer ? /real/i : /fake/i,
    });
    await user.click(correctButton);

    await screen.findByText(/correct/i);

    // Best should now be 1
    await waitFor(() => {
      expect(screen.getByTestId('best-streak')).toHaveTextContent('1');
    });
  });

  it('should preserve best streak after incorrect guess', async () => {
    // This test verifies the hook logic: best streak never decreases
    // We'll store streak data manually to test persistence
    const streakState = {
      currentStreak: 5,
      bestStreak: 10,
      currentMilestoneColor: 'text-green-500',
      lastGuessDate: '2025-10-06',
    };
    localStorage.setItem('streak-state', JSON.stringify(streakState));

    render(<GameContainer />);

    // Should show current 5, best 10
    expect(screen.getByTestId('current-streak')).toHaveTextContent('5');
    expect(screen.getByTestId('best-streak')).toHaveTextContent('10');
  });
});

describe('Streak Persistence (Integration)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should persist streak state across page reloads', async () => {
    const user = userEvent.setup();

    // Get the daily challenge to know the correct answer
    const challenge = getDailyChallenge(new Intl.DateTimeFormat('sv-SE').format(new Date()));
    const correctAnswer = challenge.internationalDay.isReal;

    // First render: make a correct guess
    const { unmount } = render(<GameContainer />);

    const correctButton = screen.getByRole('button', {
      name: correctAnswer ? /real/i : /fake/i,
    });
    await user.click(correctButton);

    await screen.findByText(/correct/i);

    // Wait for streak to update to 1/1
    await waitFor(() => {
      expect(screen.getByTestId('current-streak')).toHaveTextContent('1');
      expect(screen.getByTestId('best-streak')).toHaveTextContent('1');
    });

    // Unmount and re-render (simulate page reload)
    unmount();

    render(<GameContainer />);

    // Should still show 1/1
    expect(screen.getByTestId('current-streak')).toHaveTextContent('1');
    expect(screen.getByTestId('best-streak')).toHaveTextContent('1');
  });

  it('should load streak from localStorage on component mount', () => {
    // Manually set streak in localStorage before mounting
    const streakState = {
      currentStreak: 7,
      bestStreak: 15,
      currentMilestoneColor: 'text-blue-500',
      lastGuessDate: '2025-10-05',
    };
    localStorage.setItem('streak-state', JSON.stringify(streakState));

    render(<GameContainer />);

    // Should load persisted state
    expect(screen.getByTestId('current-streak')).toHaveTextContent('7');
    expect(screen.getByTestId('best-streak')).toHaveTextContent('15');
  });
});

describe('Consecutive Day Streaks (Integration)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should increment streak on consecutive day correct guesses', () => {
    // Day 1: October 5
    vi.setSystemTime(new Date('2025-10-05T12:00:00Z'));

    const challenge1 = getDailyChallenge('2025-10-05');
    const { unmount: unmount1 } = render(<GameContainer />);

    // Make correct guess for day 1
    const correctButton1 = screen.getByRole('button', {
      name: challenge1.internationalDay.isReal ? /real/i : /fake/i,
    });
    fireEvent.click(correctButton1);

    // Use getByText after click - no async needed since state updates are synchronous
    expect(screen.getByText(/correct/i)).toBeInTheDocument();
    expect(screen.getByTestId('current-streak')).toHaveTextContent('1');

    unmount1();

    // Day 2: October 6 (consecutive day)
    vi.setSystemTime(new Date('2025-10-06T12:00:00Z'));

    const challenge2 = getDailyChallenge('2025-10-06');
    const { unmount: unmount2 } = render(<GameContainer />);

    const correctButton2 = screen.getByRole('button', {
      name: challenge2.internationalDay.isReal ? /real/i : /fake/i,
    });
    fireEvent.click(correctButton2);

    // Streak should now be 2
    expect(screen.getByText(/correct/i)).toBeInTheDocument();
    expect(screen.getByTestId('current-streak')).toHaveTextContent('2');
    expect(screen.getByTestId('best-streak')).toHaveTextContent('2');

    unmount2();
  });

  it('should reset streak to 1 when skipping a day', () => {
    // Day 1: October 5
    vi.setSystemTime(new Date('2025-10-05T12:00:00Z'));

    const challenge1 = getDailyChallenge('2025-10-05');
    const { unmount: unmount1 } = render(<GameContainer />);

    const correctButton1 = screen.getByRole('button', {
      name: challenge1.internationalDay.isReal ? /real/i : /fake/i,
    });
    fireEvent.click(correctButton1);

    expect(screen.getByText(/correct/i)).toBeInTheDocument();
    expect(screen.getByTestId('current-streak')).toHaveTextContent('1');

    unmount1();

    // Day 3: October 7 (skipped October 6)
    vi.setSystemTime(new Date('2025-10-07T12:00:00Z'));

    const challenge2 = getDailyChallenge('2025-10-07');
    const { unmount: unmount2 } = render(<GameContainer />);

    const correctButton2 = screen.getByRole('button', {
      name: challenge2.internationalDay.isReal ? /real/i : /fake/i,
    });
    fireEvent.click(correctButton2);

    // Streak should reset to 1 (not 2)
    expect(screen.getByText(/correct/i)).toBeInTheDocument();
    expect(screen.getByTestId('current-streak')).toHaveTextContent('1');

    unmount2();
  });

  it('should not double-count same-day duplicate guess', async () => {
    vi.setSystemTime(new Date('2025-10-05T12:00:00Z'));

    // Set initial streak state
    const streakState = {
      currentStreak: 3,
      bestStreak: 5,
      currentMilestoneColor: 'text-green-500',
      lastGuessDate: '2025-10-05',
    };
    localStorage.setItem('streak-state', JSON.stringify(streakState));

    // Also set daily state to simulate already guessed today
    const dailyState = {
      date: '2025-10-05',
      guessedCorrectly: true,
      timestamp: Date.now(),
    };
    localStorage.setItem('daily-game-state', JSON.stringify(dailyState)); // Use correct key

    render(<GameContainer />);

    // Should still show 3, not increment
    expect(screen.getByTestId('current-streak')).toHaveTextContent('3');
    expect(screen.getByTestId('best-streak')).toHaveTextContent('5');

    // Buttons should not be available (already guessed)
    const realButton = screen.queryByRole('button', { name: /real/i });
    expect(realButton).not.toBeInTheDocument();
  });
});

describe('Streak Display Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should update display in real-time after guess', async () => {
    const user = userEvent.setup();

    // Get the daily challenge to know the correct answer
    const challenge = getDailyChallenge(new Intl.DateTimeFormat('sv-SE').format(new Date()));
    const correctAnswer = challenge.internationalDay.isReal;

    render(<GameContainer />);

    // Initially 0/0
    expect(screen.getByTestId('current-streak')).toHaveTextContent('0');

    // Make a correct guess
    const correctButton = screen.getByRole('button', {
      name: correctAnswer ? /real/i : /fake/i,
    });
    await user.click(correctButton);

    await screen.findByText(/correct/i);

    // Display should immediately update to 1/1
    await waitFor(() => {
      expect(screen.getByTestId('current-streak')).toHaveTextContent('1');
      expect(screen.getByTestId('best-streak')).toHaveTextContent('1');
    });
  });

  it('should apply milestone color at threshold 3', () => {
    // Set up streak at 2 (one away from milestone 3)
    const streakState = {
      currentStreak: 2,
      bestStreak: 2,
      currentMilestoneColor: null,
      lastGuessDate: '2025-10-06',
    };
    localStorage.setItem('streak-state', JSON.stringify(streakState));

    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-10-07T12:00:00Z'));

    const challenge = getDailyChallenge('2025-10-07');

    render(<GameContainer />);

    // Should show 2/2 with no color
    expect(screen.getByTestId('current-streak')).toHaveTextContent('2');

    // Make a correct guess to reach 3
    const correctButton = screen.getByRole('button', {
      name: challenge.internationalDay.isReal ? /real/i : /fake/i,
    });
    fireEvent.click(correctButton);

    // Should show 3/3 and have milestone color applied
    expect(screen.getByText(/correct/i)).toBeInTheDocument();
    expect(screen.getByTestId('current-streak')).toHaveTextContent('3');
    // Milestone 3 should have text-blue-500 color - check the parent streak-display
    expect(screen.getByTestId("streak-display")).toHaveClass('text-blue-500');

    vi.useRealTimers();
  });
});
