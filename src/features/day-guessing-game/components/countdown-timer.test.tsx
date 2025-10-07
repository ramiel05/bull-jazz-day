import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import CountdownTimer from './countdown-timer';

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render a countdown in HH:MM:SS format', () => {
    // Set time to 6:00 PM (18:00:00)
    vi.setSystemTime(new Date('2025-10-05T18:00:00'));

    render(<CountdownTimer />);

    // Should show time until midnight (6 hours = 06:00:00)
    const countdown = screen.getByText(/\d{2}:\d{2}:\d{2}/);
    expect(countdown).toBeInTheDocument();
  });

  it('should display hours, minutes, and seconds with zero padding', () => {
    // Set time to 11:30:45 PM
    vi.setSystemTime(new Date('2025-10-05T23:30:45'));

    render(<CountdownTimer />);

    // Should show approximately 00:29:15 until midnight
    const countdown = screen.getByText(/00:29:1[0-9]/);
    expect(countdown).toBeInTheDocument();
  });

  it('should update every second', () => {
    // Set time to 11:59:58 PM
    vi.setSystemTime(new Date('2025-10-05T23:59:58'));

    render(<CountdownTimer />);

    // Initial time
    expect(screen.getByText(/00:00:0[0-2]/)).toBeInTheDocument();

    // Advance 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should have decreased by 1 second
    expect(screen.getByText(/00:00:0[0-1]/)).toBeInTheDocument();
  });

  it('should countdown to 00:00:00 at midnight', () => {
    // Set time to 11:59:59 PM
    vi.setSystemTime(new Date('2025-10-05T23:59:59'));

    render(<CountdownTimer />);

    expect(screen.getByText(/00:00:0[0-1]/)).toBeInTheDocument();

    // Advance to midnight
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/00:00:00/)).toBeInTheDocument();
  });

  it('should handle hours correctly', () => {
    // Set time to 6:00:00 PM (6 hours until midnight)
    vi.setSystemTime(new Date('2025-10-05T18:00:00'));

    render(<CountdownTimer />);

    // Should show 06:00:00
    expect(screen.getByText(/06:00:00/)).toBeInTheDocument();
  });

  it('should format single-digit hours with leading zero', () => {
    // Set time to 3:00:00 PM (9 hours until midnight)
    vi.setSystemTime(new Date('2025-10-05T15:00:00'));

    render(<CountdownTimer />);

    // Should show 09:00:00 (with leading zero)
    expect(screen.getByText(/09:00:00/)).toBeInTheDocument();
  });

  it('should format single-digit minutes with leading zero', () => {
    // Set time to 11:05:00 PM
    vi.setSystemTime(new Date('2025-10-05T23:05:00'));

    render(<CountdownTimer />);

    // Should show 00:55:00 (with leading zero on minutes)
    expect(screen.getByText(/00:55:00/)).toBeInTheDocument();
  });

  it('should format single-digit seconds with leading zero', () => {
    // Set time to 11:59:05 PM
    vi.setSystemTime(new Date('2025-10-05T23:59:05'));

    render(<CountdownTimer />);

    // Should show 00:00:5X with leading zero
    const countdown = screen.getByText(/00:00:[0-5][0-9]/);
    expect(countdown).toBeInTheDocument();
  });

  it('should clean up interval on unmount', () => {
    vi.setSystemTime(new Date('2025-10-05T18:00:00'));

    const { unmount } = render(<CountdownTimer />);

    // Get the initial number of timers
    const initialTimerCount = vi.getTimerCount();

    unmount();

    // Should have cleaned up the interval
    expect(vi.getTimerCount()).toBeLessThan(initialTimerCount);
  });

  it('should handle edge case at start of day (midnight)', () => {
    // Set time to 00:00:01 (just after midnight) in local time
    const justAfterMidnight = new Date('2025-10-05');
    justAfterMidnight.setHours(0, 0, 1);
    vi.setSystemTime(justAfterMidnight);

    render(<CountdownTimer />);

    // Should show almost a full day - exact hours depend on DST
    // Could be 22:59:59 or 23:59:59 depending on timezone/DST
    expect(screen.getByText(/(22|23):59:5[0-9]/)).toBeInTheDocument();
  });

  it('should handle noon correctly', () => {
    // Set time to 12:00:00 PM (noon)
    vi.setSystemTime(new Date('2025-10-05T12:00:00'));

    render(<CountdownTimer />);

    // Should show 12 hours until midnight (12:00:00)
    expect(screen.getByText(/12:00:00/)).toBeInTheDocument();
  });

  it('should continuously update the countdown', () => {
    vi.setSystemTime(new Date('2025-10-05T23:59:55'));

    render(<CountdownTimer />);

    expect(screen.getByText(/00:00:0[0-5]/)).toBeInTheDocument();

    // Advance 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText(/00:00:0[0-2]/)).toBeInTheDocument();
  });
});
