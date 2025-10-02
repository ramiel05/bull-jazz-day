/**
 * Contract Tests: calculateMilestone
 * Feature: 002-streak-counter-consecutive
 *
 * These tests define the contract for the calculateMilestone function.
 * Tests MUST fail before implementation (TDD).
 */

import { describe, it, expect } from "vitest";
import { calculateMilestone } from "./calculate-milestone";

describe("calculateMilestone", () => {
  describe("non-milestone streaks", () => {
    it("returns null for streak 0", () => {
      expect(calculateMilestone(0)).toBeNull();
    });

    it("returns null for streak 1", () => {
      expect(calculateMilestone(1)).toBeNull();
    });

    it("returns null for streak 2", () => {
      expect(calculateMilestone(2)).toBeNull();
    });

    it("returns null for streak 4 (between milestones)", () => {
      expect(calculateMilestone(4)).toBeNull();
    });

    it("returns null for streak 101 (beyond highest milestone)", () => {
      expect(calculateMilestone(101)).toBeNull();
    });

    it("returns null for large streak like 1000", () => {
      expect(calculateMilestone(1000)).toBeNull();
    });
  });

  describe("milestone streaks", () => {
    it("returns blue config for streak 3", () => {
      const result = calculateMilestone(3);
      expect(result).toEqual({ value: 3, color: "text-blue-500" });
    });

    it("returns green config for streak 5", () => {
      const result = calculateMilestone(5);
      expect(result).toEqual({ value: 5, color: "text-green-500" });
    });

    it("returns purple config for streak 10", () => {
      const result = calculateMilestone(10);
      expect(result).toEqual({ value: 10, color: "text-purple-500" });
    });

    it("returns orange config for streak 15", () => {
      const result = calculateMilestone(15);
      expect(result).toEqual({ value: 15, color: "text-orange-500" });
    });

    it("returns red config for streak 20", () => {
      const result = calculateMilestone(20);
      expect(result).toEqual({ value: 20, color: "text-red-500" });
    });

    it("returns gold config for streak 30", () => {
      const result = calculateMilestone(30);
      expect(result).toEqual({ value: 30, color: "text-yellow-500" });
    });

    it("returns cyan config for streak 50", () => {
      const result = calculateMilestone(50);
      expect(result).toEqual({ value: 50, color: "text-cyan-500" });
    });

    it("returns magenta config for streak 100", () => {
      const result = calculateMilestone(100);
      expect(result).toEqual({ value: 100, color: "text-magenta-500" });
    });
  });

  describe("invariant violations", () => {
    it("throws error for negative streak", () => {
      expect(() => calculateMilestone(-1)).toThrow("Streak count must be non-negative");
    });

    it("throws error for non-integer streak", () => {
      expect(() => calculateMilestone(3.5)).toThrow("Streak count must be an integer");
    });

    it("throws error for NaN", () => {
      expect(() => calculateMilestone(NaN)).toThrow("Streak count must be finite");
    });

    it("throws error for Infinity", () => {
      expect(() => calculateMilestone(Infinity)).toThrow("Streak count must be finite");
    });
  });
});
