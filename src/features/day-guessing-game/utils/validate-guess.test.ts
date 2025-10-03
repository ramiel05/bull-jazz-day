import { describe, it, expect } from 'vitest';
import { validateGuess } from './validate-guess';
import type { InternationalDay } from '~/features/day-guessing-game/types/international-day';

describe('validateGuess', () => {
  const realDay: InternationalDay = {
    id: 'test-real',
    name: 'Test Real Day',
    isReal: true,
    date: 'January 1',
    description: 'A real test day',
    sourceUrl: 'https://example.com',
  };

  const fakeDay: InternationalDay = {
    id: 'test-fake',
    name: 'Test Fake Day',
    isReal: false,
    date: null,
    description: 'A fake test day',
    sourceUrl: null,
  };

  describe('Real day guesses', () => {
    it('should return correct=true when real day is guessed as real', () => {
      const result = validateGuess(realDay, true);

      expect(result.correct).toBe(true);
      expect(result.day).toEqual(realDay);
    });

    it('should return correct=false when real day is guessed as fake', () => {
      const result = validateGuess(realDay, false);

      expect(result.correct).toBe(false);
      expect(result.day).toEqual(realDay);
    });
  });

  describe('Fake day guesses', () => {
    it('should return correct=true when fake day is guessed as fake', () => {
      const result = validateGuess(fakeDay, false);

      expect(result.correct).toBe(true);
      expect(result.day).toEqual(fakeDay);
    });

    it('should return correct=false when fake day is guessed as real', () => {
      const result = validateGuess(fakeDay, true);

      expect(result.correct).toBe(false);
      expect(result.day).toEqual(fakeDay);
    });
  });

  it('should always include the day in the result', () => {
    const resultReal = validateGuess(realDay, true);
    const resultFake = validateGuess(fakeDay, false);

    expect(resultReal.day).toBeDefined();
    expect(resultFake.day).toBeDefined();
  });
});
