"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { getTransferPaymentIntent } from "@/features/booking/api";
import {
  createTransferPaymentIntentAction,
  simulateTransferPaymentAction,
  syncTransferPaymentAction,
} from "@/features/booking/action";
import { usePaymentAttempt } from "@/features/booking/hooks/usePaymentAttempt";
import type {
  PaymentIntent,
  PaymentMethodId,
  PaymentOutcomeWithIntent,
  SimulatedOutcome,
} from "@/features/booking/types";
import { getTicketOwnership } from "../api";

/** Provider poll cadence: fast enough to feel live, cheap enough for a demo. */
const INTENT_POLL_INTERVAL_MS = 3000;

/** The attempt's message channel — passed down so pre-hook callbacks never close over hook state. */
interface PaymentMessages {
  setErrorMessage: (message: string | null) => void;
  setNotice: (message: string | null) => void;
}

/**
 * Where the recipient's checkout stands:
 * `reading` the stored attempt → `choosing` a method (nothing opened yet) →
 * `paying` (QR on screen) → one terminal stage.
 */
export type TransferPaymentStage =
  "reading" | "choosing" | "paying" | "settled" | "expired" | "refunded" | "declined";

export interface UseTransferPaymentResult {
  stage: TransferPaymentStage;
  intent: PaymentIntent | null;
  isOpening: boolean;
  isSyncing: boolean;
  simulatingOutcome: SimulatedOutcome | null;
  errorMessage: string | null;
  notice: string | null;
  /** Open the charge for the chosen gateway (picker → QR). */
  start: (method: PaymentMethodId) => Promise<void>;
  simulate: (outcome: SimulatedOutcome) => Promise<void>;
  sync: () => Promise<void>;
  /** Back to the picker after a decline, while the window is still open. */
  retry: () => void;
}

/**
 * Recipient-side checkout controller for an accepted transfer. The deal's own
 * deadline — not this hook — decides when money stops being accepted, so the
 * page polls the attempt and never closes itself.
 *
 * A captured charge is not proof the ticket moved (money arriving after the deal
 * closed is refunded), so success is confirmed against ownership.
 */
