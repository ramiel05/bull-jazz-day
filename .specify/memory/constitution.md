<!--
Sync Impact Report
==================
Version: 1.2.0 → 1.3.0
Date: 2025-10-01

Changes:
- MINOR version bump: Expanded Principle V (Feature Co-location) with stricter test placement guidance
- Updated Principle V: Tests must be co-located directly next to source files (not in separate tests/ folders)
- Exception: Integration and higher-level tests remain in dedicated test directories (cross-file boundaries)
- Code Review Requirements updated to verify test file co-location

Modified Principles:
- V. Feature Co-location - Expanded with explicit test co-location requirements (unit tests next to source, integration tests in dedicated folders)

Added Sections:
- None (expanded existing principle)

Removed Sections:
- None

Template Updates:
✅ plan-template.md - Project Structure examples updated to show co-located test files
✅ spec-template.md - No changes required (principle-agnostic)
✅ tasks-template.md - Path examples updated to show co-located test placement

Follow-up TODOs: None
-->

# Bull Jazz Day Constitution

## Core Principles

### I. Functional Patterns

Prefer functional programming patterns over imperative or object-oriented approaches.

**Rules**:
- MUST use pure functions where possible (no side effects)
- MUST prefer immutability over mutation
- MUST use composition over inheritance
- SHOULD use declarative code over imperative
- MUST avoid stateful classes when functional alternatives exist

**Rationale**: Functional patterns improve testability, reduce bugs from shared mutable state, and align with React/Next.js best practices.

### II. Test-Driven Development (NON-NEGOTIABLE)

Test-Driven Development is mandatory for all feature work.

**Rules**:
- MUST write tests before implementation
- MUST follow red-green-refactor cycle strictly:
  1. Write failing test (RED)
  2. User approves test coverage
  3. Implement minimal code to pass (GREEN)
  4. Refactor with tests passing (REFACTOR)
- MUST NOT skip to implementation without failing tests
- MUST have tests for all public interfaces and user-facing functionality

**Rationale**: TDD ensures requirements are understood before coding, catches regressions early, and produces better-designed, more maintainable code. This principle is non-negotiable as it fundamentally affects code quality and project maintainability.

### III. Naming Conventions

Consistent and clear naming conventions take precedence over clever or concise alternatives.

**Rules**:
- MUST use descriptive, unambiguous names
- MUST NOT use abbreviations unless universally understood (e.g., API, URL, ID)
- MUST NOT use clever wordplay or puns in production code
- SHOULD use full words over shortened forms (e.g., `getUserProfile` not `getUsrProf`)
- MUST follow language/framework conventions (camelCase for JS/TS, kebab-case for files)

**Rationale**: Code is read far more than written. Clear naming reduces onboarding time, minimizes misunderstandings, and makes code self-documenting.

### IV. Idiomatic Code

Favour idiomatic code patterns and naming conventions over custom abstractions.

**Rules**:
- MUST follow Next.js App Router conventions (Server Components, RSC patterns)
- MUST use React idioms (hooks, composition, props)
- MUST follow TypeScript best practices (type inference, discriminated unions)
- SHOULD use established patterns from framework documentation
- MUST NOT create custom abstractions when framework provides idiomatic solution

**Rationale**: Idiomatic code is immediately recognizable to developers familiar with the framework, easier to maintain, and benefits from community best practices and tooling.

### V. Feature Co-location

Structure the codebase around features, not functionality types, with maximum co-location of related files.

**Rules**:
- MUST organize files by feature/domain (e.g., `/features/user-profile/`)
- MUST co-locate related files (components, hooks, types, tests) within feature directories
- MUST NOT organize by technical role (e.g., avoid `/components/`, `/hooks/`, `/types/` at root)
- SHOULD keep feature directories self-contained and independently understandable
- MAY share truly cross-cutting concerns in `/shared/` or `/lib/`

**Test Co-location**:
- MUST place unit test files directly next to the files they test (e.g., `user-service.ts` and `user-service.test.ts` in same directory)
- MUST NOT create separate `tests/` folders within features for unit tests
- MUST place integration tests (and higher in testing pyramid) in dedicated test directories since they test across file boundaries
- Examples:
  - ✅ `features/user/services/user-service.ts` + `features/user/services/user-service.test.ts`
  - ✅ `features/user/components/user-profile.tsx` + `features/user/components/user-profile.test.tsx`
  - ✅ `features/user/tests/integration/registration-flow.test.ts` (integration test)
  - ❌ `features/user/tests/unit/user-service.test.ts` (unit test in separate folder)

