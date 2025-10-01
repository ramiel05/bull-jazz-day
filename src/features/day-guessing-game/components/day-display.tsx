type DayDisplayProps = {
  dayName: string;
};

export default function DayDisplay({ dayName }: DayDisplayProps) {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {dayName}
      </h1>
    </div>
  );
}
