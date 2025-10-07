# Data Model: International Day Guessing Game (Daily Challenge)

**Feature**: 001-create-a-international
**Created**: 2025-09-30
**Updated**: 2025-10-07 (merged with 003-daily-guess-mechanic)

## Core Entities

### 1. InternationalDay (Extended)

Represents a day entry in the game pool, extended to support daily challenges with calendar dates.

#### Type Definition

```typescript
type InternationalDay = {
  id: string;
  name: string;
  isReal: boolean;
  date: string | null; // "MM-DD" format for real days, null for fake
  description: string;
  sourceUrl: string | null;
};
```

#### Field Specifications

| Field | Type | Required | Description | Validation Rules | Example |
|-------|------|----------|-------------|------------------|---------|
| `id` | `string` | Yes | Unique identifier for the day | Non-empty, unique within pool | `"iwd-001"` |
| `name` | `string` | Yes | Display name of the international day | Non-empty, clear format | `"International Women's Day"` |
| `isReal` | `boolean` | Yes | Whether the day is real or fabricated | true or false | `true` |
| `date` | `string \| null` | No | Calendar date in MM-DD format | "MM-DD" or null for fake days | `"03-08"` or `null` |
| `description` | `string` | Yes | Brief context about the day | 1-3 sentences, non-empty | `"Celebrates women's achievements globally."` |
| `sourceUrl` | `string \| null` | No | Reference link for verification | Valid URL or null for fake days | `"https://en.wikipedia.org/..."` |

#### Field Rules & Constraints

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
- Purpose: Calendar date mapping for daily challenges
- Format: `"MM-DD"` (ISO 8601 date format, e.g., "03-08" for March 8)
- Nullability:
  - MUST be `null` for fake days (`isReal === false`)
  - MUST be populated for real days (`isReal === true`)
- Examples: `"03-08"`, `"06-05"`, `"12-10"`
- Multiple days can share the same date (e.g., "03-21" has 5 UN days)
- No variable or relative dates allowed (e.g., "First Friday of June")

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
  - MUST be populated for real days
- Preferred sources:
  1. Wikipedia (e.g., `https://en.wikipedia.org/wiki/International_Women%27s_Day`)
  2. UN page (e.g., `https://www.un.org/...`)
  3. Official organization (e.g., `https://www.worldoceanday.org`)
- Validation: Must be valid HTTPS URL

#### Pool Requirements

- At least 100 real international days
- At least 100 fake days
- Real and fake days should be equal in amount
- Each real day must have specific `date` value in "MM-DD" format
- Sources: UN, UNESCO, other official international observances
- Fake days must have `null` for `date` field

---

### 2. DailyChallenge

Represents the daily international day challenge for a specific calendar date.

#### Type Definition

```typescript
type DailyChallenge = {
  date: string; // YYYY-MM-DD
  internationalDay: InternationalDay;
  timezone: string;
};
```

#### Field Specifications

**date**: Calendar date in YYYY-MM-DD format (e.g., "2025-10-05")
**internationalDay**: The selected international day for this date
**timezone**: User's timezone (for reference, derived from browser)

#### Validation Rules

- `date` must be valid YYYY-MM-DD format
- `internationalDay` must exist in the days pool
- All users in the same timezone get the same `internationalDay` for the same `date`

#### State Transitions

- Generated once per calendar date using deterministic randomization
- Immutable once generated (same date always produces same challenge)

---

### 3. DailyGameState

Represents a visitor's guess state for the current calendar date, persisted in browser localStorage.

#### Type Definition

```typescript
type DailyGameState = {
  date: string; // YYYY-MM-DD
  guessedCorrectly: boolean | null;
  timestamp: number;
};
```

#### Field Specifications

**date**: Calendar date for this state (YYYY-MM-DD)
**guessedCorrectly**: Result of the guess (null if not guessed yet)
**timestamp**: Unix timestamp when state was saved (for debugging)

#### Validation Rules

- `date` must be valid YYYY-MM-DD format
- `guessedCorrectly` must be `boolean` or `null`
- `timestamp` must be positive integer

#### Derived State

- `hasGuessed` can be derived from `guessedCorrectly !== null`

#### State Transitions

1. **Initial state** (new day):
   ```typescript
   { date: "2025-10-05", guessedCorrectly: null, timestamp: 1728086400000 }
   ```

2. **After guess** (visitor makes guess):
   ```typescript
   { date: "2025-10-05", guessedCorrectly: true, timestamp: 1728087000000 }
   ```

3. **New day** (day changes):
   - Previous state is discarded
   - New initial state created with new date

#### Persistence

- Stored in browser `localStorage` with key `"daily-game-state"`
- Serialized as JSON
- Read on page load and compared with current date
- Updated after each guess

---

## Data Relationships

