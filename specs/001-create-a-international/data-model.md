# Data Model: International Day Guessing Game

**Feature**: 001-create-a-international
**Date**: 2025-09-30

## Core Entity: InternationalDay

### Type Definition

```typescript
type InternationalDay = {
  id: string;
  name: string;
  isReal: boolean;
  date: string | null;
  description: string;
  sourceUrl: string | null;
};
```

### Field Specifications

| Field | Type | Required | Description | Validation Rules | Example |
|-------|------|----------|-------------|------------------|---------|
| `id` | `string` | Yes | Unique identifier for the day | Non-empty, unique within pool | `"iwd-001"` |
| `name` | `string` | Yes | Display name of the international day | Non-empty, clear format | `"International Women's Day"` |
| `isReal` | `boolean` | Yes | Whether the day is real or fabricated | true or false | `true` |
| `date` | `string \| null` | No | Calendar date the day occurs | Format: "Month DD" or null for fake days | `"March 8"` or `null` |
| `description` | `string` | Yes | Brief context about the day | 1-3 sentences, non-empty | `"Celebrates women's achievements globally."` |
| `sourceUrl` | `string \| null` | No | Reference link for verification | Valid URL or null for fake days | `"https://en.wikipedia.org/..."` |

### Field Rules & Constraints

**id**:
- Purpose: Internal tracking, must be unique
- Format: Lowercase kebab-case with optional prefix
- Examples: `"iwd-001"`, `"fake-sock-puppet"`, `"earth-day"`
- Generation: Manual assignment during pool creation

**name**:
- Purpose: User-facing display text
- Format: Title case, typically "International [X] Day" or "World [X] Day"
- Length: 10-80 characters (readability)
- Examples:
  - Real: `"International Women's Day"`, `"World Ocean Day"`
  - Fake: `"International Sock Puppet Appreciation Day"`

**isReal**:
- Purpose: Ground truth for guess validation
- Values: `true` (real day), `false` (fabricated day)
- Determines: Whether date and sourceUrl should be populated

**date**:
- Purpose: Display calendar date after guess
- Format: `"Month DD"` (human-readable, no year)
- Nullability:
  - MUST be `null` for fake days (`isReal === false`)
  - SHOULD be populated for real days (`isReal === true`)
- Examples: `"March 8"`, `"June 5"`, `"December 10"`
- No localization in MVP (English month names)

**description**:
- Purpose: Educational context shown in feedback panel
- Length: 50-250 characters (brief but informative)
- Tone: Neutral, factual for real days; playful for fake days
- Examples:
  - Real: `"Celebrates women's rights and achievements worldwide. Recognized by the UN since 1977."`
  - Fake: `"A made-up day for enthusiasts of hand puppets shaped like socks. Does not exist!"`

**sourceUrl**:
- Purpose: Verification link for real days
- Nullability:
  - MUST be `null` for fake days
  - SHOULD be populated for real days
- Preferred sources:
  1. Wikipedia (e.g., `https://en.wikipedia.org/wiki/International_Women%27s_Day`)
  2. UN page (e.g., `https://www.un.org/...`)
  3. Official organization (e.g., `https://www.worldoceanday.org`)
- Validation: Must be valid HTTPS URL

### Entity Lifecycle

**Creation**:
- All days created at build time (static data pool)
- No runtime creation of days in MVP
- Pool defined in `src/features/day-guessing-game/data/days-pool.ts`

**Usage Flow**:
1. Random selection from pool → displayed to user
2. User guesses → validation against `isReal` field
3. Feedback shows → `date`, `description`, `sourceUrl` fields

**Immutability**:
- Days pool is read-only at runtime
- No mutations to InternationalDay objects
- Functional selection creates no side effects

### Data Relationships

**No relationships** (single entity model):
- Self-contained entity
- No foreign keys or references
- Flat array structure

**Pool Organization**:
```typescript
type DaysPool = ReadonlyArray<InternationalDay>;
```

- Combined pool of real and fake days
- No separate categorization needed (handled by `isReal` flag)
- Readonly to enforce immutability (constitutional principle)

## Sample Data

### Real Days (5-10 examples for MVP)

```typescript
const realDays: InternationalDay[] = [
  {
    id: "iwd-001",
    name: "International Women's Day",
    isReal: true,
    date: "March 8",
    description: "Celebrates women's rights and achievements worldwide. Recognized by the UN since 1977.",
    sourceUrl: "https://en.wikipedia.org/wiki/International_Women%27s_Day",
  },
  {
    id: "earth-day",
    name: "Earth Day",
    isReal: true,
    date: "April 22",
    description: "Annual event to demonstrate support for environmental protection, celebrated globally since 1970.",
    sourceUrl: "https://en.wikipedia.org/wiki/Earth_Day",
  },
  {
    id: "donut-day",
    name: "National Donut Day",
    isReal: true,
    date: "First Friday of June",
    description: "Celebrated in the United States. Honors the Salvation Army 'Lassies' who served donuts to soldiers in WWI.",
    sourceUrl: "https://en.wikipedia.org/wiki/National_Doughnut_Day",
  },
  {
    id: "pi-day",
    name: "Pi Day",
    isReal: true,
    date: "March 14",
    description: "Celebrates the mathematical constant π (pi). The date 3/14 matches the first digits of pi.",
    sourceUrl: "https://en.wikipedia.org/wiki/Pi_Day",
  },
  {
    id: "left-handers-day",
    name: "International Left-Handers Day",
    isReal: true,
    date: "August 13",
    description: "Celebrates left-handed people and raises awareness of their unique challenges.",
    sourceUrl: "https://en.wikipedia.org/wiki/International_Left-Handers_Day",
  },
];
```

