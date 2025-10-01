# Implementation Plan: International Day Guessing Game

**Branch**: `001-create-a-international` | **Date**: 2025-09-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/ramiel/Projects/bull-jazz-day/specs/001-create-a-international/spec.md`

## Summary

Build a web-based guessing game where visitors are shown international day names (mix of real and fabricated) and guess whether each is real or fake. After guessing, the system provides immediate feedback along with educational context (date, description, source link for real days). The game supports infinite play with a starter pool of 10-20 days, uses no persistence (fresh state on refresh), and follows functional programming patterns with mandatory TDD.

**Technical Approach**: Next.js 15 App Router with TypeScript, React Server Components + Client Components hybrid, Tailwind CSS, pure functional game logic, static data pool, client-side state management with useState.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode), React 19.1.0, Next.js 15.5.4
**Primary Dependencies**: react, react-dom, next, tailwindcss (all installed)
**Storage**: N/A (client-only, no persistence per FR-011)
**Testing**: Vitest + React Testing Library (to be added)
**Target Platform**: Web browsers (modern, ES2017+)
**Project Type**: Single project (Next.js App Router)
**Performance Goals**: <100ms guess validation, <2s initial load, 60fps interactions
**Constraints**: No backend/database, no state persistence, client-side only, 10-20 day pool for MVP
**Scale/Scope**: Single-page application, 10-20 international days, unlimited gameplay sessions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Initial Check (Pre-Research)

**I. Functional Patterns**:
- [x] Feature design favors pure functions and immutability
  - `selectRandomDay()`, `validateGuess()` are pure functions
  - Readonly days pool, no mutations
- [x] No stateful classes where functional alternatives exist
  - React functional components only
  - No class components
- [x] Composition used over inheritance
  - Component composition pattern (GameContainer → child components)

**II. Test-Driven Development (NON-NEGOTIABLE)**:
- [x] Tests will be written BEFORE implementation
  - Unit tests for pure functions first
  - Component tests before component implementation
- [x] Red-green-refactor cycle planned in Phase 2
  - Detailed in tasks.md generation approach below
- [x] All public interfaces will have test coverage
  - All utility functions, all components, full game flow

**III. Naming Conventions**:
- [x] All entities, functions, and components use descriptive names
  - `InternationalDay`, `selectRandomDay`, `GameContainer`, `FeedbackPanel`
- [x] No abbreviations except universally understood (API, URL, ID)
  - Using `URL` in sourceUrl, `ID` in id field only
- [x] Naming follows TypeScript/React conventions
  - camelCase for functions/variables, PascalCase for components/types

**IV. Idiomatic Code**:
- [x] Design follows Next.js App Router conventions
  - App Router structure, Server Components default, Client Components marked
- [x] React patterns (hooks, composition) used appropriately
  - useState for local state, props for composition
- [x] No custom abstractions where framework provides solution
  - Using built-in Next.js, React, TypeScript features only

**V. Feature Co-location**:
- [x] Files organized by feature/domain, not technical role
  - `src/features/day-guessing-game/` contains all game code
- [x] Related code (components, hooks, types, tests) co-located
  - All game code in single feature directory
- [x] Only truly cross-cutting concerns in /shared or /lib
  - No shared code needed for MVP (self-contained feature)

**Violations**: None

### Post-Design Check

**I. Functional Patterns**:
- [x] Data model uses immutable structures (readonly arrays)
- [x] All game logic in pure functions
- [x] React components are functional, not class-based

**II. Test-Driven Development (NON-NEGOTIABLE)**:
- [x] Test files structured before implementation files
- [x] Unit → Integration → Component test order planned

**III. Naming Conventions**:
- [x] Type names clear: `InternationalDay`, `GuessResult`, `GamePhase`
- [x] Function names descriptive: `selectRandomDay`, `validateGuess`

**IV. Idiomatic Code**:
- [x] Server/Client Component split idiomatic
- [x] TypeScript discriminated unions for game phases
- [x] Tailwind CSS (existing project standard)

**V. Feature Co-location**:
- [x] Directory structure follows feature co-location principle
- [x] Tests co-located within feature directory

**Violations**: None

## Project Structure

### Documentation (this feature)
```
specs/001-create-a-international/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output ✓
├── data-model.md        # Phase 1 output ✓
├── quickstart.md        # Phase 1 output ✓
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── app/
│   ├── layout.tsx                 # Existing (update metadata)
│   ├── page.tsx                   # Replace with GameContainer import
│   └── globals.css                # Existing (keep as is)
└── features/
    └── day-guessing-game/
        ├── components/
        │   ├── game-container.tsx      # Main orchestrator (Client Component)
        │   ├── day-display.tsx          # Shows current day name (Server Component)
        │   ├── guess-buttons.tsx        # Real/Fake buttons (Client Component)
        │   └── feedback-panel.tsx       # Result + details (Client Component)
        ├── utils/
        │   ├── select-random-day.ts     # Pure function: random selection
        │   ├── validate-guess.ts        # Pure function: guess validation
        │   └── shuffle-array.ts         # Pure function: array shuffle (if needed)
        ├── data/
        │   └── days-pool.ts             # 10-20 InternationalDay objects
        ├── types/
        │   └── international-day.ts     # Type definitions
        └── tests/
            ├── unit/
            │   ├── select-random-day.test.ts
            │   ├── validate-guess.test.ts
            │   └── days-pool.test.ts
            ├── integration/
            │   └── game-flow.test.ts
            └── component/
                ├── game-container.test.tsx
                ├── guess-buttons.test.tsx
                └── feedback-panel.test.tsx
