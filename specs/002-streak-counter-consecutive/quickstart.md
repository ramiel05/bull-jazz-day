# Quickstart: Streak Counter

**Feature**: 002-streak-counter-consecutive
**Date**: 2025-10-01
**Purpose**: Manual validation steps to verify streak counter implementation

## Prerequisites

- All tests passing (unit + integration)
- Dev server running (`pnpm dev`)
- Browser with DevTools open (for console observation)

## Validation Scenarios

### Scenario 1: Basic Streak Increment

**Objective**: Verify streak increments on correct guesses

**Steps**:
1. Load the game at `http://localhost:3000`
2. Observe initial streak display shows "Current: 0, Best: 0"
3. Make a correct guess (click "Real" for a real day, or "Fake" for a fake day - ensure correct answer)
4. Observe streak display updates to "Current: 1, Best: 1"
5. Make another correct guess
6. Observe streak display updates to "Current: 2, Best: 2"

**Expected Results**:
- ✅ Streak counter visible on screen
- ✅ Current streak increments with each correct guess
- ✅ Best streak matches current streak (since no resets yet)
- ✅ No console errors

**Failure Indicators**:
- ❌ Streak does not increment
- ❌ Display shows incorrect values
- ❌ Console errors about state updates

---

### Scenario 2: Streak Reset on Incorrect Guess

**Objective**: Verify streak resets to 0 on incorrect guess, but best is preserved

**Steps**:
1. Continue from Scenario 1 (or achieve streak of at least 3)
2. Current state: "Current: 5, Best: 5" (example)
3. Make an incorrect guess deliberately
4. Observe streak display updates to "Current: 0, Best: 5"
5. Make a correct guess
6. Observe streak display updates to "Current: 1, Best: 5"

**Expected Results**:
- ✅ Current streak resets to 0 after incorrect guess
- ✅ Best streak remains at previous high value
- ✅ Current streak increments from 0 on next correct guess
- ✅ Best streak unchanged until current exceeds it

**Failure Indicators**:
- ❌ Best streak resets to 0
- ❌ Current streak does not reset
- ❌ Negative streak values displayed

---

### Scenario 3: First Milestone Celebration (Streak 3)

**Objective**: Verify milestone 3 triggers animation and color change

**Steps**:
1. Start fresh game (or after reset)
2. Make 2 correct guesses (streak 0→1→2)
3. Current state: "Current: 2, Best: 2", default gray color
4. Make 3rd correct guess (reaching streak 3)
5. **Observe**:
   - Brief (<1 second) scale/pulse animation on streak display
   - Streak counter text color changes to blue (Tailwind `text-blue-500`)
   - Display shows "Current: 3, Best: 3"
6. Make 4th correct guess
7. **Observe**:
   - No animation (4 is not a milestone)
   - Blue color **persists** (does not revert to gray)
   - Display shows "Current: 4, Best: 4"

**Expected Results**:
- ✅ Animation plays exactly once when streak reaches 3
- ✅ Color changes to blue during/after animation
- ✅ Color persists at streak 4 (no revert to gray)
- ✅ No animation at streak 4

**Failure Indicators**:
- ❌ No animation at streak 3
- ❌ Color does not change
- ❌ Color reverts to gray at streak 4
- ❌ Animation plays every guess after milestone

---

### Scenario 4: Multiple Milestone Progression

**Objective**: Verify each milestone has distinct color and triggers animation

**Steps**:
1. Achieve streak of 5
   - **Observe**: Green color (`text-green-500`), animation at streak 5
2. Achieve streak of 10
   - **Observe**: Purple color (`text-purple-500`), animation at streak 10
3. Achieve streak of 15
   - **Observe**: Orange color (`text-orange-500`), animation at streak 15
4. **Between milestones** (e.g., streak 6, 11, 16):
   - **Observe**: Previous milestone color persists, no animations

**Expected Results**:
- ✅ Each milestone (3, 5, 10, 15, 20, 30, 50, 100) has unique color
- ✅ Animation plays exactly once per milestone reached
- ✅ Color persists between milestones
- ✅ Progression: gray → blue → green → purple → orange → red → gold → cyan → magenta

**Milestone Color Reference**:
| Milestone | Color | Tailwind Class |
|-----------|-------|----------------|
| 3 | Blue | `text-blue-500` |
| 5 | Green | `text-green-500` |
| 10 | Purple | `text-purple-500` |
| 15 | Orange | `text-orange-500` |
| 20 | Red | `text-red-500` |
| 30 | Gold | `text-yellow-500` |
| 50 | Cyan | `text-cyan-500` |
| 100 | Magenta | `text-magenta-500` |

**Failure Indicators**:
- ❌ Wrong color at milestone
- ❌ Same color for different milestones
- ❌ Color resets between milestones

---

### Scenario 5: Streak Reset Clears Color

**Objective**: Verify incorrect guess resets color to default (gray)

**Steps**:
1. Achieve streak of 10 (purple color active)
2. Current state: "Current: 10, Best: 10", purple color
3. Make an incorrect guess
4. **Observe**:
   - Streak resets to "Current: 0, Best: 10"
   - Color reverts to default gray
5. Make 2 correct guesses (streak 0→1→2)
6. **Observe**:
   - Gray color persists (no milestone reached yet)
