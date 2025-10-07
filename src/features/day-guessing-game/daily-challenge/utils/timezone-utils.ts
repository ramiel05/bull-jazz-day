/**
 * Gets the current local date in YYYY-MM-DD format
 * Uses Swedish locale ('sv-SE') which naturally produces ISO 8601 format
 * The date is calculated in the user's local timezone
 */
export function getCurrentLocalDate(): string {
  const date = new Date();
  return new Intl.DateTimeFormat('sv-SE').format(date);
}
