"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Appended-item reveal for paginated lists: when `count` grows, the first new
 * card is scrolled into view and the animation threshold drops to the previous
 * count so only the appended cards fade in. A `swapKey` (e.g. the active tab)
 * marks a grow as a list replacement instead — no scroll, no threshold reset.
 */
export function useAppendReveal<T extends HTMLElement>({
  count,
  cardSelector,
  swapKey,
}: {
  /** Number of items currently rendered inside the container. */
  count: number;
  /** Selector matching one card inside the container (e.g. `[data-movie-card]`). */
  cardSelector: string;
  /** Changing this key means the list was replaced (tab switch) rather than appended. */
  swapKey?: string | number;
}): { containerRef: RefObject<T | null>; animThreshold: number } {
  const containerRef = useRef<T>(null);
  const prevCountRef = useRef(count);
  const prevSwapKeyRef = useRef(swapKey);
  const [animThreshold, setAnimThreshold] = useState(count);

  useEffect(() => {
    const grew = count > prevCountRef.current;
    const swapChanged = swapKey !== prevSwapKeyRef.current;

    if (grew && !swapChanged) {
      const container = containerRef.current;
      if (container) {
        const cards = container.querySelectorAll<HTMLElement>(cardSelector);
        const firstNew = cards[prevCountRef.current];
        if (firstNew) {
          firstNew.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
      setAnimThreshold(prevCountRef.current);
    }

    prevCountRef.current = count;
    prevSwapKeyRef.current = swapKey;
  }, [count, swapKey, cardSelector]);

  return { containerRef, animThreshold };
}
