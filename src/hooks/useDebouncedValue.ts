"use client";

import { useEffect, useState } from "react";

/**
 * Returns `value` once it has stayed unchanged for `delayMs` — collapses a
 * burst of updates (typing) into a single update for fetch/write consumers.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
