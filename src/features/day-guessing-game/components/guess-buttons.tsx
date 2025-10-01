'use client';

type GuessButtonsProps = {
  onGuess: (guessedReal: boolean) => void;
  disabled: boolean;
};

export default function GuessButtons({ onGuess, disabled }: GuessButtonsProps) {
  return (
    <div className="flex gap-4 justify-center" role="group" aria-label="Make your guess">
      <button
        onClick={() => onGuess(true)}
        disabled={disabled}
        aria-label="Guess this is a real international day"
        className="px-8 py-4 text-lg font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Real
      </button>
      <button
        onClick={() => onGuess(false)}
        disabled={disabled}
        aria-label="Guess this is a fake international day"
        className="px-8 py-4 text-lg font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Fake
      </button>
    </div>
  );
}