```
┌─────────────────────────────┐
│  InternationalDay Pool      │
│  (at least 100 real days +  │
│   at least 100 fake days)   │
└────────┬────────────────────┘
         │
         │ references (deterministic random)
         ▼
┌─────────────────────────┐
│   DailyChallenge        │
│   - date: "2025-10-05"  │
│   - internationalDay    │
│   - timezone            │
└────────┬────────────────┘
         │
         │ implicit reference (same date)
         ▼
┌─────────────────────────┐
│   DailyGameState        │
│   - date: "2025-10-05"  │
│   - guessedCorrectly    │
│   - timestamp           │
└─────────────────────────┘
         │
         │ persisted in
         ▼
┌─────────────────────────┐
│   Browser localStorage  │
└─────────────────────────┘
```

## Invariants

1. **Deterministic Challenge Selection**:
   - Same `date` string MUST always produce same `DailyChallenge` for all visitors
   - Enforced by using date as seed for PRNG (xmur3 + mulberry32)

2. **State Date Validity**:
   - `DailyGameState.date` MUST match current calendar date to be considered valid
   - If dates don't match, state is discarded and fresh state created

3. **Guess Consistency**:
   - Once `DailyGameState.guessedCorrectly` is non-null, it cannot be reset to `null` for same date
   - Only transitions: `null → boolean` (never reverses)

4. **Real Day Calendar Mapping**:
   - Every real `InternationalDay` MUST have non-null `date` in "MM-DD" format
   - Fake days MUST have `null` for `date`

5. **Timezone Consistency**:
   - All visitors using same timezone see same `DailyChallenge.date` at same moment
   - Date boundaries occur at midnight in visitor's local timezone

## Pool Structure

```typescript
type DaysPool = ReadonlyArray<InternationalDay>;
```

- Combined pool of real and fake days
- No separate categorization needed (handled by `isReal` flag)
- Readonly to enforce immutability (constitutional principle)

## Sample Data

### Real Days (examples)

```typescript
const realDays: InternationalDay[] = [
  {
    id: "iwd-001",
    name: "International Women's Day",
    isReal: true,
    date: "03-08",
    description: "Celebrates women's rights and achievements worldwide. Recognized by the UN since 1977.",
    sourceUrl: "https://en.wikipedia.org/wiki/International_Women%27s_Day",
  },
  {
    id: "earth-day",
    name: "Earth Day",
    isReal: true,
    date: "04-22",
    description: "Annual event to demonstrate support for environmental protection, celebrated globally since 1970.",
    sourceUrl: "https://en.wikipedia.org/wiki/Earth_Day",
  },
  {
    id: "pi-day",
    name: "Pi Day",
    isReal: true,
    date: "03-14",
    description: "Celebrates the mathematical constant π (pi). The date 3/14 matches the first digits of pi.",
    sourceUrl: "https://en.wikipedia.org/wiki/Pi_Day",
  },
];
```

### Fake Days (examples)

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
];
```

## Validation Logic

### Business Rules

1. If `isReal === true`, MUST have `date` populated (in MM-DD format)
2. If `isReal === true`, MUST have `sourceUrl` populated
3. If `isReal === false`, MUST have `date === null`
4. If `isReal === false`, MUST have `sourceUrl === null`
5. `id` must be unique across entire pool
6. No variable or relative dates allowed (e.g., "First Friday of June")

### Validation Function

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
    if (day.isReal && day.date && !/^\d{2}-\d{2}$/.test(day.date)) {
      errors.push(`Real day has invalid date format (expected MM-DD): ${day.name}`);
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

### Daily Challenge Selection

```typescript
function getDailyChallenge(dateString: string, pool: readonly InternationalDay[]): DailyChallenge {
  // Extract MM-DD from YYYY-MM-DD
  const mmdd = dateString.slice(5); // e.g., "10-05"

  // Get real days for this calendar date
  const realDaysForDate = pool.filter(day => day.isReal && day.date === mmdd);

  // Deterministic random using date as seed
  const seed = xmur3(dateString);
  const random = mulberry32(seed());
  const randomValue = random();

  // Randomly choose: real day OR fake day
  let selectedDay: InternationalDay;
  if (realDaysForDate.length > 0 && randomValue < 0.5) {
    // Select one of the real days for this date
    const index = Math.floor(random() * realDaysForDate.length);
    selectedDay = realDaysForDate[index];
  } else {
    // Select any random fake day
    const fakeDays = pool.filter(day => !day.isReal);
    const index = Math.floor(random() * fakeDays.length);
    selectedDay = fakeDays[index];
  }

  return {
    date: dateString,
    internationalDay: selectedDay,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}
```

### Guess Validation

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

## Migration Notes

### Changes from Original Spec 001

- Updated `date` field from human-readable "March 8" to machine-readable "MM-DD" format
- Expanded pool requirements from 10-20 days to at least 100 real + 100 fake days
- Added DailyChallenge and DailyGameState entities
- Removed variable/relative dates constraint
- Added persistence requirements (localStorage)

### Data Sources for Expansion

- UN official international days list: ~50 days
- UNESCO observances: ~40 days
- Select most globally recognized and culturally diverse days
- Ensure coverage across all 12 months
- Create equivalent fake days with creative/humorous names

---

**Data Model Version**: 2.0
**Last Updated**: 2025-10-07
**Constitution**: v1.4.0 compliant (explicit null types, immutability)
