"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { getBookingById, getPaymentIntent } from "../api";
import { createPaymentIntentAction, simulatePaymentAction, syncPaymentAction } from "../action";
import type {
  BookingDetail,
  PaymentIntent,
  PaymentMethodId,
  PaymentOutcomeWithIntent,
  SimulatedOutcome,
} from "../types";

/** Provider poll cadence: fast enough to feel live, cheap enough for a demo. */
const INTENT_POLL_INTERVAL_MS = 3000;

export interface UsePaymentIntentResult {
  /** The attempt on screen; null until the first one is opened. */
  intent: PaymentIntent | null;
  /** The booking itself is gone, so no attempt can be opened at all. */
  isClosed: boolean;
  isOpening: boolean;
  isSyncing: boolean;
  simulatingOutcome: SimulatedOutcome | null;
  /** Money arrived after the window closed, so a refund row was queued. */
  isRefundQueued: boolean;
  errorMessage: string | null;
  notice: string | null;
  simulate: (outcome: SimulatedOutcome) => Promise<void>;
  sync: () => Promise<void>;
  /** Open a fresh attempt after the current code expired. */
  reopen: () => Promise<void>;
}

/**
 * QR-page controller: get-or-create the intent, poll it until it settles, and
 * route on the outcome. The page owns the attempt so the payment step can never
 * create a second booking by retrying.
 */
