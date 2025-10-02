# Contract: calculateMilestone Function

**Type**: Pure Function
**File**: `src/features/day-guessing-game/streak/utils/calculate-milestone.ts`

## Signature

```typescript
function calculateMilestone(streakCount: number): MilestoneConfig | null
```

## Input Contract

### Parameters

#### `streakCount: number`

The current streak count to check for milestone.

**Type**: `number` (integer expected, but accepts any number)

**Valid Range**: `>= 0` (non-negative integers)

**Invalid Inputs**:
- Negative numbers
- Non-integer numbers (e.g., 3.5)
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

**Type**: `MilestoneConfig | null`

#### When Milestone Reached

Returns `MilestoneConfig` object:

```typescript
{
  value: number;   // The milestone value (3, 5, 10, 15, 20, 30, 50, or 100)
  color: string;   // Tailwind color class (e.g., 'text-blue-500')
}
```

**Conditions**:
- `streakCount` exactly equals one of: 3, 5, 10, 15, 20, 30, 50, 100

**Examples**:
- `calculateMilestone(3)` → `{ value: 3, color: 'text-blue-500' }`
- `calculateMilestone(5)` → `{ value: 5, color: 'text-green-500' }`
- `calculateMilestone(100)` → `{ value: 100, color: 'text-magenta-500' }`

#### When No Milestone

Returns `null`

**Conditions**:
- `streakCount` is 0
- `streakCount` is between milestones (e.g., 1, 2, 4, 6, 11, 99)
- `streakCount` is beyond highest milestone (e.g., 101, 200)

**Examples**:
- `calculateMilestone(0)` → `null`
- `calculateMilestone(2)` → `null`
- `calculateMilestone(4)` → `null`
- `calculateMilestone(101)` → `null`

### Postconditions

**If return value is not null**:
- `result.value` is one of the milestone thresholds
- `result.value === streakCount`
- `result.color` is a valid Tailwind color class string

**If return value is null**:
- `streakCount` is not in the milestone set

### Side Effects

None - pure function (no state mutations, no I/O, deterministic)

## Behavior Specification

### Milestone Mapping

| Streak Count | Returns | Color |
|--------------|---------|-------|
| 0 | null | - |
| 1 | null | - |
| 2 | null | - |
| 3 | `{ value: 3, color: 'text-blue-500' }` | Blue |
| 4 | null | - |
| 5 | `{ value: 5, color: 'text-green-500' }` | Green |
| 6-9 | null | - |
| 10 | `{ value: 10, color: 'text-purple-500' }` | Purple |
| 11-14 | null | - |
| 15 | `{ value: 15, color: 'text-orange-500' }` | Orange |
| 16-19 | null | - |
| 20 | `{ value: 20, color: 'text-red-500' }` | Red |
| 21-29 | null | - |
| 30 | `{ value: 30, color: 'text-yellow-500' }` | Gold |
| 31-49 | null | - |
| 50 | `{ value: 50, color: 'text-cyan-500' }` | Cyan |
| 51-99 | null | - |
| 100 | `{ value: 100, color: 'text-magenta-500' }` | Magenta |
| 101+ | null | - |

### Error Handling

**Invariant Violations**:
- Throws error if `streakCount` is negative
- Throws error if `streakCount` is not an integer
- Throws error if `streakCount` is NaN or Infinity

**Example**:
```typescript
calculateMilestone(-1);   // throws: 'Streak count must be non-negative'
calculateMilestone(3.5);  // throws: 'Streak count must be an integer'
calculateMilestone(NaN);  // throws: 'Streak count must be finite'
```

## Implementation Notes

**Algorithm**:
```typescript
const MILESTONE_CONFIGS: ReadonlyArray<MilestoneConfig> = [
  { value: 3, color: 'text-blue-500' },
  // ... rest of milestones
];

function calculateMilestone(streakCount: number): MilestoneConfig | null {
  invariant(Number.isInteger(streakCount), 'Streak count must be an integer');
  invariant(streakCount >= 0, 'Streak count must be non-negative');
  invariant(Number.isFinite(streakCount), 'Streak count must be finite');

  return MILESTONE_CONFIGS.find(m => m.value === streakCount) ?? null;
}
```

**Complexity**:
- Time: O(1) - 8 milestones, fixed-size array
- Space: O(1) - no allocations

## Test Requirements

### Unit Tests

**File**: `calculate-milestone.test.ts` (co-located)

**Test Cases**:
1. Returns null for streak 0
2. Returns null for streak 1
3. Returns null for streak 2
4. Returns blue config for streak 3
5. Returns null for streak 4
6. Returns green config for streak 5
7. Returns purple config for streak 10
8. Returns orange config for streak 15
9. Returns red config for streak 20
10. Returns gold config for streak 30
11. Returns cyan config for streak 50
12. Returns magenta config for streak 100
13. Returns null for streak 101
14. Returns null for large streak (e.g., 1000)
15. Throws error for negative streak
16. Throws error for non-integer streak
17. Throws error for NaN
18. Throws error for Infinity

---

**Status**: Contract defined, ready for test implementation
