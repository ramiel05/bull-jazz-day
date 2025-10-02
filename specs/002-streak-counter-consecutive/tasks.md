# Tasks: Streak Counter (Consecutive Correct Guesses)

**Input**: Design documents from `/specs/002-streak-counter-consecutive/`
**Prerequisites**: research.md, data-model.md, contracts/, quickstart.md

## Execution Flow
```
1. Load design documents (research, data-model, contracts, quickstart)
2. Generate tasks by category:
   → Setup: types, constants
   → Tests: contract tests (TDD), unit tests
   → Core: utils, hooks, components
   → Integration: GameContainer integration
   → Polish: manual validation
3. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
4. Number tasks sequentially (T001-T020)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup

- [ ] T001 [P] Create type definitions in `src/features/day-guessing-game/streak/types/streak-types.ts`
- [ ] T002 [P] Create milestone constants in `src/features/day-guessing-game/streak/constants/milestones.ts`

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
**Constitutional requirement (Principle II - NON-NEGOTIABLE)**

### Contract Tests (Pure Functions & Hooks)

- [ ] T003 [P] Contract test for calculateMilestone in `src/features/day-guessing-game/streak/utils/calculate-milestone.test.ts`
- [ ] T004 [P] Contract test for getMilestoneColor in `src/features/day-guessing-game/streak/utils/get-milestone-color.test.ts`
- [ ] T005 [P] Contract test for useStreakCounter in `src/features/day-guessing-game/streak/hooks/use-streak-counter.test.ts`
- [ ] T006 [P] Contract test for StreakDisplay component in `src/features/day-guessing-game/streak/components/streak-display.test.tsx`

### Integration Tests

- [ ] T007 Integration test for full streak flow in `src/features/day-guessing-game/streak/tests/integration/streak-flow.test.tsx`

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Utilities (Pure Functions)

- [ ] T008 [P] Implement calculateMilestone function in `src/features/day-guessing-game/streak/utils/calculate-milestone.ts`
- [ ] T009 [P] Implement getMilestoneColor function in `src/features/day-guessing-game/streak/utils/get-milestone-color.ts`

### Hooks

- [ ] T010 Implement useStreakCounter hook in `src/features/day-guessing-game/streak/hooks/use-streak-counter.ts`

### Components

- [ ] T011 Implement StreakDisplay component in `src/features/day-guessing-game/streak/components/streak-display.tsx`

## Phase 3.4: Integration

- [ ] T012 Extend GameState type with streak field in `src/features/day-guessing-game/types/game-types.ts`
- [ ] T013 Integrate useStreakCounter into GameContainer in `src/features/day-guessing-game/components/game-container.tsx`
- [ ] T014 Update handleGuess to increment/reset streak in `src/features/day-guessing-game/components/game-container.tsx`
- [ ] T015 Add StreakDisplay to GameContainer UI in `src/features/day-guessing-game/components/game-container.tsx`

## Phase 3.5: Polish

- [ ] T016 Manual validation: Scenario 1 (Basic Streak Increment) from quickstart.md
- [ ] T017 Manual validation: Scenario 2 (Streak Reset) from quickstart.md
- [ ] T018 Manual validation: Scenario 3 (First Milestone) from quickstart.md
- [ ] T019 Manual validation: Scenario 4-5 (Multiple Milestones, Color Reset) from quickstart.md
- [ ] T020 Manual validation: Scenario 6-7 (Session Persistence, Accessibility) from quickstart.md

## Dependencies

### Critical Path
```
T001, T002 (Setup)
  ↓
T003-T007 (Tests - parallel, must fail)
  ↓
T008-T011 (Core Implementation - make tests pass)
  ↓
T012 (GameState extension)
  ↓
T013-T015 (Integration - sequential, same file)
  ↓
