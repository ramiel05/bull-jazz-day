/**
 * Integration Tests: Full Streak Flow
 * Feature: 002-streak-counter-consecutive
 *
 * These tests verify the complete streak counter integration with GameContainer.
 * Tests use actual button clicks and user interactions, not manual hook manipulation.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameContainer from "../../../components/game-container";
import * as selectRandomDayModule from "../../../utils/select-random-day";
import type { InternationalDay } from "../../../types/international-day";

// Mock days for controlled testing
const realDay: InternationalDay = {
  id: "test-real-day",
  name: "International Real Day",
  date: "January 1",
  description: "A real international day",
  sourceUrl: null,
  isReal: true,
};

const fakeDay: InternationalDay = {
  id: "test-fake-day",
  name: "International Fake Day",
  date: "February 30",
  description: "A fake international day",
  sourceUrl: null,
  isReal: false,
};

describe("Streak Flow Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("streak increments when user makes consecutive correct guesses", async () => {
    const user = userEvent.setup();

    // Mock to always return real day
    vi.spyOn(selectRandomDayModule, "selectRandomDay").mockReturnValue(realDay);

    render(<GameContainer />);

    // Initial state: streak should be 0
    expect(screen.getByText(/Current:\s*0/)).toBeInTheDocument();
    expect(screen.getByText(/Best:\s*0/)).toBeInTheDocument();

    // First correct guess - click "Real" button
    const realButton = screen.getByRole("button", { name: /Guess this is a real international day/ });
    await user.click(realButton);

    // After correct guess, should show feedback and streak: 1
    expect(await screen.findByText(/Correct!/)).toBeInTheDocument();
    expect(screen.getByText(/Current:\s*1/)).toBeInTheDocument();
    expect(screen.getByText(/Best:\s*1/)).toBeInTheDocument();

    // Click Continue to next round
    const continueButton = screen.getByRole("button", { name: /Continue to next international day/ });
    await user.click(continueButton);

    // Second correct guess
    const realButtonRound2 = screen.getByRole("button", { name: /Guess this is a real international day/ });
    await user.click(realButtonRound2);

    // Streak should be 2
    expect(await screen.findByText(/Correct!/)).toBeInTheDocument();
    expect(screen.getByText(/Current:\s*2/)).toBeInTheDocument();
    expect(screen.getByText(/Best:\s*2/)).toBeInTheDocument();
  });

  it("streak resets to 0 when user makes incorrect guess, best is preserved", async () => {
    const user = userEvent.setup();

    // First return real day, then fake day
    vi.spyOn(selectRandomDayModule, "selectRandomDay")
      .mockReturnValueOnce(realDay)
      .mockReturnValueOnce(realDay)
      .mockReturnValueOnce(realDay)
      .mockReturnValueOnce(fakeDay);

    render(<GameContainer />);

    // Make 3 correct guesses to build streak
    const realButton1 = screen.getByRole("button", { name: /Guess this is a real international day/ });
    await user.click(realButton1);
    expect(await screen.findByText(/Correct!/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Continue to next international day/ }));

    const realButton2 = screen.getByRole("button", { name: /Guess this is a real international day/ });
    await user.click(realButton2);
    expect(await screen.findByText(/Correct!/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Continue to next international day/ }));

    const realButton3 = screen.getByRole("button", { name: /Guess this is a real international day/ });
    await user.click(realButton3);
    expect(await screen.findByText(/Correct!/)).toBeInTheDocument();

    // Streak should be 3
    expect(screen.getByText(/Current:\s*3/)).toBeInTheDocument();
    expect(screen.getByText(/Best:\s*3/)).toBeInTheDocument();

    // Continue to fake day
    await user.click(screen.getByRole("button", { name: /Continue to next international day/ }));

    // Make incorrect guess (guess Real when it's Fake)
    const realButtonIncorrect = screen.getByRole("button", { name: /Guess this is a real international day/ });
    await user.click(realButtonIncorrect);

    // Should show incorrect feedback
    expect(await screen.findByText(/Incorrect!/)).toBeInTheDocument();

    // Streak should reset to 0, but best should be preserved at 3
    expect(screen.getByText(/Current:\s*0/)).toBeInTheDocument();
    expect(screen.getByText(/Best:\s*3/)).toBeInTheDocument();
  });

  it("milestone color appears at streak 3", async () => {
    const user = userEvent.setup();

    vi.spyOn(selectRandomDayModule, "selectRandomDay").mockReturnValue(realDay);

    render(<GameContainer />);

    // Make 3 correct guesses
    for (let i = 0; i < 3; i++) {
      const realButton = screen.getByRole("button", { name: /Guess this is a real international day/ });
      await user.click(realButton);

      if (i < 2) {
        await user.click(screen.getByRole("button", { name: /Continue to next international day/ }));
      }
    }

    // At streak 3, should show blue color
    expect(screen.getByText(/Current:\s*3/)).toBeInTheDocument();

    // Find the streak display element (it has the specific class) and verify it has blue color class
    const streakDisplay = screen.getByText(/Current:\s*3/).closest('.streak-display');
    expect(streakDisplay).toHaveClass("text-blue-500");
  });

  it("milestone color changes from blue to green at streak 5", async () => {
    const user = userEvent.setup();

    vi.spyOn(selectRandomDayModule, "selectRandomDay").mockReturnValue(realDay);

    render(<GameContainer />);

    // Make 5 correct guesses
    for (let i = 0; i < 5; i++) {
      const realButton = screen.getByRole("button", { name: /Guess this is a real international day/ });
      await user.click(realButton);

      if (i < 4) {
        await user.click(screen.getByRole("button", { name: /Continue to next international day/ }));
      }
    }

    // At streak 5, should show green color
    expect(screen.getByText(/Current:\s*5/)).toBeInTheDocument();

    const streakDisplay = screen.getByText(/Current:\s*5/).closest('.streak-display');
    expect(streakDisplay).toHaveClass("text-green-500");
  });

  it("Continue button preserves streak between rounds", async () => {
    const user = userEvent.setup();

    vi.spyOn(selectRandomDayModule, "selectRandomDay").mockReturnValue(realDay);

    render(<GameContainer />);

    // Make one correct guess
    const realButton = screen.getByRole("button", { name: /Guess this is a real international day/ });
    await user.click(realButton);

    // Streak should be 1
    expect(await screen.findByText(/Correct!/)).toBeInTheDocument();
    expect(screen.getByText(/Current:\s*1/)).toBeInTheDocument();

    // Click Continue
    const continueButton = screen.getByRole("button", { name: /Continue to next international day/ });
    await user.click(continueButton);

    // Streak should still be 1 (preserved)
    expect(screen.getByText(/Current:\s*1/)).toBeInTheDocument();
    expect(screen.getByText(/Best:\s*1/)).toBeInTheDocument();
  });
});
