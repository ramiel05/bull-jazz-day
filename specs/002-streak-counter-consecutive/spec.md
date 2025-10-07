# Feature Specification: Daily Streak Counter

**Feature Branch**: `002-streak-counter-consecutive`
**Created**: 2025-10-01
**Updated**: 2025-10-07 (aligned with daily challenge mechanics from spec 001)
**Status**: Active
**Input**: User description: "Streak counter. Consecutive correct guesses add to streak counter, a single incorrect guess resets to zero. Have milestone markers at 3, 5, 10, 15, 20, 30, 50, 100, at the milestones signal it in some way, maybe changed color streak counter and a emoji or small animation, open to suggestions."

**Context**: This feature integrates with the daily challenge game (spec 001) where users get one guess per day. Streak now represents consecutive DAYS with correct guesses, not consecutive guesses within a session.

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Design for TDD**: Requirements must be written to support test-first development (clear inputs/outputs, observable behaviors)
5. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs
   - Testable acceptance criteria

---

## Clarifications

### Session 2025-10-01 (Original)
- Q: How long should the milestone celebration visual effects remain visible? → A: Quick flash (<1 second) followed by permanent color change to milestone-specific color
- Q: What visual elements should be included in the milestone celebration (beyond the color change)? → A: Animation only (scale/pulse effect on the counter)
- Q: Should the system track and display the user's highest streak ever achieved? → A: Yes, display "Best: X" alongside current streak
- Q: Should different milestone levels have different colors, or progressively intensifying shades? → A: Distinct colors per milestone (e.g., 3=blue, 5=green, 10=purple, etc.)

