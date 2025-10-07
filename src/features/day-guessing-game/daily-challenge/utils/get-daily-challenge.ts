import type { DailyChallenge } from '~/features/day-guessing-game/types/daily-types';
import { daysPool } from '~/features/day-guessing-game/data/days-pool';
import { xmur3, mulberry32 } from './deterministic-random';

/**
 * Generates a deterministic daily challenge for a given date
 * @param dateString - Date in YYYY-MM-DD format
 * @returns DailyChallenge object containing the selected international day
 */
export function getDailyChallenge(dateString: string): DailyChallenge {
  // Extract MM-DD from the full date string
  const mmdd = dateString.slice(5); // "2025-10-05" -> "10-05"

  // Find real international days that match this calendar date
  const realDaysForDate = daysPool.filter(
    (day) => day.isReal && day.date === mmdd
  );

  // Generate deterministic random value using the date as seed
  const seedFn = xmur3(dateString);
  const randomFn = mulberry32(seedFn());
  const randomValue = randomFn();

  // Selection logic:
  // If there are real days for this date, randomly choose between:
  // 1. One of the matching real days (60% probability)
  // 2. A random fake day (40% probability)
  let selectedDay;

  if (realDaysForDate.length > 0 && randomValue < 0.6) {
    // Select one of the matching real days
    const realIndex = Math.floor(randomFn() * realDaysForDate.length);
    selectedDay = realDaysForDate[realIndex];
  } else {
    // Select a random day from the entire pool
    const poolIndex = Math.floor(randomFn() * daysPool.length);
    selectedDay = daysPool[poolIndex];
  }

  // Get the user's timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return {
    date: dateString,
    internationalDay: selectedDay,
    timezone,
  };
}
