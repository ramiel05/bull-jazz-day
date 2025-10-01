# Research: International Day Guessing Game

**Feature**: 001-create-a-international
**Date**: 2025-09-30

## Technical Context Discovery

### Existing Technology Stack

**Language & Runtime**:
- TypeScript 5 (strict mode enabled)
- Node.js 20+ (via Next.js requirement)
- ES2017 target, ESNext modules

**Framework & Libraries**:
- Next.js 15.5.4 (App Router with Turbopack)
- React 19.1.0 (with React DOM)
- Tailwind CSS 4 (with PostCSS plugin)

**Tooling**:
- ESLint 9 with Next.js config
- TypeScript path alias: `~/` → `./src/`
- pnpm as package manager

**Project Structure**:
- App Router structure: `src/app/` directory
- TypeScript configured for strict type checking
- Geist fonts (Sans & Mono) already imported

## Technical Decisions

### 1. Data Storage Strategy

**Decision**: Static TypeScript constant array
**Rationale**:
- MVP scope: 10-20 days total (5-10 real, 5-10 fake)
- No persistence requirement (FR-011: no state across refreshes)
- No backend/database needed for static content
- Type-safe with TypeScript interfaces
- Easy to expand later to JSON/API if needed

**Alternatives Considered**:
- JSON file: Adds unnecessary I/O for small dataset
- Database: Overkill for static reference data
- API endpoint: Not needed for client-only game

**Implementation**: `src/features/day-guessing-game/data/days-pool.ts`

### 2. State Management

**Decision**: React useState (component-level)
**Rationale**:
- Simple game state (current day, game phase)
- Single-page, single-feature scope
- No state sharing across components deep in tree
- Aligns with React 19 idioms
- Constitutional principle: avoid stateful classes

**Alternatives Considered**:
- Context API: Not needed, no prop drilling
- Zustand/Redux: Overkill for simple local state
- Server state: Contradicts "no persistence" requirement

**Implementation**: State in `GameContainer` component, passed via props

### 3. Randomization Strategy

**Decision**: `Math.random()` with array shuffling
**Rationale**:
- Sufficient randomness for game purposes
- No cryptographic security needed
- Simple, deterministic, testable
- Compatible with React Server Components

**Alternatives Considered**:
- `crypto.getRandomValues()`: Overkill for non-security use case
- Server-side random: Contradicts client-only architecture

**Implementation**: Pure function `selectRandomDay(pool: InternationalDay[]): InternationalDay`

### 4. Testing Framework

**Decision**: Vitest + React Testing Library
**Rationale**:
- Vitest: Fast, modern, ESM-native, excellent TypeScript support
- RTL: React idioms, testing library standard
- Next.js compatible (better than Jest for ESM)
- Supports component + integration tests
- Constitutional requirement: TDD mandatory

**Alternatives Considered**:
- Jest: Slower, ESM configuration complex
- Playwright only: Need unit tests for pure functions

**Implementation**: Add to `package.json` devDependencies

### 5. Component Architecture

**Decision**: React Server Components + Client Components hybrid
**Rationale**:
- Static content (day pool) can be server-rendered
- Interactive elements (buttons, feedback) need client state
- Next.js 15 default: Server Components
- Performance benefit: smaller client bundle

**Component Breakdown**:
- `GameContainer`: Client Component (manages state)
- `DayDisplay`: Server Component (static rendering)
- `GuessButtons`: Client Component (interaction)
- `FeedbackPanel`: Client Component (conditional rendering)

**Alternatives Considered**:
- All client components: Misses Next.js optimization
- All server components: Can't have interaction

### 6. Styling Approach

**Decision**: Tailwind CSS 4 (existing setup)
**Rationale**:
- Already configured in project
- Constitutional principle: use idiomatic, existing solutions
- Rapid prototyping for simple UI
- No custom CSS needed

**Alternatives Considered**:
- CSS Modules: Tailwind already set up
- Styled Components: Not installed, adds bundle size

### 7. Type Safety Strategy

**Decision**: Discriminated union for game phases
**Rationale**:
- Type-safe state transitions
- TypeScript best practice (constitutional principle)
- Clear game flow: `'guessing' | 'feedback'`
- Compile-time guarantees

**Type Structure**:
```typescript
type GamePhase = 'guessing' | 'feedback';
type GuessResult = { correct: boolean; day: InternationalDay };
```

### 8. Performance Considerations

**Decision**: Client-side rendering, no optimization needed for MVP
**Rationale**:
- Small data set (10-20 items)
- Simple interactions (<100ms target easily met)
- No expensive computations
- Can optimize later if needed

**Measurements**:
- Array lookup: O(1)
- Random selection: O(n) for shuffle, acceptable for n=20
- React render: <16ms for simple components

## Dependencies to Add

### Testing (TDD requirement)

```json
{
  "vitest": "^2.0.0",
  "@testing-library/react": "^16.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "@vitejs/plugin-react": "^4.0.0"
}
```

### No Runtime Dependencies Needed
All functionality achievable with existing React, Next.js, TypeScript

## Best Practices Research

### Next.js App Router Patterns

**File Conventions**:
- `page.tsx`: Route page component
- `layout.tsx`: Shared layout (already exists)
- Client components: `'use client'` directive at top
- Server components: Default (no directive)

**Metadata**:
- Update `layout.tsx` metadata for game title/description
- Add Open Graph tags for sharing (future enhancement)

### React 19 Idioms

**Hooks Usage**:
- `useState` for local state
- `useCallback` for stable function references (if needed)
- No `useEffect` needed (event-driven, no side effects)

**Component Composition**:
- Props for configuration
- Composition over complex state management
- Pure functional components where possible

### TypeScript Patterns

**Type Inference**:
- Let TypeScript infer return types where obvious
- Explicit types for function parameters
- Discriminated unions for state variants

**Strict Mode Benefits**:
- Null safety enabled
- No implicit any
- Strict function types

## Integration Points

### Existing App Structure

**Current `src/app/page.tsx`**:
- Will be replaced with game import
- Preserve layout (fonts, global styles)
- Update metadata

**Tailwind Configuration**:
- Use existing color scheme (dark mode support)
- Responsive design (mobile-first)
- Accessibility (focus states, ARIA labels)

### Feature Co-location

**Directory Structure** (constitutional requirement):
```
src/
├── app/
│   ├── layout.tsx (existing, update metadata)
│   ├── page.tsx (replace with game import)
│   └── globals.css (existing, keep as is)
└── features/
    └── day-guessing-game/
        ├── components/
        ├── utils/
        ├── data/
        ├── types/
        └── tests/
```

**Rationale**: Feature co-location principle from constitution

## Known Constraints

1. **No Persistence**: FR-011 - refresh clears state (simplifies architecture)
2. **No Backend**: Client-only implementation (reduces complexity)
3. **Fixed Pool**: 10-20 days for MVP (expandable later)
4. **TDD Mandatory**: All code test-first (constitutional)

## Migration Path (Future Enhancements)

**Not in MVP, but designed for**:
- Score tracking: Add localStorage
- Expanded pool: Move to JSON file or API
- Analytics: Track guess accuracy (privacy-respecting)
- Sharing: Add share buttons with results
- Difficulty modes: Filter pool by category

**Architecture supports** these additions without refactoring core game logic (pure functions, clear data model).

---

**Research Complete**: All technical unknowns resolved. Ready for Phase 1 (Design & Contracts).