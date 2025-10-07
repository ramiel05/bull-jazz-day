# Contract: ShareButton Component

**Type**: React Client Component
**Module**: `src/features/day-guessing-game/components/share-button.tsx`

## Component Signature

```typescript
export default function ShareButton(props: ShareButtonProps): JSX.Element

type ShareButtonProps = {
  guessResult: GuessResult;
  streakState: StreakState;
}
```

## Props

### guessResult: GuessResult

**Type**:
```typescript
{
  correct: boolean;
  day: InternationalDay; // { name: string, isReal: boolean, ... }
}
```

**Usage**: Source data for day name, type, and correctness

### streakState: StreakState

**Type**:
```typescript
{
  currentStreak: number;
  bestStreak: number;
  currentMilestoneColor: string | null;
  lastGuessDate: string | null;
}
```

**Usage**: Source data for streak, milestone, and best streak information

## Behavior

### Initial Render

**Display**:
- Button with text "Share"
- Appropriate styling (matches feedback panel theme)
- Button is enabled and clickable

### On Click

**Action Sequence**:
1. Assemble `ShareMessageData` from props:
   - Extract day name from `guessResult.day.name`
   - Determine day type: 'real' if `guessResult.day.isReal`, else 'fake'
   - Determine player guess from `guessResult.correct` + day type (reverse logic)
   - Set `isCorrect` from `guessResult.correct`
   - Set `currentStreak` from `streakState.currentStreak`
   - Determine `milestoneText` (logic TBD - check if current streak is milestone)
   - Determine `newBestText` (logic TBD - check if current > previous best)

2. Call `formatShareMessage(data)` to generate text

3. Call `await copyToClipboard(text)`

4. **If success**:
   - Set button state to 'copied'
   - Button text changes to "Copied!"
   - After 5 seconds, revert to 'idle' ("Share")

5. **If failure**:
   - Set button state to 'failed'
   - Button text changes to "Copy failed"
   - After 5 seconds, revert to 'idle' ("Share")

### State Management

**State Variable**: `buttonState: 'idle' | 'copied' | 'failed'`

**Initial Value**: `'idle'`

**Transitions**:
- `idle` → `copied` (on successful copy)
- `idle` → `failed` (on failed copy)
- `copied` → `idle` (after 5000ms)
- `failed` → `idle` (after 5000ms)

**Timeout Cleanup**: `useEffect` with cleanup to clear timeout on unmount

## UI States

### idle State
- Button text: "Share"
- Button enabled: true
- Style: Primary button style

### copied State
- Button text: "Copied!"
- Button enabled: true (can share again)
- Style: Success style (green accent)

### failed State
- Button text: "Copy failed"
- Button enabled: true (can retry)
- Style: Error style (red accent)

## Accessibility

**ARIA Attributes**:
- `role="button"` (implicit on `<button>`)
- `aria-label="Share your result"` (when in 'idle' state)
- `aria-label="Result copied to clipboard"` (when in 'copied' state)
- `aria-label="Failed to copy result"` (when in 'failed' state)
- `aria-live="polite"` on status text container (announces state changes)

**Keyboard Support**:
- Enter/Space triggers share action (default button behavior)

## Example Usage

```tsx
<ShareButton
  guessResult={{
    correct: true,
    day: {
      name: "International Day of Peace",
      isReal: true,
      date: "September 21",
      description: "...",
      sourceUrl: "..."
    }
  }}
  streakState={{
    currentStreak: 5,
    bestStreak: 8,
    currentMilestoneColor: "text-green-500",
    lastGuessDate: "2025-10-07"
  }}
/>
```

## Derived Data Logic

### Determining Player Guess

**Logic**:
```typescript
const dayType = guessResult.day.isReal ? 'real' : 'fake';
const playerGuess = guessResult.correct
  ? dayType  // If correct, they guessed what it actually is
  : (dayType === 'real' ? 'fake' : 'real'); // If incorrect, they guessed opposite
```

### Determining Milestone Text

**Logic**:
```typescript
const MILESTONE_VALUES = [3, 5, 10, 15, 20, 30, 50, 100];
const isMilestone = MILESTONE_VALUES.includes(streakState.currentStreak);

const milestoneText = isMilestone
  ? `${getMilestoneEmoji(streakState.currentStreak)} Milestone reached: ${streakState.currentStreak}-day streak!`
  : null;
```

### Determining New Best Text

**Logic**:
```typescript
const isNewBest = streakState.currentStreak > streakState.bestStreak;

const newBestText = isNewBest
  ? `🔥 New personal best: ${streakState.currentStreak}-day streak!`
  : null;
```

**Note**: This checks current > best, but best should already be updated by streak counter hook before this component renders. Need to verify streak update timing.

## Test Coverage Requirements

**Unit Tests MUST cover**:
1. Initial render shows "Share" button
2. Click assembles correct ShareMessageData for correct guess
3. Click assembles correct ShareMessageData for incorrect guess
4. Successful copy changes button to "Copied!"
5. Failed copy changes button to "Copy failed"
6. "Copied!" reverts to "Share" after 5 seconds
7. "Copy failed" reverts to "Share" after 5 seconds
8. Milestone text generated when streak is milestone value
9. New best text generated when current > best
10. No milestone text when streak is not milestone value
11. Timeout cleanup on unmount prevents memory leak
12. Accessibility attributes present

**Integration Tests MUST cover**:
- Full share flow in feedback panel context
- Multiple shares in same session
- Share after correct guess with streak
- Share after incorrect guess (streak = 0)

## Dependencies

**Internal**:
- `formatShareMessage` from `~/features/day-guessing-game/share/utils/format-share-message`
- `copyToClipboard` from `~/features/day-guessing-game/share/utils/copy-to-clipboard`
- `GuessResult` from `~/features/day-guessing-game/types/game-types`
- `StreakState` from `~/features/day-guessing-game/streak/types/streak-types`
- `MILESTONE_CONFIGS` from `~/features/day-guessing-game/streak/constants/milestones`

**External**:
- React (useState, useEffect, useCallback)

## Integration Point

**Parent Component**: `FeedbackPanel`

**Modification Required**: Add `<ShareButton>` to feedback panel JSX after feedback content, before countdown timer.

**Props Source**:
- `guessResult` - Already available as prop in FeedbackPanel
- `streakState` - Need to pass from GameContainer (may require prop drilling or context)

---

*This contract defines the expected behavior for test-driven development. Tests will be written against this contract before implementation.*
