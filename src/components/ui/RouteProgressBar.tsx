"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const START_PROGRESS = 8;
const MAX_PROGRESS = 90;
const CREEP_INTERVAL_MS = 200;
const DONE_DELAY_MS = 300;
const MAX_DURATION_MS = 10000;

/**
 * Global top progress bar for route navigation (App Router).
 *
 * App Router has no `router.events`, so we detect the *start* of a navigation
 * by intercepting clicks on internal `<a>` and the *end* by watching
 * `usePathname()` change. Complements per-route `loading.tsx` skeletons — it
 * gives instant feedback before the skeleton renders.
 */
export default function RouteProgressBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const creepRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const doneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPathnameRef = useRef(pathname);
  const doneRef = useRef<() => void>(() => {});

  const clearTimers = () => {
    if (creepRef.current) {
      clearInterval(creepRef.current);
      creepRef.current = null;
    }
    if (doneTimerRef.current) {
      clearTimeout(doneTimerRef.current);
      doneTimerRef.current = null;
    }
    if (maxTimerRef.current) {
      clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
  };

  const start = useCallback(() => {
    clearTimers();
    setVisible(true);
    setProgress(START_PROGRESS);

    creepRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= MAX_PROGRESS) return prev;
        return prev + (MAX_PROGRESS - prev) * 0.15;
      });
    }, CREEP_INTERVAL_MS);

    maxTimerRef.current = setTimeout(() => {
      // Safety net: never leave the bar stuck.
      doneRef.current?.();
    }, MAX_DURATION_MS);
  }, []);

  const done = useCallback(() => {
    clearTimers();
    setProgress(100);
    doneTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, DONE_DELAY_MS);
  }, []);

  useEffect(() => {
    doneRef.current = done;
  });

  // End of navigation: pathname changed.
  useEffect(() => {
    if (pathname !== lastPathnameRef.current) {
      lastPathnameRef.current = pathname;
      if (visible) {
        const timer = setTimeout(() => done(), 0);
        return () => clearTimeout(timer);
      }
    }
    return undefined;
  }, [pathname, visible, done]);

  // Start of navigation: intercept internal link clicks.
  useEffect(() => {
    const isInternalNavigation = (anchor: HTMLAnchorElement, event: MouseEvent) => {
      if (event.defaultPrevented) return false;
      if (event.button !== 0) return false;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
      if (anchor.target && anchor.target !== "_self") return false;
      if (anchor.hasAttribute("download")) return false;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return false;
      if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return false;
      }
      if (url.origin !== window.location.origin) return false;
      // Same path + same search => no navigation.
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return false;
      }
      return true;
    };

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      if (!isInternalNavigation(anchor, event)) return;
      start();
    };

    const onPopState = () => start();

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-progress h-0.5 overflow-hidden"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms ease" }}
    >
      <div
        className="h-full bg-(--color-gold)"
        style={{ width: `${progress}%`, transition: "width 200ms ease-out" }}
      />
      <div className="route-progress-shimmer absolute inset-0" />
    </div>
  );
}
