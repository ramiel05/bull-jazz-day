# Contract: StreakDisplay Component

**Type**: React Client Component
**File**: `src/features/day-guessing-game/streak/components/streak-display.tsx`

## Signature

```typescript
type StreakDisplayProps = {
  currentStreak: number;
  bestStreak: number;
  milestoneColor: string | null;
  onMilestoneReached?: (milestone: number) => void;
};

function StreakDisplay(props: StreakDisplayProps): JSX.Element
```

## Input Contract

### Props

#### `currentStreak: number` (required)

The current consecutive correct guesses.

**Type**: `number` (non-negative integer)

**Valid Values**: `>= 0`

**Display Format**: "Current: {currentStreak}"

#### `bestStreak: number` (required)

The best streak achieved in the current session.

**Type**: `number` (non-negative integer)

**Valid Values**: `>= 0`, `>= currentStreak`

**Display Format**: "Best: {bestStreak}"

#### `milestoneColor: string | null` (required)

The Tailwind color class to apply to the streak display.

**Type**: `string | null`

**Valid Values**:
- `null`: No milestone reached (use default color)
- Tailwind color class string (e.g., `'text-blue-500'`)

**Effect**: Applied to streak counter text

#### `onMilestoneReached?: (milestone: number) => void` (optional)

Callback triggered when a milestone is detected.

**Type**: Optional function

**Parameters**: `milestone: number` - The milestone value reached (3, 5, 10, etc.)

**Timing**: Called once per milestone when `currentStreak` changes to milestone value

### Preconditions

```typescript
invariant(props.currentStreak >= 0, 'Current streak must be non-negative');
invariant(props.bestStreak >= 0, 'Best streak must be non-negative');
invariant(
  props.bestStreak >= props.currentStreak,
  'Best streak must be >= current streak'
);
```

## Output Contract

### Rendered Output

**Structure**:
```tsx
<div className="streak-display" role="status" aria-live="polite">
  <div className={milestoneColor ?? 'text-gray-700'}>
    <span>Current: {currentStreak}</span>
    <span>Best: {bestStreak}</span>
  </div>
</div>
```

**Accessibility**:
- `role="status"`: Indicates informational content
- `aria-live="polite"`: Screen reader announces updates (non-interruptive)
- Text content readable by screen readers: "Current: 5, Best: 10"

**Visual Behavior**:
- Default color (gray) when `milestoneColor` is null
- Milestone color applied when not null
- Both current and best streaks always visible

### Side Effects

#### Milestone Detection

**Behavior**:
- Component internally detects when `currentStreak` prop changes to a milestone value
- If milestone detected AND `onMilestoneReached` callback provided, calls callback with milestone value
- Ensures callback fires only once per milestone (not on every re-render at that streak)

**Example**:
```typescript
// Streak changes from 2 to 3
// Component detects 3 is a milestone
// Calls onMilestoneReached(3)

// Subsequent re-renders at streak 3 do not call callback again
```

### Postconditions

**Rendered DOM**:
- Text content matches props: "Current: {currentStreak}" and "Best: {bestStreak}"
- Color class applied matches `milestoneColor` prop (or default if null)
- ARIA attributes present for accessibility

**Callback Invocation**:
- If `currentStreak` changed to milestone value, `onMilestoneReached` was called exactly once with that value
- If `currentStreak` is not a milestone, `onMilestoneReached` was not called

## Behavior Specification

### Display Examples

| Props | Rendered Text | Color Class |
|-------|---------------|-------------|
| `{ currentStreak: 0, bestStreak: 0, milestoneColor: null }` | "Current: 0, Best: 0" | `text-gray-700` |
| `{ currentStreak: 3, bestStreak: 3, milestoneColor: 'text-blue-500' }` | "Current: 3, Best: 3" | `text-blue-500` |
| `{ currentStreak: 5, bestStreak: 10, milestoneColor: 'text-green-500' }` | "Current: 5, Best: 10" | `text-green-500` |

### Milestone Callback Behavior

**Scenario 1**: Streak increments to milestone
```
Props change: currentStreak 2 → 3
Expected: onMilestoneReached(3) called once
```

**Scenario 2**: Component re-renders at same streak
```
Props: currentStreak stays at 3 (re-render)
Expected: onMilestoneReached NOT called again
```

**Scenario 3**: Streak increments past milestone
```
Props change: currentStreak 3 → 4
Expected: onMilestoneReached NOT called (4 is not a milestone)
```

**Scenario 4**: No callback provided
```
Props: onMilestoneReached is undefined
Expected: No error, milestone detection still works for internal logic
```

### Error Handling

**Invariant Violations**:
- Component throws error if `currentStreak < 0`
- Component throws error if `bestStreak < currentStreak`
- Errors displayed in React error boundary (if present)

## Integration Points

### Parent Component Usage

```typescript
function GameContainer() {
  const { streakState, incrementStreak, resetStreak } = useStreakCounter();

  return (
    <StreakDisplay
      currentStreak={streakState.currentStreak}
      bestStreak={streakState.bestStreak}
      milestoneColor={streakState.currentMilestoneColor}
      onMilestoneReached={(milestone) => {
        // Trigger celebration animation
        setShowCelebration(milestone);
      }}
    />
  );
}
```

### Child Components

**MilestoneAnimation** (optional):
- Sibling component triggered by `onMilestoneReached` callback
- StreakDisplay focuses on display, delegates animation to separate component

## Test Requirements

### Unit Tests

**File**: `streak-display.test.tsx` (co-located)

**Test Cases**:
1. Renders "Current: 0" and "Best: 0" for initial state
2. Renders correct current streak value
3. Renders correct best streak value
4. Applies default color when milestoneColor is null
5. Applies milestone color when milestoneColor is provided
6. Calls onMilestoneReached when streak reaches milestone (e.g., 3)
7. Does not call onMilestoneReached on re-render at same streak
8. Does not call onMilestoneReached for non-milestone streaks
9. Works without onMilestoneReached callback (no error)
10. Has role="status" attribute
11. Has aria-live="polite" attribute
12. Throws error if currentStreak is negative
13. Throws error if bestStreak < currentStreak

### Integration Tests

Covered in `streak-flow.test.tsx` (tests StreakDisplay within full game flow)

---

**Status**: Contract defined, ready for test implementation
