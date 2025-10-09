import invariant from 'tiny-invariant';
import type { ShareMessageData } from '~/features/day-guessing-game/share/types/share-types';

const PRODUCTION_URL = 'https://bull-jazz-day.vercel.app';

/**
 * Formats a share message for copying to clipboard.
 * Pure function with no side effects.
 *
 * @param data - The share message data
 * @returns Formatted plain text message with line breaks
 * @throws {Error} When dayName is empty or currentStreak is negative
 */
export function formatShareMessage(data: ShareMessageData): string {
  // Precondition checks
  invariant(data.dayName.trim().length > 0, 'dayName must not be empty');
  invariant(data.currentStreak >= 0, 'currentStreak must be non-negative');

  const { dayName, dayType, playerGuess, isCorrect, currentStreak, milestoneText, newBestText } = data;

  // Result emoji and text
  const resultEmoji = isCorrect ? '🎉' : '❌';
  const resultText = isCorrect ? 'Correct!' : 'Incorrect!';

  // Capitalize first letter of guess for display
  const capitalizedGuess = playerGuess.charAt(0).toUpperCase() + playerGuess.slice(1);

  // Build message sections
  const sections: string[] = [];

  // Section 1: Result
  sections.push(`${resultEmoji} ${resultText}`);
  sections.push(''); // Empty line

  // Section 2: Day info
  sections.push(`${dayName} is ${dayType}!`);
  sections.push(`My guess: ${capitalizedGuess}`);

  // Section 3: Streak info (only if currentStreak > 0)
  if (currentStreak > 0) {
    sections.push(''); // Empty line
    sections.push(`Current streak: ${currentStreak}`);
    if (milestoneText !== null) {
      sections.push(milestoneText);
    }
    if (newBestText !== null) {
      sections.push(newBestText);
    }
  }

  // Section 4: Link
  sections.push(''); // Empty line
  sections.push(`🔗 ${PRODUCTION_URL}`);

  return sections.join('\n');
}
