# Research: International Day Guessing Game (Daily Challenge)

**Feature**: 001-create-a-international
**Created**: 2025-09-30
**Updated**: 2025-10-07 (merged with 003-daily-guess-mechanic)

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

**Decision**: Deterministic PRNG using xmur3 + mulberry32
**Rationale**:
- Deterministic: Same date always produces same result for all users
- No dependencies: Pure JavaScript implementation (~15 lines each)
- High quality: mulberry32 passes all tests of gjrand testing suite
- Fast: Extremely performant for client-side use
- Enables timezone-consistent daily challenges

**Implementation**:
```typescript
// Hash function to convert string to numeric seed
function xmur3(str: string) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
    (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)),
      (h = (h << 13) | (h >>> 19));
  return function () {
    (h = Math.imul(h ^ (h >>> 16), 2246822507)),
      (h = Math.imul(h ^ (h >>> 13), 3266489909));
    return (h ^= h >>> 16) >>> 0;
  };
}

// Simple 32-bit PRNG
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Usage for daily challenge
const dateString = "2025-10-04";
const seed = xmur3(dateString);
const random = mulberry32(seed());
const randomValue = random(); // 0-1 deterministic for this date
```

**Alternatives Considered**:
- `Math.random()`: Non-deterministic, different users would see different challenges
- `seedrandom` library: Adds dependency, overkill for simple use case
- Simple hash-based approach: Poor randomness distribution

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

1. **localStorage Persistence**: Daily state must persist across page refreshes
2. **No Backend**: Client-only implementation (reduces complexity)
3. **Large Pool**: 100+ real and 100+ fake days for daily challenges
4. **TDD Mandatory**: All code test-first (constitutional)
5. **Deterministic Challenges**: Same date must produce same challenge for all users in timezone
6. **No Variable Dates**: Cannot use relative dates like "First Friday of June"

## Additional Research: Daily Challenge Mechanics

### 1. Browser localStorage for Daily State

**Decision**: Create typed localStorage wrapper with JSON serialization

**Rationale**:
- Type safety: TypeScript wrapper prevents runtime errors
- Structured data: JSON allows storing complex objects
- Date comparison: Easy to detect when day changes
- Graceful degradation: Can handle missing/corrupt data

**Implementation Pattern**:
```typescript
interface DailyGameState {
  date: string; // YYYY-MM-DD
  guessedCorrectly: boolean | null;
  timestamp: number;
}

class LocalStorageHelper {
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`);
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${error}`);
    }
  }
}
```

**Best Practices**:
1. Date-based invalidation: Compare stored date with current date
2. Error handling: Try-catch blocks for localStorage access
3. Type safety: Generic types for all operations
4. Default values: Graceful fallback when data missing
5. Timestamp tracking: Useful for debugging timezone issues

**Edge Cases Handled**:
- localStorage disabled: App continues, may lose state on refresh
- Corrupted JSON: Catches parse errors, returns default
- Timezone changes: Compares date strings, not timestamps

**Alternatives Considered**:
- Raw localStorage calls: No type safety, repetitive error handling
- Third-party library (typed-local-store): Adds dependency, overkill
- Cookies: Size limits, sent with requests, unnecessary complexity

### 2. Timezone Handling in JavaScript

**Decision**: Use Intl.DateTimeFormat with 'sv-SE' locale for YYYY-MM-DD format

**Rationale**:
- Built-in API: No dependencies required
- Automatic timezone handling: Uses browser's timezone automatically
- ISO 8601 format: Swedish locale produces YYYY-MM-DD natively
- Simple and reliable: One-liner solution

**Implementation**:
```typescript
function getCurrentLocalDate(): string {
  const date = new Date();
  return new Intl.DateTimeFormat("sv-SE").format(date);
  // Returns: "2025-10-05" in user's local timezone
}
```

**Why This Works**:
- sv-SE locale: Swedish date format is YYYY-MM-DD (ISO 8601)
- Local timezone: Browser automatically converts UTC to local time
- Consistent: Works across all browsers and platforms
- Future-proof: Part of ECMAScript Internationalization API

**Important Notes**:
- Midnight transitions: Date changes at midnight in user's local timezone
- Same experience: All users in same timezone see same daily challenge
- Different timezones: Users in different timezones may see different days at same UTC time
- Wordle pattern: This matches how Wordle handles daily challenges

**Alternatives Considered**:
- Manual formatting with padStart(): More verbose, manual padding required
- toISOString() with timezone offset hack: Hacky, confusing to maintain
- date-fns or moment.js: Unnecessary dependency for simple use case

### 3. International Days Data Sources

**Decision**: Use UN and UNESCO official lists as primary sources

**Rationale**:
- Authoritative: UN/UNESCO days are officially recognized
- Well-documented: Each day has clear definition and purpose
- Diverse: 100+ days covering various causes and topics
- Stable: Dates don't change year-to-year
- Cultural significance: Globally recognized observances

**Primary Sources**:
1. UN Official List (50+ days): https://www.un.org/en/observances/list-days-weeks
2. UNESCO International Days (40+ days): https://www.unesco.org/en/days/list
3. InternationalDays.org (100+ days): https://www.internationaldays.org/calendar

**Data Collection Strategy**:
- Manual curation from official sources
- Create TypeScript data structure with MM-DD dates
- Include: date, name, description, source
- Ensure coverage across all 12 months
- Create equivalent fake days with creative/humorous names

**Notable Facts**:
- March 21: Most international days (5 different observances)
- June: Month with most total international days
- Coverage: Can easily get 100+ days from official sources
- All days recur annually on same date

## Migration Path (Future Enhancements)

**Not in MVP, but designed for**:
- Score tracking: Extend localStorage with historical results
- Expanded pool: Move to JSON file or API for easier updates
- Sharing: Add share buttons with results
- Streak counters: Track consecutive correct guesses
- Leaderboards: Optional server integration

**Architecture supports** these additions without refactoring core game logic (pure functions, clear data model, separated daily challenge logic).

---

**Research Complete**: All technical unknowns resolved. Ready for Phase 1 (Design & Contracts).
**Last Updated**: 2025-10-07