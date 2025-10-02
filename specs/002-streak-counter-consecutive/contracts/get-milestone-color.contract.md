# Contract: getMilestoneColor Function

**Type**: Pure Function
**File**: `src/features/day-guessing-game/streak/utils/get-milestone-color.ts`

## Signature

```typescript
function getMilestoneColor(streakCount: number): string | null
```

## Input Contract

### Parameters

#### `streakCount: number`

The current streak count to determine color for.

**Type**: `number` (integer expected)

**Valid Range**: `>= 0` (non-negative integers)

**Invalid Inputs**:
- Negative numbers
- Non-integer numbers
- NaN
- Infinity

### Preconditions

```typescript
invariant(Number.isInteger(streakCount), 'Streak count must be an integer');
invariant(streakCount >= 0, 'Streak count must be non-negative');
invariant(Number.isFinite(streakCount), 'Streak count must be finite');
```

## Output Contract

### Return Value

**Type**: `string | null`

#### When Milestone Color Exists

Returns the Tailwind color class string for the **highest milestone at or below** the current streak.

**Logic**: Find the highest milestone value <= `streakCount`, return its color.

**Examples**:
- `getMilestoneColor(0)` → `null` (no milestone reached)
- `getMilestoneColor(3)` → `'text-blue-500'` (exactly at milestone 3)
- `getMilestoneColor(4)` → `'text-blue-500'` (between 3 and 5, use 3's color)
- `getMilestoneColor(5)` → `'text-green-500'` (exactly at milestone 5)
- `getMilestoneColor(9)` → `'text-green-500'` (between 5 and 10, use 5's color)
- `getMilestoneColor(100)` → `'text-magenta-500'` (exactly at milestone 100)
- `getMilestoneColor(150)` → `'text-magenta-500'` (beyond 100, use 100's color)

#### When No Milestone Color

Returns `null`

**Conditions**:
- `streakCount` is 0, 1, or 2 (below first milestone of 3)

### Postconditions

**If return value is not null**:
- Return value is a valid Tailwind color class string
- There exists a milestone M where M <= streakCount
- Return value is the color of the highest such M

**If return value is null**:
- `streakCount` < 3 (below first milestone)

### Side Effects

None - pure function

## Behavior Specification

### Color Mapping by Streak Range

| Streak Range | Returns | Rationale |
|--------------|---------|-----------|
| 0-2 | `null` | Below first milestone |
| 3-4 | `'text-blue-500'` | Milestone 3 reached, persists until 5 |
| 5-9 | `'text-green-500'` | Milestone 5 reached, persists until 10 |
| 10-14 | `'text-purple-500'` | Milestone 10 reached |
| 15-19 | `'text-orange-500'` | Milestone 15 reached |
| 20-29 | `'text-red-500'` | Milestone 20 reached |
| 30-49 | `'text-yellow-500'` | Milestone 30 reached (gold) |
| 50-99 | `'text-cyan-500'` | Milestone 50 reached |
| 100+ | `'text-magenta-500'` | Milestone 100 reached, persists forever |

### Algorithm

**Implementation**:
```typescript
function getMilestoneColor(streakCount: number): string | null {
  invariant(Number.isInteger(streakCount), 'Streak count must be an integer');
  invariant(streakCount >= 0, 'Streak count must be non-negative');
  invariant(Number.isFinite(streakCount), 'Streak count must be finite');

  // Find highest milestone at or below streakCount
  const milestone = [...MILESTONE_CONFIGS]
    .reverse()
    .find(m => m.value <= streakCount);

  return milestone?.color ?? null;
}
```

**Complexity**:
- Time: O(1) - 8 milestones, constant-time lookup
- Space: O(1) - no allocations

### Error Handling

**Invariant Violations**:
- Throws error if `streakCount` is negative
- Throws error if `streakCount` is not an integer
- Throws error if `streakCount` is NaN or Infinity

## Difference from calculateMilestone

| Function | Purpose | Return for streak 4 |
|----------|---------|---------------------|
| `calculateMilestone(4)` | Detect exact milestone match | `null` (4 is not a milestone) |
| `getMilestoneColor(4)` | Get current color to display | `'text-blue-500'` (persists from milestone 3) |

**Use Cases**:
- `calculateMilestone`: Trigger celebration animation (only on exact match)
- `getMilestoneColor`: Apply color to streak display (persists after milestone)

## Test Requirements

### Unit Tests

**File**: `get-milestone-color.test.ts` (co-located)

**Test Cases**:
1. Returns null for streak 0
2. Returns null for streak 1
3. Returns null for streak 2
4. Returns blue for streak 3
5. Returns blue for streak 4 (persists)
6. Returns green for streak 5
7. Returns green for streak 9 (persists)
8. Returns purple for streak 10
9. Returns purple for streak 14 (persists)
10. Returns orange for streak 15
11. Returns red for streak 20
12. Returns gold for streak 30
13. Returns cyan for streak 50
14. Returns magenta for streak 100
15. Returns magenta for streak 150 (persists beyond 100)
16. Throws error for negative streak
17. Throws error for non-integer streak
18. Throws error for NaN
19. Throws error for Infinity

---

**Status**: Contract defined, ready for test implementation
