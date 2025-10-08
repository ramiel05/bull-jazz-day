export type ShareMessageData = {
  dayName: string;
  dayType: 'real' | 'fake';
  playerGuess: 'real' | 'fake';
  isCorrect: boolean;
  currentStreak: number;
  milestoneText: string | null;
  newBestText: string | null;
};

export type ShareButtonState = 'idle' | 'copied' | 'failed';
