import type { InternationalDay } from './international-day';
import type { StreakState } from '../streak/types/streak-types';

export type GuessResult = {
  correct: boolean;
  day: InternationalDay;
};

export type GamePhase = 'guessing' | 'feedback';

export type GameState = {
  currentDay: InternationalDay;
  phase: GamePhase;
  lastResult: GuessResult | null;
  streak: StreakState;
};
