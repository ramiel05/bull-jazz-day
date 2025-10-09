import { describe, it, expect } from 'vitest';
import { formatShareMessage } from './format-share-message';
import type { ShareMessageData } from '~/features/day-guessing-game/share/types/share-types';

describe('formatShareMessage', () => {
  it('should format correct guess with no streak (currentStreak = 0)', () => {
    const data: ShareMessageData = {
      dayName: 'International Day of Peace',
      dayType: 'real',
      playerGuess: 'real',
      isCorrect: true,
      currentStreak: 0,
      milestoneText: null,
      newBestText: null,
    };

    const result = formatShareMessage(data);

    expect(result).toContain('🎉 Correct!');
    expect(result).toContain('International Day of Peace is real!');
    expect(result).toContain('My guess: Real');
    expect(result).toContain('🔗 https://bull-jazz-day.vercel.app');
    expect(result).not.toContain('Current streak');
    expect(result).not.toContain('Streak: 0');
  });

  it('should format correct guess with streak (no milestone)', () => {
    const data: ShareMessageData = {
      dayName: 'International Day of Friendship',
      dayType: 'real',
      playerGuess: 'real',
      isCorrect: true,
      currentStreak: 2,
      milestoneText: null,
      newBestText: null,
    };

    const result = formatShareMessage(data);

    expect(result).toContain('🎉 Correct!');
    expect(result).toContain('International Day of Friendship is real!');
    expect(result).toContain('My guess: Real');
    expect(result).toContain('Current streak: 2');
    expect(result).toContain('🔗 https://bull-jazz-day.vercel.app');
  });

  it('should format correct guess with milestone', () => {
    const data: ShareMessageData = {
      dayName: 'International Day of Friendship',
      dayType: 'real',
      playerGuess: 'real',
      isCorrect: true,
      currentStreak: 5,
      milestoneText: '🎖️ Milestone reached: 5-day streak!',
      newBestText: null,
    };

    const result = formatShareMessage(data);

    expect(result).toContain('🎉 Correct!');
    expect(result).toContain('Current streak: 5');
    expect(result).toContain('🎖️ Milestone reached: 5-day streak!');
  });

  it('should format correct guess with new best', () => {
    const data: ShareMessageData = {
      dayName: 'International Day of Yoga',
      dayType: 'real',
      playerGuess: 'real',
      isCorrect: true,
      currentStreak: 8,
      milestoneText: null,
      newBestText: '🔥 New personal best: 8-day streak!',
    };

    const result = formatShareMessage(data);

    expect(result).toContain('🎉 Correct!');
    expect(result).toContain('Current streak: 8');
    expect(result).toContain('🔥 New personal best: 8-day streak!');
  });

  it('should format correct guess with both milestone AND new best', () => {
    const data: ShareMessageData = {
      dayName: 'World Food Day',
      dayType: 'real',
      playerGuess: 'real',
      isCorrect: true,
      currentStreak: 10,
      milestoneText: '🎖️ Milestone reached: 10-day streak!',
      newBestText: '🔥 New personal best: 10-day streak!',
    };

    const result = formatShareMessage(data);

    expect(result).toContain('🎉 Correct!');
    expect(result).toContain('Current streak: 10');
    expect(result).toContain('🎖️ Milestone reached: 10-day streak!');
    expect(result).toContain('🔥 New personal best: 10-day streak!');
  });

  it('should format incorrect guess', () => {
    const data: ShareMessageData = {
      dayName: 'International Day of Jazz',
      dayType: 'fake',
      playerGuess: 'real',
      isCorrect: false,
      currentStreak: 0,
      milestoneText: null,
      newBestText: null,
    };

    const result = formatShareMessage(data);

    expect(result).toContain('❌ Incorrect!');
    expect(result).toContain('International Day of Jazz is fake!');
    expect(result).toContain('My guess: Real');
    expect(result).not.toContain('Current streak');
    expect(result).toContain('🔗 https://bull-jazz-day.vercel.app');
  });

  it('should format incorrect guess immediately after having a streak', () => {
    const data: ShareMessageData = {
      dayName: 'International Day of Nonsense',
      dayType: 'fake',
      playerGuess: 'real',
      isCorrect: false,
      currentStreak: 0,
      milestoneText: null,
      newBestText: null,
    };

    const result = formatShareMessage(data);

    expect(result).toContain('❌ Incorrect!');
    expect(result).not.toContain('Current streak');
  });

  it('should throw error when dayName is empty', () => {
    const data: ShareMessageData = {
      dayName: '',
      dayType: 'real',
      playerGuess: 'real',
      isCorrect: true,
      currentStreak: 1,
      milestoneText: null,
      newBestText: null,
    };

    expect(() => formatShareMessage(data)).toThrow();
  });

  it('should throw error when currentStreak is negative', () => {
    const data: ShareMessageData = {
      dayName: 'International Day of Peace',
      dayType: 'real',
      playerGuess: 'real',
      isCorrect: true,
      currentStreak: -1,
      milestoneText: null,
      newBestText: null,
    };

    expect(() => formatShareMessage(data)).toThrow();
  });

  it('should handle streak = 1 edge case', () => {
    const data: ShareMessageData = {
      dayName: 'International Day of Peace',
      dayType: 'real',
      playerGuess: 'real',
      isCorrect: true,
      currentStreak: 1,
      milestoneText: null,
      newBestText: null,
    };

    const result = formatShareMessage(data);

    expect(result).toContain('Current streak: 1');
    expect(result).toContain('🔗 https://bull-jazz-day.vercel.app');
  });

  // Gap 8: Whitespace-only day names
  it('should throw error when dayName is only whitespace', () => {
    const data: ShareMessageData = {
      dayName: '   ',
      dayType: 'real',
      playerGuess: 'real',
      isCorrect: true,
      currentStreak: 1,
      milestoneText: null,
      newBestText: null,
    };

    expect(() => formatShareMessage(data)).toThrow();
  });

  it('should throw error when dayName is only tabs and newlines', () => {
    const data: ShareMessageData = {
      dayName: '\t\n\t',
      dayType: 'real',
      playerGuess: 'real',
      isCorrect: true,
      currentStreak: 1,
      milestoneText: null,
      newBestText: null,
    };

    expect(() => formatShareMessage(data)).toThrow();
  });

  // Gap 9: Long day name validation
  it('should handle very long day names without truncation', () => {
    const longDayName = 'A'.repeat(150); // 150 character day name
    const data: ShareMessageData = {
      dayName: longDayName,
      dayType: 'real',
      playerGuess: 'real',
      isCorrect: true,
      currentStreak: 5,
      milestoneText: null,
      newBestText: null,
    };

    const result = formatShareMessage(data);

    expect(result).toContain(longDayName);
    expect(result).toContain('🔗 https://bull-jazz-day.vercel.app');
  });
});
