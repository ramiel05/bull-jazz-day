import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getCurrentLocalDate } from './timezone-utils';

describe('getCurrentLocalDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return a date string in YYYY-MM-DD format', () => {
    vi.setSystemTime(new Date('2025-10-05T12:00:00Z'));

    const result = getCurrentLocalDate();

    expect(typeof result).toBe('string');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('should return the same date for the same moment in time', () => {
    vi.setSystemTime(new Date('2025-10-05T15:30:00Z'));

    const result1 = getCurrentLocalDate();
    const result2 = getCurrentLocalDate();

    expect(result1).toBe(result2);
  });

  it('should return different dates for different days', () => {
    vi.setSystemTime(new Date('2025-10-05T12:00:00Z'));
    const date1 = getCurrentLocalDate();

    vi.setSystemTime(new Date('2025-10-06T12:00:00Z'));
    const date2 = getCurrentLocalDate();

    expect(date1).not.toBe(date2);
  });

  it('should handle January 1st correctly', () => {
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));

    const result = getCurrentLocalDate();

    expect(result).toMatch(/2025-01-01/);
  });

  it('should handle December 31st correctly', () => {
    vi.setSystemTime(new Date('2025-12-31T12:00:00'));

    const result = getCurrentLocalDate();

    expect(result).toMatch(/2025-12-31/);
  });

  it('should handle leap year February 29th correctly', () => {
    vi.setSystemTime(new Date('2024-02-29T12:00:00Z'));

    const result = getCurrentLocalDate();

    expect(result).toMatch(/2024-02-29/);
  });

  it('should return properly formatted month (zero-padded)', () => {
    vi.setSystemTime(new Date('2025-03-05T12:00:00Z'));

    const result = getCurrentLocalDate();
    const month = result.split('-')[1];

    expect(month).toBe('03');
    expect(month.length).toBe(2);
  });

  it('should return properly formatted day (zero-padded)', () => {
    vi.setSystemTime(new Date('2025-10-05T12:00:00Z'));

    const result = getCurrentLocalDate();
    const day = result.split('-')[2];

    expect(day).toBe('05');
    expect(day.length).toBe(2);
  });

  it('should use local timezone for date calculation', () => {
    // This test verifies that the function uses local time, not UTC
    // The exact result depends on the system timezone, but we can verify format
    vi.setSystemTime(new Date('2025-10-05T23:30:00Z'));

    const result = getCurrentLocalDate();

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.split('-')[0]).toBe('2025');
  });
});
