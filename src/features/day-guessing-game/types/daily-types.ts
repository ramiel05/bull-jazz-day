import type { InternationalDay } from './international-day';

export type DailyChallenge = {
  date: string; // YYYY-MM-DD
  internationalDay: InternationalDay;
  timezone: string;
};

export type DailyGameState = {
  date: string; // YYYY-MM-DD
  guessedCorrectly: boolean | null;
  timestamp: number; // Unix timestamp
};