### Fake Days (5-10 examples for MVP)

```typescript
const fakeDays: InternationalDay[] = [
  {
    id: "fake-sock-puppet",
    name: "International Sock Puppet Appreciation Day",
    isReal: false,
    date: null,
    description: "A completely fabricated day for appreciating hand puppets made from socks. This day does not actually exist!",
    sourceUrl: null,
  },
  {
    id: "fake-procrastination",
    name: "World Procrastination Day",
    isReal: false,
    date: null,
    description: "An imaginary day for putting things off until tomorrow. Ironically, this day itself doesn't exist.",
    sourceUrl: null,
  },
  {
    id: "fake-backwards-walking",
    name: "International Backwards Walking Day",
    isReal: false,
    date: null,
    description: "A made-up celebration of walking in reverse. Nobody actually celebrates this day.",
    sourceUrl: null,
  },
  {
    id: "fake-invisible-friend",
    name: "World Invisible Friend Day",
    isReal: false,
    date: null,
    description: "A fictional day honoring imaginary companions. This day is as real as those friends - not at all!",
    sourceUrl: null,
  },
  {
    id: "fake-triple-espresso",
    name: "International Triple Espresso Day",
    isReal: false,
    date: null,
    description: "A fabricated day for coffee enthusiasts. While coffee lovers exist, this specific day does not.",
    sourceUrl: null,
  },
];
```

## Validation Logic

### Type Guards

```typescript
function isValidInternationalDay(day: unknown): day is InternationalDay {
  if (typeof day !== 'object' || day === null) return false;

  const d = day as Partial<InternationalDay>;

  return (
    typeof d.id === 'string' && d.id.length > 0 &&
    typeof d.name === 'string' && d.name.length > 0 &&
    typeof d.isReal === 'boolean' &&
    (d.date === null || typeof d.date === 'string') &&
    typeof d.description === 'string' && d.description.length > 0 &&
    (d.sourceUrl === null || typeof d.sourceUrl === 'string')
  );
}
```

### Business Rules

**Consistency Rules**:
1. If `isReal === true`, SHOULD have `date` populated (warning if null)
2. If `isReal === true`, SHOULD have `sourceUrl` populated (warning if null)
3. If `isReal === false`, MUST have `date === null`
4. If `isReal === false`, MUST have `sourceUrl === null`
5. `id` must be unique across entire pool

**Validation Function** (for build-time pool validation):

```typescript
function validateDaysPool(pool: InternationalDay[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const day of pool) {
    // Check uniqueness
    if (ids.has(day.id)) {
      errors.push(`Duplicate id: ${day.id}`);
    }
    ids.add(day.id);

    // Check real day constraints
    if (day.isReal && !day.date) {
      errors.push(`Real day missing date: ${day.name}`);
    }
    if (day.isReal && !day.sourceUrl) {
      errors.push(`Real day missing sourceUrl: ${day.name}`);
    }

    // Check fake day constraints
    if (!day.isReal && day.date !== null) {
      errors.push(`Fake day should not have date: ${day.name}`);
    }
    if (!day.isReal && day.sourceUrl !== null) {
      errors.push(`Fake day should not have sourceUrl: ${day.name}`);
    }
  }

  return { valid: errors.length === 0, errors };
}
```

## Query Operations

### Selection Functions

**Random Selection**:
```typescript
function selectRandomDay(pool: readonly InternationalDay[]): InternationalDay {
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
```

**Filter by Type** (not needed in MVP, but possible):
```typescript
function getRealDays(pool: readonly InternationalDay[]): InternationalDay[] {
  return pool.filter(day => day.isReal);
}

function getFakeDays(pool: readonly InternationalDay[]): InternationalDay[] {
  return pool.filter(day => !day.isReal);
}
```

### Validation Operations

**Guess Validation**:
```typescript
type GuessResult = {
  correct: boolean;
  day: InternationalDay;
};

function validateGuess(day: InternationalDay, guessedReal: boolean): GuessResult {
  return {
    correct: day.isReal === guessedReal,
    day,
  };
}
```

## Data Evolution

### MVP Scope
- 10-20 total days (roughly equal real/fake split)
- Hardcoded TypeScript array
- No external data sources

### Future Expansion Options
1. **JSON File**: Move pool to `days-pool.json` for easier editing
2. **User Submissions**: Allow community to suggest days (moderated)

**Migration Path**: Type stays same, source changes from const to import/fetch

---

**Data Model Complete**: Single entity with clear validation and usage patterns. Ready for implementation.