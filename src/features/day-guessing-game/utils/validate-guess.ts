import type { InternationalDay } from '../types/international-day';
import type { GuessResult } from '../types/game-types';

export function validateGuess(day: InternationalDay, guessedReal: boolean): GuessResult {
  return {
    correct: day.isReal === guessedReal,
    day,
  };
}
