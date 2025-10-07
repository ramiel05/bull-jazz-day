# Quickstart: Share Results Feature

**Feature**: 003-share-result
**Purpose**: Verify implementation meets all functional requirements through user scenarios

## Prerequisites

- Development server running (`pnpm dev`)
- Browser with clipboard API support (Chrome 66+, Firefox 63+, Safari 13.1+)
- HTTPS or localhost context

## Scenario 1: Share Correct Guess (No Streak)

**Setup**: First-time player, no previous streak

**Steps**:
1. Navigate to game page
2. View UN International Day presented
3. Make a CORRECT guess (click matching Real/Fake button)
4. Wait for feedback panel to appear
5. Locate "Share" button in feedback display
6. Click "Share" button
7. Observe button text changes to "Copied!"
8. Open text editor and paste (Cmd+V / Ctrl+V)

**Expected Result**:
```
🎉 Correct!

[Day Name] is real!
My guess: Real

🔗 https://bull-jazz-day.vercel.app
```

**Validation**:
- ✅ Message copied to clipboard
- ✅ Button shows "Copied!" feedback
- ✅ No streak information included (currentStreak = 0)
- ✅ Message contains day name, type, guess, and URL
- ✅ Correct emoji (🎉) displayed

**FR Coverage**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-009, FR-011, FR-013

---

## Scenario 2: Share Correct Guess with Streak (No Milestone)

**Setup**: Player with existing streak of 2 days

**Steps**:
1. Continue from previous scenario OR set up streak manually
2. Make another CORRECT guess
3. Wait for feedback panel (currentStreak = 3)
4. Click "Share" button
5. Paste clipboard content

**Expected Result**:
```
🎉 Correct!

[Day Name] is real!
My guess: Real

Current streak: 3
🎖️ Milestone reached: 3-day streak!

🔗 https://bull-jazz-day.vercel.app
```

**Validation**:
- ✅ Streak information included (currentStreak > 0)
- ✅ Milestone text included (3 is a milestone)
- ✅ Milestone emoji (🎖️) present

**FR Coverage**: FR-006, FR-007, FR-010, FR-014

---

## Scenario 3: Share Incorrect Guess (Streak Reset)

**Setup**: Player with existing streak about to break it

**Steps**:
1. Have a current streak of 5
2. Make an INCORRECT guess
3. Wait for feedback panel (streak resets to 0)
4. Click "Share" button
5. Paste clipboard content

**Expected Result**:
```
❌ Incorrect!

[Day Name] is fake!
My guess: Real

🔗 https://bull-jazz-day.vercel.app
```

**Validation**:
- ✅ Incorrect emoji (❌) displayed
- ✅ No streak information (currentStreak = 0 after incorrect guess)
- ✅ Shows correct day type vs player's wrong guess
- ✅ Message still contains all required fields except streak

**FR Coverage**: FR-006 (omit when 0), FR-009 (incorrect emoji)

---

## Scenario 4: Share with New Best Streak

**Setup**: Player achieves new personal best

**Steps**:
1. Set up player with bestStreak = 7, currentStreak = 6
2. Make a CORRECT guess (currentStreak becomes 7, equals best)
3. Make another CORRECT guess (currentStreak becomes 8, exceeds best)
4. Click "Share" button
5. Paste clipboard content

**Expected Result**:
```
🎉 Correct!

[Day Name] is real!
My guess: Real

Current streak: 8
🔥 New personal best: 8-day streak!

🔗 https://bull-jazz-day.vercel.app
```

**Validation**:
- ✅ New best streak text included
- ✅ Fire emoji (🔥) present
- ✅ Both streak and new best lines displayed

**FR Coverage**: FR-008

---

## Scenario 5: Share with Milestone AND New Best

**Setup**: Player reaches milestone that is also new best

**Steps**:
1. Set up player with bestStreak = 9, currentStreak = 9
2. Make a CORRECT guess (currentStreak becomes 10, milestone + new best)
3. Click "Share" button
4. Paste clipboard content

**Expected Result**:
```
🎉 Correct!

[Day Name] is real!
My guess: Real

Current streak: 10
🎖️ Milestone reached: 10-day streak!
🔥 New personal best: 10-day streak!

🔗 https://bull-jazz-day.vercel.app
```

**Validation**:
- ✅ Both milestone and new best text included
- ✅ Both emojis present
- ✅ Lines appear in correct order (milestone then best)

**FR Coverage**: FR-007, FR-008, FR-010

---

## Scenario 6: Copy Failure Handling

**Setup**: Browser environment with clipboard blocked

**Steps**:
1. Open browser DevTools
2. In console, run: `Object.assign(navigator, { clipboard: undefined })`
3. Make any guess and reach feedback panel
4. Click "Share" button
5. Observe button text

**Expected Result**:
- Button text changes to "Copy failed"
- After 5 seconds, button text reverts to "Share"
- Button remains clickable (can retry)