```

**Structure Decision**: Feature co-location pattern. All game-related code lives under `src/features/day-guessing-game/`. No separate `components/`, `utils/`, `types/` at root level. This follows constitutional principle V (Feature Co-location) and makes the codebase easier to navigate and maintain.

## Phase 0: Outline & Research

✅ **Research Complete** - See [research.md](./research.md)

### Key Decisions Made

1. **Data Storage**: Static TypeScript const array (no DB needed for MVP 10-20 days)
2. **State Management**: React useState (component-level, no global state)
3. **Randomization**: Math.random() with array operations (sufficient for game)
4. **Testing Framework**: Vitest + React Testing Library (fast, Next.js compatible)
5. **Component Architecture**: Server/Client Component hybrid for performance
6. **Styling**: Tailwind CSS 4 (already configured)
7. **Type Safety**: Discriminated unions for game phases
8. **Performance**: Client-side rendering, no optimization needed for MVP scale

### Dependencies to Add

Testing infrastructure only:
- vitest
- @testing-library/react
- @testing-library/jest-dom
- @vitejs/plugin-react

All runtime functionality uses existing dependencies.

## Phase 1: Design & Contracts

✅ **Design Complete** - See artifacts below

### Data Model

**Output**: [data-model.md](./data-model.md)

**Core Entity**: `InternationalDay`
```typescript
type InternationalDay = {
  id: string;               // Unique identifier
  name: string;             // Display name ("International Women's Day")
  isReal: boolean;          // Ground truth for validation
  date: string | null;      // "March 8" or null for fake days
  description: string;      // Brief context (1-3 sentences)
  sourceUrl: string | null; // Wikipedia/UN link or null for fake
};
```

**Pool Structure**: `ReadonlyArray<InternationalDay>` (10-20 items for MVP)

**Validation**: Business rules ensure fake days have null date/sourceUrl, real days have both populated.

### API Contracts

**No external APIs** for MVP (client-only game).

**Internal Function Contracts**:

```typescript
// Game logic (pure functions)
function selectRandomDay(pool: readonly InternationalDay[]): InternationalDay;
function validateGuess(day: InternationalDay, guessedReal: boolean): GuessResult;

// Types
type GuessResult = { correct: boolean; day: InternationalDay };
type GamePhase = 'guessing' | 'feedback';
type GameState = {
  currentDay: InternationalDay;
  phase: GamePhase;
  lastResult: GuessResult | null;
};
```

**Component Contracts**:

```typescript
// GameContainer (Client Component)
- Props: none (root component)
- State: GameState
- Events: onGuess(guessedReal: boolean), onContinue()

// GuessingButtons (Client Component)
- Props: { onGuess: (guessedReal: boolean) => void; disabled: boolean }
- Events: onClick (Real/Fake)

// FeedbackPanel (Client Component)
- Props: { result: GuessResult; onContinue: () => void }
- Displays: correct/incorrect, date, description, sourceUrl

