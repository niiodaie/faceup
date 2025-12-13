export function useABVariant(key) {
  const LOCKED_VARIANT = 'B';

  // Persist for consistency (analytics/debugging)
  localStorage.setItem(key, LOCKED_VARIANT);

  return LOCKED_VARIANT;
}
