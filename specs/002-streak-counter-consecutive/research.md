# Research: Daily Streak Counter

**Feature**: 002-streak-counter-consecutive
**Created**: 2025-10-01
**Updated**: 2025-10-07 (aligned with daily challenge mechanics)

## Research Summary

Technical decisions have been updated to support daily streak persistence across browser sessions. Streak now tracks consecutive DAYS with correct guesses (not guesses within a session), requiring localStorage integration and skipped day detection logic.

## Technology Decisions

### 1. State Management & Persistence Approach

**Decision**: Use React hooks (useState) + localStorage persistence with custom hook abstraction (useStreakCounter)

**Rationale**:
- Aligns with existing codebase pattern (game-container.tsx uses useState for GameState)
- Functional pattern per Constitution Principle I
- localStorage provides persistence across browser sessions (required for daily streak)
- Custom hook encapsulates streak logic, localStorage I/O, and skipped day detection
- Same pattern as spec 001's daily-state-storage (consistency across features)

**Persistence Strategy**:
- Load streak state from localStorage on component mount
- Save to localStorage immediately after each streak update
- Separate storage key (`'streak-state'`) from daily game state (`'daily-game-state'`)
- Graceful fallback to initial state if localStorage unavailable or corrupted

**Alternatives Considered**:
- Context API: Rejected - overkill for single-feature state not shared across route boundaries
- useReducer: Rejected - state updates are simple increments/resets, not complex state machines
- External state library: Rejected - adds dependency for localStorage wrapper
- sessionStorage: Rejected - clears on browser close, breaks multi-day streak tracking
- Combining with daily-game-state: Rejected - different lifecycles (streak persists across days, daily state resets each day)

### 2. Animation Implementation

**Decision**: CSS transitions with JavaScript state triggers

**Rationale**:
- Native browser performance (GPU-accelerated)
- <16ms render target easily achievable with CSS transforms
- Simple milestone detection logic in React can trigger CSS class changes
- No animation library needed for scale/pulse effects

**Alternatives Considered**:
- Framer Motion: Rejected - adds 50KB+ bundle size for simple scale/pulse animation
- React Spring: Rejected - physics-based animations unnecessary for <1s milestone flash
- Canvas/WebGL: Rejected - massive overkill for simple UI animations

### 3. Milestone Color Management

**Decision**: Static configuration object mapping milestone values to Tailwind color classes

**Rationale**:
- 8 milestones map to 8 colors (3→blue, 5→green, 10→purple, 15→orange, 20→red, 30→gold, 50→cyan, 100→magenta)
- Tailwind provides consistent color palette already in use
- Pure function `getMilestoneColor(streakCount: number): string | null` for lookup
- Type-safe with discriminated union or explicit mapping

**Alternatives Considered**:
- CSS custom properties: Rejected - less type-safe, harder to test
- Inline styles: Rejected - violates Tailwind-first convention in codebase
- Gradient interpolation: Rejected - spec requires distinct colors per milestone, not gradient

### 4. Testing Strategy

**Decision**: Vitest + @testing-library/react following existing test patterns

**Rationale**:
- Already configured in project (package.json shows vitest setup)
- Co-located test files match existing pattern (e.g., validate-guess.test.ts next to validate-guess.ts)
- @testing-library/react for component testing aligns with user-centric testing philosophy
- Integration tests in dedicated tests/integration/ folder per Constitution V

**Test Coverage Plan**:
- Unit: streak calculation logic, milestone detection, color mapping
- Component: streak display rendering, animation triggers, accessibility
- Integration: full game flow with streak updates across guess cycles

**Alternatives Considered**:
- Jest: Rejected - project already uses Vitest
- Cypress: Rejected - no E2E requirement, integration tests in Vitest sufficient
- Separate test folder structure: Rejected - violates Constitution V (co-location)

### 5. Skipped Day Detection

**Decision**: Calculate calendar day difference using Date objects and compare with lastGuessDate