**Rationale**: Maximum co-location improves discoverability, reduces cognitive load when working on features, and makes it immediately obvious which tests cover which code. Unit tests belong next to their source files; integration tests belong in dedicated folders since they verify cross-file interactions. This facilitates code ownership, makes refactoring safer, and reduces navigation overhead.

### VI. Explicit Failure with Invariants

Prefer invariants that throw exceptions over silent failures for **error conditions**.

**Rules**:
- MUST use invariant checks to validate preconditions and postconditions
- MUST throw exceptions when invariants are violated (error conditions)
- MUST NOT return void, null, empty strings, or sentinel values **to indicate errors**
- MUST NOT silently swallow exceptions or errors
- SHOULD use typed errors (Error subclasses or discriminated unions) for error cases
- MUST ensure failures are observable and debuggable

**Rationale**: Silent failures lead to unexpected states that propagate through the system, making bugs harder to track and debug. Explicit failures via invariants fail fast at the point of violation, making issues immediately visible and preventing dependents from receiving invalid state. This improves system reliability and developer experience.

**Note**: This principle applies to **error conditions**. For valid empty/default states, see Principle VII.

### VII. Explicit Null Types

Distinguish between empty/default states and intentional absence using explicit type design.

**Rules**:
- MUST use empty strings (`""`), zero (`0`), empty arrays (`[]`), or other falsey values of the appropriate type for valid default or empty states
- MUST use explicit `| null` union types to represent intentional absence or "not yet set"
- MUST NOT use `null` for empty states that are valid values of the base type
- SHOULD make absence/presence semantics clear in type definitions
- MUST be intentional and expressive about when `null` represents meaningful absence

**Examples**:
- ✅ `name: string` with default `""` for an optional-but-set name
- ✅ `count: number` with default `0` for a count that starts at zero
- ✅ `selectedItem: Item | null` when nothing is selected (intentional absence)
- ❌ `name: string | null` when empty string would suffice
- ❌ Using `null` as a default when `""` or `0` communicates empty state

**Rationale**: Using typed empty values (empty strings, zeros) for defaults reduces null-checking ceremony and makes valid empty states explicit. Reserving `null` for intentional absence makes the type system more expressive and prevents confusion between "empty but valid" and "not provided/not applicable". This improves type safety and makes data flow more predictable.

## Development Workflow

**Red-Green-Refactor Cycle**:
1. **Red**: Write a failing test that defines desired behavior
2. **Approval**: Review test with team/stakeholders to confirm requirements
3. **Green**: Write minimal code to make test pass
4. **Refactor**: Improve code quality while keeping tests green
5. **Repeat**: Continue cycle for next piece of functionality

**Code Review Requirements**:
- All PRs MUST include tests written before implementation
- Reviewers MUST verify TDD cycle was followed
- Reviewers MUST check for functional patterns and idiomatic code
- Reviewers MUST verify feature co-location structure
- Reviewers MUST verify unit tests are co-located next to source files (not in separate test folders)
- Reviewers MUST verify integration tests are in dedicated test directories
- Reviewers MUST verify invariants are used for error conditions (not silent failures)
- Reviewers MUST verify explicit null type usage (null for absence, not for empty defaults)

**Testing Strategy**:
- Unit tests: Pure functions, utilities, isolated components (co-located with source)
- Integration tests: Feature workflows, API routes, data flows (dedicated test directories)
- Contract tests: API interfaces, external integrations (dedicated test directories)
- E2E tests: Critical user journeys (minimal, high-value only)

## Governance

**Amendment Process**:
- Constitution changes require team consensus
- Amendments MUST include rationale and migration plan
- Version MUST be incremented per semantic versioning:
  - MAJOR: Breaking governance changes, principle removals
  - MINOR: New principles, section additions
  - PATCH: Clarifications, wording improvements
- All dependent templates MUST be updated before ratification

**Compliance Review**:
- All PRs MUST be evaluated against constitutional principles
- Violations MUST be justified in PR description or corrected
- Plan phase (/plan command) MUST include Constitution Check section
- Complexity deviations MUST be documented and reviewed

**Versioning Policy**:
- Constitution version tracked in this document footer
- All templates reference constitution version at bottom
- Breaking changes require migration guide

**Enforcement**:
- This constitution supersedes all other coding practices and guidelines
- Automated checks SHOULD enforce principles where possible (linting, CI)
- Manual review MUST verify adherence during code review
- Principle violations block PR merge unless explicitly justified and approved

**Version**: 1.3.0 | **Ratified**: 2025-09-30 | **Last Amended**: 2025-10-01
