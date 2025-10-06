# Daily Challenge Mechanic Research

## 1. Deterministic Randomization Using Dates as Seeds

### Decision

Use a simple pure JavaScript implementation combining **xmur3** hash function (to convert date strings to numeric seeds) with **mulberry32** PRNG (to generate deterministic random numbers).

### Rationale

- **No dependencies**: Both algorithms are simple, standalone functions (~15 lines each)
- **Deterministic**: Same date string always produces the same random value
- **High quality**: mulberry32 passes all tests of gjrand testing suite
- **Fast**: Extremely performant for client-side use
- **Simple integration**: Just two pure functions to copy into codebase

### Implementation

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

### Alternatives Considered

1. **seedrandom library** (npm package)

   - Pro: Well-tested, popular
   - Con: Adds dependency, overkill for simple use case

2. **sfc32 PRNG** (alternative to mulberry32)

   - Pro: Slightly better statistical quality, 128-bit state
   - Con: Requires 4 seeds instead of 1, more complex

3. **Simple hash-based approach** (modulo on hash)
   - Pro: Even simpler
   - Con: Poor randomness distribution, not suitable for PRNGs

### References

- [Stack Overflow: Seeding RNG in JavaScript](https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript)
- [bryc/code PRNGs.md on GitHub](https://github.com/bryc/code/blob/master/jshash/PRNGs.md)

---

## 2. Browser localStorage Best Practices for Daily State

### Decision

Create a **typed localStorage wrapper** with JSON serialization that stores:

- Current date (YYYY-MM-DD format)
- Guess result for that date
- Timestamp for validation

### Rationale

- **Type safety**: TypeScript wrapper prevents runtime errors
- **Structured data**: JSON allows storing complex objects
- **Date comparison**: Easy to detect when day changes
- **Graceful degradation**: Can handle missing/corrupt data

### Implementation Pattern

```typescript
// Type definition for daily state
interface DailyGameState {
  date: string; // YYYY-MM-DD
  guessedCorrectly: boolean | null; // null = not guessed yet
  timestamp: number; // Unix timestamp
}
// Note: hasGuessed can be derived as: guessedCorrectly !== null

// Type-safe localStorage wrapper
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

// Usage
const STORAGE_KEY = "daily-game-state";

function getDailyState(currentDate: string): DailyGameState {
  const stored = LocalStorageHelper.get<DailyGameState | null>(
    STORAGE_KEY,
    null
  );

  // Return stored state if it's for today
  if (stored && stored.date === currentDate) {
    return stored;
  }

  // Return fresh state for new day
  return {
    date: currentDate,
    guessedCorrectly: null,
    timestamp: Date.now(),
  };
}

function saveDailyState(state: DailyGameState): void {
  LocalStorageHelper.set(STORAGE_KEY, state);
}
```

### Best Practices Implemented

1. **Date-based invalidation**: Compare stored date with current date
2. **Error handling**: Try-catch blocks for localStorage access
3. **Type safety**: Generic types for all operations
4. **Default values**: Graceful fallback when data missing
5. **Timestamp tracking**: Useful for debugging timezone issues

### Edge Cases Handled

- **Cleared storage**: Returns fresh state
- **Corrupted JSON**: Catches parse errors, returns default
- **Timezone changes**: Compares date strings, not timestamps
- **localStorage disabled**: Error caught, app continues (could add fallback to memory)

### Alternatives Considered

1. **Raw localStorage calls**

   - Pro: Simpler, no abstraction
   - Con: No type safety, repetitive error handling

2. **Third-party library** (typed-local-store, pocketstore)

   - Pro: More features (TTL, encryption, namespaces)
   - Con: Adds dependency, overkill for simple daily state

3. **Cookies**
   - Pro: Server-accessible
   - Con: Size limits, sent with requests, unnecessary complexity

### References

- [MDN: Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Medium: Type-Safe localStorage with TypeScript](https://medium.com/@gcascio/how-to-add-types-to-your-local-storage-9e47ca0087af)

---

## 3. Timezone Handling in JavaScript

### Decision

Use **Intl.DateTimeFormat with 'sv-SE' locale** to get YYYY-MM-DD format in user's local timezone.

### Rationale

- **Built-in API**: No dependencies required
- **Automatic timezone handling**: Uses browser's timezone automatically
- **ISO 8601 format**: Swedish locale produces YYYY-MM-DD natively
- **Simple and reliable**: One-liner solution

### Implementation

```typescript
function getCurrentLocalDate(): string {
  const date = new Date();
  return new Intl.DateTimeFormat("sv-SE").format(date);
  // Returns: "2025-10-05" in user's local timezone
}

// Alternative: ensure consistent formatting
function getCurrentLocalDateSafe(): string {
  const date = new Date();
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  return formatter.format(date);
}
```

### Why This Approach Works

- **sv-SE locale**: Swedish date format is YYYY-MM-DD (ISO 8601)
- **Local timezone**: Browser automatically converts UTC to local time
- **Consistent**: Works across all browsers and platforms
- **Future-proof**: Part of ECMAScript Internationalization API

### Alternatives Considered

1. **Manual formatting with padStart()**

   ```typescript
   const d = new Date();
   const yyyy = d.getFullYear();
   const mm = String(d.getMonth() + 1).padStart(2, "0");
   const dd = String(d.getDate()).padStart(2, "0");
   return `${yyyy}-${mm}-${dd}`;
   ```

   - Pro: More explicit
   - Con: More verbose, manual padding

2. **toISOString() with timezone offset hack**

   ```typescript
   const d = new Date();
   const offset = d.getTimezoneOffset() * 60000;
   return new Date(d.getTime() - offset).toISOString().slice(0, 10);
   ```

   - Pro: Works
   - Con: Hacky, confusing to maintain

3. **date-fns or moment.js**
   - Pro: More date utilities
   - Con: Unnecessary dependency for simple use case

### Important Notes

- **Midnight transitions**: Date changes at midnight in user's local timezone
- **Same experience**: All users in same timezone see same daily challenge
- **Different timezones**: Users in different timezones may be on different "days"
- **Wordle pattern**: This matches how Wordle handles daily challenges

### References

- [MDN: Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
- [Stack Overflow: Format date as YYYY-MM-DD](https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd)

---

## 4. Strategies for Finding/Sourcing International Days

### Decision

Use **UN and UNESCO official lists** as primary sources, supplemented by internationaldays.org for comprehensive coverage.

### Rationale

- **Authoritative**: UN/UNESCO days are officially recognized
- **Well-documented**: Each day has clear definition and purpose
- **Diverse**: 100+ days covering various causes and topics
- **Stable**: Dates don't change year-to-year
- **Cultural significance**: Globally recognized observances

### Primary Sources

1. **UN Official List** (50+ days)

   - URL: https://www.un.org/en/observances/list-days-weeks
   - Status: Most authoritative, UN General Assembly designated
   - Access: May require scraping or manual compilation

2. **UNESCO International Days** (40+ days)

   - URL: https://www.unesco.org/en/days/list
   - Status: UNESCO-specific observances
   - Coverage: Education, science, culture

3. **InternationalDays.org** (100+ days)
   - URL: https://www.internationaldays.org/calendar
   - Status: Community-maintained, comprehensive
   - Coverage: UN + other recognized observances
   - Access: Web-accessible, can be scraped

### Sample International Days (by month)

```
January:
- 04: World Braille Day
- 24: International Day of Education
- 26: International Customs Day
- 27: Holocaust Remembrance Day

February:
- 04: World Cancer Day
- 06: International Day of Zero Tolerance for Female Genital Mutilation
- 10: World Pulses Day
- 11: International Day of Women and Girls in Science
- 13: World Radio Day
- 20: World Day of Social Justice
- 21: International Mother Language Day

March:
- 08: International Women's Day
- 21: International Day for the Elimination of Racial Discrimination
- 21: World Poetry Day
- 21: International Day of Forests
- 21: World Down Syndrome Day
- 22: World Water Day

(Note: March 21 has 5 different international days - most of any single date)
```

### Data Collection Strategy

1. **Manual Curation** (Recommended for MVP)

   - Compile another 100 days from official sources
   - Create TypeScript data structure
   - Include: date (MM-DD), name, description, source

2. **Automated Scraping** (For scale)
   - Parse internationaldays.org calendar
   - Validate against UN/UNESCO lists
   - Update annually

### Data Structure Recommendation

```typescript
interface InternationalDay {
  month: number; // 1-12
  day: number; // 1-31
  name: string;
  description: string;
  source: "UN" | "UNESCO" | "Other";
  url?: string; // Link to official page
}

// Example
const days: InternationalDay[] = [
  {
    month: 3,
    day: 8,
    name: "International Women's Day",
    description:
      "Celebrates women's achievements and raises awareness about gender equality",
    source: "UN",
    url: "https://www.un.org/en/observances/womens-day",
  },
  // ... more days
];

// Helper function to get day for a date
function getInternationalDay(date: string): InternationalDay | null {
  const [year, month, day] = date.split("-").map(Number);
  return days.find((d) => d.month === month && d.day === day) || null;
}
```

### Notable Facts

- **March 21**: Most international days (5 different observances)
- **June**: Month with most total international days
- **Coverage**: Can easily get 100+ days from official sources
- **Recurrence**: All international days recur annually on same date

### Expansion Strategy

1. **Phase 1** (MVP): 50 most popular UN/UNESCO days
2. **Phase 2**: Expand to 100+ with lesser-known observances
3. **Phase 3**: Add regional/cultural days (not just UN)
4. **Phase 4**: User submissions (with verification)

### Alternatives Considered

1. **Wikipedia scraping**

   - Pro: Comprehensive
   - Con: Less structured, harder to parse

2. **API services** (timeanddate.com, etc.)

   - Pro: Programmatic access
   - Con: May require payment, rate limits

3. **Manual database creation**
   - Pro: Full control, curated quality
   - Con: Time-intensive initially

### References

- [UN: List of International Days and Weeks](https://www.un.org/en/observances/list-days-weeks)
- [UNESCO: International Days](https://www.unesco.org/en/days/list)
- [InternationalDays.org Calendar](https://www.internationaldays.org/calendar)

---

## Implementation Summary

### Recommended Tech Stack

- **Randomization**: xmur3 + mulberry32 (pure JS, no deps)
- **Storage**: Custom typed localStorage wrapper
- **Dates**: Intl.DateTimeFormat with 'sv-SE' locale
- **Data**: Manually curated list of at least 100 UN/UNESCO days

### Integration Pattern

```typescript
// 1. Get current local date
const currentDate = getCurrentLocalDate(); // "2025-10-05"

// 2. Check localStorage for existing state
const dailyState = getDailyState(currentDate);

// 3. If new day, generate challenge
if (dailyState.guessedCorrectly === null) {
  // Generate deterministic random value for this date
  const seed = xmur3(currentDate);
  const random = mulberry32(seed());
  const challengeValue = random();

  // Use challengeValue to select today's international day
  const dayIndex = Math.floor(challengeValue * internationalDays.length);
  const todaysDay = internationalDays[dayIndex];
}

// 4. Save state after guess
dailyState.guessedCorrectly = userGuessedCorrectly;
saveDailyState(dailyState);
```

### Testing Considerations

- **Determinism**: Verify same date produces same challenge
- **Timezone**: Test around midnight transitions
- **Storage**: Test with cleared/disabled localStorage
- **Edge cases**: Feb 29, timezone changes, clock adjustments

---

**Research completed**: 2025-10-05
**Target implementation**: Client-side TypeScript/React app
**Dependencies required**: None (all pure JavaScript/TypeScript)
