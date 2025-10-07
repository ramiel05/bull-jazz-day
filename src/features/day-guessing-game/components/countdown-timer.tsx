'use client';

import { useState, useEffect } from 'react';

/**
 * Countdown timer that shows time remaining until midnight in HH:MM:SS format
 * Updates every second
 */
export default function CountdownTimer() {
  const [timeUntilMidnight, setTimeUntilMidnight] = useState('');

  useEffect(() => {
    const calculateTimeUntilMidnight = () => {
      const now = new Date();

      // Calculate next midnight (start of tomorrow)
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();

      // Handle case where we're at or past midnight (shouldn't happen, but be defensive)
      if (diff <= 0 || diff >= 24 * 60 * 60 * 1000) {
        return '00:00:00';
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Format with zero padding
      const hoursStr = String(hours).padStart(2, '0');
      const minutesStr = String(minutes).padStart(2, '0');
      const secondsStr = String(seconds).padStart(2, '0');

      return `${hoursStr}:${minutesStr}:${secondsStr}`;
    };

    // Initial calculation
    setTimeUntilMidnight(calculateTimeUntilMidnight());

    // Update every second
    const interval = setInterval(() => {
      setTimeUntilMidnight(calculateTimeUntilMidnight());
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-mono text-blue-900 dark:text-blue-100" aria-label="Time until next challenge">
      {timeUntilMidnight}
    </span>
  );
}
