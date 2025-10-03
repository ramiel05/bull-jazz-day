/**
 * Milestone Configuration Constants
 * Feature: 002-streak-counter-consecutive
 */

import type { MilestoneConfig } from "~/features/day-guessing-game/streak/types/streak-types";

/**
 * Immutable array of milestone configurations.
 * Sorted ascending by value for efficient lookup.
 */
export const MILESTONE_CONFIGS: ReadonlyArray<MilestoneConfig> = [
  { value: 3, color: "text-blue-500" },
  { value: 5, color: "text-green-500" },
  { value: 10, color: "text-purple-500" },
  { value: 15, color: "text-orange-500" },
  { value: 20, color: "text-red-500" },
  { value: 30, color: "text-yellow-500" }, // gold
  { value: 50, color: "text-cyan-500" },
  { value: 100, color: "text-magenta-500" },
] as const;

/**
 * Milestone threshold values
 */
export type MilestoneThresholds = readonly [3, 5, 10, 15, 20, 30, 50, 100];
