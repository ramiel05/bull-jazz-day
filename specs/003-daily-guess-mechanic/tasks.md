# Tasks: Daily Guess Mechanic

**Input**: Design documents from `/specs/003-daily-guess-mechanic/`
**Prerequisites**: plan.md, research.md, data-model.md, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → research.md: Extract decisions → setup tasks
   → quickstart.md: Extract scenarios → integration test tasks
3. Generate tasks by category:
   → Setup: data types, utilities
   → Tests: unit tests, integration tests (TDD)
   → Core: daily challenge logic, storage, hooks
   → Integration: UI components, game flow
   → Polish: data expansion, performance validation
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All entities have types?
   → All utilities have tests?
   → All integration scenarios covered?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Feature co-location**: `src/features/day-guessing-game/`
- **Daily challenge logic**: `src/features/day-guessing-game/daily-challenge/`
- Co-locate related files: components, hooks, types, tests within feature directories
- **Test co-location**: Unit tests MUST be placed directly next to source files (e.g., `foo.ts` + `foo.test.ts`)
- **Integration tests**: Place in `src/features/day-guessing-game/tests/integration/`
- Paths must align with Feature Co-location principle from constitution

## Phase 3.1: Data Types & Research
- [X] T001 [P] Update InternationalDay type to include `date: string | null` field (MM-DD format) in src/features/day-guessing-game/types/international-day.ts
- [X] T002 [P] Create DailyGameState and DailyChallenge types in src/features/day-guessing-game/types/daily-types.ts
- [X] T003 [P] Research and add 100 real UN/UNESCO international days to src/features/day-guessing-game/data/days-pool.ts (with MM-DD dates)
- [X] T004 [P] Research and add 100 fake international days to src/features/day-guessing-game/data/days-pool.ts (with null dates)

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
**Constitutional requirement (Principle II - NON-NEGOTIABLE)**
- [X] T005 [P] Unit test for xmur3 hash function in src/features/day-guessing-game/daily-challenge/utils/deterministic-random.test.ts
- [X] T006 [P] Unit test for mulberry32 PRNG in src/features/day-guessing-game/daily-challenge/utils/deterministic-random.test.ts
- [X] T007 [P] Unit test for getCurrentLocalDate in src/features/day-guessing-game/daily-challenge/utils/timezone-utils.test.ts
- [X] T008 [P] Unit test for getDailyChallenge in src/features/day-guessing-game/daily-challenge/utils/get-daily-challenge.test.ts
- [X] T009 [P] Unit test for localStorage wrapper getDailyState in src/features/day-guessing-game/daily-challenge/storage/daily-state-storage.test.ts
- [X] T010 [P] Unit test for localStorage wrapper saveDailyState in src/features/day-guessing-game/daily-challenge/storage/daily-state-storage.test.ts
- [X] T011 [P] Unit test for useDailyState hook in src/features/day-guessing-game/daily-challenge/hooks/use-daily-state.test.ts
- [X] T012 [P] Integration test for daily challenge flow (new day → guess → revisit same day) in src/features/day-guessing-game/tests/integration/daily-flow.test.tsx
- [X] T013 [P] Integration test for determinism (same date produces same challenge) in src/features/day-guessing-game/tests/integration/daily-flow.test.tsx
- [X] T014 [P] Integration test for day transition (midnight boundary) in src/features/day-guessing-game/tests/integration/daily-flow.test.tsx
- [X] T014a [P] Unit test for countdown timer component in src/features/day-guessing-game/components/countdown-timer.test.tsx

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [X] T015 [P] Implement xmur3 hash function in src/features/day-guessing-game/daily-challenge/utils/deterministic-random.ts
- [X] T016 [P] Implement mulberry32 PRNG in src/features/day-guessing-game/daily-challenge/utils/deterministic-random.ts
- [X] T017 [P] Implement getCurrentLocalDate using Intl.DateTimeFormat('sv-SE') in src/features/day-guessing-game/daily-challenge/utils/timezone-utils.ts
- [X] T018 Implement getDailyChallenge logic (date-seeded random selection) in src/features/day-guessing-game/daily-challenge/utils/get-daily-challenge.ts (depends on T015, T016, T017)
- [X] T019 [P] Implement localStorage wrapper getDailyState in src/features/day-guessing-game/daily-challenge/storage/daily-state-storage.ts
- [X] T020 [P] Implement localStorage wrapper saveDailyState in src/features/day-guessing-game/daily-challenge/storage/daily-state-storage.ts
- [X] T021 Implement useDailyState hook in src/features/day-guessing-game/daily-challenge/hooks/use-daily-state.ts (depends on T018, T019, T020)

