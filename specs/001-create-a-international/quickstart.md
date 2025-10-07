# Quickstart Guide: International Day Guessing Game (Daily Challenge)

**Feature**: 001-create-a-international
**Created**: 2025-09-30
**Updated**: 2025-10-07 (merged with 003-daily-guess-mechanic)
**Purpose**: Manual testing and validation of daily challenge game functionality

## Prerequisites

- Node.js 20+ installed
- pnpm installed (`npm install -g pnpm`)
- Repository cloned and dependencies installed
- Browser with localStorage enabled

## Setup

```bash
# From repository root
pnpm install

# Start development server
pnpm dev
```

**Expected**: Dev server starts on http://localhost:3000

## Core Daily Challenge Scenarios

### Scenario 1: First Visit - New Daily Challenge

**Steps**:
1. Open http://localhost:3000 in browser (first time today)
2. Observe the page

**Expected Results**:
- ✅ Page displays: "Today is [International Day Name]"
- ✅ Day name corresponds to current calendar date in your timezone
- ✅ Two buttons visible: "Real" and "Fake"
- ✅ No previous guess result shown
- ✅ Page loads in <2 seconds

**Validation Criteria**:
- [ ] Day name is clearly readable (good typography)
- [ ] Buttons are properly styled and accessible
- [ ] No console errors in browser DevTools
- [ ] Layout is responsive on mobile viewport
- [ ] Prompt reads "Today is [Day]" not just "[Day]"

**localStorage Check**:
```javascript
// In browser console:
const state = localStorage.getItem('daily-game-state');
console.log(state); // Should be null or have different date
```

---

### Scenario 2: Make a Guess

**Steps**:
1. From fresh daily challenge (Scenario 1)
2. Click either "Real" or "Fake" button

**Expected Results**:
- ✅ Feedback panel appears immediately (<100ms)
- ✅ Shows "Correct!" or "Incorrect!" message
- ✅ Reveals the truth (real or fake status)
- ✅ Shows calendar date for real days (e.g., "03-08")
- ✅ Shows description providing context
- ✅ Shows clickable source link for real days (opens in new tab)
- ✅ Displays "Come back tomorrow for a new daily challenge" message
- ✅ Countdown timer visible in HH:MM:SS format (e.g., "23:45:12")
- ✅ Countdown updates every second

**Validation Criteria**:
- [ ] Feedback is immediate (no loading delay)
- [ ] All information fields populated correctly
- [ ] Source link is valid for real days, null for fake days
- [ ] Countdown timer counts down correctly
- [ ] No date/source shown for fake days
- [ ] No option to guess again (buttons disabled/hidden)

**localStorage Check**:
```javascript
// In browser console:
const state = JSON.parse(localStorage.getItem('daily-game-state'));
console.log(state);
// Should show:
// {
//   date: "2025-10-07", // today's date
//   guessedCorrectly: true/false,
//   timestamp: 1728345600000
// }
```

---

### Scenario 3: Return Same Day - Show Previous Result

**Steps**:
1. After completing Scenario 2 (made a guess)
2. Refresh the page (F5 or Cmd+R)
3. Or close browser and reopen on same day

**Expected Results**:
- ✅ Game shows feedback screen from original guess (not new question)
- ✅ Same result displayed: correct/incorrect status
- ✅ Same international day shown
- ✅ "Come back tomorrow" message visible
- ✅ Countdown timer updated to current time
- ✅ No Real/Fake buttons (no option to guess again)

**Validation Criteria**:
- [ ] State persists correctly across refresh
- [ ] Can't make another guess for same day
- [ ] All information from original guess intact
- [ ] Countdown timer reflects current time remaining

**localStorage Check**:
```javascript
// Should still have same state as Scenario 2
const state = JSON.parse(localStorage.getItem('daily-game-state'));
console.log(state.date); // Should match today's date
console.log(state.guessedCorrectly); // Should be true or false (not null)
```

---

### Scenario 4: Timezone Consistency Check

**Steps**:
1. Open game in first browser tab
2. Note the international day shown
3. Open game in second browser tab (same device)

**Expected Results**:
- ✅ Both tabs show identical daily challenge
- ✅ Same international day name in both tabs
- ✅ If one tab makes guess, refreshing other tab shows that guess result

**Validation Criteria**:
- [ ] Deterministic selection verified (same day across tabs)
- [ ] localStorage state shared between tabs
- [ ] No race conditions or inconsistencies

