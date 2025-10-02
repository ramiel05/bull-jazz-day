# Contract: useStreakCounter Hook

**Type**: React Custom Hook
**File**: `src/features/day-guessing-game/streak/hooks/use-streak-counter.ts`

## Signature

```typescript
function useStreakCounter(): {
  streakState: StreakState;
  incrementStreak: () => void;
  resetStreak: () => void;
}
```

## Input Contract

### Parameters
None - hook called without arguments

### Preconditions
- Must be called within a React component or custom hook (React context required)
- Component must be mounted

## Output Contract

### Return Value

**Type**: Object with three properties

```typescript
{
  streakState: StreakState;
  incrementStreak: () => void;
  resetStreak: () => void;
}
```

#### `streakState: StreakState`

Current streak state object.

**Structure**:
```typescript
{
  currentStreak: number;           // >= 0
  bestStreak: number;              // >= 0, >= currentStreak
  currentMilestoneColor: string | null;  // null or Tailwind class
}
```

**Invariants**:
- `streakState.currentStreak >= 0`
- `streakState.bestStreak >= 0`
- `streakState.bestStreak >= streakState.currentStreak`

#### `incrementStreak: () => void`

Function to increment the current streak by 1.

**Behavior**:
- Increments `currentStreak` by 1
- Updates `bestStreak` if new `currentStreak` exceeds it
- Updates `currentMilestoneColor` if new `currentStreak` is a milestone
- Triggers re-render

**Side Effects**:
- State update (causes component re-render)
- May trigger milestone event (observable via streakState.currentMilestoneColor change)

#### `resetStreak: () => void`

Function to reset the current streak to 0.

**Behavior**:
- Sets `currentStreak` to 0
- Preserves `bestStreak` (no change)
- Resets `currentMilestoneColor` to null
- Triggers re-render

**Side Effects**:
- State update (causes component re-render)

### Postconditions

**After `incrementStreak()`**:
- `streakState.currentStreak === previousStreak + 1`
- `streakState.bestStreak === Math.max(previousBest, currentStreak)`
- `streakState.currentMilestoneColor` updated if milestone reached

**After `resetStreak()`**:
- `streakState.currentStreak === 0`
- `streakState.bestStreak === previousBest` (unchanged)
- `streakState.currentMilestoneColor === null`

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

## Usage Example

```typescript
function GameContainer() {
  const { streakState, incrementStreak, resetStreak } = useStreakCounter();

  const handleCorrectGuess = () => {
    incrementStreak();
    console.log(`Streak: ${streakState.currentStreak}`);
  };

  const handleIncorrectGuess = () => {
    resetStreak();
    console.log('Streak reset');
  };

  return (
    <StreakDisplay
      current={streakState.currentStreak}
      best={streakState.bestStreak}
      color={streakState.currentMilestoneColor}
    />
  );
}
```

## Test Requirements

### Unit Tests

**File**: `use-streak-counter.test.ts` (co-located)

**Test Cases**:
1. Initial state is `{ currentStreak: 0, bestStreak: 0, currentMilestoneColor: null }`
2. `incrementStreak()` increments currentStreak from 0 to 1
3. `incrementStreak()` updates bestStreak when current exceeds it
4. `incrementStreak()` at milestone (e.g., 3) sets currentMilestoneColor to 'text-blue-500'
5. `incrementStreak()` past milestone (e.g., 4) retains milestone color
6. `resetStreak()` sets currentStreak to 0
7. `resetStreak()` preserves bestStreak
8. `resetStreak()` clears currentMilestoneColor
9. Multiple increments correctly track streak (e.g., 0→1→2→3)
10. Best streak never decreases across increment/reset cycles

### Integration Tests

Covered in `streak-flow.test.tsx` (tests full game flow with streak updates)

---

**Status**: Contract defined, ready for test implementation