7. Make 3rd correct guess (milestone 3)
8. **Observe**:
   - Animation plays
   - Color changes to blue
   - Display shows "Current: 3, Best: 10"

**Expected Results**:
- ✅ Color resets to gray when streak resets
- ✅ Best streak value preserved
- ✅ Milestone animations work correctly after reset
- ✅ Color progression starts over from blue at milestone 3

**Failure Indicators**:
- ❌ Color persists after reset
- ❌ Color stuck at previous milestone color
- ❌ Best streak resets with current streak

---

### Scenario 6: Session Persistence (Ephemeral Verification)

**Objective**: Verify streak does NOT persist across page refresh

**Steps**:
1. Achieve streak of 20 (red color, "Current: 20, Best: 20")
2. Refresh the page (F5 or Cmd+R)
3. **Observe**:
   - Streak display shows "Current: 0, Best: 0"
   - Default gray color (no milestone color)
4. Close browser tab
5. Reopen `http://localhost:3000` in new tab
6. **Observe**: Same as step 3 (fresh start)

**Expected Results**:
- ✅ All streak state resets to 0 on page refresh
- ✅ No localStorage/sessionStorage persistence
- ✅ Color resets to default gray

**Failure Indicators**:
- ❌ Streak values persist after refresh
- ❌ Color persists after refresh
- ❌ Data found in browser storage (DevTools → Application → Storage)

---

### Scenario 7: Accessibility Validation

**Objective**: Verify screen reader announcements and ARIA attributes

**Steps**:
1. Open browser DevTools → Elements/Inspector
2. Locate streak display component in DOM
3. **Verify**:
   - `role="status"` attribute present
   - `aria-live="polite"` attribute present
4. Enable screen reader (macOS VoiceOver: Cmd+F5, Windows Narrator: Win+Ctrl+Enter)
5. Make a correct guess
6. **Listen**: Screen reader announces "Current: 1, Best: 1"
7. Reach milestone 3
8. **Listen**: Screen reader announces "Current: 3, Best: 3" (no mention of color/animation)

**Expected Results**:
- ✅ ARIA attributes correctly applied
- ✅ Screen reader announces streak updates
- ✅ Text content is readable (not hidden)
- ✅ Color is supplementary (not sole indicator)

**Failure Indicators**:
- ❌ Missing ARIA attributes
- ❌ Screen reader does not announce updates
- ❌ Display aria-hidden or non-semantic structure

---

## Performance Validation

**Objective**: Verify animation performance meets <16ms frame time (60fps)

**Steps**:
1. Open DevTools → Performance tab
2. Start recording
3. Make correct guess to trigger milestone animation (e.g., reach streak 3)
4. Stop recording after animation completes
5. **Analyze**:
   - Check frame rate during animation
   - Look for dropped frames (red bars)
   - Verify animation duration < 1 second

**Expected Results**:
- ✅ Frame rate stays at 60fps during animation
- ✅ No dropped frames
- ✅ Animation completes in <1 second

**Failure Indicators**:
- ❌ Frame rate drops below 30fps
- ❌ Jank or stutter visible
- ❌ Animation duration > 1 second

---

## Test Matrix Summary

| Scenario | Current Increments | Best Preserves | Reset Works | Milestone Animates | Color Changes | Persistence |
|----------|-------------------|----------------|-------------|-------------------|---------------|-------------|
| 1 | ✅ | ✅ | N/A | N/A | N/A | N/A |
| 2 | ✅ | ✅ | ✅ | N/A | N/A | N/A |
| 3 | ✅ | ✅ | N/A | ✅ | ✅ (blue) | N/A |
| 4 | ✅ | ✅ | N/A | ✅ (all) | ✅ (distinct) | N/A |
| 5 | ✅ | ✅ | ✅ | ✅ | ✅ (resets) | N/A |
| 6 | N/A | N/A | N/A | N/A | N/A | ✅ (ephemeral) |
| 7 | ✅ | ✅ | N/A | N/A | N/A | N/A |
| 8 | ✅ | ✅ | ✅ | ✅ | ✅ | N/A |

**All scenarios must pass** for feature to be considered complete.

---

## Acceptance Criteria Checklist

From specification (spec.md):

- [ ] FR-001: Counter tracks consecutive correct guesses, starts at 0 each session
- [ ] FR-002: Current streak increments by 1 for each correct guess
- [ ] FR-003: Current streak resets to 0 on incorrect guess
- [ ] FR-004: Display shows "Current: X" and "Best: Y" at all times
- [ ] FR-005: Milestones recognized at 3, 5, 10, 15, 20, 30, 50, 100
- [ ] FR-006: Milestone celebration is scale/pulse animation < 1 second
- [ ] FR-007: Color changes permanently to milestone color after animation
- [ ] FR-008: Each milestone has distinct color (8 unique colors)
- [ ] FR-009: Streak counts beyond 100 without additional milestones
- [ ] FR-010: Streak never displays negative values
- [ ] FR-011: Both streaks reset to 0 at session start (no persistence)
- [ ] FR-012: Best streak updates when current exceeds it
- [ ] FR-013: Best streak preserved when current resets

---

**Status**: Quickstart validation guide complete, ready for implementation phase
