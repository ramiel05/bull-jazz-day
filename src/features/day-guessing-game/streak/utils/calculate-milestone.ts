/**
 * Calculate Milestone Utility
 * Feature: 002-streak-counter-consecutive
 *
 * Pure function to detect exact milestone matches.
 */

import invariant from "tiny-invariant";
import { MILESTONE_CONFIGS } from "~/features/day-guessing-game/streak/constants/milestones";
import type { MilestoneConfig } from "~/features/day-guessing-game/streak/types/streak-types";

/**
 * Determines if the given streak count exactly matches a milestone.
 *
 * @param streakCount - The current streak count (must be non-negative integer)
 * @returns MilestoneConfig if streak exactly matches a milestone, null otherwise
 * @throws {Error} If streakCount is negative, non-integer, or non-finite
 *
 * @example
 * calculateMilestone(3) // { value: 3, color: 'text-blue-500' }
 * calculateMilestone(4) // null (not a milestone)
 * calculateMilestone(100) // { value: 100, color: 'text-magenta-500' }
 */
export function calculateMilestone(streakCount: number): MilestoneConfig | null {
  invariant(Number.isFinite(streakCount), "Streak count must be finite");
  invariant(Number.isInteger(streakCount), "Streak count must be an integer");
  invariant(streakCount >= 0, "Streak count must be non-negative");

  return MILESTONE_CONFIGS.find((m) => m.value === streakCount) ?? null;
}
