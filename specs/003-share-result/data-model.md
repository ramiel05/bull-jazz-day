# Data Model: Share Results Feature

**Feature**: 003-share-result
**Date**: 2025-10-07

## Entities

### ShareMessageData

**Description**: Input data required to format a share message

**Fields**:
- `dayName: string` - The name of the UN International Day (e.g., "International Day of Peace")
- `dayType: 'real' | 'fake'` - Whether the day is actually real or fake
- `playerGuess: 'real' | 'fake'` - The player's guess about the day
- `isCorrect: boolean` - Whether the player's guess was correct
- `currentStreak: number` - Player's current consecutive streak (0 or positive integer)
- `milestoneText: string | null` - Formatted milestone text if achieved on this guess, null otherwise
- `newBestText: string | null` - Formatted new best streak text if achieved, null otherwise

**Validation Rules**:
- `dayName` MUST NOT be empty string
- `currentStreak` MUST be >= 0
- `milestoneText` is null when currentStreak is not a milestone value (3, 5, 10, 15, 20, 30, 50, 100)
- `newBestText` is null when current streak did not exceed previous best

**Source**: Derived from `GuessResult` (game-types.ts) and `StreakState` (streak-types.ts)

**Example**:
```typescript
{
  dayName: "International Day of Peace",
  dayType: "real",
  playerGuess: "real",
  isCorrect: true,
  currentStreak: 5,
  milestoneText: "🎖️ Milestone reached: 5-day streak!",
  newBestText: null
}
```

### ShareButtonState

**Description**: UI state for the share button

**Type**: Discriminated union of button states

**Values**:
- `'idle'` - Default state, shows "Share" text
- `'copied'` - Success state, shows "Copied!" text
- `'failed'` - Failure state, shows "Copy failed" text

**State Transitions**:
```
idle → (click) → copied (after 5000ms) → idle
idle → (click) → failed (after 5000ms) → idle
```

**Rationale**: String literal union type (not null-based) follows Constitution Principle VII. Each state is a valid, meaningful value.

## Derived Data

### Formatted Share Message

**Description**: Plain text message copied to clipboard

**Format**:
```
[Result Emoji] [Result Text]

[dayName] is [dayType]!
My guess: [playerGuess]

[Streak line - only if currentStreak > 0]
[Milestone line - only if milestoneText !== null]
[New best line - only if newBestText !== null]

🔗 [Production URL]
```

**Example (Correct guess with milestone)**:
```
🎉 Correct!

International Day of Peace is real!
My guess: Real

Current streak: 5 🎖️
Milestone reached: 5-day streak!

🔗 https://bull-jazz-day.vercel.app
```

**Example (Incorrect guess, streak reset to 0)**:
```
❌ Incorrect!

International Day of Jazz is fake!
My guess: Real

🔗 https://bull-jazz-day.vercel.app
```

**Conditional Sections**:
1. **Streak info**: Omitted entirely when `currentStreak === 0`
2. **Milestone**: Omitted when `milestoneText === null`
3. **New best**: Omitted when `newBestText === null`

## Relationships

```
GuessResult (existing) ───┐
                          ├──> ShareMessageData ──> formatShareMessage() ──> string
StreakState (existing) ───┘

ShareButton component:
  - Assembles ShareMessageData from props
  - Calls formatShareMessage()
  - Calls copyToClipboard()
  - Manages ShareButtonState
```

## Constants

### Production URL

**Value**: `https://bull-jazz-day.vercel.app`

**Usage**: Appended to all share messages

**Source**: Specified in spec clarifications

### State Timeout Duration

**Value**: `5000` ms (5 seconds)

**Usage**: Duration for 'copied'/'failed' states before reverting to 'idle'

**Source**: Specified in spec clarifications (FR-016)

### Result Emojis

**Correct**: 🎉 (U+1F389, party popper)

**Incorrect**: ❌ (U+274C, cross mark)

**Rationale**: Consistent with existing feedback panel emojis

### Milestone Emojis

**Standard milestones (3, 5, 10, 15, 20)**: 🎖️ (U+1F396, military medal)

**Major milestones (30, 50, 100)**: 🏆 (U+1F3C6, trophy)

**New best streak**: 🔥 (U+1F525, fire)

**Rationale**: Escalating visual significance matches achievement importance

## State Management

**Scope**: Component-local state (no global/context state needed)

**Persistence**: None (button state is transient, resets on mount)

**Synchronization**: Not applicable (single component, no shared state)

## Type Definitions Location

**File**: `src/features/day-guessing-game/share/types/share-types.ts`

**Exports**:
```typescript
export type ShareMessageData = { /* ... */ };
export type ShareButtonState = 'idle' | 'copied' | 'failed';
```

**Imports From**:
- `GuessResult` from `~/features/day-guessing-game/types/game-types`
- `StreakState` from `~/features/day-guessing-game/streak/types/streak-types`
- `InternationalDay` from `~/features/day-guessing-game/types/international-day`

---

*Data model complete. Ready for contract generation.*
