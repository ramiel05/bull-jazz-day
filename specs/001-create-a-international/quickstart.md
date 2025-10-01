# Quickstart Guide: International Day Guessing Game

**Feature**: 001-create-a-international
**Purpose**: Manual testing and validation of game functionality

## Prerequisites

- Node.js 20+ installed
- pnpm installed (`npm install -g pnpm`)
- Repository cloned and dependencies installed

## Setup

```bash
# From repository root
pnpm install

# Start development server
pnpm dev
```

**Expected**: Dev server starts on http://localhost:3000

## Manual Testing Scenarios

### Scenario 1: Initial Load

**Steps**:
1. Open http://localhost:3000 in browser
2. Observe the page

**Expected Results**:
- ✅ Game interface is visible
- ✅ One international day name is displayed
- ✅ Two buttons visible: "Real" and "Fake"
- ✅ No feedback panel visible yet (initial state)
- ✅ Page loads in <2 seconds

**Validation Criteria**:
- [ ] Day name is clearly readable (good typography)
- [ ] Buttons are properly styled and accessible
- [ ] No console errors in browser DevTools
- [ ] Layout is responsive on mobile viewport

---

### Scenario 2: Correct Guess (Real Day)

**Steps**:
1. Load the game (fresh page)
2. If shown a real day (e.g., "International Women's Day"), click "Real"
3. If shown a fake day, refresh until a real day appears (or wait for random selection)

**Expected Results**:
- ✅ Feedback panel appears immediately (<100ms)
- ✅ Shows "Correct!" message
- ✅ Shows the calendar date (e.g., "March 8")
- ✅ Shows brief description
- ✅ Shows clickable source link (opens in new tab)
- ✅ "Next Day" or "Continue" button appears

**Validation Criteria**:
- [ ] Feedback is immediate (no loading delay)
- [ ] All information fields populated
- [ ] Source link is valid and opens correct page
- [ ] Buttons transition smoothly (Real/Fake → Continue)

---

### Scenario 3: Incorrect Guess (Real Day Guessed Fake)

**Steps**:
1. Wait for a real day to appear (e.g., "National Donut Day")
2. Click "Fake" (intentionally wrong)

**Expected Results**:
- ✅ Feedback panel shows "Incorrect!"
- ✅ Reveals it's actually real
- ✅ Shows date, description, source link
- ✅ Continue button available

**Validation Criteria**:
- [ ] Clear indication of wrong guess (visual feedback)
- [ ] Educational value: user learns the day is real
- [ ] No shame/negative tone (encouraging)

---

### Scenario 4: Correct Guess (Fake Day)

**Steps**:
1. Wait for a fake day (e.g., "International Sock Puppet Appreciation Day")
2. Click "Fake"

**Expected Results**:
- ✅ Shows "Correct!" message
- ✅ Confirms it's made up
- ✅ Shows description explaining it's fake
- ✅ No date or source link displayed (null values)
- ✅ Continue button available

**Validation Criteria**:
- [ ] Null fields handled gracefully (no "null" or "undefined" text)
- [ ] Description has playful tone for fake days
- [ ] Layout doesn't break with missing fields

---

### Scenario 5: Incorrect Guess (Fake Day Guessed Real)

**Steps**:
1. Wait for a fake day
2. Click "Real" (intentionally wrong)

**Expected Results**:
- ✅ Shows "Incorrect!" feedback
- ✅ Reveals it's fabricated
- ✅ No date/source shown
- ✅ Description explains it's made up

**Validation Criteria**:
- [ ] Clear but friendly incorrect feedback
- [ ] User understands why it's fake

---

### Scenario 6: Continue to Next Day

**Steps**:
1. Complete any guess (Scenario 2-5)
2. Click "Continue" or "Next Day" button

**Expected Results**:
- ✅ Feedback panel disappears
- ✅ New random day appears
- ✅ Real/Fake buttons reset to initial state
- ✅ New day is different from previous (in most cases)

**Validation Criteria**:
- [ ] State resets cleanly
- [ ] No flicker or layout shift
- [ ] Random selection appears to work (different day shown)

---

### Scenario 7: Multiple Rounds

**Steps**:
1. Play 10 consecutive rounds
2. Note which days appear

**Expected Results**:
- ✅ Each round works consistently
- ✅ Mix of real and fake days appears
- ✅ Days can repeat after all seen (infinite play)
- ✅ No errors after many rounds

