
# Implementation Plan: Share Results

**Branch**: `003-share-result` | **Date**: 2025-10-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/ramiel/Projects/bull-jazz-day/specs/003-share-result/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Add a share button to the feedback display that copies a formatted message to the clipboard. The message includes the UN day name, whether it was real/fake, the player's guess, current streak (if > 0), milestone achievements, new best streak achievements, appropriate emojis, and a link to https://bull-jazz-day.vercel.app. The feature supports both correct and incorrect guesses with appropriate visual feedback for copy success/failure.

## Technical Context
**Language/Version**: TypeScript 5.x
**Primary Dependencies**: React 19.1.0, Next.js 15.5.4 (App Router), tiny-invariant 1.3.3
**Storage**: Browser localStorage (client-side persistence, no server)
**Testing**: Vitest 3.2.4, @testing-library/react 16.3.0, @testing-library/user-event 14.6.1
**Target Platform**: Web browsers (desktop and mobile), client-side only
**Project Type**: Single project (Next.js App Router frontend)
**Performance Goals**: Instant clipboard copy (<100ms), no network latency (client-side only)
**Constraints**: Must work without browser share API, must handle clipboard API unavailability gracefully
**Scale/Scope**: Single share button component, message formatting utility, clipboard integration

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**I. Functional Patterns**:
- [x] Feature design favors pure functions and immutability (message formatter is pure function, no mutations)
- [x] No stateful classes where functional alternatives exist (React functional components only)
- [x] Composition used over inheritance (share button composes into feedback panel)

**II. Test-Driven Development (NON-NEGOTIABLE)**:
- [x] Tests will be written BEFORE implementation
- [x] Red-green-refactor cycle planned in Phase 2
- [x] All public interfaces will have test coverage (message formatter, share button component, clipboard interaction)

**III. Naming Conventions**:
- [x] All entities, functions, and components use descriptive names (formatShareMessage, ShareButton, etc.)
- [x] No abbreviations except universally understood (API, URL, ID)
- [x] Naming follows TypeScript/React conventions (camelCase functions, PascalCase components)

**IV. Idiomatic Code**:
- [x] Design follows Next.js App Router conventions (client component with 'use client' directive)
- [x] React patterns (hooks, composition) used appropriately (useState for button state, useCallback for handlers)
- [x] No custom abstractions where framework provides solution (using native clipboard API)

**V. Feature Co-location**:
- [x] Files organized by feature/domain, not technical role (within day-guessing-game feature)
- [x] Related code (components, hooks, types, tests) co-located (share utilities in components/share/ folder)
- [x] Unit test files placed directly next to source files (not in separate tests/ folders)
- [x] Integration tests (and higher) placed in dedicated test directories (tests/integration/)
- [x] Only truly cross-cutting concerns in /shared or /lib (none needed for this feature)

**VI. Explicit Failure with Invariants**:
- [x] Invariant checks validate preconditions and postconditions (validate required data exists before formatting)
- [x] Exceptions thrown when invariants are violated (error conditions)
- [x] No silent failures via void, null, empty strings, or sentinel values for errors
- [x] Typed errors used for error cases (Error subclasses or discriminated unions)

**VII. Explicit Null Types**:
- [x] Empty/default states use typed empty values (empty strings, 0, [], etc.)
- [x] `| null` union types used only for intentional absence or "not yet set" (milestone text null when not achieved)
- [x] No use of `null` for empty states that are valid values of the base type
- [x] Type definitions are intentional and expressive about absence semantics (button state as string union, not null)

**VIII. Integration Test Fidelity**:
- [x] Integration tests use real user interactions (button clicks, form inputs, navigation)
- [x] No manual manipulation of hooks, state, or internal implementation details in integration tests
- [x] Integration tests don't duplicate unit test logic (unit tests for formatter, integration for full share flow)
- [x] Integration tests verify cross-component interactions and data flow, not isolated units

