'use client';

type GuessButtonsProps = {
  onGuess: (guessedReal: boolean) => void;
  disabled: boolean;
};

export default function GuessButtons({ onGuess, disabled }: GuessButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4" role="group" aria-label="Make your guess">
      <button
        onClick={() => onGuess(true)}
        disabled={disabled}
        aria-label="Guess this is a real international day"
        className="group relative px-10 py-5 text-lg sm:text-xl font-bold rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105 active:scale-95 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
      >
        <span className="relative z-10">✓ Real</span>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      </button>
      <button
        onClick={() => onGuess(false)}
        disabled={disabled}
        aria-label="Guess this is a fake international day"
        className="group relative px-10 py-5 text-lg sm:text-xl font-bold rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
      >
        <span className="relative z-10">✗ Fake</span>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      </button>
    </div>
  );
}
