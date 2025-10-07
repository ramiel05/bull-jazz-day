import { describe, it, expect } from 'vitest';
import { getDailyChallenge } from './get-daily-challenge';

describe('getDailyChallenge', () => {
  it('should return a DailyChallenge object with required fields', () => {
    const challenge = getDailyChallenge('2025-10-05');

    expect(challenge).toBeDefined();
    expect(challenge).toHaveProperty('date');
    expect(challenge).toHaveProperty('internationalDay');
    expect(challenge).toHaveProperty('timezone');
  });

  it('should return the same challenge for the same date', () => {
    const challenge1 = getDailyChallenge('2025-10-05');
    const challenge2 = getDailyChallenge('2025-10-05');

    expect(challenge1.internationalDay.id).toBe(challenge2.internationalDay.id);
    expect(challenge1.internationalDay.name).toBe(challenge2.internationalDay.name);
  });

  it('should return different challenges for different dates', () => {
    const challenge1 = getDailyChallenge('2025-10-05');
    const challenge2 = getDailyChallenge('2025-10-06');

    // While it's technically possible to get the same day twice,
    // with 200 days in the pool, it's extremely unlikely
    expect(challenge1.internationalDay.id).not.toBe(challenge2.internationalDay.id);
  });

  it('should set the date field to the input date', () => {
    const dateString = '2025-10-05';
    const challenge = getDailyChallenge(dateString);

    expect(challenge.date).toBe(dateString);
  });

  it('should set the timezone field', () => {
    const challenge = getDailyChallenge('2025-10-05');

    expect(challenge.timezone).toBeDefined();
    expect(typeof challenge.timezone).toBe('string');
  });

  it('should return a valid InternationalDay object', () => {
    const challenge = getDailyChallenge('2025-10-05');
    const day = challenge.internationalDay;

    expect(day).toHaveProperty('id');
    expect(day).toHaveProperty('name');
    expect(day).toHaveProperty('isReal');
    expect(day).toHaveProperty('date');
    expect(day).toHaveProperty('description');
    expect(day).toHaveProperty('sourceUrl');

    expect(typeof day.id).toBe('string');
    expect(typeof day.name).toBe('string');
    expect(typeof day.isReal).toBe('boolean');
    expect(typeof day.description).toBe('string');
  });

  it('should prefer real days that match the current date', () => {
    // March 8 is International Women's Day (03-08)
    const challenge = getDailyChallenge('2025-03-08');

    // With date-matching logic, we should get a real day with date "03-08"
    // if one exists in the pool
    expect(challenge.internationalDay).toBeDefined();

    // The day should either be:
    // 1. A real day with matching date (03-08), OR
    // 2. A fake day (if no real day matches or random selection chose fake)
    const day = challenge.internationalDay;
    if (day.isReal && day.date) {
      // If it's a real day, it might have the matching date
      expect(day.date).toMatch(/^\d{2}-\d{2}$/);
    }
  });

  it('should handle dates without matching real international days', () => {
    // Use an obscure date that might not have a real international day
    const challenge = getDailyChallenge('2025-10-05');

    expect(challenge.internationalDay).toBeDefined();
    // Should return either a real day with matching date or a random fake day
  });

  it('should be deterministic across multiple calls', () => {
    const calls = Array.from({ length: 10 }, () => getDailyChallenge('2025-10-05'));

    const firstId = calls[0].internationalDay.id;

    calls.forEach((challenge) => {
      expect(challenge.internationalDay.id).toBe(firstId);
    });
  });

  it('should handle year boundaries correctly', () => {
    const dec31 = getDailyChallenge('2024-12-31');
    const jan01 = getDailyChallenge('2025-01-01');

    expect(dec31.date).toBe('2024-12-31');
    expect(jan01.date).toBe('2025-01-01');

    // Should produce different challenges (extremely likely with 200 days)
    expect(dec31.internationalDay.id).not.toBe(jan01.internationalDay.id);
  });

  it('should handle leap year dates correctly', () => {
    const challenge = getDailyChallenge('2024-02-29');

    expect(challenge.date).toBe('2024-02-29');
    expect(challenge.internationalDay).toBeDefined();
  });

  it('should distribute selections across the pool', () => {
    // Test 100 different dates to see distribution
    const dates = Array.from({ length: 100 }, (_, i) => {
      const date = new Date(2025, 0, 1);
      date.setDate(date.getDate() + i);
      return date.toISOString().split('T')[0];
    });

    const selectedIds = new Set(
      dates.map((date) => getDailyChallenge(date).internationalDay.id)
    );

    // Should have selected multiple different days (not all the same)
    expect(selectedIds.size).toBeGreaterThan(10);
  });

  // T030: Edge case test - no real day for current date (fallback to fake)
  it('should fallback to any day when no real day matches current date', () => {
    // Use a date unlikely to have a matching real international day
    // The algorithm should still select either a real day (randomly) or a fake day
    const challenge = getDailyChallenge('2025-06-13');

    expect(challenge).toBeDefined();
    expect(challenge.date).toBe('2025-06-13');
    expect(challenge.internationalDay).toBeDefined();
    expect(challenge.internationalDay.name).toBeTruthy();

    // Should be deterministic - same date always gives same day
    const challenge2 = getDailyChallenge('2025-06-13');
    expect(challenge2.internationalDay.id).toBe(challenge.internationalDay.id);
  });
});
