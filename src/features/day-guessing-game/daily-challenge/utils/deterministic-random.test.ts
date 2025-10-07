import { describe, it, expect } from 'vitest';
import { xmur3, mulberry32 } from './deterministic-random';

describe('xmur3 hash function', () => {
  it('should return a function when given a string', () => {
    const seedFn = xmur3('test-seed');
    expect(typeof seedFn).toBe('function');
  });

  it('should produce deterministic seed values for the same input', () => {
    const seedFn1 = xmur3('2025-10-05');
    const seedFn2 = xmur3('2025-10-05');

    const seed1 = seedFn1();
    const seed2 = seedFn2();

    expect(seed1).toBe(seed2);
    expect(typeof seed1).toBe('number');
  });

  it('should produce different seeds for different inputs', () => {
    const seedFn1 = xmur3('2025-10-05');
    const seedFn2 = xmur3('2025-10-06');

    const seed1 = seedFn1();
    const seed2 = seedFn2();

    expect(seed1).not.toBe(seed2);
  });

  it('should produce numeric seed values', () => {
    const seedFn = xmur3('test-string');
    const seed = seedFn();

    expect(typeof seed).toBe('number');
    expect(Number.isInteger(seed)).toBe(true);
    expect(seed).toBeGreaterThanOrEqual(0);
  });

  it('should handle empty string input', () => {
    const seedFn = xmur3('');
    const seed = seedFn();

    expect(typeof seed).toBe('number');
  });
});

describe('mulberry32 PRNG', () => {
  it('should return a function when given a seed', () => {
    const randomFn = mulberry32(12345);
    expect(typeof randomFn).toBe('function');
  });

  it('should produce deterministic random values for the same seed', () => {
    const random1 = mulberry32(12345);
    const random2 = mulberry32(12345);

    const value1a = random1();
    const value2a = random2();

    expect(value1a).toBe(value2a);
    expect(value1a).toBeGreaterThanOrEqual(0);
    expect(value1a).toBeLessThan(1);
  });

  it('should produce different sequences for different seeds', () => {
    const random1 = mulberry32(12345);
    const random2 = mulberry32(54321);

    const value1 = random1();
    const value2 = random2();

    expect(value1).not.toBe(value2);
  });

  it('should produce values in the range [0, 1)', () => {
    const random = mulberry32(98765);

    for (let i = 0; i < 100; i++) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('should produce a consistent sequence of values', () => {
    const random1 = mulberry32(99999);
    const random2 = mulberry32(99999);

    const sequence1 = [random1(), random1(), random1()];
    const sequence2 = [random2(), random2(), random2()];

    expect(sequence1).toEqual(sequence2);
  });

  it('should handle seed of 0', () => {
    const random = mulberry32(0);
    const value = random();

    expect(typeof value).toBe('number');
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });
});

describe('xmur3 + mulberry32 integration', () => {
  it('should produce deterministic random values from string seeds', () => {
    const dateString = '2025-10-05';

    const seedFn1 = xmur3(dateString);
    const random1 = mulberry32(seedFn1());

    const seedFn2 = xmur3(dateString);
    const random2 = mulberry32(seedFn2());

    expect(random1()).toBe(random2());
  });

  it('should produce different random values for different date strings', () => {
    const seedFn1 = xmur3('2025-10-05');
    const random1 = mulberry32(seedFn1());

    const seedFn2 = xmur3('2025-10-06');
    const random2 = mulberry32(seedFn2());

    expect(random1()).not.toBe(random2());
  });
});
