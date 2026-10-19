"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useBooking } from "./context";

/** Seconds left until `deadline` (epoch ms), floored at zero. */
function secondsUntil(deadline: number): number {
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}

/** Seconds left on the booking session, or `null` while no clock is running. */
const CountdownContext = createContext<number | null>(null);

/**
 * One 1-second ticker for the whole booking flow.
 *
 * Both device trees render, so a banner-owned interval would run twice and only
 * on the step that mounts it. Hoisting the clock to the booking layout keeps a
 * single timer alive on every step, and the desktop rail can show the same
 * value as the mobile banner.
 *
 * `children` passes straight through, so only the components that call
 * `useCountdownRemaining()` re-render on a tick.
 */
export function CountdownProvider({ children }: { children: ReactNode }) {
  const { countdownStarted, countdownStartTime, countdownSeconds, holdExpiresAt } = useBooking();

  /* The session deadline (first CTA + 10 min) wins over the hold deadline —
     re-pressing the CTA refreshes the hold TTL but never extends the session.
     `holdExpiresAt` only covers a session the tab forgot (storage cleared). */
  const deadline = countdownStarted ? countdownStartTime + countdownSeconds * 1000 : holdExpiresAt;

  /* A tick counter, not a stored value: the remaining seconds derive from the
     absolute deadline during render. Storing them would need a reset effect when
     the deadline clears, and would drift on a throttled background tab. */
  const [, setTick] = useState(0);

  useEffect(() => {
    if (deadline === null) return;

    const id = setInterval(() => setTick((tick) => tick + 1), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const remaining = deadline === null ? null : secondsUntil(deadline);

  return <CountdownContext.Provider value={remaining}>{children}</CountdownContext.Provider>;
}

/**
 * Seconds until the booking session ends. Before the first seats-step CTA there
 * is no deadline yet, so the full session length is returned — the step shows
 * 10:00 instead of a stuck 00:00.
 */
export function useCountdownRemaining(): number {
  const { countdownSeconds } = useBooking();
  return useContext(CountdownContext) ?? countdownSeconds;
}

/** `mm:ss` for a countdown chip — one formatter for both device skins. */
export function formatCountdown(seconds: number): string {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainder = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${remainder}`;
}
