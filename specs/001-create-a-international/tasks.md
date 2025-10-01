# Tasks: International Day Guessing Game

**Input**: Design documents from `/Users/ramiel/Projects/bull-jazz-day/specs/001-create-a-international/`
**Prerequisites**: plan.md, research.md, data-model.md

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Feature co-location**: Organize by feature/domain `src/features/day-guessing-game/`
- Co-locate related files: components, hooks, types, tests within feature directories
- **Next.js structure**: Follow App Router conventions (`src/app/`, `src/features/`)
- Paths must align with Feature Co-location principle from constitution

## Phase 3.1: Setup

- [ ] T001 Install testing dependencies: `pnpm add -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom @testing-library/user-event`
- [ ] T002 Create Vitest config file at `/Users/ramiel/Projects/bull-jazz-day/vitest.config.ts` with Next.js and TypeScript support, jsdom environment
- [ ] T003 Create feature directory structure at `/Users/ramiel/Projects/bull-jazz-day/src/features/day-guessing-game/` with subdirectories: components/, utils/, data/, types/, tests/{unit,integration,component}

## Phase 3.2: Types & Data

- [ ] T004 [P] Define InternationalDay type in `/Users/ramiel/Projects/bull-jazz-day/src/features/day-guessing-game/types/international-day.ts` with all fields: id, name, isReal, date, description, sourceUrl
- [ ] T005 [P] Define supporting types (GuessResult, GamePhase, GameState) in `/Users/ramiel/Projects/bull-jazz-day/src/features/day-guessing-game/types/game-types.ts`
- [ ] T006 Create days pool data in `/Users/ramiel/Projects/bull-jazz-day/src/features/day-guessing-game/data/days-pool.ts` with 10 real days and 10 fake days as readonly array
- [ ] T007 Write validation tests for days pool in `/Users/ramiel/Projects/bull-jazz-day/src/features/day-guessing-game/tests/unit/days-pool.test.ts` (validate structure, uniqueness, real/fake constraints)

## Phase 3.3: Pure Functions - TDD ⚠️ MUST COMPLETE BEFORE 3.4
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
**Constitutional requirement (Principle II - NON-NEGOTIABLE)**

- [ ] T008 [P] Write test for selectRandomDay in `/Users/ramiel/Projects/bull-jazz-day/src/features/day-guessing-game/tests/unit/select-random-day.test.ts` (test returns item from pool, handles empty pool)
- [ ] T009 Implement selectRandomDay function in `/Users/ramiel/Projects/bull-jazz-day/src/features/day-guessing-game/utils/select-random-day.ts` (pure function using Math.random)
- [ ] T010 [P] Write test for validateGuess in `/Users/ramiel/Projects/bull-jazz-day/src/features/day-guessing-game/tests/unit/validate-guess.test.ts` (test correct/incorrect scenarios for real and fake days)
- [ ] T011 Implement validateGuess function in `/Users/ramiel/Projects/bull-jazz-day/src/features/day-guessing-game/utils/validate-guess.ts` (pure function returning GuessResult)
- [ ] T012 Run all unit tests to verify they pass: `pnpm vitest run src/features/day-guessing-game/tests/unit/`

## Phase 3.4: Components - TDD ⚠️ MUST COMPLETE BEFORE 3.5
**CRITICAL: Component tests MUST be written and MUST FAIL before component implementation**
**Constitutional requirement (Principle II - NON-NEGOTIABLE)**

- [ ] T013 [P] Write test for DayDisplay component in `/Users/ramiel/Projects/bull-jazz-day/src/features/day-guessing-game/tests/component/day-display.test.tsx` (test renders day name prop correctly)
- [ ] T014 Implement DayDisplay component in `/Users/ramiel/Projects/bull-jazz-day/src/features/day-guessing-game/components/day-display.tsx` (Server Component, displays dayName prop with Tailwind styling)
- [ ] T015 [P] Write test for GuessButtons component in `/Users/ramiel/Projects/bull-jazz-day/src/features/day-guessing-game/tests/component/guess-buttons.test.tsx` (test button clicks call onGuess with correct boolean, disabled state)
- [ ] T016 Implement GuessButtons component in `/Users/ramiel/Projects/bull-jazz-day/src/features/day-guessing-game/components/guess-buttons.tsx` (Client Component with 'use client', Real/Fake buttons, onGuess callback)
- [ ] T017 [P] Write test for FeedbackPanel component in `/Users/ramiel/Projects/bull-jazz-day/src/features/day-guessing-game/tests/component/feedback-panel.test.tsx` (test displays correct/incorrect, shows day details, handles null date/sourceUrl, onContinue callback)
- [ ] T018 Implement FeedbackPanel component in `/Users/ramiel/Projects/bull-jazz-day/src/features/day-guessing-game/components/feedback-panel.tsx` (Client Component, displays GuessResult, shows date/description/sourceUrl conditionally, Continue button)
- [ ] T019 [P] Write test for GameContainer component in `/Users/ramiel/Projects/bull-jazz-day/src/features/day-guessing-game/tests/component/game-container.test.tsx` (test initial state, guess flow, continue flow, state transitions)
- [ ] T020 Implement GameContainer component in `/Users/ramiel/Projects/bull-jazz-day/src/features/day-guessing-game/components/game-container.tsx` (Client Component, useState for GameState, orchestrates child components, uses selectRandomDay and validateGuess)
- [ ] T021 Run all component tests to verify they pass: `pnpm vitest run src/features/day-guessing-game/tests/component/`

