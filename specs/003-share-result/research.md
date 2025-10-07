# Research: Share Results Feature

**Feature**: 003-share-result
**Date**: 2025-10-07

## Technical Decisions

### 1. Clipboard API Approach

**Decision**: Use `navigator.clipboard.writeText()` for copying to clipboard

**Rationale**:
- Modern, promise-based API with broad browser support (Chrome 66+, Firefox 63+, Safari 13.1+)
- No browser share API needed (as specified in requirements)
- Cleaner error handling compared to `document.execCommand('copy')`
- Works in secure contexts (HTTPS/localhost)

**Alternatives Considered**:
- `document.execCommand('copy')` - Deprecated, synchronous, more complex DOM manipulation required
- Browser Share API (`navigator.share()`) - Explicitly excluded by requirements
- Third-party libraries (clipboard.js) - Unnecessary dependency for simple use case

**Implementation Pattern**:
```typescript
try {
  await navigator.clipboard.writeText(message);
  // Success feedback
} catch (error) {
  // Failure feedback
}
```

### 2. Button State Management

**Decision**: React `useState` with timeout for transient feedback states

**Rationale**:
- Simple state machine: 'idle' → 'copied'/'failed' → 'idle' (after 5s)
- No external state management needed (local component state)
- Timeout cleanup handled in useEffect
- Follows React functional component patterns

**State Values**:
- `'idle'` - Default button text ("Share")
- `'copied'` - Success feedback ("Copied!")
- `'failed'` - Failure feedback ("Copy failed")

**Pattern**:
```typescript
const [buttonState, setButtonState] = useState<'idle' | 'copied' | 'failed'>('idle');

useEffect(() => {
  if (buttonState !== 'idle') {
    const timeout = setTimeout(() => setButtonState('idle'), 5000);
    return () => clearTimeout(timeout);
  }
}, [buttonState]);
```

### 3. Message Formatting

**Decision**: Plain text with `\n` line breaks, structured sections

**Rationale**:
- Requirement specifies "plain text with line breaks between sections"
- Cross-platform compatibility (mobile messaging, Twitter, Discord, etc.)
- No Markdown or HTML needed
- Readable without special rendering

**Format Structure**:
```
[Emoji] [Result]

[Name] is real!/fake!
My guess: [Real/Fake]

[Streak info if > 0]
[Milestone if achieved]
[New best if achieved]

🔗 https://bull-jazz-day.vercel.app
```

**Example Output**:
```
🎉 Correct!

International Day of Peace is real!
My guess: Real

Current streak: 5 🎖️
Milestone reached: 5-day streak!

🔗 https://bull-jazz-day.vercel.app
```

### 4. Testing Clipboard Interactions

**Decision**: Mock `navigator.clipboard` in Vitest tests

**Rationale**:
- Clipboard API not available in jsdom/test environment
- Need to test both success and failure paths
- Mock allows controlled testing of async behavior

**Mock Pattern**:
```typescript
// Success case
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

// Failure case
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockRejectedValue(new Error('Permission denied')),
  },
});
```

### 5. Emoji Selection

**Decision**: Unicode emojis directly in code

**Emojis Chosen**:
- ✅ Correct guess: 🎉 (party popper)
- ❌ Incorrect guess: ❌ (cross mark)
- 🎖️ Milestone reached: 🎖️ (military medal) for streaks 3, 5, 10, 15, 20
- 🏆 Major milestone: 🏆 (trophy) for streaks 30, 50, 100
- 🔥 New best streak: 🔥 (fire) - indicates personal best

**Rationale**:
- Cross-platform Unicode support
- No emoji library dependency needed
- Consistent with existing feedback panel emojis (🎉, ❌)
- Milestone emojis scale with achievement significance

**Milestone Emoji Mapping**:
```typescript
const getMilestoneEmoji = (streakValue: number): string => {
  if (streakValue >= 30) return '🏆';
  return '🎖️';
};
```

### 6. Type Design

**Decision**: Strong typing for message data with explicit null for absence

**ShareMessageData Type**:
```typescript
type ShareMessageData = {
  dayName: string;
  dayType: 'real' | 'fake';
  playerGuess: 'real' | 'fake';
  isCorrect: boolean;
  currentStreak: number;
  milestoneText: string | null;  // null when no milestone
  newBestText: string | null;    // null when no new best
};
```

**Rationale**:
- Follows Constitution Principle VII (Explicit Null Types)
- `| null` for intentional absence (milestone/best not achieved)
- Empty strings avoided for nullable states
- Makes intent clear: null = "not applicable" vs empty = "no content"

### 7. Pure Function Architecture

**Decision**: Message formatting as pure function, clipboard wrapper separate

**Module Structure**:
- `formatShareMessage(data: ShareMessageData): string` - Pure function, easily testable
- `copyToClipboard(text: string): Promise<void>` - Thin wrapper over navigator.clipboard
- `ShareButton` component - Orchestrates data assembly, formatting, copying, UI feedback

**Rationale**:
- Follows Constitution Principle I (Functional Patterns)
- Pure formatter function has no side effects, 100% deterministic
- Separate clipboard wrapper allows easy mocking in tests
- Component focuses on React concerns (state, events, rendering)

## Dependencies

**No New Dependencies Required**:
- Browser Clipboard API (built-in)
- React hooks (existing)
- Vitest mocking (existing dev dependency)

## Performance Considerations

**Clipboard Operation**: <100ms typical, synchronous from user perspective (promise resolves quickly)

**Message Formatting**: O(1) complexity, string concatenation only, negligible performance impact

**Button State Timeout**: 5 seconds (per requirements), cleanup on unmount prevents memory leaks

## Browser Compatibility

**Clipboard API Support**:
- Chrome/Edge: 66+ ✅
- Firefox: 63+ ✅
- Safari: 13.1+ ✅
- Opera: 53+ ✅

**Fallback Behavior**: Button shows "Copy failed" if API unavailable (per requirements)

## Security Considerations

**Secure Context Requirement**: Clipboard API requires HTTPS (or localhost). Production site already on HTTPS (Vercel).

**No Sensitive Data**: Shared message contains only public game data (day name, guess, streak). No user PII.

**Permission Model**: Clipboard write requires no user permission (unlike read). API may fail in some contexts - handled gracefully.

---

*All NEEDS CLARIFICATION markers resolved. Ready for Phase 1 (Design & Contracts).*
