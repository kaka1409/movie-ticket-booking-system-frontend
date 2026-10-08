"use client";

import { useEffect, useState } from "react";

/**
 * Flips to `true` shortly after mount — drives the staged entry animations on
 * the booking status pages. Each component schedules its own timer, but they
 * all mount in the same commit, so the timers fire in the same frame.
 */
export function useMounted(delayMs = 80): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mountTimer = setTimeout(() => setMounted(true), delayMs);
    return () => clearTimeout(mountTimer);
  }, [delayMs]);

  return mounted;
}
