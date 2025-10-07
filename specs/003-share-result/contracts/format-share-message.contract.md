# Contract: formatShareMessage

**Type**: Pure Function
**Module**: `src/features/day-guessing-game/share/utils/format-share-message.ts`

## Signature

```typescript
function formatShareMessage(data: ShareMessageData): string
```

## Input

**Parameter**: `data: ShareMessageData`

**Required Fields**:
```typescript
{
  dayName: string;              // Non-empty string
  dayType: 'real' | 'fake';
  playerGuess: 'real' | 'fake';
  isCorrect: boolean;
  currentStreak: number;        // >= 0
  milestoneText: string | null; // null when no milestone
  newBestText: string | null;   // null when no new best
}
```

**Preconditions**:
- `data.dayName` MUST NOT be empty string
- `data.currentStreak` MUST be >= 0
- Function MUST throw if preconditions violated (invariant check)

## Output

**Type**: `string`

**Format**: Plain text with `\n` line breaks, natural conversational style:

```
[Emoji] [Result]

[dayName] is [dayType]!
My guess: [playerGuess capitalized]

[Optional: Current streak: X [emoji]]
[Optional: Milestone text]
[Optional: New best text]

🔗 https://bull-jazz-day.vercel.app
```

**Postconditions**:
- Result MUST be non-empty string
- Result MUST contain day name, type, and guess
- Result MUST contain production URL
- Streak info MUST be omitted when `currentStreak === 0`
- Milestone info MUST be omitted when `milestoneText === null`
- New best info MUST be omitted when `newBestText === null`
- Result emoji MUST be 🎉 when `isCorrect === true`, ❌ when `isCorrect === false`

## Examples

### Example 1: Correct guess with streak (no milestone)

**Input**:
```typescript
{
  dayName: "International Day of Peace",
  dayType: "real",
  playerGuess: "real",
  isCorrect: true,
  currentStreak: 2,
  milestoneText: null,
  newBestText: null
}
```

**Output**:
```
🎉 Correct!

International Day of Peace is real!
My guess: Real

Current streak: 2

🔗 https://bull-jazz-day.vercel.app
```

### Example 2: Correct guess with milestone

**Input**:
```typescript
{
  dayName: "International Day of Friendship",
  dayType: "real",
  playerGuess: "real",
  isCorrect: true,
  currentStreak: 5,
  milestoneText: "🎖️ Milestone reached: 5-day streak!",
  newBestText: null
}
```

**Output**:
```
🎉 Correct!

International Day of Friendship is real!
My guess: Real

Current streak: 5
🎖️ Milestone reached: 5-day streak!

🔗 https://bull-jazz-day.vercel.app
```

### Example 3: Correct guess with new best streak

**Input**:
```typescript
{
  dayName: "International Day of Yoga",
  dayType: "real",
  playerGuess: "real",
  isCorrect: true,
  currentStreak: 8,
  milestoneText: null,
  newBestText: "🔥 New personal best: 8-day streak!"
}
```

**Output**:
```
🎉 Correct!

International Day of Yoga is real!
My guess: Real

Current streak: 8
🔥 New personal best: 8-day streak!

🔗 https://bull-jazz-day.vercel.app
```

### Example 4: Incorrect guess (streak reset to 0)

**Input**:
```typescript
{
  dayName: "International Day of Jazz",
  dayType: "fake",
  playerGuess: "real",
  isCorrect: false,
  currentStreak: 0,
  milestoneText: null,
  newBestText: null
}
```

**Output**:
```
❌ Incorrect!

International Day of Jazz is fake!
My guess: Real

🔗 https://bull-jazz-day.vercel.app
```

### Example 5: Milestone AND new best (both present)

**Input**:
```typescript
{
  dayName: "World Food Day",
  dayType: "real",
  playerGuess: "real",
  isCorrect: true,
  currentStreak: 10,
  milestoneText: "🎖️ Milestone reached: 10-day streak!",
  newBestText: "🔥 New personal best: 10-day streak!"
}
```

**Output**:
```
🎉 Correct!

World Food Day is real!
My guess: Real

Current streak: 10
🎖️ Milestone reached: 10-day streak!
🔥 New personal best: 10-day streak!

🔗 https://bull-jazz-day.vercel.app
```

## Error Handling

**Invalid Input**:
- Empty `dayName` → Throw invariant error
- Negative `currentStreak` → Throw invariant error

**Error Type**: Uses `tiny-invariant` package for precondition checks

**Example**:
```typescript
import invariant from 'tiny-invariant';

invariant(data.dayName.length > 0, 'dayName must not be empty');
invariant(data.currentStreak >= 0, 'currentStreak must be non-negative');
```

## Behavior Guarantees

**Purity**: Function is pure - same input always produces same output, no side effects

**Determinism**: Output depends only on input parameters, no external state

**Idempotency**: Calling multiple times with same input produces identical results

**Performance**: O(1) complexity, executes in <1ms

## Test Coverage Requirements

**Unit Tests MUST cover**:
1. Correct guess with no streak (currentStreak = 0)
2. Correct guess with streak (currentStreak > 0, no milestone)
3. Correct guess with milestone (milestoneText present)
4. Correct guess with new best (newBestText present)
5. Correct guess with both milestone AND new best
6. Incorrect guess (streak = 0)
7. Incorrect guess immediately after having a streak
8. Empty dayName throws invariant error
9. Negative currentStreak throws invariant error
10. Edge case: streak = 1 (singular formatting if needed)

---

*This contract defines the expected behavior for test-driven development. Tests will be written against this contract before implementation.*
