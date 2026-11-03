"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fade-in for the cards a paginated list appends.
 *
 * It never scrolls: a list that reloads (tab, search, sort, filter) must not
 * move the viewport out from under the reader — the auto-reveal did exactly
 * that whenever a replacement landed (empty render, then the rows). `swapKey`
 * is the identity of the list itself: when it changes, the whole list was
 * replaced, so the new rows enter as one unit instead of per-card.
 */
export function useAppendFade({
  count,
  swapKey,
}: {
  /** Number of items currently rendered. */
  count: number;
  /** Identity of the query the list belongs to (e.g. tab + committed filters). */
  swapKey?: string | number;
}): { animThreshold: number } {
  const prevCountRef = useRef(count);
  const prevSwapKeyRef = useRef(swapKey);
  /** A replacement was seen on an empty list; its rows are still to land. */
  const isReplacePendingRef = useRef(false);
  /** Threshold to commit on the next state update (read via ref to keep the
   *  `react-hooks/set-state-in-effect` rule happy — see the original hook). */
  const pendingThresholdRef = useRef(count);
  const [animThreshold, setAnimThreshold] = useState(count);

  useEffect(() => {
    if (swapKey !== prevSwapKeyRef.current) isReplacePendingRef.current = true;

    if (isReplacePendingRef.current) {
      // Held until the replacement lands (`count > 0`), because the swap and
      // its rows are two commits with an empty list in between.
      if (count > 0) {
        pendingThresholdRef.current = count;
        setAnimThreshold(pendingThresholdRef.current);
        isReplacePendingRef.current = false;
      }
    } else if (count > prevCountRef.current) {
      pendingThresholdRef.current = prevCountRef.current;
      setAnimThreshold(pendingThresholdRef.current);
    }

    prevCountRef.current = count;
    prevSwapKeyRef.current = swapKey;
  }, [count, swapKey]);

  return { animThreshold };
}
