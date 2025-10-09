import type { InternationalDay } from './international-day';

export type DailyChallenge = {
  date: string; // YYYY-MM-DD
  internationalDay: InternationalDay;
  timezone: string;
};

export type DailyGameState = {
  date: string; // YYYY-MM-DD
  guessedCorrectly: boolean | null;
  guessedReal: boolean | null; // What the user guessed (real or fake)
  timestamp: number; // Unix timestamp
};