**Rationale**:
- Timezone-aware: Uses same date calculation as spec 001 (Intl.DateTimeFormat with 'sv-SE')
- Accurate: Handles month boundaries, leap years automatically
- Simple logic: If `Math.abs(currentDate - lastGuessDate) > 1 day`, streak breaks
- No dependencies: Pure JavaScript Date arithmetic

**Implementation**:
```typescript
function calculateDaysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
```

**Edge Cases Handled**:
- Midnight boundary: Uses calendar dates, not timestamps (consistent with daily challenge)
- Timezone changes: Both dates in same format (YYYY-MM-DD in local timezone)
- Month/year boundaries: Date object handles automatically
- Leap years: Date object handles automatically

**Alternatives Considered**:
- String comparison: Rejected - doesn't handle month/year boundaries correctly
- Timestamp arithmetic: Rejected - DST transitions can cause off-by-one errors
- date-fns library: Rejected - adds dependency for simple date math
- Manual day counting: Rejected - error-prone with month boundaries

### 6. Integration with Existing Game State

**Decision**: Extend GameState type with streak field, load from localStorage on mount, save on each guess

**Rationale**:
- Minimal modification to existing code (game-container.tsx owns state)
- Streak updates triggered by validateGuess result (correct/incorrect)
- Must check date before updating streak (prevent double-count, detect skipped days)
- handleGuess is natural integration point for streak logic
- localStorage load/save pattern matches spec 001's daily-state-storage

**Integration Points**:
1. On mount: Load streak from localStorage
2. On mount: Check if skipped days → reset streak if true
3. On guess: Check if new day → increment if correct, reset if incorrect
4. On guess: Save updated streak to localStorage

**Alternatives Considered**:
- Separate context: Rejected - creates two sources of truth for game state
- Lift state to page.tsx: Rejected - GameContainer is appropriate boundary
- Combine with daily-game-state storage: Rejected - different lifecycles
- URL state (search params): Rejected - ephemeral session-only requirement

### 6. Accessibility Considerations

**Decision**: ARIA live regions for streak updates, screen reader announcements for milestones

**Rationale**:
- Streak counter is informational, not interactive (no focus management needed)
- aria-live="polite" for streak updates (non-disruptive)
- aria-live="assertive" for milestone celebrations (important moment)
- Proper semantic HTML (using `<div role="status">` for counter display)

**Implementation Notes**:
- Milestone animations purely visual (not essential for understanding)
- Text content "Current: X, Best: Y" always readable by screen readers
- Color changes supplemented by animation (not color-only indication)

## Open Questions

None - all ambiguities resolved in /clarify phase

## Dependencies

### Required
- React 19.1.0 (already present)
- tiny-invariant 1.3.3 (already present - use for state validation)

### Development
- Vitest 3.2.4 (already present)
- @testing-library/react 16.3.0 (already present)
- @testing-library/user-event 14.6.1 (already present)

### None Required
- No new runtime dependencies
- No new dev dependencies

## Performance Considerations

**Animation Budget**: <1 second milestone flash, <16ms (60fps) frame time
- CSS transforms are GPU-accelerated (meets requirement)
- State updates synchronous (instant streak increment)
- Re-renders isolated to StreakDisplay component (React.memo if needed)

**Memory Footprint**: Negligible
- StreakState: ~16 bytes (2 numbers + 1 optional string)
- Milestone config: static object, ~200 bytes
- No memory leaks (no event listeners, no timers persisting beyond animation)

## Security Considerations

None applicable - client-side only UI feature with no:
- User input validation concerns (streak is derived, not input)
- Data persistence (ephemeral session-only)
- External API calls
- Authentication/authorization

## Browser Compatibility

**Target**: Modern ES2020+ browsers (per Technical Context)
- CSS transitions: Supported all modern browsers
- React 19: Requires modern browser (no IE11)
- No polyfills required

---

**Status**: Research complete, ready for Phase 1 (Design & Contracts)
