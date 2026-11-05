"use client";

import { useEffect, useRef } from "react";
import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { releaseSeatHolds } from "@/features/booking/api";

/**
 * Fires once when the 10-minute booking session (started at the first
 * seats-step CTA) lapses, on whichever step the user is sitting: releases the
 * server hold even when its TTL is still valid, clears the phantom selection,
 * and drops the session clock so a re-pick + CTA starts a brand-new session.
 * Mounted once at the booking layout so expiry works past the seats step.
 */
export default function SessionExpiryWatcher() {
  const {
    countdownStarted,
    countdownStartTime,
    countdownSeconds,
    showtimeId,
    holdShowtimeId,
    clearSeatSelection,
    setSeatHold,
    expireSession,
  } = useBooking();
  const { token } = useAuth();

  const sessionDeadline =
    countdownStarted && countdownStartTime > 0
      ? countdownStartTime + countdownSeconds * 1000
      : null;

  const firedRef = useRef(false);
  useEffect(() => {
    if (sessionDeadline === null) {
      firedRef.current = false;
      return;
    }
    if (firedRef.current) return;

    const check = () => {
      if (Date.now() < sessionDeadline || firedRef.current) return;
      firedRef.current = true;

      // The hold is keyed by the showtime it was created for — after a slot
      // change that is `holdShowtimeId`, not the step the user sits on.
      const heldShowtimeId = holdShowtimeId ?? showtimeId;
      setSeatHold(null, null);
      clearSeatSelection();
      expireSession();
      if (token && heldShowtimeId) void releaseSeatHolds(heldShowtimeId, token);
    };

    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [
    sessionDeadline,
    token,
    showtimeId,
    holdShowtimeId,
    setSeatHold,
    clearSeatSelection,
    expireSession,
  ]);

  return null;
}
