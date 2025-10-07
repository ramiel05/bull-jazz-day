import { describe, it, expect } from 'vitest';
import { daysPool } from './days-pool';

describe('Days Pool', () => {
  it('should have at least 10 days total', () => {
    expect(daysPool.length).toBeGreaterThanOrEqual(10);
  });

  it('should have a mix of real and fake days', () => {
    const realDays = daysPool.filter((day) => day.isReal);
    const fakeDays = daysPool.filter((day) => !day.isReal);

    expect(realDays.length).toBeGreaterThan(0);
    expect(fakeDays.length).toBeGreaterThan(0);
  });

  // T026: Validate days pool has at least 100 real days with valid MM-DD dates
  it('should have at least 100 real days with valid MM-DD dates', () => {
    const realDays = daysPool.filter((day) => day.isReal);

    expect(realDays.length).toBeGreaterThanOrEqual(100);

    realDays.forEach((day) => {
      expect(day.date).toMatch(/^\d{2}-\d{2}$/);
    });
  });

  // T027: Validate days pool has at least 100 fake days with null dates
  it('should have at least 100 fake days with null dates', () => {
    const fakeDays = daysPool.filter((day) => !day.isReal);

    expect(fakeDays.length).toBeGreaterThanOrEqual(100);

    fakeDays.forEach((day) => {
      expect(day.date).toBeNull();
    });
  });

  it('should have unique ids for all days', () => {
    const ids = daysPool.map((day) => day.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(daysPool.length);
  });

  it('should have non-empty names for all days', () => {
    daysPool.forEach((day) => {
      expect(day.name).toBeTruthy();
      expect(day.name.length).toBeGreaterThan(0);
    });
  });

  it('should have non-empty descriptions for all days', () => {
    daysPool.forEach((day) => {
      expect(day.description).toBeTruthy();
      expect(day.description.length).toBeGreaterThan(0);
    });
  });

  describe('Real days constraints', () => {
    it('should have date populated for real days', () => {
      const realDays = daysPool.filter((day) => day.isReal);

      realDays.forEach((day) => {
        expect(day.date).not.toBeNull();
        expect(day.date).toBeTruthy();
      });
    });

    it('should have sourceUrl populated for real days', () => {
      const realDays = daysPool.filter((day) => day.isReal);

      realDays.forEach((day) => {
        expect(day.sourceUrl).not.toBeNull();
        expect(day.sourceUrl).toBeTruthy();
        expect(day.sourceUrl).toMatch(/^https?:\/\//);
      });
    });
  });

  describe('Fake days constraints', () => {
    it('should have null date for fake days', () => {
      const fakeDays = daysPool.filter((day) => !day.isReal);

      fakeDays.forEach((day) => {
        expect(day.date).toBeNull();
      });
    });

    it('should have null sourceUrl for fake days', () => {
      const fakeDays = daysPool.filter((day) => !day.isReal);

      fakeDays.forEach((day) => {
        expect(day.sourceUrl).toBeNull();
      });
    });
  });
});
