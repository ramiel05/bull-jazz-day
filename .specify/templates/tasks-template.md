# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Feature co-location**: Organize by feature/domain (e.g., `features/user-profile/`)
- Co-locate related files: components, hooks, types, tests within feature directories
- **Shared code**: Only cross-cutting concerns in `/shared/` or `/lib/`
- **Next.js structure**: Follow App Router conventions (`app/`, `features/`, `shared/`)
- Paths must align with Feature Co-location principle from constitution

## Phase 3.1: Setup
- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
**Constitutional requirement (Principle II - NON-NEGOTIABLE)**
- [ ] T004 [P] Contract test POST /api/users in features/user/tests/contract/users-post.test.ts
- [ ] T005 [P] Contract test GET /api/users/{id} in features/user/tests/contract/users-get.test.ts
- [ ] T006 [P] Integration test user registration in features/user/tests/integration/registration.test.ts
- [ ] T007 [P] Integration test auth flow in features/auth/tests/integration/auth-flow.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T008 [P] User model in features/user/types/user.ts
- [ ] T009 [P] User service (pure functions) in features/user/services/user-service.ts
- [ ] T010 [P] User profile component in features/user/components/user-profile.tsx
- [ ] T011 POST /api/users route handler in app/api/users/route.ts
- [ ] T012 GET /api/users/[id] route handler in app/api/users/[id]/route.ts
- [ ] T013 Input validation (pure functions) in features/user/utils/validation.ts
- [ ] T014 Error handling utilities in shared/utils/errors.ts

## Phase 3.4: Integration
- [ ] T015 Connect UserService to DB
- [ ] T016 Auth middleware
- [ ] T017 Request/response logging
- [ ] T018 CORS and security headers

## Phase 3.5: Polish
- [ ] T019 [P] Unit tests for validation in features/user/tests/unit/validation.test.ts
- [ ] T020 Performance tests (<200ms)
- [ ] T021 [P] Update feature documentation in features/user/README.md
- [ ] T022 Refactor: Remove duplication, improve naming clarity
- [ ] T023 Run manual-testing.md

## Dependencies
- Tests (T004-T007) before implementation (T008-T014)
- T008 blocks T009, T015
- T016 blocks T018
- Implementation before polish (T019-T023)

## Parallel Example
```
# Launch T004-T007 together (different feature directories):
Task: "Contract test POST /api/users in features/user/tests/contract/users-post.test.ts"
Task: "Contract test GET /api/users/{id} in features/user/tests/contract/users-get.test.ts"
Task: "Integration test registration in features/user/tests/integration/registration.test.ts"
Task: "Integration test auth flow in features/auth/tests/integration/auth-flow.test.ts"
```

## Notes
- [P] tasks = different files/features, no dependencies
- Verify tests fail before implementing (TDD principle)
- Use pure functions and functional patterns where possible
- Follow feature co-location: group by feature, not technical role
- Commit after each task
- Avoid: vague tasks, same file conflicts, stateful classes

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task