# Data Model: Streak Counter

**Feature**: 002-streak-counter-consecutive
**Date**: 2025-10-01

## Overview

This document defines the data structures for the streak counter feature. All types follow TypeScript conventions and Constitutional principles (functional patterns, explicit null types, immutability through React state updates).

## Core Entities

### StreakState

Represents the current session's streak tracking data.

**Type Definition**:
```typescript
type StreakState = {
  currentStreak: number;        // Non-negative integer, starts at 0
  bestStreak: number;           // Non-negative integer, starts at 0
  currentMilestoneColor: string | null;  // null = no milestone reached yet
};
```

**Properties**:
- `currentStreak`: Consecutive correct guesses in current run (resets to 0 on incorrect guess)
- `bestStreak`: Highest streak achieved in current session (never decreases, resets on session start)
- `currentMilestoneColor`: CSS class string for milestone color, or null if no milestone reached

**Invariants**:
- `currentStreak >= 0`
- `bestStreak >= 0`
- `bestStreak >= currentStreak` (after any reset)
- `currentMilestoneColor` is null OR valid Tailwind color class string

**Default State**:
```typescript
const initialStreakState: StreakState = {
  currentStreak: 0,
  bestStreak: 0,
  currentMilestoneColor: null,
};
```

**State Transitions**:
```
[Initial: 0/0/null]
  ↓ correct guess
[1/1/null]
  ↓ correct guess
[2/2/null]
  ↓ correct guess (milestone 3 reached)
[3/3/blue]
  ↓ correct guess
[4/4/blue] (color persists)
  ↓ incorrect guess
[0/4/null] (current resets, best preserved, color resets)
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
2. Initialize in GameContainer useEffect
3. Update handleGuess to increment/reset streak
4. Remove optional modifier once all code updated

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
```

**Postconditions** (after state update):
- Increment: `newStreak === oldStreak + 1`
- Reset: `newStreak === 0`
- Best update: `newBest === Math.max(oldBest, currentStreak)`

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

**None Required**: All state is ephemeral (session-only, no persistence)

**Session Boundary**:
- Page refresh: All state lost (browser default behavior)
- No localStorage/sessionStorage usage
- No URL state encoding

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