## Phase 3.4: UI Integration
- [X] T022 Update GameContainer to use useDailyState and show daily challenge in src/features/day-guessing-game/components/game-container.tsx (depends on T021)
- [X] T023 Update day-display to show "Today is [Day Name]" prompt in src/features/day-guessing-game/components/day-display.tsx
- [X] T024 Update FeedbackPanel to include "Come back tomorrow" message in src/features/day-guessing-game/components/feedback-panel.tsx
- [X] T024b Implement countdown timer component in HH:MM:SS format that updates every second until midnight local time in src/features/day-guessing-game/components/countdown-timer.tsx (depends on T014a)
- [X] T024c Integrate countdown timer into FeedbackPanel in src/features/day-guessing-game/components/feedback-panel.tsx (depends on T024b)
- [X] T025 Update game-container.test.tsx unit test for daily mode behavior in src/features/day-guessing-game/components/game-container.test.tsx

## Phase 3.5: Polish & Validation
- [X] T026 [P] Validate days-pool.ts has at least 100 real days with valid MM-DD dates in src/features/day-guessing-game/data/days-pool.test.ts
- [X] T027 [P] Validate days-pool.ts has at least 100 fake days with null dates in src/features/day-guessing-game/data/days-pool.test.ts
- [X] T028 [P] Performance test: daily challenge selection < 10ms in src/features/day-guessing-game/tests/integration/daily-flow.test.tsx
- [X] T029 [P] Edge case test: localStorage disabled/corrupted in src/features/day-guessing-game/daily-challenge/storage/daily-state-storage.test.ts
- [X] T030 [P] Edge case test: no real day for current date (fallback to fake) in src/features/day-guessing-game/daily-challenge/utils/get-daily-challenge.test.ts
- [ ] T031 Manual testing following quickstart.md scenarios (all 6 test scenarios from quickstart)

## Dependencies
- Data types (T001-T004) before all other tasks
- Tests (T005-T014a) before implementation (T015-T021)
- T015, T016 (random functions) before T018 (daily challenge)
- T017 (timezone utils) before T018 (daily challenge)
- T018 (daily challenge) before T021 (hook)
- T019, T020 (storage) before T021 (hook)
- T021 (hook) before T022 (UI integration)
- T014a (countdown timer test) before T024b (countdown timer implementation)
- T024b (countdown timer) before T024c (integration)
- T022 (GameContainer) before T025 (GameContainer test)
- Implementation (T015-T024c) before polish (T026-T031)

## Parallel Example
```
# Launch T005-T014a together (different test files):
Task: "Unit test for xmur3 hash function in src/features/day-guessing-game/daily-challenge/utils/deterministic-random.test.ts"
Task: "Unit test for mulberry32 PRNG in src/features/day-guessing-game/daily-challenge/utils/deterministic-random.test.ts"
Task: "Unit test for getCurrentLocalDate in src/features/day-guessing-game/daily-challenge/utils/timezone-utils.test.ts"
Task: "Unit test for getDailyChallenge in src/features/day-guessing-game/daily-challenge/utils/get-daily-challenge.test.ts"
Task: "Unit test for localStorage wrapper getDailyState in src/features/day-guessing-game/daily-challenge/storage/daily-state-storage.test.ts"
Task: "Unit test for localStorage wrapper saveDailyState in src/features/day-guessing-game/daily-challenge/storage/daily-state-storage.test.ts"
Task: "Unit test for useDailyState hook in src/features/day-guessing-game/daily-challenge/hooks/use-daily-state.test.ts"
Task: "Integration test for daily challenge flow in src/features/day-guessing-game/tests/integration/daily-flow.test.tsx"
Task: "Unit test for countdown timer component in src/features/day-guessing-game/components/countdown-timer.test.tsx"
```

## Notes
- [P] tasks = different files/features, no dependencies
- Verify tests fail before implementing (TDD principle)
- Use pure functions for deterministic-random, timezone-utils, get-daily-challenge
- Follow feature co-location: all daily challenge code in `src/features/day-guessing-game/daily-challenge/`
- Co-locate unit tests next to source files (e.g., `foo.ts` + `foo.test.ts`)
- Place integration tests in `src/features/day-guessing-game/tests/integration/`
- Integration tests MUST use real user interactions (button clicks, form inputs), NOT manual hook manipulation
- Integration tests MUST NOT duplicate unit test logic or test isolated units
- Use invariants for error conditions: throw exceptions, not void/null/empty returns
- Use explicit null types: empty string/0 for defaults, `| null` for intentional absence
- Commit after each task or logical group of tasks
- Avoid: vague tasks, same file conflicts, stateful classes, silent failures, null for empty defaults, separate unit test folders, renderHook() in integration tests

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All entities (DailyGameState, DailyChallenge, InternationalDay extension) have type tasks
- [x] All utilities (deterministic-random, timezone-utils, get-daily-challenge, storage) have tests
- [x] All tests come before implementation
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Integration test scenarios from quickstart.md covered (T012, T013, T014, T031)
- [x] Data expansion tasks (100 total real + 100 total fake days) included (T003, T004, T026, T027)