T016-T020 (Manual Validation)
```

### Specific Dependencies

**Setup Phase**:
- T001 blocks T003, T005, T006, T007 (types needed for tests)
- T002 blocks T003, T004 (constants needed for utility tests)

**Test Phase** (all parallel):
- T003-T006 can run in parallel (different files)
- T007 depends on none (uses mocked utilities)

**Implementation Phase**:
- T008 depends on T001, T002, T003
- T009 depends on T001, T002, T004
- T010 depends on T001, T008, T009, T005
- T011 depends on T001, T006

**Integration Phase** (sequential):
- T012 depends on T001 (GameState extension)
- T013 depends on T010, T012 (useStreakCounter + GameState)
- T014 depends on T013 (same file, after hook integration)
- T015 depends on T011, T014 (StreakDisplay + state management ready)

**Polish Phase**:
- T016-T020 depend on T015 (full feature implemented)

## Parallel Execution Examples

### Phase 3.1: Setup (Parallel)
```
Task: "Create type definitions in src/features/day-guessing-game/streak/types/streak-types.ts"
Task: "Create milestone constants in src/features/day-guessing-game/streak/constants/milestones.ts"
```

### Phase 3.2: Contract Tests (Parallel)
```
Task: "Contract test for calculateMilestone in src/features/day-guessing-game/streak/utils/calculate-milestone.test.ts"
Task: "Contract test for getMilestoneColor in src/features/day-guessing-game/streak/utils/get-milestone-color.test.ts"
Task: "Contract test for useStreakCounter in src/features/day-guessing-game/streak/hooks/use-streak-counter.test.ts"
Task: "Contract test for StreakDisplay component in src/features/day-guessing-game/streak/components/streak-display.test.tsx"
```

### Phase 3.3: Utilities (Parallel)
```
Task: "Implement calculateMilestone function in src/features/day-guessing-game/streak/utils/calculate-milestone.ts"
Task: "Implement getMilestoneColor function in src/features/day-guessing-game/streak/utils/get-milestone-color.ts"
```

## Notes

### Constitutional Alignment
- **Principle I (Functional Patterns)**: T008, T009 are pure functions
- **Principle II (TDD)**: T003-T007 MUST fail before T008-T015
- **Principle V (Feature Co-location)**: All files in `src/features/day-guessing-game/streak/`
- **Principle VII (Explicit Failure)**: T008, T009 use invariant checks
- **Principle VIII (Explicit Null)**: StreakState.currentMilestoneColor uses `| null` for intentional absence

### Implementation Guidelines
- Use React 19.1.0 hooks (useState, useEffect)
- Use tiny-invariant 1.3.3 for precondition checks
- Follow Next.js App Router conventions
- Co-locate unit tests next to source files
- Integration tests in dedicated test directory
- Use Vitest + @testing-library/react for testing
- CSS transitions for animations (no animation library)
- Tailwind color classes for milestone colors

### File Path Convention
All files under: `src/features/day-guessing-game/streak/`
```
streak/
  types/
    streak-types.ts
  constants/
    milestones.ts
  utils/
    calculate-milestone.ts
    calculate-milestone.test.ts
    get-milestone-color.ts
    get-milestone-color.test.ts
  hooks/
    use-streak-counter.ts
    use-streak-counter.test.ts
  components/
    streak-display.tsx
    streak-display.test.tsx
  tests/
    integration/
      streak-flow.test.tsx
```

### Test Coverage Requirements
- **T003**: 18 test cases (calculateMilestone contract)
- **T004**: 19 test cases (getMilestoneColor contract)
- **T005**: 10 test cases (useStreakCounter contract)
- **T006**: 13 test cases (StreakDisplay contract)
- **T007**: 7 scenarios from quickstart (integration)

### Manual Validation (T016-T020)
All scenarios from `quickstart.md`:
1. Basic Streak Increment (T016)
2. Streak Reset on Incorrect Guess (T017)
3. First Milestone Celebration (Streak 3) (T018)
4. Multiple Milestone Progression (T019)
5. Streak Reset Clears Color (T019)
6. Session Persistence (Ephemeral Verification) (T020)
7. Accessibility Validation (T020)

## Validation Checklist

- [x] All contracts have corresponding tests (T003-T006)
- [x] All entities have type tasks (T001: StreakState, MilestoneConfig, MilestoneEvent)
- [x] All tests come before implementation (T003-T007 → T008-T015)
- [x] Parallel tasks truly independent (T001/T002, T003-T006, T008/T009)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task (T013-T015 sequential)
- [x] Integration test covers full flow (T007)
- [x] Manual validation scenarios defined (T016-T020)

---

**Status**: Tasks ready for execution. Begin with T001-T002 (setup), then T003-T007 (tests), verify failures, then proceed to implementation.
