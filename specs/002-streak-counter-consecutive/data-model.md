# Data Model: Daily Streak Counter

**Feature**: 002-streak-counter-consecutive
**Created**: 2025-10-01
**Updated**: 2025-10-07 (aligned with daily challenge mechanics)

## Overview

This document defines the data structures for the daily streak counter feature. All types follow TypeScript conventions and Constitutional principles (functional patterns, explicit null types, immutability through React state updates).

**Context**: Integrates with daily challenge game (spec 001). Streak represents consecutive DAYS with correct guesses, persisted in localStorage across browser sessions.

## Core Entities

### StreakState

Represents the user's streak tracking data, persisted in localStorage.

**Type Definition**:
```typescript
type StreakState = {
  currentStreak: number;              // Non-negative integer, starts at 0
  bestStreak: number;                 // Non-negative integer, starts at 0
  currentMilestoneColor: string | null;  // null = no milestone reached yet
  lastGuessDate: string | null;       // YYYY-MM-DD format or null
};
```

**Properties**:
- `currentStreak`: Consecutive calendar days with correct guesses (resets to 0 on incorrect guess or skipped day)
- `bestStreak`: Highest streak ever achieved (persists across all sessions, never decreases)
- `currentMilestoneColor`: CSS class string for milestone color, or null if no milestone reached
- `lastGuessDate`: Date (YYYY-MM-DD) of most recent guess, used to detect skipped days and prevent double-counting same day

**Invariants**:
- `currentStreak >= 0`
- `bestStreak >= 0`
- `bestStreak >= currentStreak` (always true)
- `currentMilestoneColor` is null OR valid Tailwind color class string
- `lastGuessDate` is null OR valid YYYY-MM-DD format string
- Streak can increment by max 1 per calendar day

**Default State**:
```typescript
const initialStreakState: StreakState = {
  currentStreak: 0,
  bestStreak: 0,
  currentMilestoneColor: null,
  lastGuessDate: null,
};
```

**State Transitions** (Daily Streak):
```
[Initial: 0/0/null/null]
  ↓ Day 1 (2025-10-07) correct guess
[1/1/null/"2025-10-07"]
  ↓ Day 2 (2025-10-08) correct guess
[2/2/null/"2025-10-08"]
  ↓ Day 3 (2025-10-09) correct guess (milestone 3 reached)
[3/3/blue/"2025-10-09"]
  ↓ Day 4 (2025-10-10) correct guess
[4/4/blue/"2025-10-10"] (color persists)
  ↓ Day 5 (2025-10-11) incorrect guess
[0/4/null/"2025-10-11"] (current resets, best preserved, color resets)
  ↓ Skip Day 6, return Day 7 (2025-10-13)
[0/4/null/"2025-10-13"] (streak already broken, date updates)
```

**Skipped Day Detection**:
```
lastGuessDate = "2025-10-07"
currentDate = "2025-10-09"
daysDiff = 2 (skipped Day 8)
→ Streak breaks, reset to 0
```

### MilestoneConfig

Static configuration defining milestone thresholds and their colors.

**Type Definition**:
```typescript
type MilestoneConfig = {
  value: number;
  color: string;  // Tailwind color class
};

type MilestoneThresholds = readonly [3, 5, 10, 15, 20, 30, 50, 100];
```

**Configuration**:
```typescript
const MILESTONE_CONFIGS: ReadonlyArray<MilestoneConfig> = [
  { value: 3, color: 'text-blue-500' },
  { value: 5, color: 'text-green-500' },
  { value: 10, color: 'text-purple-500' },
  { value: 15, color: 'text-orange-500' },
  { value: 20, color: 'text-red-500' },
  { value: 30, color: 'text-yellow-500' },  // gold
  { value: 50, color: 'text-cyan-500' },
  { value: 100, color: 'text-magenta-500' },
] as const;
```

**Properties**:
- Immutable (readonly array)
- Sorted ascending by value
- Used for milestone detection and color lookup

### MilestoneEvent

Represents a transient milestone celebration trigger.

**Type Definition**:
```typescript
type MilestoneEvent = {
  streakValue: number;      // The milestone reached (3, 5, 10, etc.)
  color: string;            // Tailwind color class for this milestone
  timestamp: number;        // Date.now() when triggered (for animation timing)
};
```

**Properties**:
- Ephemeral: exists only during animation (<1 second)
- Not persisted in StreakState (derived event)
- Triggers CSS animation class application

**Lifecycle**:
```
1. Streak reaches milestone value
2. MilestoneEvent created
3. Animation component applies CSS class
4. After animation completes (~800ms), event cleared
5. Color persists in StreakState.currentMilestoneColor
```

## Persistence Strategy

### localStorage Integration

Streak state is stored separately from daily game state.

**Storage Keys**:
- Daily game state: `'daily-game-state'` (from spec 001)
- Streak state: `'streak-state'` (spec 002)

