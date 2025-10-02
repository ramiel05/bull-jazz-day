
# Implementation Plan: Streak Counter

**Branch**: `002-streak-counter-consecutive` | **Date**: 2025-10-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/ramiel/Projects/bull-jazz-day/specs/002-streak-counter-consecutive/spec.md`

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
Add a streak counter to the day-guessing game that tracks consecutive correct guesses. The counter displays both current and best streaks, celebrates milestones (3, 5, 10, 15, 20, 30, 50, 100) with animations and distinct colors, and resets on incorrect guesses. Storage is ephemeral (session-only). The feature integrates with existing game state management using React hooks and follows TDD with functional patterns.

## Technical Context
**Language/Version**: TypeScript 5.x with React 19.1.0
**Primary Dependencies**: Next.js 15.5.4 (App Router), tiny-invariant 1.3.3, React hooks (useState, useEffect)
**Storage**: In-memory only (ephemeral session storage, no persistence)
**Testing**: Vitest 3.2.4 with @testing-library/react 16.3.0
**Target Platform**: Web browsers (modern ES2020+)
**Project Type**: Single project (Next.js App Router with feature-based organization)
**Performance Goals**: <16ms render time for animations (60fps), instant streak updates on guess
**Constraints**: Animation duration <1 second, 8 distinct milestone colors, session-only storage
**Scale/Scope**: Single-player browser game, ~5 new components/hooks, integration with existing GameState

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**I. Functional Patterns**:
- [x] Feature design favors pure functions and immutability (streak state managed through React state updates, pure calculation functions)
- [x] No stateful classes where functional alternatives exist (React functional components with hooks)
- [x] Composition used over inheritance (component composition for streak display)

**II. Test-Driven Development (NON-NEGOTIABLE)**:
- [x] Tests will be written BEFORE implementation (contract tests, unit tests, integration tests all written first)
- [x] Red-green-refactor cycle planned in Phase 2 (tasks.md will specify test-first order)
- [x] All public interfaces will have test coverage (all hooks, components, and utilities tested)

**III. Naming Conventions**:
- [x] All entities, functions, and components use descriptive names (StreakState, useStreakCounter, StreakDisplay, updateStreak)
- [x] No abbreviations except universally understood (API, URL, ID)
- [x] Naming follows TypeScript/React conventions (camelCase functions, PascalCase components, kebab-case files)

**IV. Idiomatic Code**:
- [x] Design follows Next.js App Router conventions (client components with 'use client' directive)
- [x] React patterns (hooks, composition) used appropriately (custom useStreakCounter hook, component composition)
- [x] No custom abstractions where framework provides solution (using React's useState/useEffect directly)

**V. Feature Co-location**:
- [x] Files organized by feature/domain, not technical role (all in src/features/day-guessing-game/streak/)
- [x] Related code (components, hooks, types, tests) co-located (each .ts/.tsx has adjacent .test.ts/.test.tsx)
- [x] Unit test files placed directly next to source files (not in separate tests/ folders)
- [x] Integration tests (and higher) placed in dedicated test directories (in features/day-guessing-game/tests/integration/)
- [x] Only truly cross-cutting concerns in /shared or /lib (streak is game-specific, stays in feature)

**VI. Explicit Failure with Invariants**:
- [x] Invariant checks validate preconditions and postconditions (use tiny-invariant for state validation)
- [x] Exceptions thrown when invariants are violated (error conditions like negative streak throw)
- [x] No silent failures via void, null, empty strings, or sentinel values for errors
- [x] Typed errors used for error cases (Error subclasses or discriminated unions)

**VII. Explicit Null Types**:
- [x] Empty/default states use typed empty values (empty strings, 0, [], etc.) (streak starts at 0, not null)
- [x] `| null` union types used only for intentional absence or "not yet set" (currentMilestoneColor is string | null)
- [x] No use of `null` for empty states that are valid values of the base type
- [x] Type definitions are intentional and expressive about absence semantics (null = no milestone reached yet)

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
├── app/
│   ├── layout.tsx
│   └── page.tsx
└── features/
    └── day-guessing-game/
        ├── components/
        │   ├── game-container.tsx
        │   ├── game-container.test.tsx
        │   ├── day-display.tsx
        │   ├── day-display.test.tsx
        │   ├── guess-buttons.tsx
        │   ├── guess-buttons.test.tsx
        │   ├── feedback-panel.tsx
        │   └── feedback-panel.test.tsx
        ├── streak/                    # NEW: Streak counter feature
        │   ├── types/
        │   │   ├── streak-types.ts
        │   │   └── streak-types.test.ts
        │   ├── hooks/
        │   │   ├── use-streak-counter.ts
        │   │   └── use-streak-counter.test.ts
        │   ├── utils/
        │   │   ├── calculate-milestone.ts
        │   │   ├── calculate-milestone.test.ts
        │   │   ├── get-milestone-color.ts
        │   │   └── get-milestone-color.test.ts
        │   └── components/
        │       ├── streak-display.tsx
        │       └── streak-display.test.tsx
        ├── types/
        │   ├── game-types.ts          # MODIFIED: Add streak to GameState
        │   ├── game-types.test.ts
        │   └── international-day.ts
        ├── utils/
        │   ├── select-random-day.ts
        │   ├── select-random-day.test.ts
        │   ├── validate-guess.ts
        │   └── validate-guess.test.ts
        ├── data/
        │   ├── days-pool.ts
        │   └── days-pool.test.ts
        └── tests/
            └── integration/
                ├── game-flow.test.tsx
                └── streak-flow.test.tsx  # NEW: Integration test
```

