# Contract: useStreakCounter Hook

**Type**: React Custom Hook
**File**: `src/features/day-guessing-game/streak/hooks/use-streak-counter.ts`

## Signature

```typescript
function useStreakCounter(): {
  streakState: StreakState;
  recordCorrectGuess: (guessDate: string) => void;
  recordIncorrectGuess: (guessDate: string) => void;
}
```

## Input Contract

### Parameters
None - hook called without arguments

### Preconditions
- Must be called within a React component or custom hook (React context required)
- Component must be mounted
- localStorage must be available (browser environment)

## Output Contract

### Return Value

**Type**: Object with three properties

```typescript
{
  streakState: StreakState;
  recordCorrectGuess: (guessDate: string) => void;
  recordIncorrectGuess: (guessDate: string) => void;
}
```

#### `streakState: StreakState`

Current streak state object, persisted in localStorage.

**Structure**:
```typescript
{
  currentStreak: number;           // >= 0
  bestStreak: number;              // >= 0, >= currentStreak
  currentMilestoneColor: string | null;  // null or Tailwind class
  lastGuessDate: string | null;    // YYYY-MM-DD or null
}
```

**Invariants**:
- `streakState.currentStreak >= 0`
- `streakState.bestStreak >= 0`
- `streakState.bestStreak >= streakState.currentStreak`
- `streakState.lastGuessDate` matches YYYY-MM-DD format or is null

#### `recordCorrectGuess: (guessDate: string) => void`

Function to record a correct guess on a specific date.

**Parameters**:
- `guessDate: string` - Date in YYYY-MM-DD format

**Behavior**:
- **Same day**: If `guessDate === lastGuessDate`, no change (prevents double-counting)
- **First guess**: If `lastGuessDate === null`, sets `currentStreak = 1`
- **Consecutive day**: If date is exactly 1 day after `lastGuessDate`, increments `currentStreak`
- **Skipped days**: If date gap > 1 day, resets `currentStreak = 1` (new streak)
- Updates `bestStreak` if new `currentStreak` exceeds it
- Updates `currentMilestoneColor` based on new `currentStreak`
- Sets `lastGuessDate = guessDate`
- Saves to localStorage immediately

**Side Effects**:
- State update (causes component re-render)
- localStorage write with key `'streak-state'`
- May trigger milestone event (observable via streakState.currentMilestoneColor change)

#### `recordIncorrectGuess: (guessDate: string) => void`

Function to record an incorrect guess on a specific date.

**Parameters**:
- `guessDate: string` - Date in YYYY-MM-DD format

**Behavior**:
- Sets `currentStreak = 0`
- Preserves `bestStreak` (no change)
- Resets `currentMilestoneColor = null`
- Sets `lastGuessDate = guessDate`
- Saves to localStorage immediately

**Side Effects**:
- State update (causes component re-render)
- localStorage write with key `'streak-state'`

### Postconditions

**After `recordCorrectGuess(date)` (first guess)**:
- `streakState.currentStreak === 1`
- `streakState.lastGuessDate === date`

**After `recordCorrectGuess(date)` (consecutive day)**:
- `streakState.currentStreak === previousStreak + 1`
- `streakState.bestStreak === Math.max(previousBest, currentStreak)`
- `streakState.lastGuessDate === date`
- `streakState.currentMilestoneColor` updated if milestone reached

**After `recordCorrectGuess(date)` (same day)**:
- No changes to state (idempotent)

**After `recordCorrectGuess(date)` (skipped days)**:
- `streakState.currentStreak === 1`
- `streakState.lastGuessDate === date`

**After `recordIncorrectGuess(date)`**:
- `streakState.currentStreak === 0`
- `streakState.bestStreak === previousBest` (unchanged)
- `streakState.currentMilestoneColor === null`
- `streakState.lastGuessDate === date`

### Error Handling

**Invariant Violations**:
```typescript
// These should never occur due to internal logic, but are checked
invariant(
  newStreak >= 0,
  'Streak cannot be negative after increment'
);
invariant(
  newBest >= newCurrent,
  'Best streak must be >= current streak'
);
```

**Error Cases**:
- None expected (pure state management, no async operations or external dependencies)

### Persistence

**Storage Key**: `'streak-state'` (localStorage)

**Behavior**:
- State loads from localStorage on hook mount
- State saves to localStorage automatically after every update
- Corrupted/missing data returns fresh initial state

## Usage Example

```typescript
function GameContainer() {
  const { dailyChallenge } = useDailyState();
  const { streakState, recordCorrectGuess, recordIncorrectGuess } = useStreakCounter();

  const handleGuess = (guessedReal: boolean) => {
    const result = validateGuess(dailyChallenge.internationalDay, guessedReal);

    if (result.correct) {
      recordCorrectGuess(dailyChallenge.date); // e.g., '2025-10-07'
    } else {
      recordIncorrectGuess(dailyChallenge.date);
    }
  };

  return (
    <div>
      <StreakDisplay
        currentStreak={streakState.currentStreak}
        bestStreak={streakState.bestStreak}
        milestoneColor={streakState.currentMilestoneColor}
      />
      <GuessButtons onGuess={handleGuess} />
    </div>
  );
}
```

## Test Requirements

### Unit Tests

**File**: `use-streak-counter.test.ts` (co-located)

**Test Cases**:
1. Initial state has all fields at default values including `lastGuessDate: null`
2. `recordCorrectGuess(date)` increments streak from 0 to 1 on first guess
3. `recordCorrectGuess(date)` increments streak on consecutive day (Day 1 → Day 2)
4. `recordCorrectGuess(date)` does NOT increment on same day (prevents double-counting)
5. `recordCorrectGuess(date)` resets to 1 when days are skipped (Day 1 → Day 3)
6. `recordCorrectGuess(date)` updates bestStreak when current exceeds it
7. `recordCorrectGuess(date)` at milestone (e.g., 3) sets currentMilestoneColor
8. `recordCorrectGuess(date)` past milestone retains milestone color
9. `recordIncorrectGuess(date)` resets currentStreak to 0
10. `recordIncorrectGuess(date)` preserves bestStreak
11. `recordIncorrectGuess(date)` clears currentMilestoneColor
12. `recordIncorrectGuess(date)` updates lastGuessDate
13. State loads from localStorage on mount
14. State saves to localStorage after `recordCorrectGuess()`
15. State saves to localStorage after `recordIncorrectGuess()`
16. Best streak never decreases across correct/incorrect guess cycles
17. Streak persists across hook unmount/remount

### Integration Tests

Covered in `daily-flow.test.tsx` (tests full game flow with streak updates)

---

**Status**: Contract implemented and tested (77 passing tests)