## Phase 3.5: Integration

- [ ] T022 Write integration test for full game flow in `/Users/ramiel/Projects/bull-jazz-day/src/features/day-guessing-game/tests/integration/game-flow.test.tsx` (test user can load game, make guess, see feedback, continue to next day, verify no state after conceptual refresh)
- [ ] T023 Update `/Users/ramiel/Projects/bull-jazz-day/src/app/page.tsx` to import and render GameContainer component (remove boilerplate)
- [ ] T024 Update metadata in `/Users/ramiel/Projects/bull-jazz-day/src/app/layout.tsx` (title: "International Day Guessing Game", description: "Guess whether international days are real or fake")
- [ ] T025 Run integration tests and verify all pass: `pnpm vitest run src/features/day-guessing-game/tests/integration/`
- [ ] T026 Run dev server (`pnpm dev`) and perform smoke test: verify game loads, can guess, see feedback, continue works

## Phase 3.6: Polish

- [ ] T027 [P] Accessibility audit: Add ARIA labels to buttons in GuessButtons and FeedbackPanel, ensure keyboard navigation works, test with Tab/Enter keys
- [ ] T028 [P] Add loading state handling to GameContainer if needed (though initial load should be instant with static data)
- [ ] T029 Run production build (`pnpm build`) and verify no TypeScript errors or build warnings
- [ ] T030 Run all tests suite: `pnpm vitest run` and ensure 100% pass rate
- [ ] T031 [P] Refactor: Review all files for naming consistency, remove any unused code, ensure proper TypeScript types (no `any`)
- [ ] T032 Performance validation: Run Lighthouse on production build (`pnpm build && pnpm start`), verify Performance score >90, accessibility score 100

## Dependencies

- Setup (T001-T003) must complete before all other phases
- Types (T004-T005) block all implementation tasks
- Data (T006-T007) blocks utils and components
- Pure function tests (T008, T010) must complete before implementations (T009, T011)
- T012 blocks component phase
- Component tests (T013, T015, T017, T019) must complete before implementations (T014, T016, T018, T020)
- T021 blocks integration phase
- Integration (T022-T026) blocks polish
- Polish tasks (T027-T032) can run after integration complete

## Parallel Execution Examples

```bash
# After T003 completes, run T004-T005 in parallel (different files):
# Task 1: Define InternationalDay type
# Task 2: Define supporting types

# After T007 completes, run T008 and T010 in parallel (different test files):
# Task 1: Write test for selectRandomDay
# Task 2: Write test for validateGuess

# After T012 completes, run T013, T015, T017, T019 in parallel (different test files):
# Task 1: Write test for DayDisplay
# Task 2: Write test for GuessButtons
# Task 3: Write test for FeedbackPanel
# Task 4: Write test for GameContainer

# After implementation complete, run T027, T028, T031 in parallel:
# Task 1: Accessibility audit
# Task 2: Add loading state
# Task 3: Refactor for consistency
```

## Notes

- [P] tasks = different files/features, no dependencies
- Verify tests FAIL before implementing (TDD principle - NON-NEGOTIABLE)
- Use pure functions and functional patterns where possible
- Follow feature co-location: group by feature, not technical role
- All components use descriptive names (no abbreviations)
- Client components MUST have 'use client' directive
- Server components have NO directive (default)
- Commit after completing each phase

## Validation Checklist

Before marking feature complete:
- [ ] All 32 tasks completed
- [ ] All tests passing (`pnpm vitest run`)
- [ ] Production build succeeds (`pnpm build`)
- [ ] Dev server runs without errors (`pnpm dev`)
- [ ] Game playable: load → guess → feedback → continue works
- [ ] Page refresh clears state (FR-011)
- [ ] Accessibility: keyboard navigation works
- [ ] Performance: Lighthouse score >90
- [ ] Code quality: No TypeScript errors, consistent naming
- [ ] Constitutional compliance: Functional patterns, TDD followed, feature co-located

---

**Task List Version**: 1.0
**Generated**: 2025-09-30
**Total Tasks**: 32
**Estimated Completion**: ~8-12 hours (with TDD workflow)