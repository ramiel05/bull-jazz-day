# Contract: copyToClipboard

**Type**: Async Function (Browser API Wrapper)
**Module**: `src/features/day-guessing-game/share/utils/copy-to-clipboard.ts`

## Signature

```typescript
async function copyToClipboard(text: string): Promise<void>
```

## Input

**Parameter**: `text: string`

**Preconditions**:
- `text` MUST NOT be empty string
- Function MUST throw if precondition violated (invariant check)

## Output

**Type**: `Promise<void>`

**Success**: Promise resolves with no value when clipboard write succeeds

**Failure**: Promise rejects with error when clipboard write fails

## Behavior

**Success Path**:
1. Calls `navigator.clipboard.writeText(text)`
2. Returns resolved promise when write completes
3. Text is now in user's clipboard

**Failure Path**:
1. Calls `navigator.clipboard.writeText(text)`
2. API throws/rejects (permission denied, API unavailable, etc.)
3. Returns rejected promise with original error

**Error Propagation**: This function is a thin wrapper - it does NOT catch errors, allowing caller to handle them

## Browser API Dependency

**Requires**: `navigator.clipboard.writeText()` available

**Browser Support**:
- Chrome/Edge 66+
- Firefox 63+
- Safari 13.1+

**Secure Context**: HTTPS or localhost required for clipboard API

## Examples

### Example 1: Successful copy

**Input**: `"Hello World"`

**Behavior**:
```typescript
await copyToClipboard("Hello World");
// Promise resolves
// Clipboard now contains "Hello World"
```

### Example 2: Failed copy (permission denied)

**Input**: `"Some text"`

**Behavior**:
```typescript
try {
  await copyToClipboard("Some text");
} catch (error) {
  // Error caught: "NotAllowedError: Permission denied"
}
```

### Example 3: Invalid input (empty string)

**Input**: `""`

**Behavior**:
```typescript
copyToClipboard(""); // Throws invariant error immediately (synchronous)
```

## Error Handling

**Precondition Violations**:
- Empty `text` → Throw invariant error (synchronous)

**Clipboard API Errors** (async, propagated to caller):
- `NotAllowedError` - User denied clipboard permission
- `NotSupportedError` - Clipboard API not available
- Other browser-specific errors

**Error Type**: Uses `tiny-invariant` for precondition checks, propagates native browser errors

**Example**:
```typescript
import invariant from 'tiny-invariant';

invariant(text.length > 0, 'text must not be empty');
await navigator.clipboard.writeText(text); // May throw - not caught
```

## Testing Strategy

**Unit Tests**:
- Mock `navigator.clipboard.writeText` in test environment
- Test success path (mock resolves)
- Test failure path (mock rejects)
- Test empty string precondition

**Mock Pattern**:
```typescript
// Success
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

// Failure
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockRejectedValue(new Error('Permission denied')),
  },
});
```

## Usage Pattern

**In Component**:
```typescript
const handleShare = async () => {
  try {
    const message = formatShareMessage(data);
    await copyToClipboard(message);
    setButtonState('copied');
  } catch (error) {
    setButtonState('failed');
  }
};
```

## Test Coverage Requirements

**Unit Tests MUST cover**:
1. Successful clipboard write
2. Failed clipboard write (API rejects)
3. Empty text throws invariant error
4. Verify `navigator.clipboard.writeText` called with correct text
5. Verify error propagates to caller (not swallowed)

---

*This contract defines the expected behavior for test-driven development. Tests will be written against this contract before implementation.*