### Session 2025-10-07 (Daily Challenge Integration)
- Q: Should the streak counter persist across browser sessions (page refresh, closing/reopening the app)? → A: Yes, persist in localStorage (changed from original "ephemeral" decision to align with daily challenge mechanics)
- Q: What happens to streak when user skips a day (e.g., guesses correctly on Day 1, doesn't visit on Day 2, returns on Day 3)? → A: Streak resets to 0 (to incentivize daily engagement)
- Q: What happens if user makes a correct guess on Day 1, then returns multiple times on Day 1? → A: Streak stays at 1 (only increments once per calendar date)
- Q: How is "consecutive days" defined - calendar days in user's timezone, or 24-hour periods? → A: Calendar days in user's timezone (aligns with daily challenge date boundaries)

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
A user playing the daily guessing game wants to track their success through consecutive days with correct guesses. Each day they visit and guess correctly, their streak counter increases by 1, motivating them to maintain their daily habit. The interface displays both their current streak and their best streak ever achieved. When they reach certain milestone achievements (3, 5, 10, 15, 20, 30, 50, 100 consecutive days), the interface celebrates their accomplishment with a quick animation and changes the streak counter color to that milestone's distinct color. If they make an incorrect guess OR skip a day without guessing, their current streak resets to zero while their best streak record is preserved in localStorage. The streak persists across browser sessions to support the multi-day gameplay pattern.

### Acceptance Scenarios
*Write scenarios that can be directly converted to tests (support TDD)*

**Daily Streak Mechanics**:
1. **Given** the user has a streak of 0 and guesses correctly on Day 1 (2025-10-07), **When** the guess is submitted, **Then** the streak counter increases to 1 and last guess date is saved as "2025-10-07"
2. **Given** the user has a streak of 1 from Day 1 and returns on Day 2 (2025-10-08) and guesses correctly, **When** the guess is submitted, **Then** the streak counter increases to 2
3. **Given** the user has a streak of 5 from Day 5 and returns on Day 6 and guesses correctly, **When** the guess is submitted, **Then** the streak counter increases to 6
4. **Given** the user has a streak of 10 from Day 10 and returns on Day 11 and guesses incorrectly, **When** the guess is submitted, **Then** the streak counter resets to 0
5. **Given** the user has a streak of 3 from Day 3, skips Day 4, and returns on Day 5, **When** the application loads, **Then** the streak counter resets to 0 (streak broken by missed day)
6. **Given** the user has a streak of 5 and visits multiple times on the same day, **When** they return later the same day, **Then** the streak counter remains at 5 (no double-counting same day)

**Persistence**:
7. **Given** the user has a streak of 7, **When** they close and reopen the application on the same day, **Then** the streak counter displays 7 (loaded from localStorage)
8. **Given** the user has achieved a best streak of 10, **When** they close and reopen the application, **Then** the "Best: 10" display is preserved

**Milestone Celebrations**:
9. **Given** the user reaches a streak of exactly 3, **When** the counter updates, **Then** a milestone celebration is displayed
10. **Given** the user reaches a streak of exactly 5, **When** the counter updates, **Then** a milestone celebration is displayed
11. **Given** the user reaches a streak of exactly 10, **When** the counter updates, **Then** a milestone celebration is displayed
12. **Given** the user reaches a streak of exactly 15, **When** the counter updates, **Then** a milestone celebration is displayed
13. **Given** the user reaches a streak of exactly 20, **When** the counter updates, **Then** a milestone celebration is displayed
14. **Given** the user reaches a streak of exactly 30, **When** the counter updates, **Then** a milestone celebration is displayed
15. **Given** the user reaches a streak of exactly 50, **When** the counter updates, **Then** a milestone celebration is displayed
16. **Given** the user reaches a streak of exactly 100, **When** the counter updates, **Then** a milestone celebration is displayed
17. **Given** the user has a streak of 7 (not a milestone) and guesses correctly on the next day reaching 8, **When** the counter updates, **Then** the counter increases without milestone celebration
18. **Given** the user reaches a milestone streak, **When** the celebration displays, **Then** a quick (<1 second) scale/pulse animation plays and the streak counter changes to that milestone's distinct color
19. **Given** the user has achieved a streak of 10, **When** they later have a streak of 7 after a reset, **Then** the "Best: 10" display remains unchanged

**Display**:
20. **Given** the user is viewing the streak counter, **When** the counter is displayed, **Then** both "Current: X" and "Best: Y" values are visible

### Edge Cases
- What happens when user returns on the same day after already guessing? (Streak remains unchanged; no double-increment)
- What happens when user's streak is exactly at a milestone (e.g., 10) and they guess correctly the next day to reach 11? (No milestone celebration, just normal increment; milestone color persists)
- What happens when user skips multiple days (e.g., Day 1 correct, skips Days 2-5, returns Day 6)? (Streak resets to 0 due to missed days)
- What happens when user reaches 100 and continues to Day 101+? (Continue counting beyond 100 with no additional milestones; retains milestone 100's color)
- What happens when current streak exceeds previous best? (Best streak updates immediately to match current streak)
- What happens when localStorage is corrupted or cleared externally? (System treats as new user with streak = 0, best = 0)
- What happens at timezone midnight boundaries? (Date comparison uses same timezone logic as daily challenge - see spec 001)
- What invariants must hold? (Streak count >= 0; best streak >= current streak; lastGuessDate must be valid YYYY-MM-DD or null; streak can only increment by 1 per day maximum)

## Requirements *(mandatory)*

### Functional Requirements

**Daily Streak Tracking**:
- **FR-001**: System MUST maintain a counter that tracks consecutive calendar days with correct guesses
- **FR-002**: System MUST store the date (YYYY-MM-DD format) of the user's most recent guess in localStorage
- **FR-003**: System MUST increment the current streak counter by 1 when the user makes a correct guess on a new calendar day (date different from last guess date)
- **FR-004**: System MUST NOT increment the streak counter when the user returns on the same calendar day after already guessing (prevent double-counting)
- **FR-005**: System MUST reset the current streak counter to 0 when any incorrect guess is made
- **FR-006**: System MUST reset the current streak counter to 0 when the user returns after skipping one or more calendar days (e.g., last guess was Day 1, user returns on Day 3)
- **FR-007**: System MUST determine if days were skipped by comparing the current date with the last guess date (difference > 1 day = streak broken)

**Persistence**:
- **FR-008**: System MUST persist streak state in browser localStorage with key `'streak-state'`
- **FR-009**: System MUST load streak state from localStorage on application start
- **FR-010**: System MUST persist changes to streak state immediately after each guess
- **FR-011**: System MUST handle corrupted or missing localStorage data gracefully by initializing fresh streak state (currentStreak: 0, bestStreak: 0, lastGuessDate: null)

**Display & Best Streak**:
- **FR-012**: System MUST display both the current streak count and best streak count to the user at all times during gameplay (format: "Current: X" and "Best: Y")
- **FR-013**: System MUST track and update the best streak value, setting it to the current streak value whenever current streak exceeds the previous best streak
- **FR-014**: System MUST preserve the best streak value when the current streak resets due to an incorrect guess or skipped days
- **FR-015**: System MUST ensure streak counter never displays negative values

**Milestones**:
- **FR-016**: System MUST recognize milestones at streak values: 3, 5, 10, 15, 20, 30, 50, and 100
- **FR-017**: System MUST trigger a milestone celebration when the current streak reaches any milestone value, consisting of a scale/pulse animation lasting less than 1 second
- **FR-018**: System MUST change the streak counter display color to the milestone's distinct color after the celebration animation completes
- **FR-019**: System MUST assign a unique distinct color to each milestone level (e.g., 3=blue, 5=green, 10=purple, 15=orange, 20=red, 30=gold, 50=cyan, 100=magenta)
- **FR-020**: System MUST continue counting streak beyond 100 without additional milestone celebrations, retaining milestone 100's color
- **FR-021**: System MUST reset milestone color to default when streak resets to 0

### Key Entities *(include if feature involves data)*
- **Streak State**: Represents the user's streak tracking data (persisted in localStorage)
  - Current count: non-negative integer (default: 0) - consecutive days with correct guesses
  - Best count: non-negative integer (default: 0) - highest streak ever achieved
  - Current milestone color: string representing the color of the highest milestone reached by current streak (null if no milestone reached)
  - Last guess date: YYYY-MM-DD format string or null (default: null) - date of most recent guess, used to detect skipped days and prevent double-counting

- **Milestone Definition**: Static configuration for each milestone
  - Streak value: one of [3, 5, 10, 15, 20, 30, 50, 100]
  - Distinct color: unique color identifier per milestone
  - Animation type: scale/pulse effect (<1 second duration)

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---