**Validation Criteria**:
- [ ] Randomization seems fair (not same day 10 times)
- [ ] Performance doesn't degrade
- [ ] No memory leaks (check DevTools Performance tab)

---

### Scenario 8: Page Refresh

**Steps**:
1. Start game, note current day
2. Make a guess (don't continue yet)
3. Refresh browser (F5 or Cmd+R)

**Expected Results**:
- ✅ Game resets completely
- ✅ New random day shown (likely different)
- ✅ No memory of previous guess
- ✅ Back to initial "guessing" state

**Validation Criteria**:
- [ ] FR-011 validated: no persistence across refresh
- [ ] State fully cleared

---

### Scenario 9: Responsive Design

**Steps**:
1. Load game on desktop browser (1920x1080)
2. Resize to tablet (768x1024)
3. Resize to mobile (375x667)

**Expected Results**:
- ✅ Layout adapts to all viewport sizes
- ✅ Buttons remain tappable (min 44x44px touch target)
- ✅ Text remains readable
- ✅ No horizontal scroll at any size

**Validation Criteria**:
- [ ] Mobile-first design (Tailwind default)
- [ ] Breakpoints work correctly
- [ ] Touch-friendly on mobile

---

### Scenario 10: Accessibility

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

**Validation Criteria**:
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Focus order is logical
- [ ] ARIA labels present where needed
- [ ] Color contrast meets WCAG AA standards

---

## Edge Cases Testing

### Edge Case 1: Pool Exhaustion (if pool ≤ 10 days)

**Steps**:
1. Play through more rounds than pool size (e.g., 15 rounds for 10-day pool)
2. Track which days appear

**Expected**:
- Days start repeating after all seen
- No errors or "no more days" state

### Edge Case 2: Empty Pool (Developer Error)

**Setup**: Temporarily empty the days pool array in code

**Expected**:
- Graceful error handling (or build-time validation prevents this)

### Edge Case 3: Rapid Clicking

**Steps**:
1. Click "Real" or "Fake" multiple times rapidly

**Expected**:
- Only first click registers
- No duplicate feedback panels
- Buttons disabled after first click

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
- Guess validation: <10ms
- Random selection: <5ms
- State transition: <16ms (60fps)
- Memory stable (no leaks over 50 rounds)

---

## Checklist for Acceptance

### Functional Requirements Coverage

- [ ] FR-001: One day displayed at a time ✓
- [ ] FR-002: Real/Fake options provided ✓
- [ ] FR-003: Guess accepted ✓
- [ ] FR-004: Immediate feedback shown ✓
- [ ] FR-005: Truth revealed with context (date, description, link) ✓
- [ ] FR-006: Continue button works ✓
- [ ] FR-007: Real days pool (5-10) present ✓
- [ ] FR-008: Fake days pool (5-10) present ✓
- [ ] FR-009: Random selection working ✓
- [ ] FR-010: Day name clear and recognizable ✓
- [ ] FR-011: No persistence across refresh ✓

### Constitutional Compliance

- [ ] Functional patterns: Pure functions used ✓
- [ ] TDD: All tests passing before implementation ✓
- [ ] Naming: Clear, descriptive names throughout ✓
- [ ] Idiomatic: Next.js/React patterns followed ✓
- [ ] Co-location: Feature directory structure ✓

### User Experience

- [ ] Interface intuitive (no instructions needed)
- [ ] Feedback is encouraging (not punitive)
- [ ] Educational value (users learn about real days)
- [ ] Fun and engaging (playful fake days)
- [ ] Accessible to all users (keyboard, screen reader)

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
- Pool exports correctly imported

### Issue: Console errors

**Check**:
- Browser console (F12) for error messages
- Next.js terminal output for build errors
- TypeScript compiler errors: `pnpm tsc --noEmit`

### Issue: Tests failing

**Check**:
- All dependencies installed including devDependencies
- Test files in correct directories
- Imports use correct paths (check `~/` alias)

---

## Success Criteria

**Game is ready for launch when**:
1. All 10 manual scenarios pass ✓
2. All edge cases handled ✓
3. Performance benchmarks met ✓
4. Accessibility checklist complete ✓
5. All automated tests passing ✓

**Next Step After Quickstart**: Run `/tasks` command to generate implementation task list.

---

**Quickstart Guide Version**: 1.0
**Last Updated**: 2025-09-30