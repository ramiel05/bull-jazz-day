/**
 * StreakDisplay Component
 * Feature: 002-streak-counter-consecutive
 *
 * React component to display the current and best streaks with milestone colors.
 */

"use client";

import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { calculateMilestone } from "~/features/day-guessing-game/streak/utils/calculate-milestone";

export type StreakDisplayProps = {
  /** The current consecutive correct guesses (must be >= 0) */
  currentStreak: number;
  /** The best streak achieved in session (must be >= 0, >= currentStreak) */
  bestStreak: number;
  /** Tailwind color class or null for default color */
  milestoneColor: string | null;
  /** Optional callback when milestone is reached */
  onMilestoneReached?: (milestone: number) => void;
};

/**
 * Displays the current and best streak counts with milestone color styling.
 * Includes accessibility attributes and optional milestone celebration callback.
 *
 * @param props - StreakDisplayProps
 * @throws {Error} If invariants are violated (negative streak, best < current)
 *
 * @example
 * <StreakDisplay
 *   currentStreak={5}
 *   bestStreak={10}
 *   milestoneColor="text-green-500"
 *   onMilestoneReached={(milestone) => console.log(`Milestone ${milestone} reached!`)}
 * />
 */
export function StreakDisplay({
  currentStreak,
  bestStreak,
  milestoneColor,
  onMilestoneReached,
}: StreakDisplayProps) {
  // Validate invariants
  invariant(currentStreak >= 0, "Current streak must be non-negative");
  invariant(bestStreak >= 0, "Best streak must be non-negative");
  invariant(
    bestStreak >= currentStreak,
    "Best streak must be >= current streak"
  );

  // Track previous streak to detect milestone events
  const prevStreakRef = useRef(currentStreak);

  useEffect(() => {
    // Only trigger callback if streak actually changed
    if (currentStreak !== prevStreakRef.current) {
      const milestone = calculateMilestone(currentStreak);

      if (milestone && onMilestoneReached) {
        onMilestoneReached(milestone.value);
      }

      prevStreakRef.current = currentStreak;
    }
  }, [currentStreak, onMilestoneReached]);

  const colorClass = milestoneColor ?? "text-gray-700";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`streak-display font-bold transition-colors duration-2000 text-lg sm:text-xl`}
    >
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 dark:text-slate-400">🔥 Current:</span>
          <span className={`text-2xl sm:text-3xl ${colorClass}`}>{currentStreak}</span>
        </div>
        <div className="hidden sm:block text-slate-400 dark:text-slate-600">|</div>
        <div className="flex items-center gap-2">
          <span className="text-slate-600 dark:text-slate-400">⭐ Best:</span>
          <span className={`text-2xl sm:text-3xl ${colorClass}`}>{bestStreak}</span>
        </div>
      </div>
    </div>
  );
}
