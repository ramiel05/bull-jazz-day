'use client';

import type { GuessResult } from '~/features/day-guessing-game/types/game-types';
import CountdownTimer from './countdown-timer';

type FeedbackPanelProps = {
  result: GuessResult;
};

export default function FeedbackPanel({ result }: FeedbackPanelProps) {
  const { correct, day } = result;

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`p-6 rounded-lg mb-6 ${
          correct ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
        }`}
        role="status"
        aria-live="polite"
      >
        <h2
          className={`text-3xl font-bold mb-4 ${
            correct ? 'text-green-800 dark:text-green-100' : 'text-red-800 dark:text-red-100'
          }`}
        >
          {correct ? 'Correct!' : 'Incorrect!'}
        </h2>

        <div className="text-gray-900 dark:text-gray-100 space-y-3">
          <p className="font-semibold">
            This is a {day.isReal ? 'real' : 'fake'} international day.
          </p>

          {day.date && (
            <p className="font-semibold">
              Date: <span className="font-normal">{day.date}</span>
            </p>
          )}

          <p>{day.description}</p>

          {day.sourceUrl && (
            <p>
              <a
                href={day.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200"
              >
                Learn more
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="text-center p-6 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <p className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Come back tomorrow for a new daily challenge!
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-200">
          Next challenge in: <CountdownTimer />
        </p>
      </div>
    </div>
  );
}
