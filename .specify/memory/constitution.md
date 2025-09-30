<!--
Sync Impact Report
==================
Version: 1.0.0 (initial)
Date: 2025-09-30

Changes:
- Initial constitution establishment
- 5 core principles defined: Functional Patterns, TDD, Naming Conventions, Idiomatic Code, Feature Co-location
- Development Workflow section added
- Governance section established

Template Updates:
✅ plan-template.md - Constitution Check section references new principles
✅ spec-template.md - Aligned with TDD requirements
✅ tasks-template.md - Feature-based structure emphasis
✅ agent-file-template.md - Code style section added

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

Structure the codebase around features, not functionality types.

**Rules**:
- MUST organize files by feature/domain (e.g., `/features/user-profile/`)
- MUST co-locate related files (components, hooks, types, tests) within feature directories
- MUST NOT organize by technical role (e.g., avoid `/components/`, `/hooks/`, `/types/` at root)
- SHOULD keep feature directories self-contained and independently understandable
- MAY share truly cross-cutting concerns in `/shared/` or `/lib/`

**Rationale**: Feature co-location improves discoverability, reduces cognitive load when working on features, and makes it easier to reason about impact of changes. It also facilitates code ownership and module boundaries.

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

**Testing Strategy**:
- Unit tests: Pure functions, utilities, isolated components
- Integration tests: Feature workflows, API routes, data flows
- Contract tests: API interfaces, external integrations
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

**Version**: 1.0.0 | **Ratified**: 2025-09-30 | **Last Amended**: 2025-09-30