import type { InternationalDay } from '~/features/day-guessing-game/types/international-day';
import type { GuessResult } from '~/features/day-guessing-game/types/game-types';

export function validateGuess(day: InternationalDay, guessedReal: boolean): GuessResult {
  return {
    correct: day.isReal === guessedReal,
    day,
  };
}