**Rationale for Separate Storage**:
- Daily game state resets when calendar day changes
- Streak state persists across days
- Different lifecycles require separate storage

### Storage Functions

```typescript
const STORAGE_KEY = 'streak-state';

function getStreakState(): StreakState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate and return parsed state
      return validateStreakState(parsed);
    }
  } catch (error) {
    console.error('Error reading streak state:', error);
  }
  return initialStreakState;
}

function saveStreakState(state: StreakState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving streak state:', error);
  }
}
```

### Integration with Daily Challenge

Streak updates must coordinate with daily guess:

1. User makes guess (spec 001 flow)
2. Daily state saved: `{ date: "2025-10-07", guessedCorrectly: true, ... }`
3. Check if guess was correct
4. If correct AND new day: increment streak, update lastGuessDate
5. If incorrect: reset streak to 0, update lastGuessDate
6. If same day as lastGuessDate: no streak change
7. If skipped days: reset streak to 0, update lastGuessDate
8. Save updated streak state to localStorage

## Integration with Existing GameState

### Modified GameState

Extend existing GameState to include streak.

**Current GameState** (from game-types.ts):
```typescript
export type GameState = {
  currentDay: InternationalDay;
  phase: GamePhase;
  lastResult: GuessResult | null;
};
```

**Extended GameState** (after implementation):
```typescript
export type GameState = {
  currentDay: InternationalDay;
  phase: GamePhase;
  lastResult: GuessResult | null;
  streak: StreakState;  // NEW
};
```

**Migration Strategy**:
1. Add streak field as optional first: `streak?: StreakState`
2. Load from localStorage on GameContainer mount
3. Update handleGuess to check date and increment/reset streak
4. Save to localStorage after each streak update
5. Remove optional modifier once all code updated

## Validation Rules

### StreakState Validation

**Preconditions** (checked with invariant):
```typescript
invariant(state.currentStreak >= 0, 'Current streak cannot be negative');
invariant(state.bestStreak >= 0, 'Best streak cannot be negative');
invariant(
  state.bestStreak >= state.currentStreak,
  'Best streak must be >= current streak'
);
invariant(
  state.lastGuessDate === null || /^\d{4}-\d{2}-\d{2}$/.test(state.lastGuessDate),
  'Last guess date must be null or YYYY-MM-DD format'
);
```

**Postconditions** (after state update):
- Increment (new day): `newStreak === oldStreak + 1`, `newLastGuessDate === currentDate`
- Reset (incorrect or skipped): `newStreak === 0`, `newLastGuessDate === currentDate`
- Same day: `newStreak === oldStreak`, `newLastGuessDate === oldLastGuessDate`
- Best update: `newBest === Math.max(oldBest, currentStreak)`

### Skipped Day Detection Logic

```typescript
function calculateDaysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function hasSkippedDays(lastGuessDate: string | null, currentDate: string): boolean {
  if (lastGuessDate === null) return false;
  const daysDiff = calculateDaysDifference(lastGuessDate, currentDate);
  return daysDiff > 1; // More than 1 day between guesses = skipped
}
```

### Milestone Detection

**Rule**: A milestone event triggers when `currentStreak` equals a value in `MILESTONE_CONFIGS`

**Algorithm**:
```typescript
function detectMilestone(streak: number): MilestoneConfig | null {
  return MILESTONE_CONFIGS.find(m => m.value === streak) ?? null;
}
```

**Edge Cases**:
- Streak 1-2: No milestone (returns null)
- Streak 3: First milestone (blue)
- Streak 4: No milestone, color persists from 3
- Streak 101: No milestone (beyond 100, magenta persists)

## Relationships

```
GameState (1) --contains--> (1) StreakState
StreakState (0..1) --references--> (1) MilestoneConfig [via currentMilestoneColor]
MilestoneEvent (0..*) --derives-from--> (1) StreakState [transient]
```

**Ownership**:
- GameContainer owns GameState
- useStreakCounter hook owns StreakState update logic
- MilestoneAnimation component owns MilestoneEvent lifecycle

## Serialization

**localStorage Format**:
```json
{
  "currentStreak": 5,
  "bestStreak": 10,
  "currentMilestoneColor": "text-green-500",
  "lastGuessDate": "2025-10-07"
}
```

**Storage Key**: `'streak-state'`

**Persistence Lifecycle**:
- Load on application start
- Save immediately after each streak update
- Persists across browser sessions
- No expiration (user can have infinite lifetime best streak)

## Type Exports

**Public Types** (exported from streak/types/streak-types.ts):
```typescript
export type { StreakState, MilestoneConfig, MilestoneEvent };
export { MILESTONE_CONFIGS, initialStreakState };
```

**Internal Types** (not exported):
```typescript
type MilestoneThresholds = readonly [3, 5, 10, 15, 20, 30, 50, 100];
```

---

**Status**: Data model complete, ready for contract generation
