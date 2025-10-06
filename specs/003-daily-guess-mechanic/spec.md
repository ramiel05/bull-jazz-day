# Feature Specification: Daily Guess Mechanic

**Feature Branch**: `003-daily-guess-mechanic`
**Created**: 2025-10-04
**Status**: Draft
**Input**: User description: "daily guess mechanic. change the game from having new questions given immedietly after guessing, to having one daily question. every user in the same time zone gets the same question so they can compare and compete with their friends and socials. don't worry about a sharing feature for this spec. every other game mechanic and UX stays the same, just the \"pace\" of questions, and that all players get the same question for the day are different. timezone should be based on users locale. if a user has made their guess and they come to the page again on the same device and browser (i.e. no user accounts), then the game will tell them they have already made their guess for the day and their result, it will do this by just continuing to show to feedback screen from the original moment they made their guess. expand the feedback screen to tell the user will be told to come back tomorrow for a new day to guess. the day in question must line line up with the actual date time, tweak the guess prompting message to say something like \"today is X day\", in order to be able to do this we need to do research to get a lot more days in the days pool for true days, it is ok for now if not every single day of the year has a possible true day, if there is no true day in the data available for the current day then pick any random fake day."

## Clarifications

### Session 2025-10-05

- Q: When a real international day exists for the current calendar date (e.g., March 8 = International Women's Day), should the daily challenge always show that specific real day, or should the system randomly choose between showing the real day OR a fake day? → A: Randomly choose: either show the real day for that date OR show any random fake day from the pool
- Q: When a visitor clears their browser storage/cookies and returns on the same day, what should happen? → A: Allow them to guess again (treat as new visitor)
- Q: When selecting the daily challenge (real or fake day), how should the randomness be deterministic to ensure all visitors in the same timezone see the same challenge? → A: Use the calendar date as a seed for randomization (e.g., "2025-10-04" → deterministic random selection)
- Q: When the feedback screen displays "Come back tomorrow for a new daily challenge", should it also show a countdown timer or the specific time when the next challenge becomes available? → A: Yes - show a countdown timer until next challenge

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

## User Scenarios & Testing _(mandatory)_

### Primary User Story

A visitor arrives at the game and is presented with the daily international day of X challenge. The prompt reads "Today is [Day Name]" where the day shown matches the current calendar date in their timezone. They guess whether it's real or fake, see immediate feedback, and if they return later the same day on the same device, they see their previous result and are informed to come back tomorrow for a new challenge. All visitors in the same timezone see the same daily challenge, enabling them to compare results with friends and on social media.

### Acceptance Scenarios

_Write scenarios that can be directly converted to tests (support TDD)_

1. **Given** a visitor in EST timezone loads the game on October 4, 2025, **When** the page loads, **Then** they see a prompt reading "Today is [Day Name]" where the day corresponds to October 4, along with "Real" or "Fake" guess options

2. **Given** another visitor in EST timezone loads the game on October 4, 2025, **When** the page loads, **Then** they see the exact same day name as the first visitor

3. **Given** a visitor in PST timezone loads the game on October 4, 2025, **When** the page loads, **Then** they see a day name that corresponds to October 4 in PST (which may differ from EST if it's a different calendar date in PST)

4. **Given** a visitor sees "Today is International Taco Day" (October 4), **When** they select "Real", **Then** the system shows whether they were correct, reveals the truth with the date, description, and source link, and displays a message "Come back tomorrow for a new daily challenge" along with a countdown timer in HH:MM:SS format (e.g., "23:45:12") that updates every second until midnight in their local timezone

5. **Given** a visitor has made their guess for October 4, **When** they return to the game later on October 4 on the same device and browser, **Then** the system shows the feedback screen from their original guess (not a new question)

6. **Given** a visitor has made their guess for October 4, **When** they return on October 5, **Then** the system presents a new daily challenge corresponding to October 5

7. **Given** the current date is October 4 and there is no real international day in the data pool for October 4, **When** the visitor loads the game, **Then** the system presents a random fake day from the pool with the prompt "Today is [Fake Day Name]"

8. **Given** the current date is March 8 (International Women's Day exists for this date), **When** visitors in the same timezone load the game, **Then** they all see the same daily challenge (which could be either "Today is International Women's Day" OR "Today is [some fake day]" depending on the random selection for that date)

### Edge Cases

- When the visitor has already made their guess for the current day and returns on the same device/browser, the feedback screen from their original guess must be shown (no option to guess again).
- When the day changes (based on the visitor's local timezone), the game must present a new daily challenge even if the visitor hasn't returned in 24 hours.
- When there is no real international day available in the data pool for the current calendar date, the system must present any random fake day from the pool (not an error state).
- When a visitor clears their browser storage/cookies and returns on the same day, they are treated as a new visitor and allowed to guess again (no server-side tracking without user accounts).
- The game must handle timezone boundaries correctly - visitors in different timezones may see different days at the same moment in UTC time.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST determine the visitor's timezone based on their locale
- **FR-002**: System MUST determine the current calendar date in the visitor's timezone
- **FR-003**: System MUST display one international day challenge per calendar date
- **FR-004**: System MUST ensure all visitors in the same timezone see the same daily challenge for the same calendar date by using the calendar date as a deterministic seed for challenge selection
- **FR-005**: System MUST display the challenge prompt in the format "Today is [Day Name]" where the day name corresponds to the current calendar date
- **FR-006**: System MUST randomly choose between showing a real international day (if one exists for the current calendar date) OR showing a random fake day from the pool
- **FR-007**: System MUST select any random fake day from the pool when no real international day exists for the current calendar date (fallback behavior)
- **FR-008**: System MUST provide "Real" and "Fake" guess options to the visitor
- **FR-009**: System MUST accept the visitor's guess and show immediate feedback indicating correctness
- **FR-010**: System MUST reveal the truth (real or fake status) along with the date, description, and source/reference link after each guess
- **FR-011**: System MUST display a message "Come back tomorrow for a new daily challenge" (or similar wording) on the feedback screen along with a countdown timer in HH:MM:SS format that updates every second showing time remaining until midnight in the visitor's local timezone
- **FR-012**: System MUST persist the visitor's guess result for the current day on their device/browser (no user accounts)
- **FR-013**: System MUST show the visitor their previous feedback screen when they return on the same day on the same device/browser
- **FR-014**: System MUST NOT allow the visitor to make a new guess for a day they have already guessed on the same device/browser
- **FR-015**: System MUST present a new daily challenge when the visitor returns on a different calendar date (based on their timezone)
- **FR-016**: System MUST maintain a pool of at least 100 real international days and at least 100 fake days with calendar dates to support daily challenges
- **FR-017**: System MUST NOT include variable or relative dates (e.g., "First Friday of June") in the international days pool

### Key Entities

- **International Day**: Represents a day entry in the game pool. Contains the day name (e.g., "International Women's Day"), whether it is real or fake, the calendar date it occurs on (stored in MM-DD format), a brief description providing context, and a source/reference link. Real days must have Wikipedia entries or backing from major organizations. The pool requires at least 100 real days and at least 100 fake days with calendar dates to support daily gameplay.

- **Daily Challenge**: Represents the challenge presented to visitors for a specific calendar date in a specific timezone. Contains the calendar date, the associated International Day from the pool, and the timezone. All visitors in the same timezone for the same calendar date see the same Daily Challenge.

- **Visitor Guess**: Represents a visitor's guess for a specific Daily Challenge on their device/browser. Contains the calendar date, the guessed answer (Real or Fake), whether the guess was correct, and a timestamp. Persisted locally on the visitor's device (no user accounts). Used to determine whether to show a new challenge or the previous feedback screen.

---

## Review & Acceptance Checklist

_GATE: Automated checks run during main() execution_

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

_Updated by main() during processing_

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---