**Validation**:
- ✅ "Copy failed" text displayed
- ✅ 5-second timeout before revert
- ✅ Button still functional after failure

**FR Coverage**: FR-016

---

## Scenario 7: Multiple Shares

**Setup**: Test unlimited sharing

**Steps**:
1. Make a guess and reach feedback panel
2. Click "Share" button
3. Wait for "Copied!" to appear
4. Immediately click "Share" button again
5. Wait 5 seconds for revert to "Share"
6. Click "Share" button third time

**Expected Result**:
- All three share attempts succeed
- Each shows "Copied!" feedback
- No rate limiting or blocking

**Validation**:
- ✅ Multiple shares allowed
- ✅ No rate limiting (FR-015)
- ✅ Button state resets properly between shares

**FR Coverage**: FR-015

---

## Scenario 8: Cross-Platform Message Format

**Setup**: Verify message renders correctly across platforms

**Steps**:
1. Share a result and copy message
2. Paste into multiple destinations:
   - Plain text editor (TextEdit, Notepad)
   - Mobile messaging app (iMessage, WhatsApp)
   - Twitter/X compose window
   - Discord message input

**Expected Result**:
- Line breaks preserved in all platforms
- Emojis render correctly
- Link is clickable (where supported)
- Message is readable without special formatting

**Validation**:
- ✅ Plain text with line breaks (FR-017)
- ✅ Works across different platforms
- ✅ No Markdown or HTML needed

**FR Coverage**: FR-017

---

## Scenario 9: Accessibility Validation

**Setup**: Keyboard and screen reader testing

**Steps**:
1. Navigate to feedback panel using Tab key
2. Locate Share button via keyboard
3. Press Enter or Space to activate
4. Verify screen reader announces state changes
5. Test with VoiceOver (Mac), NVDA (Windows), or similar

**Expected Result**:
- Button is keyboard accessible
- Tab stops at Share button
- Enter/Space triggers share
- ARIA live region announces "Result copied" or "Failed to copy"
- Button label changes are announced

**Validation**:
- ✅ Full keyboard support
- ✅ Screen reader announcements
- ✅ Proper ARIA attributes

**FR Coverage**: Implicit accessibility requirements

---

## Automated Validation

**Run all tests**:
```bash
pnpm test:run
```

**Expected Coverage**:
- All unit tests passing (format-share-message, copy-to-clipboard, share-button)
- Integration test passing (share-flow.test.tsx)
- No regressions in existing tests

**Coverage Targets**:
- Unit tests: 100% coverage on new utilities
- Integration test: Full user workflow covered

---

## Success Criteria Checklist

### Functional Requirements
- [ ] FR-001: Share button displays in feedback panel (both correct/incorrect)
- [ ] FR-002: Clicking button copies message to clipboard
- [ ] FR-003: Message includes day name
- [ ] FR-004: Message indicates real/fake status
- [ ] FR-005: Message includes player's guess
- [ ] FR-006: Streak included when > 0, omitted when = 0
- [ ] FR-007: Milestone info included when achieved
- [ ] FR-008: New best info included when achieved
- [ ] FR-009: Correct/incorrect emoji included
- [ ] FR-010: Milestone emoji included
- [ ] FR-011: Production URL included
- [ ] FR-012: Uses clipboard API (not share API)
- [ ] FR-013: URL is https://bull-jazz-day.vercel.app
- [ ] FR-014: Recognizes milestones 3, 5, 10, 15, 20, 30, 50, 100
- [ ] FR-015: Unlimited shares allowed
- [ ] FR-016: "Copy failed" shows for 5s on failure
- [ ] FR-017: Plain text with line breaks for cross-platform compatibility

### User Scenarios (from spec)
- [ ] Scenario 1: Correct guess copies formatted message
- [ ] Scenario 2: Incorrect guess copies formatted message
- [ ] Scenario 7: Streak = 0 omits streak info
- [ ] Scenario 3: Milestone includes achievement text
- [ ] Scenario 4: New best includes achievement text
- [ ] Scenario 5: Copy success shows "Copied!"
- [ ] Scenario 6: Copy failure shows "Copy failed"

### Edge Cases
- [ ] First play (streak = 0) - no streak info
- [ ] Clipboard unavailable - graceful failure
- [ ] Multiple rapid clicks - no errors
- [ ] Component unmount during timeout - no memory leak

---

## Troubleshooting

**Clipboard not working**:
- Ensure HTTPS or localhost
- Check browser console for security errors
- Verify clipboard API support (caniuse.com)

**"Copy failed" always showing**:
- Check browser permissions
- Verify clipboard API available: `console.log(!!navigator.clipboard)`

**Message format incorrect**:
- Verify data passed to ShareButton component
- Check formatShareMessage unit tests
- Inspect generated message in debugger

**Button state stuck**:
- Check for timeout cleanup in useEffect
- Verify no errors in async handler
- Inspect component state in React DevTools

---

*Follow scenarios in order for comprehensive validation. All scenarios must pass before marking feature complete.*
