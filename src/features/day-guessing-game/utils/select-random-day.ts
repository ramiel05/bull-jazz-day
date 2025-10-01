import type { InternationalDay } from '../types/international-day';

export function selectRandomDay(pool: readonly InternationalDay[]): InternationalDay {
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
