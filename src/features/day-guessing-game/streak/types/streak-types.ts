/**
 * Streak Counter Type Definitions
 * Feature: 002-streak-counter-consecutive
 */

/**
 * Represents the current session's streak tracking data.
 */
export type StreakState = {
  /** Consecutive correct guesses in current run (resets to 0 on incorrect guess) */
  currentStreak: number;
  /** Highest streak achieved in current session (never decreases, resets on session start) */
  bestStreak: number;
  /** CSS class string for milestone color, or null if no milestone reached */
  currentMilestoneColor: string | null;
};

/**
 * Static configuration defining milestone thresholds and their colors.
 */
export type MilestoneConfig = {
  /** The milestone value (3, 5, 10, 15, 20, 30, 50, or 100) */
  value: number;
  /** Tailwind color class */
  color: string;
};

/**
 * Represents a transient milestone celebration trigger.
 */
export type MilestoneEvent = {
  /** The milestone reached (3, 5, 10, etc.) */
  streakValue: number;
  /** Tailwind color class for this milestone */
  color: string;
  /** Date.now() when triggered (for animation timing) */
  timestamp: number;
};

/**
 * Default initial streak state
 */
export const initialStreakState: StreakState = {
  currentStreak: 0,
  bestStreak: 0,
  currentMilestoneColor: null,
};
