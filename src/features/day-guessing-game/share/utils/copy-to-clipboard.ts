import invariant from 'tiny-invariant';

/**
 * Copies text to the clipboard using the Clipboard API.
 * This is a thin wrapper that propagates errors to the caller.
 *
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves when copy succeeds
 * @throws {Error} When text is empty (synchronous)
 * @throws {Error} When clipboard API fails (asynchronous, propagated from navigator.clipboard)
 */
export async function copyToClipboard(text: string): Promise<void> {
  // Precondition check
  invariant(text.length > 0, 'text must not be empty');

  // Call clipboard API - errors propagate to caller
  await navigator.clipboard.writeText(text);
}
