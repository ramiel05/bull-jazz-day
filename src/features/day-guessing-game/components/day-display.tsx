type DayDisplayProps = {
  dayName: string;
};

export default function DayDisplay({ dayName }: DayDisplayProps) {
  return (
    <div className="text-center bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 sm:p-12 border border-slate-200 dark:border-slate-700">
      <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 mb-4 font-medium tracking-wide uppercase">
        Today is
      </p>
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent leading-tight px-4">
        {dayName}
      </h1>
    </div>
  );
}
