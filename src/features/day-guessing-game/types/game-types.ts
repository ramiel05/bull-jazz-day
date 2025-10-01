import type { InternationalDay } from './international-day';

export type GuessResult = {
  correct: boolean;
  day: InternationalDay;
};

export type GamePhase = 'guessing' | 'feedback';

export type GameState = {
  currentDay: InternationalDay;
  phase: GamePhase;
  lastResult: GuessResult | null;
};
