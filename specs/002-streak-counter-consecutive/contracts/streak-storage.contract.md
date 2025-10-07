# Contract: Streak Storage Functions

**Type**: Storage Utility Functions
**File**: `src/features/day-guessing-game/streak/storage/streak-storage.ts`

## Overview

Provides localStorage persistence for streak state. Handles reading, writing, and graceful degradation for corrupted/missing data.

## Signatures

```typescript
function getStreakState(): StreakState
function saveStreakState(state: StreakState): void
```

---

## getStreakState

### Signature

```typescript
function getStreakState(): StreakState
```

### Input Contract

**Parameters**: None

**Preconditions**:
- Function can be called in any browser environment
- localStorage may or may not be available
- localStorage may contain valid, invalid, or no data

### Output Contract

**Return Type**: `StreakState`

**Return Value**:
```typescript
{
  currentStreak: number;           // >= 0
  bestStreak: number;              // >= 0
  currentMilestoneColor: string | null;
  lastGuessDate: string | null;    // YYYY-MM-DD or null
}
```

**Behavior**:
1. Reads from `localStorage.getItem('streak-state')`
2. If found and valid, parses and returns stored state
3. If not found, corrupted, or invalid, returns fresh initial state

**Fresh Initial State**:
```typescript
{
  currentStreak: 0,
  bestStreak: 0,
  currentMilestoneColor: null,
  lastGuessDate: null,
}
```

### Postconditions

**Always returns valid StreakState**:
- All required fields present
- All types correct
- No undefined or missing properties

**Never throws**: Errors are caught and logged, function returns fresh state

### Side Effects

**Read**: `localStorage.getItem('streak-state')`

**Console**: May log error to console.error if JSON parse fails or data is corrupted

### Error Handling

**Graceful Degradation**:
```typescript
try {
  const stored = localStorage.getItem('streak-state');
  if (stored) {
    const parsed = JSON.parse(stored);
    // Validate all required fields present
    if (isValidStreakState(parsed)) {
      return parsed;
    }
  }
} catch (error) {
  console.error('Error reading streak state from localStorage:', error);
}
// Return fresh state on any error
return initialStreakState;
```

**Error Cases Handled**:
- localStorage not available (Safari private mode, etc.)
- Corrupted JSON syntax
- Missing required fields
- Wrong data types
- null/undefined stored value

---

## saveStreakState

### Signature

```typescript
function saveStreakState(state: StreakState): void
```

### Input Contract

**Parameters**:
- `state: StreakState` - Valid streak state object

**Preconditions**:
- `state` has all required fields
- localStorage may or may not be available
- localStorage may be at quota limit

### Output Contract

**Return Type**: `void`

**Behavior**:
1. Serializes `state` to JSON string
2. Writes to `localStorage.setItem('streak-state', jsonString)`
3. Overwrites any existing value

### Postconditions

**On Success**:
- localStorage contains serialized state at key `'streak-state'`
- Subsequent `getStreakState()` will return this state

**On Failure**:
- Error logged to console
- Function returns normally (does not throw)
- State may not be persisted

### Side Effects

**Write**: `localStorage.setItem('streak-state', JSON.stringify(state))`

**Console**: May log error to console.error if write fails

### Error Handling

**Graceful Degradation**:
```typescript
try {
  localStorage.setItem('streak-state', JSON.stringify(state));
} catch (error) {
  console.error('Error writing streak state to localStorage:', error);
}
```

**Error Cases Handled**:
- localStorage not available
- Quota exceeded (storage full)
- Security restrictions (cross-origin, etc.)

---

## Storage Key

**Constant**: `'streak-state'`

**Scope**: localStorage (per-origin, persistent)

**Format**: JSON string representation of StreakState

**Example Stored Value**:
```json
{
  "currentStreak": 5,
  "bestStreak": 10,
  "currentMilestoneColor": "text-green-500",
  "lastGuessDate": "2025-10-07"
}
```

---

## Data Validation

### Valid StreakState Criteria

A stored object is considered valid if:
1. It's an object (not null, array, or primitive)
2. Contains key `'currentStreak'` (any value)
3. Contains key `'bestStreak'` (any value)
4. Contains key `'currentMilestoneColor'` (any value)
5. Contains key `'lastGuessDate'` (any value)

**Note**: No runtime type checking of values. Assumes data written by same app version is valid.

---

## Integration with useStreakCounter

**Hook Initialization**:
```typescript
const [streakState, setStreakState] = useState<StreakState>(() => {
  return getStreakState(); // Load from localStorage
});
```

**Hook Updates**:
```typescript
useEffect(() => {
  saveStreakState(streakState); // Save on every state change
}, [streakState]);
```

---

## Test Requirements

### Unit Tests

**File**: `streak-storage.test.ts` (co-located)

**Test Cases**:
1. `getStreakState()` returns initial state when localStorage is empty
2. `getStreakState()` returns stored state when valid data exists
3. `getStreakState()` returns initial state when localStorage contains corrupted JSON
4. `getStreakState()` returns initial state when stored data is missing required fields
5. `getStreakState()` returns initial state when stored data is not an object
6. `saveStreakState(state)` saves state to localStorage with correct key
7. `saveStreakState(state)` overwrites existing state
8. `saveStreakState(state)` handles localStorage quota exceeded gracefully

---

**Status**: Contract implemented and tested (8 passing tests)
