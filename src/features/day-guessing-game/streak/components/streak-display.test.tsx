/**
 * Contract Tests: StreakDisplay Component
 * Feature: 002-streak-counter-consecutive
 *
 * These tests define the contract for the StreakDisplay React component.
 * Tests MUST fail before implementation (TDD).
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StreakDisplay } from "./streak-display";

describe("StreakDisplay", () => {
  describe("rendering streak values", () => {
    it("renders 'Current: 0' and 'Best: 0' for initial state", () => {
      render(<StreakDisplay currentStreak={0} bestStreak={0} milestoneColor={null} />);

      expect(screen.getByText(/Current:\s*0/)).toBeInTheDocument();
      expect(screen.getByText(/Best:\s*0/)).toBeInTheDocument();
    });

    it("renders correct current streak value", () => {
      render(<StreakDisplay currentStreak={5} bestStreak={5} milestoneColor={null} />);

      expect(screen.getByText(/Current:\s*5/)).toBeInTheDocument();
    });

    it("renders correct best streak value", () => {
      render(<StreakDisplay currentStreak={3} bestStreak={10} milestoneColor={null} />);

      expect(screen.getByText(/Best:\s*10/)).toBeInTheDocument();
    });
  });

  describe("milestone color styling", () => {
    it("applies default color when milestoneColor is null", () => {
      const { container } = render(
        <StreakDisplay currentStreak={2} bestStreak={2} milestoneColor={null} />
      );

      const display = container.querySelector('[role="status"]');
      expect(display).toHaveClass("text-gray-700");
    });

    it("applies milestone color when milestoneColor is provided", () => {
      const { container } = render(
        <StreakDisplay currentStreak={3} bestStreak={3} milestoneColor="text-blue-500" />
      );

      const display = container.querySelector('[role="status"]');
      expect(display).toHaveClass("text-blue-500");
    });
  });

  describe("milestone callback", () => {
    it("calls onMilestoneReached when streak reaches milestone value 3", () => {
      const onMilestoneReached = vi.fn();

      const { rerender } = render(
        <StreakDisplay
          currentStreak={2}
          bestStreak={2}
          milestoneColor={null}
          onMilestoneReached={onMilestoneReached}
        />
      );

      // Update to milestone 3
      rerender(
        <StreakDisplay
          currentStreak={3}
          bestStreak={3}
          milestoneColor="text-blue-500"
          onMilestoneReached={onMilestoneReached}
        />
      );

      expect(onMilestoneReached).toHaveBeenCalledWith(3);
      expect(onMilestoneReached).toHaveBeenCalledTimes(1);
    });

    it("does not call onMilestoneReached on re-render at same streak", () => {
      const onMilestoneReached = vi.fn();

      const { rerender } = render(
        <StreakDisplay
          currentStreak={3}
          bestStreak={3}
          milestoneColor="text-blue-500"
          onMilestoneReached={onMilestoneReached}
        />
      );

      // Re-render with same props
      rerender(
        <StreakDisplay
          currentStreak={3}
          bestStreak={3}
          milestoneColor="text-blue-500"
          onMilestoneReached={onMilestoneReached}
        />
      );

      expect(onMilestoneReached).not.toHaveBeenCalled();
    });

    it("does not call onMilestoneReached for non-milestone streaks", () => {
      const onMilestoneReached = vi.fn();

      const { rerender } = render(
        <StreakDisplay
          currentStreak={1}
          bestStreak={1}
          milestoneColor={null}
          onMilestoneReached={onMilestoneReached}
        />
      );

      // Update to streak 2 (not a milestone)
      rerender(
        <StreakDisplay
          currentStreak={2}
          bestStreak={2}
          milestoneColor={null}
          onMilestoneReached={onMilestoneReached}
        />
      );

      expect(onMilestoneReached).not.toHaveBeenCalled();
    });

    it("works without onMilestoneReached callback (no error)", () => {
      expect(() => {
        render(<StreakDisplay currentStreak={3} bestStreak={3} milestoneColor="text-blue-500" />);
      }).not.toThrow();
    });
  });

  describe("accessibility", () => {
    it("has role='status' attribute", () => {
      render(<StreakDisplay currentStreak={5} bestStreak={10} milestoneColor="text-green-500" />);

      const display = screen.getByRole("status");
      expect(display).toBeInTheDocument();
    });

    it("has aria-live='polite' attribute", () => {
      const { container } = render(
        <StreakDisplay currentStreak={5} bestStreak={10} milestoneColor="text-green-500" />
      );

      const display = container.querySelector('[aria-live="polite"]');
      expect(display).toBeInTheDocument();
    });
  });

  describe("invariant violations", () => {
    it("throws error if currentStreak is negative", () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        render(<StreakDisplay currentStreak={-1} bestStreak={0} milestoneColor={null} />);
      }).toThrow("Current streak must be non-negative");

      consoleSpy.mockRestore();
    });

    it("throws error if bestStreak < currentStreak", () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        render(<StreakDisplay currentStreak={5} bestStreak={3} milestoneColor={null} />);
      }).toThrow("Best streak must be >= current streak");

      consoleSpy.mockRestore();
    });
  });
});
