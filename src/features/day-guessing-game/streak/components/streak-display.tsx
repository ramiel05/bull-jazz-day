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
      className={`streak-display ${colorClass} font-semibold transition-colors duration-2000`}
    >
      <div className="flex gap-4">
        <span>Current: {currentStreak}</span>
        <span>Best: {bestStreak}</span>
      </div>
    </div>
  );
}
