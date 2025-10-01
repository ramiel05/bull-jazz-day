# [PROJECT NAME] Development Guidelines

Auto-generated from all feature plans. Last updated: [DATE]

## Active Technologies
[EXTRACTED FROM ALL PLAN.MD FILES]

## Project Structure
```
[ACTUAL STRUCTURE FROM PLANS]
```

## Commands
[ONLY COMMANDS FOR ACTIVE TECHNOLOGIES]

## Code Style
*Based on Constitution v1.3.0 - See `.specify/memory/constitution.md`*

### Functional Patterns
- Prefer pure functions (no side effects)
- Use immutability over mutation
- Favor composition over inheritance
- Write declarative code over imperative

### Naming Conventions
- Use descriptive, unambiguous names
- No abbreviations except API, URL, ID
- Follow TypeScript/React conventions (camelCase for variables, PascalCase for components)
- Use kebab-case for file names

### Idiomatic Code
- Follow Next.js App Router conventions
- Use React patterns: hooks, composition, props
- Follow TypeScript best practices: type inference, discriminated unions
- No custom abstractions when framework provides solution

### Feature Co-location
- Organize by feature/domain: `features/[feature-name]/`
- Co-locate: components, hooks, types, tests
- Unit tests MUST be next to source files (e.g., `foo.ts` + `foo.test.ts`)
- Integration tests in dedicated test directories (cross-file boundaries)
- Cross-cutting concerns only in `/shared/` or `/lib/`

### Test-Driven Development
- Write tests BEFORE implementation
- Follow red-green-refactor cycle
- All public interfaces must have test coverage

### Explicit Failure with Invariants
- Use invariant checks for preconditions/postconditions
- Throw exceptions for error conditions (not void/null/empty)
- Use typed errors (Error subclasses or discriminated unions)

### Explicit Null Types
- Use empty strings/0/[] for valid empty states
- Use `| null` only for intentional absence
- Be expressive about absence semantics

## Recent Changes
[LAST 3 FEATURES AND WHAT THEY ADDED]

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->