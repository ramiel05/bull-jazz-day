# Data Model: Daily Guess Mechanic

## Entities

### DailyChallenge

Represents the daily international day challenge for a specific calendar date.

**Fields**:

- `date: string` - Calendar date in YYYY-MM-DD format (e.g., "2025-10-05")
- `internationalDay: InternationalDay` - The selected international day for this date
- `timezone: string` - User's timezone (for reference, derived from browser)

**Relationships**:

- References one `InternationalDay` from the pool

**Validation Rules**:

- `date` must be valid YYYY-MM-DD format
- `internationalDay` must exist in the days pool
- All users in the same timezone get the same `internationalDay` for the same `date`

**State Transitions**:

- Generated once per calendar date using deterministic randomization
- Immutable once generated (same date always produces same challenge)

---

### DailyGameState

Represents a visitor's guess state for the current calendar date, persisted in browser localStorage.

**Fields**:

- `date: string` - Calendar date for this state (YYYY-MM-DD)
- `guessedCorrectly: boolean | null` - Result of the guess (null if not guessed yet)
- `timestamp: number` - Unix timestamp when state was saved (for debugging)

**Relationships**:

- Implicitly references the `DailyChallenge` for the same `date`

**Validation Rules**:

- `date` must be valid YYYY-MM-DD format
- `guessedCorrectly` must be `boolean` or `null`
- `timestamp` must be positive integer

**Derived State**:

- `hasGuessed` can be derived from `guessedCorrectly !== null`

**State Transitions**:

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

**Persistence**:

- Stored in browser `localStorage` with key `"daily-game-state"`
- Serialized as JSON
- Read on page load and compared with current date
- Updated after each guess

---

### InternationalDay (Extended)

Existing entity from Feature 001, now extended with calendar date field for daily challenges.

**Updated Fields** (additions to existing type):

- `date: string | null` - ISO 8601 date format "MM-DD" (e.g., "03-08" for March 8) for real days, null for fake days

**Existing Fields** (unchanged):

- `id: string` - Unique identifier
- `name: string` - Name of the international day
- `isReal: boolean` - Whether this is a real or fake day
- `description: string` - Brief description
- `sourceUrl: string | null` - Wikipedia or source link (null for fake days)

**Validation Rules** (new):

- Real days: `date` must be valid "MM-DD" format (month 01-12, day 01-31 based on month)
- Fake days: `date` must be `null`
- `date` must be valid calendar date (e.g., no "02-30")

**Pool Requirements**:

- At least 100 real days
- At least 100 fake days
- Fake and real days to be equal in amount
- Each real day must have specific `date` value in "MM-DD" format
- Multiple days can share the same `date` (e.g., "03-21" has 5 UN days)
- Sources: UN, UNESCO, other official international observances

---

## Helper Types

### DailyChallengeSelection

Intermediate type used during daily challenge generation.

**Fields**:

- `realDaysForDate: InternationalDay[]` - Array of real days that occur on this calendar date
- `randomValue: number` - Deterministic random value (0-1) for this date
- `selectedDay: InternationalDay` - The chosen day (either from `realDaysForDate` or any fake day)

**Purpose**:

- Facilitates the selection logic: "randomly choose real day OR random fake day"
- Enables testability of selection algorithm

---

## Data Relationships Diagram

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

---

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

---

## Type Definitions (TypeScript)

```typescript
// Extended InternationalDay type
export type InternationalDay = {
  id: string;
  name: string;
  isReal: boolean;
  date: string | null; // "MM-DD" format (e.g., "03-08") for real days, null for fake
  description: string;
  sourceUrl: string | null;
};

// Daily challenge entity
export type DailyChallenge = {
  date: string; // YYYY-MM-DD
  internationalDay: InternationalDay;
  timezone: string;
};

// Visitor's daily state (persisted in localStorage)
export type DailyGameState = {
  date: string; // YYYY-MM-DD
  guessedCorrectly: boolean | null;
  timestamp: number; // Unix timestamp
};

// Helper type for selection logic
export type DailyChallengeSelection = {
  realDaysForDate: InternationalDay[];
  randomValue: number; // 0-1
  selectedDay: InternationalDay;
};
```

---

## Migration Notes

### Extending Existing InternationalDay Type

- Update `date` field to use "MM-DD" format instead of human-readable string
- Update existing real days in `days-pool.ts` to include `date` values in "MM-DD" format
- Add 40-90 additional real days directly to `days-pool.ts` (no separate file)
- Add 40-90 additional fake days directly to `days-pool.ts` to match real days count

### Data Sources for Expansion

- UN official international days list: ~50 days
- UNESCO observances: ~40 days
- Select most globally recognized and culturally diverse days
- Ensure coverage across all 12 months
- Create equivalent fake days with creative/humorous names

---

**Based on**: Feature Spec 003-daily-guess-mechanic
**Constitution**: v1.4.0 compliant (explicit null types, immutability)