export function useTransferPayment({
  ticketId,
  transferId,
}: {
  ticketId: string;
  transferId: string;
}): UseTransferPaymentResult {
  const router = useRouter();
  const { token } = useAuth();
  const { translate } = useLocale();

  const [stage, setStage] = useState<TransferPaymentStage>("reading");
  const [intent, setIntent] = useState<PaymentIntent | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  /** One terminal decision per page — a late poll must not navigate twice. */
  const hasResolved = useRef(false);
  const hasBootstrapped = useRef(false);

  const goToTicket = useCallback(() => {
    hasResolved.current = true;
    router.replace(`/tickets/${ticketId}`);
  }, [router, ticketId]);

  /**
   * Ownership is the only honest answer to "did I get the ticket?": a refunded
   * capture leaves it with the sender, a settled one moved it here.
   */
  const resolveCapture = useCallback(
    async (captured: PaymentIntent, messages: PaymentMessages) => {
      setIntent(captured);
      messages.setErrorMessage(null);
      if (!token) return;

      const ownership = await getTicketOwnership(ticketId, token);
      if ("error" in ownership) {
        // A 404 means this ticket is not on the recipient's side at all, which is
        // exactly what a refunded late capture looks like. Anything else may be a
        // transient read: stay on the code so "check status" can retry.
        if (ownership.error.status === 404) {
          setStage("refunded");
          return;
        }
        setStage("paying");
        messages.setErrorMessage(ownership.error.message);
        return;
      }
      if (ownership.data.viewerRole === "owner") {
        setStage("settled");
        goToTicket();
        return;
      }
      setStage("refunded");
    },
    [goToTicket, ticketId, token],
  );

  const applyIntent = useCallback(
    (next: PaymentIntent, messages: PaymentMessages) => {
      if (next.status === "success") {
        void resolveCapture(next, messages);
        return;
      }
      setIntent(next);
      if (next.status === "failed") {
        setStage("declined");
        return;
      }
      // The attempt's deadline is the deal's deadline, so an expired attempt
      // means the offer is over — the sender has to send it again.
      if (next.status === "expired") {
        setStage("expired");
        return;
      }
      setStage("paying");
    },
    [resolveCapture],
  );

  const applyOutcome = useCallback(
    (outcome: PaymentOutcomeWithIntent, helpers: PaymentMessages) => {
      setIntent(outcome.intent);

      switch (outcome.settlement) {
        case "transfer_settled":
          if (hasResolved.current) return;
          setStage("settled");
          goToTicket();
          return;
        case "transfer_expired":
        case "duplicate_charge":
          if (hasResolved.current) return;
          setStage("refunded");
          return;
        case "declined":
          setStage("declined");
          return;
        case "no_change":
          // Nothing left to apply: the attempt's own state is the answer.
          if (outcome.intent.status === "pending") {
            helpers.setNotice(translate("tickets.transfer.payment.not_confirmed"));
            return;
          }
          applyIntent(outcome.intent, helpers);
          return;
        default:
          applyIntent(outcome.intent, helpers);
      }
    },
    [applyIntent, goToTicket, translate],
  );

  const simulateAction = useCallback(
    (outcome: SimulatedOutcome, attemptToken: string) =>
      simulateTransferPaymentAction({ transferId, outcome }, attemptToken),
    [transferId],
  );

  const syncAction = useCallback(
    (attemptToken: string) => syncTransferPaymentAction({ transferId }, attemptToken),
    [transferId],
  );

  const {
    isSyncing,
    simulatingOutcome,
    errorMessage,
    notice,
    setErrorMessage,
    setNotice,
    simulate,
    sync,
  } = usePaymentAttempt({ simulateAction, syncAction, applyOutcome });

  const start = useCallback(
    async (method: PaymentMethodId) => {
      if (!token) return;
      setIsOpening(true);
      setErrorMessage(null);
      setNotice(null);

      try {
        const result = await createTransferPaymentIntentAction({ transferId, method }, token);
        if (!result.success) {
          if (result.code === "TRANSFER_NOT_PENDING" || result.code === "INVALID_STATE") {
            setStage("expired");
            return;
          }
          setErrorMessage(result.error);
          return;
        }
        applyIntent(result.data, { setErrorMessage, setNotice });
      } catch {
        setErrorMessage(translate("common.error"));
      } finally {
        setIsOpening(false);
      }
    },
    [applyIntent, transferId, token, translate, setErrorMessage, setNotice],
  );

  useEffect(() => {
    if (!token || hasBootstrapped.current) return;
    hasBootstrapped.current = true;

    void (async () => {
      const current = await getTransferPaymentIntent(transferId, token);
      if ("error" in current) {
        // 404 = this deal never had a charge, which is the picker's starting
        // point; any other failure still lets the recipient try to open one.
        if (current.error.status !== 404) setErrorMessage(current.error.message);
        setStage("choosing");
        return;
      }
      applyIntent(current.data, { setErrorMessage, setNotice });
    })();
  }, [applyIntent, token, transferId, setErrorMessage, setNotice]);

  useEffect(() => {
    if (!token || stage !== "paying" || intent?.status !== "pending") return;

    const intervalId = setInterval(() => {
      void (async () => {
        const current = await getTransferPaymentIntent(transferId, token);
        // A transient read failure keeps the visible code on screen.
        if ("error" in current) return;
        if (current.data.status === intent.status) return;
        applyIntent(current.data, { setErrorMessage, setNotice });
      })();
    }, INTENT_POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [applyIntent, intent?.status, stage, token, transferId, setErrorMessage, setNotice]);

  const retry = useCallback(() => {
    hasResolved.current = false;
    setIntent(null);
    setNotice(null);
    setErrorMessage(null);
    setStage("choosing");
  }, [setNotice, setErrorMessage]);

  return {
    stage,
    intent,
    isOpening,
    isSyncing,
    simulatingOutcome,
    errorMessage,
    notice,
    start,
    simulate,
    sync,
    retry,
  };
}
