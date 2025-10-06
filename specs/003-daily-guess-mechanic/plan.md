
# Implementation Plan: Daily Guess Mechanic

**Branch**: `003-daily-guess-mechanic` | **Date**: 2025-10-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/ramiel/Projects/bull-jazz-day/specs/003-daily-guess-mechanic/spec.md`

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
Transform the game from instant question flow to a daily challenge format where all players in the same timezone see the same international day question each day. The game uses deterministic date-based randomization to ensure consistency and persists results in browser storage. Requires expanding the pool of international days to at least 100 real days and at least 100 fake days to support daily gameplay.

## Technical Context
**Language/Version**: TypeScript 5.x
**Primary Dependencies**: React 19.1.0, Next.js 15.5.4 (App Router), tiny-invariant 1.3.3
**Storage**: Browser localStorage (client-side persistence, no server)
**Testing**: Vitest 3.2.4, @testing-library/react 16.3.0, @testing-library/user-event 14.6.1
**Target Platform**: Web browser (client-side only)
**Project Type**: single (Next.js web app)
**Performance Goals**: <100ms UI response time, instant date/timezone calculations
**Constraints**: Client-side only (no backend), deterministic randomization using date as seed, browser storage for state persistence, no variable/relative dates allowed
**Scale/Scope**: At least 100 real international days and at least 100 fake days with calendar dates, single daily challenge per timezone

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**I. Functional Patterns**:
- [x] Feature design favors pure functions and immutability
- [x] No stateful classes where functional alternatives exist
- [x] Composition used over inheritance

**II. Test-Driven Development (NON-NEGOTIABLE)**:
- [x] Tests will be written BEFORE implementation
- [x] Red-green-refactor cycle planned in Phase 2
- [x] All public interfaces will have test coverage

**III. Naming Conventions**:
- [x] All entities, functions, and components use descriptive names
- [x] No abbreviations except universally understood (API, URL, ID)
- [x] Naming follows TypeScript/React conventions

**IV. Idiomatic Code**:
- [x] Design follows Next.js App Router conventions
- [x] React patterns (hooks, composition) used appropriately
- [x] No custom abstractions where framework provides solution

**V. Feature Co-location**:
- [x] Files organized by feature/domain, not technical role
- [x] Related code (components, hooks, types, tests) co-located
- [x] Unit test files placed directly next to source files (not in separate tests/ folders)
- [x] Integration tests (and higher) placed in dedicated test directories
- [x] Only truly cross-cutting concerns in /shared or /lib

**VI. Explicit Failure with Invariants**:
- [x] Invariant checks validate preconditions and postconditions
- [x] Exceptions thrown when invariants are violated (error conditions)
- [x] No silent failures via void, null, empty strings, or sentinel values for errors
- [x] Typed errors used for error cases (Error subclasses or discriminated unions)

**VII. Explicit Null Types**:
- [x] Empty/default states use typed empty values (empty strings, 0, [], etc.)
- [x] `| null` union types used only for intentional absence or "not yet set"
- [x] No use of `null` for empty states that are valid values of the base type
- [x] Type definitions are intentional and expressive about absence semantics

**VIII. Integration Test Fidelity**:
- [x] Integration tests use real user interactions (button clicks, form inputs, navigation)
- [x] No manual manipulation of hooks, state, or internal implementation details in integration tests
- [x] Integration tests don't duplicate unit test logic
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
├── features/
│   └── day-guessing-game/
│       ├── components/           # Existing game UI components
│       ├── data/
│       │   ├── days-pool.ts      # Existing: needs expansion to 100 real + 100 fake days
│       │   └── days-pool.test.ts
│       ├── daily-challenge/      # New: daily challenge logic
│       │   ├── utils/
│       │   │   ├── get-daily-challenge.ts
│       │   │   ├── get-daily-challenge.test.ts
│       │   │   ├── deterministic-random.ts
│       │   │   ├── deterministic-random.test.ts
│       │   │   ├── timezone-utils.ts
│       │   │   └── timezone-utils.test.ts
│       │   ├── storage/
│       │   │   ├── daily-state-storage.ts
│       │   │   └── daily-state-storage.test.ts
│       │   └── hooks/
│       │       ├── use-daily-state.ts
│       │       └── use-daily-state.test.ts
│       ├── streak/               # Existing: streak counter
│       ├── types/
│       │   ├── international-day.ts  # Existing: may need updates
│       │   └── daily-types.ts        # New: daily challenge types
│       ├── utils/                # Existing: validation utils
│       └── tests/
│           └── integration/      # Integration tests only
│               ├── game-flow.test.tsx  # Existing: needs updates
│               └── daily-flow.test.tsx # New: daily challenge flow
└── app/
    └── page.tsx                  # Main page: needs updates for daily mode

tests/
└── contract/                     # N/A for this feature (client-side only)
```

**Structure Decision**: Single project structure with feature co-location. All daily challenge logic will be organized under `src/features/day-guessing-game/daily-challenge/` with utils, storage, and hooks subdirectories. Unit tests are co-located next to source files. Integration tests are in dedicated `tests/integration/` directory within the feature.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

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
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (data model, quickstart, research findings)
- Core utilities → pure function tasks [P] (deterministic-random, timezone-utils, get-daily-challenge)
- Storage layer → localStorage wrapper tasks [P]
- Data expansion → extend days-pool tasks (at least 100 real days)
- Data expansion → extend days-pool tasks (at least 100 fake days)
- React hooks → daily state management tasks
- Component updates → integrate daily mode into existing game flow
- Integration tests → daily flow scenarios from quickstart
- Implementation tasks to make tests pass

**Task Categories**:
1. **Data Layer** (parallel):
   - Update InternationalDay type with "MM-DD" date format
   - Add 100 real international days to pool (directly in days-pool.ts)
   - Add 100 fake days to pool (directly in days-pool.ts)
   - Unit tests for extended pool

2. **Pure Utilities** (parallel):
   - Deterministic random (xmur3 + mulberry32)
   - Timezone date formatting
   - Daily challenge selection logic
   - Unit tests for each utility

3. **State Management**:
   - localStorage wrapper with type safety
   - Daily state persistence hooks
   - Unit tests for storage layer

4. **UI Integration** (depends on utilities + state):
   - Update GameContainer for daily mode
   - Update FeedbackPanel with countdown/next time
   - Update prompt to show "Today is [Day]"
   - Component unit tests

5. **Integration Tests**:
   - Daily flow test (new challenge → guess → revisit)
   - Determinism test (same date = same challenge)
   - Day transition test (midnight boundary)
   - Storage persistence test

**Ordering Strategy**:
- TDD order: Tests before implementation for each layer
- Dependency order: Data types → Utils → Storage → Hooks → Components → Integration
- Mark [P] for parallel execution within same layer

**Estimated Output**: 20-25 numbered, ordered tasks in tasks.md

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
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (None)

---
*Based on Constitution v1.4.0 - See `.specify/memory/constitution.md`*
