# Research: Streak Counter

**Feature**: 002-streak-counter-consecutive
**Date**: 2025-10-01

## Research Summary

All technical decisions for this feature are clear from the specification and existing codebase context. No additional research required.

## Technology Decisions

### 1. State Management Approach

**Decision**: Use React hooks (useState) with custom hook abstraction (useStreakCounter)

**Rationale**:
- Aligns with existing codebase pattern (game-container.tsx uses useState for GameState)
- Functional pattern per Constitution Principle I
- No need for external state management (Redux, Zustand) for session-only ephemeral state
- Custom hook encapsulates streak logic and provides clean interface to components

**Alternatives Considered**:
- Context API: Rejected - overkill for single-feature state not shared across route boundaries
- useReducer: Rejected - state updates are simple increments/resets, not complex state machines
- External state library: Rejected - adds dependency for simple session-only state

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

### 5. Integration with Existing Game State

**Decision**: Extend GameState type with optional streak field, initialize in GameContainer

**Rationale**:
- Minimal modification to existing code (game-container.tsx owns state)
- Streak updates triggered by validateGuess result (correct/incorrect)
- handleGuess and handleContinue already touch state, natural integration points
- Backward compatible (streak field optional during migration)

**Alternatives Considered**:
- Separate context: Rejected - creates two sources of truth for game state
- Lift state to page.tsx: Rejected - GameContainer is appropriate boundary
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