**Determinism Test**:
```javascript
// In browser console:
const date = new Intl.DateTimeFormat('sv-SE').format(new Date());
console.log(date); // e.g., "2025-10-07"
// All users in same timezone should see same challenge for this date
```

---

### Scenario 5: Clear Storage - New Visitor Simulation

**Steps**:
1. After making a guess (Scenario 2)
2. Open browser console
3. Run: `localStorage.removeItem('daily-game-state');`
4. Refresh page

**Expected Results**:
- ✅ Game shows same daily challenge again (same day, same question)
- ✅ "Real" and "Fake" buttons enabled
- ✅ Can make guess again (treated as new visitor)
- ✅ Streak counter reset (if implemented)

**Validation Criteria**:
- [ ] Clearing storage allows re-guessing
- [ ] Same deterministic day shown (not random)
- [ ] No errors or broken state

**Rationale**: Per spec, clearing storage treats user as new visitor (no server-side tracking)

---

### Scenario 6: Day Transition Test

**Action** (Manual or Simulated):
```javascript
// Simulate next day by changing system date (if possible)
// OR wait until actual midnight in your timezone
// OR manually test tomorrow
```

**Expected Results** (when day actually changes):
- ✅ New daily challenge appears
- ✅ Different international day shown (deterministic, but different seed)
- ✅ Previous day's state discarded
- ✅ Fresh guess opportunity
- ✅ Prompt reads "Today is [New Day Name]"

**Validation Criteria**:
- [ ] Date change detected correctly
- [ ] Old localStorage state replaced with new state
- [ ] New challenge is deterministic for new date

---

## Additional Manual Testing Scenarios

### Scenario 7: Responsive Design

**Steps**:
1. Load game on desktop browser (1920x1080)
2. Resize to tablet (768x1024)
3. Resize to mobile (375x667)

**Expected Results**:
- ✅ Layout adapts to all viewport sizes
- ✅ Buttons remain tappable (min 44x44px touch target)
- ✅ Text remains readable
- ✅ No horizontal scroll at any size
- ✅ Countdown timer remains visible and readable

**Validation Criteria**:
- [ ] Mobile-first design (Tailwind default)
- [ ] Breakpoints work correctly
- [ ] Touch-friendly on mobile
- [ ] Countdown timer doesn't break layout

---

### Scenario 8: Accessibility

**Steps**:
1. Load game
2. Tab through interface with keyboard only
3. Use screen reader (VoiceOver on Mac, NVDA on Windows)

**Expected Results**:
- ✅ All interactive elements focusable
- ✅ Focus indicators visible
- ✅ Screen reader announces day name
- ✅ Buttons have clear labels
- ✅ Feedback is announced to screen reader
- ✅ Countdown timer updates announced appropriately

**Validation Criteria**:
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Focus order is logical
- [ ] ARIA labels present where needed
- [ ] Color contrast meets WCAG AA standards

---

### Scenario 9: Edge Case - localStorage Disabled

**Setup**: Disable localStorage in browser settings

**Steps**:
1. Open game with localStorage disabled
2. Make a guess
3. Refresh page

**Expected Results**:
- ✅ Game still loads (no crash)
- ✅ Can make guess
- ✅ After refresh, state may be lost (acceptable degradation)
- ✅ No JavaScript errors in console

**Validation Criteria**:
- [ ] Graceful degradation when localStorage unavailable
- [ ] Error handling catches localStorage failures

---

### Scenario 10: Edge Case - Rapid Clicking

**Steps**:
1. Load fresh daily challenge
2. Click "Real" or "Fake" multiple times rapidly

**Expected**:
- Only first click registers
- No duplicate feedback panels
- Buttons disabled after first click
- No race conditions or double submissions

---

## Integration Test Scenarios

### Test 1: Complete Daily Flow

**Automated Test Coverage**:
```typescript
test('visitor completes full daily challenge flow', () => {
  // 1. First visit shows challenge
  // 2. Make guess
  // 3. See feedback with countdown
  // 4. Refresh shows same result
  // 5. Can't guess again
});
```

### Test 2: Deterministic Challenge Selection

**Automated Test Coverage**:
```typescript
test('same date produces same challenge for all users', () => {
  const date = '2025-10-07';
  const challenge1 = getDailyChallenge(date);
  const challenge2 = getDailyChallenge(date);
  expect(challenge1.internationalDay.id).toBe(challenge2.internationalDay.id);
});
```

### Test 3: State Persistence

**Automated Test Coverage**:
```typescript
test('visitor sees previous guess result on return', () => {
  // Make guess
  // Unmount component (simulate page close)
  // Remount component (simulate page reopen)
  // Verify feedback screen shown, not new question
});
```