**Structure Decision**: Single project structure (Next.js App Router). The streak counter is co-located within the day-guessing-game feature in a dedicated `streak/` subdirectory, following principle V (Feature Co-location). Unit tests are placed directly next to source files, and integration tests remain in the dedicated `tests/integration/` folder.

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
1. Load `.specify/templates/tasks-template.md` as base template
2. Generate tasks from Phase 1 artifacts:
   - **Types** (from data-model.md): streak-types.ts → test → implementation
   - **Utils** (from contracts/): calculate-milestone, get-milestone-color → tests → implementations [P]
   - **Hook** (from contracts/): use-streak-counter → test → implementation
   - **Components** (from contracts/): streak-display (includes milestone animations via CSS) → test → implementation
   - **Integration**: Modify game-types.ts, game-container.tsx → integration test
3. Each contract generates 2 tasks:
   - Task N: Write failing test (RED)
   - Task N+1: Implement to pass test (GREEN)
4. Integration test task uses quickstart.md validation scenarios

**Ordering Strategy**:

**Layer 1 - Foundation** (parallel executable [P]):
- Types definition (streak-types.ts)
- Type tests
- Milestone constants

**Layer 2 - Pure Utilities** (parallel executable [P]):
- calculateMilestone test
- calculateMilestone implementation
- getMilestoneColor test
- getMilestoneColor implementation

**Layer 3 - React Hook** (depends on Layer 2):
- useStreakCounter test
- useStreakCounter implementation

**Layer 4 - Components** (depends on Layer 3):
- streak-display test (includes milestone animation behavior)
- streak-display implementation (CSS transitions for milestone animations)

**Layer 5 - Integration** (depends on all previous):
- Extend GameState type (game-types.ts)
- Integration test (streak-flow.test.tsx) - covers all acceptance scenarios
- Integrate into GameContainer (modify game-container.tsx)
- Manual quickstart validation

**Task Breakdown Estimate**:
- Setup: 2 tasks (types + constants)
- Tests: 5 tasks (4 contract tests + 1 integration test)
- Utils: 2 tasks (2 functions)
- Hook: 1 task (useStreakCounter)
- Components: 1 task (StreakDisplay with animations)
- Integration: 4 tasks (GameState extension + integration + validation)
- Validation: 5 tasks (manual quickstart scenarios)
- **Total**: ~20 tasks in dependency order

**TDD Enforcement**:
- All implementation tasks blocked by corresponding test task
- No [P] across TDD boundaries (test must pass before implementation starts)
- [P] only for independent test files or independent implementation files

**Estimated Output**: 20 numbered, dependency-ordered tasks in tasks.md

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
- [x] Complexity deviations documented

**Artifacts Generated**:
- ✅ research.md (Phase 0)
- ✅ data-model.md (Phase 1)
- ✅ contracts/ (4 contract files: useStreakCounter, calculateMilestone, getMilestoneColor, StreakDisplay)
- ✅ quickstart.md (Phase 1)
- ✅ CLAUDE.md updated (Phase 1)

---
*Based on Constitution v1.3.0 - See `.specify/memory/constitution.md`*