**Violations**: None

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── app/                                    # Next.js App Router
│   ├── page.tsx                           # Main page
│   └── layout.tsx                         # Root layout
└── features/
    └── day-guessing-game/
        ├── components/
        │   ├── feedback-panel.tsx         # MODIFIED: Will integrate share button
        │   ├── feedback-panel.test.tsx
        │   ├── share-button.tsx           # NEW: Share button component
        │   ├── share-button.test.tsx      # NEW: Unit tests
        │   └── game-container.tsx         # Existing (unchanged)
        ├── share/                          # NEW: Share feature module
        │   ├── utils/
        │   │   ├── format-share-message.ts       # NEW: Pure formatter function
        │   │   ├── format-share-message.test.ts  # NEW: Unit tests
        │   │   ├── copy-to-clipboard.ts          # NEW: Clipboard wrapper
        │   │   └── copy-to-clipboard.test.ts     # NEW: Unit tests
        │   └── types/
        │       └── share-types.ts         # NEW: Type definitions
        ├── streak/
        │   ├── types/
        │   │   └── streak-types.ts        # Existing: StreakState, MilestoneEvent
        │   └── constants/
        │       └── milestones.ts          # Existing: MILESTONE_CONFIGS
        ├── types/
        │   ├── game-types.ts              # Existing: GuessResult
        │   └── international-day.ts       # Existing: InternationalDay
        └── tests/
            └── integration/
                └── share-flow.test.tsx    # NEW: Integration test for full share workflow
```

**Structure Decision**: Single project structure (Next.js App Router). Feature co-location within `day-guessing-game` feature with new `share/` subfolder for share-specific utilities. Unit tests co-located with source files, integration tests in dedicated test directory following constitutional principles.

## Phase 0: Outline & Research

**Analysis**: All technical context is fully specified with no NEEDS CLARIFICATION markers. The feature uses well-established browser APIs and React patterns. Research focused on:

1. **Clipboard API patterns** → navigator.clipboard.writeText() is the standard
2. **React state management for button feedback** → useState with timeout for transient states
3. **Message formatting for cross-platform compatibility** → plain text with line breaks
4. **Testing clipboard interactions** → Mock navigator.clipboard in tests
5. **Emoji selection** → Unicode emojis for success (🎉), failure (❌), milestones (🎖️, 🏆)

**Output**: research.md generated with technical decisions documented

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:

The /tasks command will generate ordered, dependency-aware tasks following TDD principles:

1. **Type Definitions** (Foundation):
   - Create `share-types.ts` with ShareMessageData, ShareButtonState types
   - [P] Independent of other tasks, can be done first

2. **Pure Function Tests & Implementation** (Core Logic):
   - Write tests for `formatShareMessage` (10 test cases from contract)
   - Implement `formatShareMessage` to pass tests
   - Write tests for `copyToClipboard` (5 test cases from contract)
   - Implement `copyToClipboard` to pass tests
   - [P] These can be done in parallel after types complete

3. **Component Tests & Implementation** (UI Layer):
   - Write tests for `ShareButton` component (12 test cases from contract)
   - Implement `ShareButton` component to pass tests
   - Depends on formatShareMessage and copyToClipboard existing

4. **Integration Tests** (End-to-End Verification):
   - Write integration test for full share flow in feedback panel
   - Test covers multiple scenarios from quickstart.md
   - Depends on ShareButton component existing

5. **Integration into FeedbackPanel** (Composition):
   - Modify `FeedbackPanel` to include `ShareButton`
   - Pass guessResult and streakState props
   - Update FeedbackPanel tests to verify ShareButton presence

6. **Validation** (Final Verification):
   - Run all tests (unit + integration)
   - Execute quickstart scenarios manually
   - Verify all 17 FRs met

**Ordering Strategy**:
- TDD strict: Tests BEFORE implementation for every module
- Bottom-up: Types → Utils → Component → Integration
- [P] markers for parallel-safe tasks (independent files)
- Each implementation task blocked by corresponding test task

**Estimated Task Count**: ~15-18 tasks
- 2 type/setup tasks
- 4 test-writing tasks (utils)
- 2 implementation tasks (utils)
- 1 test-writing task (component)
- 1 implementation task (component)
- 1 integration test task
- 2 integration tasks (modify FeedbackPanel)
- 2 validation tasks

**Task Dependencies**:
```
Types [P]
  ↓
formatShareMessage tests [P]     copyToClipboard tests [P]
  ↓                                ↓
formatShareMessage impl [P]      copyToClipboard impl [P]
  ↓                                ↓
  └──────────────┬─────────────────┘
                 ↓
         ShareButton tests
                 ↓
         ShareButton impl
                 ↓
    Integration test + FeedbackPanel modification
                 ↓
            Validation
```

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved (5 clarifications already in spec)
- [x] Complexity deviations documented (None - no violations)

---
*Based on Constitution v1.4.0 - See `.specify/memory/constitution.md`*