### Test 4: Day Transition

**Automated Test Coverage**:
```typescript
test('new day presents new challenge', () => {
  // Mock system time as today
  // Make guess
  // Mock system time as tomorrow
  // Remount component
  // Verify new challenge shown
});
```

---

## Performance Benchmarks

### Load Performance

**Measurement**: Chrome DevTools Lighthouse

**Targets**:
- Performance score: >90
- First Contentful Paint: <1.5s
- Time to Interactive: <2.5s
- Total Blocking Time: <200ms

**How to Test**:
```bash
# Production build
pnpm build
pnpm start

# Run Lighthouse on http://localhost:3000
```

### Runtime Performance

**Measurement**: Chrome DevTools Performance tab

**Targets**:
- Daily challenge selection: <10ms
- Guess validation: <10ms
- localStorage read/write: <5ms
- Timezone date calculation: <1ms
- State transition: <16ms (60fps)
- Countdown timer updates: Smooth (every second)

---

## Checklist for Acceptance

### Functional Requirements Coverage

- [ ] FR-001: Visitor timezone determined ✓
- [ ] FR-002: Current calendar date determined ✓
- [ ] FR-003: One challenge per calendar date ✓
- [ ] FR-004: All visitors in timezone see same challenge ✓
- [ ] FR-005: "Today is [Day]" format displayed ✓
- [ ] FR-006: Random choice between real day OR fake day ✓
- [ ] FR-007: Fallback to fake day when no real day ✓
- [ ] FR-008: Real/Fake options provided ✓
- [ ] FR-009: Guess accepted, immediate feedback ✓
- [ ] FR-010: Truth revealed with context ✓
- [ ] FR-011: Countdown timer shown ✓
- [ ] FR-012: Guess result persisted on device ✓
- [ ] FR-013: Previous feedback shown on return ✓
- [ ] FR-014: No second guess allowed ✓
- [ ] FR-015: New challenge on new date ✓
- [ ] FR-016: At least 100 real + 100 fake days ✓
- [ ] FR-017: No variable/relative dates ✓

### Constitutional Compliance

- [ ] Functional patterns: Pure functions, immutability ✓
- [ ] TDD: All tests passing before implementation ✓
- [ ] Naming: Clear, descriptive names ✓
- [ ] Idiomatic: Next.js/React patterns ✓
- [ ] Co-location: Feature directory structure ✓
- [ ] Explicit failure: Invariants used ✓
- [ ] Explicit null types: | null for intentional absence ✓
- [ ] Integration test fidelity: Real user interactions ✓

### User Experience

- [ ] Interface intuitive (no instructions needed)
- [ ] Feedback is encouraging (not punitive)
- [ ] Educational value (users learn about real days)
- [ ] Fun and engaging (playful fake days)
- [ ] Accessible to all users (keyboard, screen reader)
- [ ] Countdown creates anticipation for next challenge
- [ ] Timezone-consistent experience enables social sharing

---

## Troubleshooting

### Issue: Dev server won't start

**Check**:
- Node version: `node --version` (should be 20+)
- Dependencies installed: `pnpm install`
- Port 3000 available: `lsof -i :3000`

### Issue: No days appearing

**Check**:
- Days pool is populated in `src/features/day-guessing-game/data/days-pool.ts`
- Pool has at least 100 real days with MM-DD dates
- Pool has at least 100 fake days with null dates

### Issue: Same day repeating across dates

**Check**:
- Deterministic random implementation correct
- Date string format is YYYY-MM-DD
- Timezone detection working properly

### Issue: localStorage not persisting

**Check**:
- Browser allows localStorage
- No private/incognito mode
- localStorage quota not exceeded
- Error handling catching failures

### Issue: Countdown timer not updating

**Check**:
- setInterval running correctly
- Component not unmounted
- Timezone calculations correct
- Timer cleanup on component unmount

---

## Success Criteria

**Game is ready for launch when**:
1. All 10 core scenarios pass ✓
2. All edge cases handled ✓
3. Performance benchmarks met ✓
4. Accessibility checklist complete ✓
5. All automated tests passing ✓
6. At least 100 real + 100 fake days in pool ✓
7. Determinism verified across multiple dates ✓
8. localStorage persistence working ✓

**Next Step After Quickstart**: Run `/tasks` command to generate implementation task list.

---

**Quickstart Guide Version**: 2.0 (merged from 001 + 003)
**Last Updated**: 2025-10-07
