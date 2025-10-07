'use client';

import type { GuessResult } from '~/features/day-guessing-game/types/game-types';
import CountdownTimer from './countdown-timer';

type FeedbackPanelProps = {
  result: GuessResult;
};

export default function FeedbackPanel({ result }: FeedbackPanelProps) {
  const { correct, day } = result;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div
        className={`p-8 rounded-3xl shadow-2xl border-2 ${
          correct
            ? 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 border-emerald-300 dark:border-emerald-700'
            : 'bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950 dark:to-red-950 border-rose-300 dark:border-rose-700'
        } animate-pulse-scale`}
        role="status"
        aria-live="polite"
      >
        <h2
          className={`text-4xl sm:text-5xl font-extrabold mb-6 ${
            correct
              ? 'text-emerald-700 dark:text-emerald-300'
              : 'text-rose-700 dark:text-rose-300'
          }`}
        >
          {correct ? '🎉 Correct!' : '❌ Incorrect!'}
        </h2>

        <div className={`space-y-4 ${correct ? 'text-emerald-900 dark:text-emerald-100' : 'text-rose-900 dark:text-rose-100'}`}>
          <p className="text-xl font-bold">
            This is a {day.isReal ? 'real' : 'fake'} international day.
          </p>

          {day.date && (
            <p className="text-lg">
              <span className="font-semibold">Date:</span> <span className="font-medium">{day.date}</span>
            </p>
          )}

          <p className="text-base leading-relaxed">{day.description}</p>

          {day.sourceUrl && (
            <p>
              <a
                href={day.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 font-semibold underline decoration-2 underline-offset-4 transition-all ${
                  correct
                    ? 'text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100'
                    : 'text-rose-700 dark:text-rose-300 hover:text-rose-900 dark:hover:text-rose-100'
                }`}
              >
                Learn more →
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-3xl shadow-xl border-2 border-indigo-200 dark:border-indigo-800">
        <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-3">
          Come back tomorrow for a new daily challenge!
        </p>
        <p className="text-lg text-indigo-700 dark:text-indigo-300 font-medium">
          Next challenge in: <CountdownTimer />
        </p>
      </div>
    </div>
  );
}
