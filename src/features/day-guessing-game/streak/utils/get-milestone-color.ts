/**
 * Get Milestone Color Utility
 * Feature: 002-streak-counter-consecutive
 *
 * Pure function to get the persistent milestone color for a given streak.
 */

import invariant from "tiny-invariant";
import { MILESTONE_CONFIGS } from "~/features/day-guessing-game/streak/constants/milestones";

/**
 * Returns the color for the highest milestone at or below the current streak.
 * Color persists between milestones (e.g., streak 4 returns blue from milestone 3).
 *
 * @param streakCount - The current streak count (must be non-negative integer)
 * @returns Color class string if a milestone has been reached, null if below first milestone
 * @throws {Error} If streakCount is negative, non-integer, or non-finite
 *
 * @example
 * getMilestoneColor(0) // null (below first milestone)
 * getMilestoneColor(3) // 'text-blue-500' (exact milestone)
 * getMilestoneColor(4) // 'text-blue-500' (persists from milestone 3)
 * getMilestoneColor(100) // 'text-magenta-500'
 * getMilestoneColor(150) // 'text-magenta-500' (persists beyond 100)
 */
export function getMilestoneColor(streakCount: number): string | null {
  invariant(Number.isFinite(streakCount), "Streak count must be finite");
  invariant(Number.isInteger(streakCount), "Streak count must be an integer");
  invariant(streakCount >= 0, "Streak count must be non-negative");

  // Find highest milestone at or below streakCount
  const milestone = [...MILESTONE_CONFIGS]
    .reverse()
    .find((m) => m.value <= streakCount);

  return milestone?.color ?? null;
}