export function usePaymentIntent({
  slug,
  booking,
  method,
}: {
  slug: string;
  booking: BookingDetail;
  method: PaymentMethodId;
}): UsePaymentIntentResult {
  const router = useRouter();
  const { token } = useAuth();
  const { translate } = useLocale();

  const [intent, setIntent] = useState<PaymentIntent | null>(null);
  const [isClosed, setIsClosed] = useState(booking.status !== "pending");
  const [isOpening, setIsOpening] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [simulatingOutcome, setSimulatingOutcome] = useState<SimulatedOutcome | null>(null);
  const [isRefundQueued, setIsRefundQueued] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const bookingId = booking.id;
  /** One terminal decision per page — a late poll must not navigate twice. */
  const hasResolved = useRef(false);
  const hasBootstrapped = useRef(false);

  const goToSuccess = useCallback(() => {
    hasResolved.current = true;
    router.replace(`/booking/${slug}/status/success?bookingId=${encodeURIComponent(bookingId)}`);
  }, [bookingId, router, slug]);

  const goToFailure = useCallback(
    (reason: string | null) => {
      hasResolved.current = true;
      const reasonParam = encodeURIComponent(reason ?? "payment_declined");
      router.replace(
        `/booking/${slug}/status/failed?bookingId=${encodeURIComponent(bookingId)}&reason=${reasonParam}`,
      );
    },
    [bookingId, router, slug],
  );

  const openIntent = useCallback(async () => {
    if (!token) return;
    setIsOpening(true);
    setErrorMessage(null);
    setNotice(null);

    try {
      const result = await createPaymentIntentAction({ bookingId, method }, token);
      if (!result.success) {
        // The window closed between the server render and this call.
        if (result.code === "BOOKING_EXPIRED") setIsClosed(true);
        else setErrorMessage(result.error);
        return;
      }
      setIntent(result.data);
    } catch {
      setErrorMessage(translate("common.error"));
    } finally {
      setIsOpening(false);
    }
  }, [bookingId, method, token, translate]);

  const applyOutcome = useCallback(
    (outcome: PaymentOutcomeWithIntent) => {
      setIntent(outcome.intent);
      if (hasResolved.current) return;

      switch (outcome.settlement) {
        case "settled":
          goToSuccess();
          return;
        case "declined":
          goToFailure(outcome.intent.reason);
          return;
        case "late_success":
          // The charge went through after the booking closed: the backend
          // queued a refund instead of settling, so there is no ticket to show.
          hasResolved.current = true;
          setIsRefundQueued(true);
          return;
        case "duplicate_charge":
          if (outcome.bookingStatus === "paid") goToSuccess();
          else {
            hasResolved.current = true;
            setIsRefundQueued(true);
          }
          return;
        case "no_change":
          setNotice(translate("booking.payment.qr.not_confirmed"));
      }
    },
    [goToFailure, goToSuccess, translate],
  );

  useEffect(() => {
    if (!token || hasBootstrapped.current) return;
    hasBootstrapped.current = true;
    if (isClosed) return;

    void (async () => {
      const current = await getPaymentIntent(bookingId, token);
      if ("error" in current) {
        if (current.error.status === 404) await openIntent();
        else setErrorMessage(current.error.message);
        return;
      }
      // A pending row with no provider handle is the one `POST /bookings`
      // writes; a real attempt has to be opened on top of it.
      if (current.data.status === "pending" && current.data.kind === null) {
        await openIntent();
        return;
      }
      setIntent(current.data);
    })();
  }, [bookingId, isClosed, openIntent, token]);

  const intentStatus = intent?.status ?? null;

  useEffect(() => {
    if (!token || intentStatus !== "pending" || isRefundQueued) return;

    const intervalId = setInterval(() => {
      void (async () => {
        const current = await getPaymentIntent(bookingId, token);
        // A transient read failure keeps the visible code on screen.
        if ("error" in current) return;
        setIntent(current.data);
      })();
    }, INTENT_POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [bookingId, intentStatus, isRefundQueued, token]);

  useEffect(() => {
    if (!intent || hasResolved.current) return;
    if (intent.status === "failed") {
      goToFailure(intent.reason);
      return;
    }
    if (intent.status !== "success") return;

    // A success attempt is not proof the booking settled — a charge captured
    // after the window is refunded instead — so confirm against the booking.
    hasResolved.current = true;
    void (async () => {
      const bookingResult = await getBookingById(bookingId, undefined, token ?? undefined);
      if (!("error" in bookingResult) && bookingResult.data.status !== "paid") {
        setIsRefundQueued(true);
        return;
      }
      goToSuccess();
    })();
  }, [bookingId, goToFailure, goToSuccess, intent, token]);

  const simulate = useCallback(
    async (outcome: SimulatedOutcome) => {
      if (!token || simulatingOutcome !== null) return;
      setSimulatingOutcome(outcome);
      setErrorMessage(null);
      setNotice(null);

      try {
        const result = await simulatePaymentAction({ bookingId, outcome }, token);
        if (!result.success) {
          setErrorMessage(
            result.status === 403
              ? translate("booking.payment.qr.demo_unavailable")
              : result.status === 409
                ? translate("booking.payment.qr.no_open_payment")
                : result.error,
          );
          return;
        }
        applyOutcome(result.data);
      } catch {
        setErrorMessage(translate("common.error"));
      } finally {
        setSimulatingOutcome(null);
      }
    },
    [applyOutcome, bookingId, simulatingOutcome, token, translate],
  );

  const sync = useCallback(async () => {
    if (!token || isSyncing) return;
    setIsSyncing(true);
    setErrorMessage(null);
    setNotice(null);

    try {
      const result = await syncPaymentAction({ bookingId }, token);
      if (!result.success) {
        setErrorMessage(result.error);
        return;
      }
      applyOutcome(result.data);
    } catch {
      setErrorMessage(translate("common.error"));
    } finally {
      setIsSyncing(false);
    }
  }, [applyOutcome, bookingId, isSyncing, token, translate]);

  const reopen = useCallback(async () => {
    hasResolved.current = false;
    setIntent(null);
    await openIntent();
  }, [openIntent]);

  return {
    intent,
    isClosed,
    isOpening,
    isSyncing,
    simulatingOutcome,
    isRefundQueued,
    errorMessage,
    notice,
    simulate,
    sync,
    reopen,
  };
}