// DayDisplay (Server Component)
- Props: { dayName: string }
- Displays: Day name in clean typography
```

### Contract Tests

**Test Strategy**:
1. Unit tests validate pure functions match contracts
2. Component tests validate props/events interface
3. Integration tests validate full game flow

**Test Files** (to be created in `/tasks`):
- `tests/unit/select-random-day.test.ts`: Validates randomSelection contract
- `tests/unit/validate-guess.test.ts`: Validates validation contract
- `tests/component/game-container.test.tsx`: Validates state management
- `tests/integration/game-flow.test.ts`: Validates end-to-end flow

### Quickstart Guide

**Output**: [quickstart.md](./quickstart.md)

**Manual Testing Scenarios**:
1. Initial load → day displayed with buttons
2. Correct guess (real) → feedback with date/description/link
3. Incorrect guess (real guessed fake) → educational feedback
4. Correct guess (fake) → confirmation with no date/link
5. Incorrect guess (fake guessed real) → friendly correction
6. Continue to next day → state resets, new day appears
7. Multiple rounds → randomization and infinite play
8. Page refresh → state clears (FR-011 validation)
9. Responsive design → works on mobile/tablet/desktop
10. Accessibility → keyboard/screen reader support

**Performance Benchmarks**:
- Lighthouse score: >90
- First Contentful Paint: <1.5s
- Guess validation: <10ms
- State transition: <16ms (60fps)

### Agent Context Update

Agent-specific file will be created/updated with:
- Next.js 15 App Router context
- TypeScript strict mode settings
- Tailwind CSS usage
- Feature co-location structure
- TDD workflow for this feature

**Note**: CLAUDE.md update will be handled in Phase 1 completion per template requirements.

## Phase 2: Task Planning Approach

*This section describes what the /tasks command will do - DO NOT execute during /plan*

### Task Generation Strategy

**Input Sources**:
1. Data model from data-model.md (InternationalDay type)
2. Function contracts from this plan
3. Component hierarchy from project structure
4. Acceptance scenarios from spec.md
5. Quickstart test cases from quickstart.md

**Task Categories**:

1. **Setup** (3 tasks):
   - Install test dependencies (Vitest, RTL)
   - Configure Vitest for Next.js
   - Create feature directory structure

2. **Data & Types** (3 tasks, parallel):
   - Define InternationalDay type
   - Create days pool data (10-20 items)
   - Write pool validation tests

3. **Pure Functions - TDD** (6 tasks, test-first):
   - Write tests for selectRandomDay → implement
   - Write tests for validateGuess → implement
   - Write tests for pool validation → implement

4. **Components - TDD** (12 tasks, test-first):
   - Write tests for DayDisplay → implement
   - Write tests for GuessButtons → implement
   - Write tests for FeedbackPanel → implement
   - Write tests for GameContainer → implement

5. **Integration** (4 tasks):
   - Integration test for full game flow
   - Update app/page.tsx to import GameContainer
   - Update app/layout.tsx metadata
   - Verify quickstart scenarios pass

6. **Polish** (3 tasks):
   - Refactor for naming consistency
   - Accessibility review (ARIA labels, keyboard nav)
   - Performance validation (Lighthouse)

**Task Ordering Principles**:
1. **TDD Order**: Test file before implementation file
2. **Dependency Order**: Types → Data → Utils → Components → Integration
3. **Parallel Markers [P]**: Different files = can run parallel
4. **Constitutional Requirement**: Red-Green-Refactor strictly followed

**Estimated Task Count**: ~30 numbered tasks

**File Path Examples**:
- `src/features/day-guessing-game/tests/unit/select-random-day.test.ts`
- `src/features/day-guessing-game/utils/select-random-day.ts`
- `src/features/day-guessing-game/components/game-container.tsx`

### Dependencies Graph

```
Setup
  ↓
Types & Data (parallel)
  ↓
Pure Functions Tests → Pure Functions Implementation
  ↓
Component Tests → Component Implementation
  ↓
Integration Tests → Page Integration
  ↓
Polish & Refactor
```

### Parallel Execution Opportunities

**Can run in parallel** (mark [P]):
- All type definitions
- All test file creations (before implementation)
- All pure function implementations (after tests)
- All component implementations (after tests, if independent)

**Must be sequential**:
- Test → Implementation (TDD requirement)
- Types → Functions using types
- Utils → Components using utils
- Components → Page integration

## Phase 3+: Future Implementation

*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following TDD principles)
**Phase 5**: Validation (run quickstart.md, verify all acceptance criteria)

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

**No violations** - Constitution fully adhered to.

## Progress Tracking

*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning approach described (/plan command)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved (via /clarify command)
- [x] Complexity deviations documented (none exist)

**Artifacts Generated**:
- [x] research.md
- [x] data-model.md
- [x] quickstart.md
- [x] plan.md (this file)
- [ ] CLAUDE.md (agent context - to be updated)
- [ ] tasks.md (by /tasks command)

---

**Plan Status**: ✅ COMPLETE - Ready for `/tasks` command

*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*