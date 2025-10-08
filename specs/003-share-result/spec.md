# Feature Specification: Share Results

**Feature Branch**: `003-share-result`
**Created**: 2025-10-07
**Status**: Draft
**Input**: User description: "share results. a share button in the feedback display. it appear on both correct and incorrect guesses. it should be a simple copy to clipboard share, no browser share API is necessary. it should share the following information: the day in question, whether the day was fake or real, the players guess chosen, current streak, milestone if just achieved on that guess, new best streak if a new best streak was just achieved on that guess. have some emojis to reflect correct or wrong guess and any milestone reached. include a link to the deployed production site."

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

### Session 2025-10-07

- Q: What is the production site URL that should be included in shared messages? → A: https://bull-jazz-day.vercel.app
- Q: What are the specific milestone thresholds that should be recognized and celebrated in shared messages? → A: 3, 5, 10, 15, 20, 30, 50, 100 (as defined in spec 002)
- Q: How should copy failure be communicated to the user when the clipboard API is unavailable or denied permission? → A: Button text changes to "Copy failed" for 5 seconds, then reverts
- Q: When a player has a streak of 0 (first play or after reset), should the shared message include "Streak: 0" or omit the streak information entirely? → A: Omit streak information entirely
- Q: How should the shared message be formatted to ensure readability across different platforms (mobile messaging, Twitter, Discord, etc.)? → A: Plain text with line breaks between sections

## User Scenarios & Testing _(mandatory)_

### Primary User Story

After making a guess about whether a UN International Day is real or fake, users want to share their results with others. They click a share button to copy a formatted message to their clipboard that includes their guess outcome, streak information, any milestones achieved, and a link to the game, which they can then paste into social media, messaging apps, or anywhere else.

### Acceptance Scenarios

_Write scenarios that can be directly converted to tests (support TDD)_

1. **Given** a player has made a correct guess, **When** they click the share button in the feedback display, **Then** a formatted message is copied to their clipboard containing: the day name, correct real/fake designation, their correct guess, current streak, success emoji, and production site link

2. **Given** a player has made an incorrect guess, **When** they click the share button in the feedback display, **Then** a formatted message is copied to their clipboard containing: the day name, correct real/fake designation, their incorrect guess, failure emoji, and production site link. Streak information is omitted (as streak resets to 0 on incorrect guess).

3. **Given** a player with streak of 0 clicks the share button, **When** the message is copied, **Then** the shared message omits all streak information (no "Streak: 0" displayed)

4. **Given** a player achieves a milestone on their current guess, **When** they click the share button, **Then** the copied message includes the milestone achievement with celebratory emoji

5. **Given** a player achieves a new best streak on their current guess, **When** they click the share button, **Then** the copied message includes the new best streak information with celebratory emoji

6. **Given** the share button has been clicked, **When** the copy operation completes successfully, **Then** there is visual feedback to the user that the copy succeeded in the form of button text changing to "Copied!"

7. **Given** the share button has been clicked, **When** the copy operation fails (clipboard API unavailable or permission denied), **Then** the button text changes to "Copy failed" for 5 seconds before reverting to the original text

### Edge Cases

- Clipboard API unavailable or denied permission → Button text changes to "Copy failed" for 5 seconds
- Player has streak of 0 (first play or after reset) → Omit streak information from shared message
- Message formatting across platforms → Plain text with line breaks between sections for cross-platform readability

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display a share button in the feedback display after both correct and incorrect guesses
- **FR-002**: System MUST copy a formatted message to the user's clipboard when the share button is clicked
- **FR-003**: Shared message MUST include the name of the UN International Day being guessed
- **FR-004**: Shared message MUST indicate whether the day was real or fake
- **FR-005**: Shared message MUST include the player's guess (real or fake)
- **FR-006**: Shared message MUST include the player's current streak value when streak is greater than 0; MUST omit streak information when streak equals 0
- **FR-007**: System MUST include milestone information in the shared message if a milestone was achieved on that guess
- **FR-008**: System MUST include new best streak information in the shared message if a new best streak was achieved on that guess
- **FR-009**: Shared message MUST include emoji(s) reflecting correct or wrong guess
- **FR-010**: Shared message MUST include emoji(s) reflecting any milestone reached
- **FR-011**: Shared message MUST include a link to the deployed production site
- **FR-012**: System MUST use clipboard copy functionality (not browser share API)
- **FR-013**: System MUST include the URL https://bull-jazz-day.vercel.app in all shared messages
- **FR-014**: System MUST recognize and include milestone achievements for the following streak values: 3, 5, 10, 15, 20, 30, 50, and 100
- **FR-015**: System MUST allow unlimited shares, no rate limiting
- **FR-016**: System MUST display "Copy failed" button text for 5 seconds when clipboard copy operation fails, then revert to original button text
- **FR-017**: Shared message MUST be formatted as plain text with line breaks between sections to ensure readability across different platforms (mobile messaging, Twitter, Discord, etc.)

### Key Entities

- **Share Message**: The formatted text copied to clipboard (plain text with line breaks between sections)
  - Day name (string, from game state)
  - Day type (real or fake, from game state)
  - Player guess (real or fake, from game state)
  - Current streak (number, positive integer. Not included when current streak is 0)
  - Milestone text (string or null - null when no milestone achieved)
  - New best streak text (string or null - null when no new best achieved)
  - Emoji indicators (string, never empty - always includes guess result emoji)
  - Production site URL (string, constant: https://bull-jazz-day.vercel.app)
  - Format: Plain text with line breaks between sections for cross-platform compatibility
  - Style: Natural, conversational phrasing (e.g., "International Day of Peace is real!", "My guess: Real") rather than key-value format (e.g., "Day:", "Type:", "Your guess:")

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
- [x] Ambiguities marked (5 clarifications identified)
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Clarifications resolved (5 questions answered)
- [x] Review checklist passed

---
