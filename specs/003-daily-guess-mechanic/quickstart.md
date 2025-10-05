# Quickstart: Daily Guess Mechanic

## Overview
This quickstart validates the daily challenge mechanic by walking through the complete user journey for a daily international day guessing game.

## Prerequisites
- Development server running (`pnpm dev`)
- Browser with localStorage enabled
- Current date/time available in local timezone

## Test Scenario: Complete Daily Challenge Flow

### 1. First Visit - New Daily Challenge

**Action**: Open the game in browser
```
Navigate to: http://localhost:3000
```

**Expected Outcome**:
- [ ] Page displays: "Today is [International Day Name]"
- [ ] Day name corresponds to current calendar date in your timezone
- [ ] "Real" and "Fake" guess buttons are visible
- [ ] No previous guess result is shown

**Validation**:
```typescript
// Check localStorage is empty for today
const state = localStorage.getItem('daily-game-state');
// Should be null or have different date
```

---

### 2. Make a Guess

**Action**: Click "Real" button (or "Fake" depending on the day)

**Expected Outcome**:
- [ ] Immediate feedback shown: "Correct!" or "Incorrect!"
- [ ] Truth revealed: actual status (Real/Fake), description, source link
- [ ] Streak counter updates if guess was correct
- [ ] Message displays: "Come back tomorrow for a new daily challenge"
- [ ] Countdown timer or next availability time shown

**Validation**:
```typescript
// Check localStorage has been updated
const state = JSON.parse(localStorage.getItem('daily-game-state'));
console.log(state);
// Should show:
// {
//   date: "2025-10-05",  // today's date
//   hasGuessed: true,
//   guessedCorrectly: true/false,
//   timestamp: 1728086400000
// }
```

---

### 3. Return Same Day - Show Previous Result

**Action**: Refresh the page or close and reopen browser on same day

**Expected Outcome**:
- [ ] Game shows feedback screen from original guess (not new question)
- [ ] Same result displayed: correct/incorrect status
- [ ] Same international day shown
- [ ] "Come back tomorrow" message visible
- [ ] Countdown timer updated to current time
- [ ] No option to guess again

**Validation**:
```typescript
// localStorage should still have same state
const state = JSON.parse(localStorage.getItem('daily-game-state'));
console.log(state.date); // Should match today's date
console.log(state.hasGuessed); // Should be true
```

---

### 4. Timezone Consistency Check

**Action**: Open game in multiple browser tabs/windows

**Expected Outcome**:
- [ ] All tabs show identical daily challenge
- [ ] Same international day name in all tabs
- [ ] If one tab makes guess, refreshing shows guess result everywhere

**Validation**:
```bash
# Test determinism
# In browser console:
const date = new Intl.DateTimeFormat('sv-SE').format(new Date());
console.log(date); // e.g., "2025-10-05"

# All users in same timezone should see same challenge for this date
```

---

### 5. Clear Storage - New Visitor Simulation

**Action**: Clear browser localStorage
```javascript
// In browser console:
localStorage.removeItem('daily-game-state');
// Then refresh page
```

**Expected Outcome**:
- [ ] Game shows same daily challenge again (same day)
- [ ] "Real" and "Fake" buttons enabled
- [ ] Can make guess again (treated as new visitor)
- [ ] Streak counter reset to initial state

**Rationale**: Per spec, clearing storage allows re-guessing (no server-side tracking)

---

### 6. Midnight Transition - New Day Test

**Action**:
```javascript
// Simulate next day by manually changing localStorage
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowDate = new Intl.DateTimeFormat('sv-SE').format(tomorrow);

// Clear state to simulate new day
localStorage.removeItem('daily-game-state');

// Manually set system date to tomorrow (or wait for midnight)
```

**Expected Outcome** (when day actually changes):
- [ ] New daily challenge appears
- [ ] Different international day shown (unless deterministic random picks same)
- [ ] Previous day's state discarded
- [ ] Fresh guess opportunity
- [ ] Prompt reads "Today is [New Day Name]"

---

## Integration Test Coverage

### Test 1: Deterministic Challenge Selection
```typescript
// Test same date produces same challenge
test('same date produces same daily challenge for all users', () => {
  const date = '2025-10-05';
  const challenge1 = getDailyChallenge(date);
  const challenge2 = getDailyChallenge(date);

  expect(challenge1.internationalDay.id).toBe(challenge2.internationalDay.id);
});
```

### Test 2: State Persistence
```typescript
// Test state persists across sessions
test('visitor sees previous guess result on return', () => {
  render(<GameContainer />);

  // Make guess
  user.click(screen.getByRole('button', { name: /Real/ }));

  // Unmount and remount (simulate page reload)
  cleanup();
  render(<GameContainer />);

  // Should show feedback, not new question
  expect(screen.getByText(/Come back tomorrow/i)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Real/ })).not.toBeInTheDocument();
});
```

### Test 3: Day Transition
```typescript
// Test new day clears old state
test('new day presents new challenge', () => {
  const today = '2025-10-05';
  const tomorrow = '2025-10-06';

  // Mock date as today
  vi.setSystemTime(new Date('2025-10-05'));
  const { rerender } = render(<GameContainer />);

  // Make guess
  user.click(screen.getByRole('button', { name: /Real/ }));

  // Change date to tomorrow
  vi.setSystemTime(new Date('2025-10-06'));
  rerender(<GameContainer />);

  // Should see new challenge, not previous result
  expect(screen.getByRole('button', { name: /Real/ })).toBeInTheDocument();
  expect(screen.queryByText(/Come back tomorrow/i)).not.toBeInTheDocument();
});
```

---

## Performance Validation

### Timing Checks
- [ ] Daily challenge selection: < 10ms
- [ ] localStorage read/write: < 5ms
- [ ] Timezone date calculation: < 1ms
- [ ] UI response to guess: < 100ms

### Determinism Validation
```javascript
// Run 1000 times to verify determinism
const date = '2025-10-05';
const results = new Set();

for (let i = 0; i < 1000; i++) {
  const challenge = getDailyChallenge(date);
  results.add(challenge.internationalDay.id);
}

console.assert(results.size === 1, 'Same date must always produce same challenge');
```

---

## Edge Cases to Verify

1. **localStorage disabled**:
   - [ ] Game still loads (may lose state on refresh)
   - [ ] No crash or error

2. **Invalid date in localStorage**:
   - [ ] Corrupted state handled gracefully
   - [ ] Fresh state created

3. **Leap day (Feb 29)**:
   - [ ] Works correctly on leap years
   - [ ] Falls back to random fake if no real day for Feb 29

4. **Multiple days for same date** (e.g., March 21):
   - [ ] One randomly selected (deterministically)
   - [ ] Selection consistent across users in same timezone

5. **No real day for current date**:
   - [ ] Random fake day shown
   - [ ] No error or blank screen

---

## Success Criteria

✅ **Complete when**:
- All 6 manual test scenarios pass
- All 3 integration tests pass
- Performance validation shows < 100ms total UI response
- Determinism validation shows 100% consistency
- All 5 edge cases handled gracefully

---

## Rollback Plan

If critical issues found:
1. Revert to instant question flow (Feature 001 behavior)
2. Disable daily challenge selection
3. Remove localStorage persistence
4. Deploy fix as hotfix branch

---

**Feature**: 003-daily-guess-mechanic
**Test Environment**: Local development (localhost:3000)
**Estimated Time**: 15-20 minutes for complete validation
