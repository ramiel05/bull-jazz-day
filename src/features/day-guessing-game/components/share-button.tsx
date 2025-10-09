'use client';

import { useState, useEffect, useCallback } from 'react';
import type { GuessResult } from '~/features/day-guessing-game/types/game-types';
import type { StreakState } from '~/features/day-guessing-game/streak/types/streak-types';
import type { ShareButtonState, ShareMessageData } from '~/features/day-guessing-game/share/types/share-types';
import { formatShareMessage } from '~/features/day-guessing-game/share/utils/format-share-message';
import { copyToClipboard } from '~/features/day-guessing-game/share/utils/copy-to-clipboard';
import { MILESTONE_CONFIGS } from '~/features/day-guessing-game/streak/constants/milestones';

type ShareButtonProps = {
  guessResult: GuessResult;
  streakState: StreakState;
};

const TIMEOUT_DURATION = 5000; // 5 seconds
const MILESTONE_VALUES = MILESTONE_CONFIGS.map((config) => config.value);

/**
 * Share button component for copying game results to clipboard.
 * Displays feedback for copy success/failure with automatic timeout.
 */
export default function ShareButton({ guessResult, streakState }: ShareButtonProps) {
  const [buttonState, setButtonState] = useState<ShareButtonState>('idle');

  // Cleanup timeout on unmount
  useEffect(() => {
    if (buttonState === 'copied' || buttonState === 'failed') {
      const timeoutId = setTimeout(() => {
        setButtonState('idle');
      }, TIMEOUT_DURATION);

      return () => clearTimeout(timeoutId);
    }
  }, [buttonState]);

  const handleShare = useCallback(async () => {
    // Assemble ShareMessageData from props
    const dayType = guessResult.day.isReal ? 'real' : 'fake';
    const playerGuess = guessResult.correct
      ? dayType
      : dayType === 'real'
        ? 'fake'
        : 'real';

    // Determine milestone text
    const isMilestone = MILESTONE_VALUES.includes(streakState.currentStreak);
    const milestoneEmoji = streakState.currentStreak >= 30 ? '🏆' : '🎖️';
    const milestoneText = isMilestone
      ? `${milestoneEmoji} Milestone reached: ${streakState.currentStreak}-day streak!`
      : null;

    // Determine new best text
    const isNewBest = streakState.currentStreak > streakState.bestStreak;
    const newBestText = isNewBest
      ? `🔥 New personal best: ${streakState.currentStreak}-day streak!`
      : null;

    const data: ShareMessageData = {
      dayName: guessResult.day.name,
      dayType,
      playerGuess,
      isCorrect: guessResult.correct,
      currentStreak: streakState.currentStreak,
      milestoneText,
      newBestText,
    };

    try {
      const message = formatShareMessage(data);
      await copyToClipboard(message);
      setButtonState('copied');
    } catch {
      setButtonState('failed');
    }
  }, [guessResult, streakState]);

  const buttonText = {
    idle: 'Share',
    copied: 'Copied!',
    failed: 'Copy failed',
  }[buttonState];

  const ariaLabel = {
    idle: 'Share your result',
    copied: 'Result copied to clipboard',
    failed: 'Failed to copy result',
  }[buttonState];

  const buttonStyle = {
    idle: 'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40',
    copied: 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40',
    failed: 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40',
  }[buttonState];

  return (
    <button
      onClick={handleShare}
      aria-label={ariaLabel}
      className={`group relative ${buttonStyle} text-white font-bold px-10 py-5 text-lg rounded-2xl hover:scale-105 active:scale-95 transition-all duration-200`}
    >
      <span className="relative z-10">{buttonText}</span>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </button>
  );
}
