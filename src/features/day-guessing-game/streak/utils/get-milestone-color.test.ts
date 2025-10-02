/**
 * Contract Tests: getMilestoneColor
 * Feature: 002-streak-counter-consecutive
 *
 * These tests define the contract for the getMilestoneColor function.
 * Tests MUST fail before implementation (TDD).
 */

import { describe, it, expect } from "vitest";
import { getMilestoneColor } from "./get-milestone-color";

describe("getMilestoneColor", () => {
  describe("below first milestone", () => {
    it("returns null for streak 0", () => {
      expect(getMilestoneColor(0)).toBeNull();
    });

    it("returns null for streak 1", () => {
      expect(getMilestoneColor(1)).toBeNull();
    });

    it("returns null for streak 2", () => {
      expect(getMilestoneColor(2)).toBeNull();
    });
  });

  describe("milestone colors with persistence", () => {
    it("returns blue for streak 3 (exact milestone)", () => {
      expect(getMilestoneColor(3)).toBe("text-blue-500");
    });

    it("returns blue for streak 4 (color persists)", () => {
      expect(getMilestoneColor(4)).toBe("text-blue-500");
    });

    it("returns green for streak 5 (exact milestone)", () => {
      expect(getMilestoneColor(5)).toBe("text-green-500");
    });

    it("returns green for streak 9 (color persists)", () => {
      expect(getMilestoneColor(9)).toBe("text-green-500");
    });

    it("returns purple for streak 10 (exact milestone)", () => {
      expect(getMilestoneColor(10)).toBe("text-purple-500");
    });

    it("returns purple for streak 14 (color persists)", () => {
      expect(getMilestoneColor(14)).toBe("text-purple-500");
    });

    it("returns orange for streak 15 (exact milestone)", () => {
      expect(getMilestoneColor(15)).toBe("text-orange-500");
    });

    it("returns red for streak 20 (exact milestone)", () => {
      expect(getMilestoneColor(20)).toBe("text-red-500");
    });

    it("returns gold for streak 30 (exact milestone)", () => {
      expect(getMilestoneColor(30)).toBe("text-yellow-500");
    });

    it("returns cyan for streak 50 (exact milestone)", () => {
      expect(getMilestoneColor(50)).toBe("text-cyan-500");
    });

    it("returns magenta for streak 100 (exact milestone)", () => {
      expect(getMilestoneColor(100)).toBe("text-magenta-500");
    });

    it("returns magenta for streak 150 (persists beyond highest milestone)", () => {
      expect(getMilestoneColor(150)).toBe("text-magenta-500");
    });
  });

  describe("invariant violations", () => {
    it("throws error for negative streak", () => {
      expect(() => getMilestoneColor(-1)).toThrow("Streak count must be non-negative");
    });

    it("throws error for non-integer streak", () => {
      expect(() => getMilestoneColor(3.5)).toThrow("Streak count must be an integer");
    });

    it("throws error for NaN", () => {
      expect(() => getMilestoneColor(NaN)).toThrow("Streak count must be finite");
    });

    it("throws error for Infinity", () => {
      expect(() => getMilestoneColor(Infinity)).toThrow("Streak count must be finite");
    });
  });
});
