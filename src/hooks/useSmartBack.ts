"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * Back handler that prefers real browser history but never dead-ends: when the
 * tab has no previous entry (deep link / new tab open) it replaces to
 * `fallbackHref` instead of calling `router.back()` (a no-op with no history).
 * `window.history.length > 1` is a heuristic — forward and external entries
 * also count — which is acceptable for the public movie-detail page where the
 * true origin (home / list / wishlist / search) is worth preserving.
 */
export function useSmartBack(fallbackHref: string): () => void {
  const router = useRouter();

  return useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace(fallbackHref);
    }
  }, [router, fallbackHref]);
}
