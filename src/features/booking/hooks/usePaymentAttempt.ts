"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import type { BookingActionResult } from "../action";
import type { PaymentOutcomeWithIntent, SimulatedOutcome } from "../types";

export interface PaymentAttemptControls {
  isSyncing: boolean;
  simulatingOutcome: SimulatedOutcome | null;
  errorMessage: string | null;
  notice: string | null;
  setErrorMessage: (message: string | null) => void;
  setNotice: (message: string | null) => void;
  simulate: (outcome: SimulatedOutcome) => Promise<void>;
  sync: () => Promise<void>;
}

/**
 * Shared machinery for a payment attempt — booking checkout and transfer
 * checkout run the same simulate/sync protocol against different endpoints.
 * The caller injects its bound actions and decides what a settled outcome
 * means (`applyOutcome` owns navigation/stage transitions).
 */
export function usePaymentAttempt({
  simulateAction,
  syncAction,
  applyOutcome,
}: {
  simulateAction: (
    outcome: SimulatedOutcome,
    token: string,
  ) => Promise<BookingActionResult<PaymentOutcomeWithIntent>>;
  syncAction: (token: string) => Promise<BookingActionResult<PaymentOutcomeWithIntent>>;
  /** Receives the outcome plus the message setters — the caller owns navigation/stages. */
  applyOutcome: (
    outcome: PaymentOutcomeWithIntent,
    helpers: Pick<PaymentAttemptControls, "setErrorMessage" | "setNotice">,
  ) => void;
}): PaymentAttemptControls {
  const { token } = useAuth();
  const { translate } = useLocale();

  const [isSyncing, setIsSyncing] = useState(false);
  const [simulatingOutcome, setSimulatingOutcome] = useState<SimulatedOutcome | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const simulate = useCallback(
    async (outcome: SimulatedOutcome) => {
      if (!token || simulatingOutcome !== null) return;
      setSimulatingOutcome(outcome);
      setErrorMessage(null);
      setNotice(null);

      try {
        const result = await simulateAction(outcome, token);
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
        applyOutcome(result.data, { setErrorMessage, setNotice });
      } catch {
        setErrorMessage(translate("common.error"));
      } finally {
        setSimulatingOutcome(null);
      }
    },
    [applyOutcome, simulateAction, simulatingOutcome, token, translate],
  );

  const sync = useCallback(async () => {
    if (!token || isSyncing) return;
    setIsSyncing(true);
    setErrorMessage(null);
    setNotice(null);

    try {
      const result = await syncAction(token);
      if (!result.success) {
        setErrorMessage(result.error);
        return;
      }
      applyOutcome(result.data, { setErrorMessage, setNotice });
    } catch {
      setErrorMessage(translate("common.error"));
    } finally {
      setIsSyncing(false);
    }
  }, [applyOutcome, isSyncing, syncAction, token, translate]);

  return {
    isSyncing,
    simulatingOutcome,
    errorMessage,
    notice,
    setErrorMessage,
    setNotice,
    simulate,
    sync,
  };
}
