import { describe, it, expect } from 'vitest';
import { selectRandomDay } from './select-random-day';
import type { InternationalDay } from '~/features/day-guessing-game/types/international-day';

describe('selectRandomDay', () => {
  it('should return a day from the pool', () => {
    const pool: readonly InternationalDay[] = [
      {
        id: 'test-1',
        name: 'Test Day 1',
        isReal: true,
        date: 'January 1',
        description: 'Test description',
        sourceUrl: 'https://example.com',
      },
      {
        id: 'test-2',
        name: 'Test Day 2',
        isReal: false,
        date: null,
        description: 'Test description 2',
        sourceUrl: null,
      },
    ];

    const result = selectRandomDay(pool);

    expect(pool).toContain(result);
  });

  it('should return different days on multiple calls (probabilistic)', () => {
    const pool: readonly InternationalDay[] = [
      {
        id: 'test-1',
        name: 'Test Day 1',
        isReal: true,
        date: 'January 1',
        description: 'Test description',
        sourceUrl: 'https://example.com',
      },
      {
        id: 'test-2',
        name: 'Test Day 2',
        isReal: false,
        date: null,
        description: 'Test description 2',
        sourceUrl: null,
      },
      {
        id: 'test-3',
        name: 'Test Day 3',
        isReal: true,
        date: 'March 3',
        description: 'Test description 3',
        sourceUrl: 'https://example.com/3',
      },
    ];

    const results = new Set();
    // Run 50 times to increase likelihood of different selections
    for (let i = 0; i < 50; i++) {
      results.add(selectRandomDay(pool).id);
    }

    // Should have selected at least 2 different days in 50 tries
    expect(results.size).toBeGreaterThan(1);
  });

  it('should handle a pool with single item', () => {
    const pool: readonly InternationalDay[] = [
      {
        id: 'only-one',
        name: 'Only Day',
        isReal: true,
        date: 'January 1',
        description: 'The only day',
        sourceUrl: 'https://example.com',
      },
    ];

    const result = selectRandomDay(pool);

    expect(result).toEqual(pool[0]);
  });
});
