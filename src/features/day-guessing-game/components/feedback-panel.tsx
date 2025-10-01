'use client';

import type { GuessResult } from '../types/game-types';

type FeedbackPanelProps = {
  result: GuessResult;
  onContinue: () => void;
};

export default function FeedbackPanel({ result, onContinue }: FeedbackPanelProps) {
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

      <div className="flex justify-center">
        <button
          onClick={onContinue}
          aria-label="Continue to next international day"
          className="px-8 py-4 text-lg font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
