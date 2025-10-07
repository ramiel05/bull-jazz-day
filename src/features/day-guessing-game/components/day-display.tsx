type DayDisplayProps = {
  dayName: string;
};

export default function DayDisplay({ dayName }: DayDisplayProps) {
  return (
    <div className="text-center">
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">Today is</p>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {dayName}
      </h1>
    </div>
  );
}
