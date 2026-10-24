"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { acceptTransferAction, declineTransferAction } from "@/features/tickets/action";
import type { TransferDecisionActionResult } from "@/features/tickets/action";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { getTransferErrorMessage } from "../utils";

const initialDecisionState: TransferDecisionActionResult = { success: false, error: "" };

/** A decided transfer (accepted elsewhere/expired) is not an error — it is done. */
function isSettled(state: TransferDecisionActionResult): boolean {
  return state.success || state.code === "TRANSFER_NOT_PENDING";
}

interface TransferDecisions {
  acceptFormAction: (formData: FormData) => void;
  declineFormAction: (formData: FormData) => void;
  isAccepting: boolean;
  isDeclining: boolean;
  /** Any decision in flight — both buttons disable. */
  isBusy: boolean;
  /** Localized error text while neither decision settled; empty otherwise. */
  error: string;
}

/**
 * Recipient-side transfer decision controller (accept / decline), shared by the
 * mobile action block and the desktop actions rail. Both dispatchers belong on a
 * real `<form action={...}>` — never on an `onClick`.
 *
 * Accept only moves the deal to `awaiting_payment`: ownership follows the money,
 * so the next stop is the transfer checkout. Declined (or an offer that closed
 * meanwhile) leaves nothing to read here, so the visitor goes to the listing.
 */
export function useTransferDecisions(): TransferDecisions {
  const router = useRouter();
  const { translate } = useLocale();
  const { ticket } = useTicketDetail();

  const [acceptState, acceptFormAction, isAccepting] = useActionState(
    acceptTransferAction,
    initialDecisionState,
  );
  const [declineState, declineFormAction, isDeclining] = useActionState(
    declineTransferAction,
    initialDecisionState,
  );

  useEffect(() => {
    if (!isSettled(acceptState)) return;
    if (acceptState.success) {
      router.push(`/tickets/${ticket.id}/transfer/payment`);
      return;
    }
    router.replace("/tickets");
  }, [acceptState, router, ticket.id]);

  useEffect(() => {
    if (!isSettled(declineState)) return;
    router.replace("/tickets");
  }, [declineState, router]);

  const isSettledNow = isSettled(acceptState) || isSettled(declineState);
  // A settled decision is "already handled", not a failure — only surface an
  // error while neither side has settled.
  const failure =
    !acceptState.success && acceptState.error
      ? acceptState
      : !declineState.success && declineState.error
        ? declineState
        : null;
  const error =
    isSettledNow || failure === null
      ? ""
      : getTransferErrorMessage(translate, { message: failure.error, code: failure.code });

  return {
    acceptFormAction,
    declineFormAction,
    isAccepting,
    isDeclining,
    isBusy: isAccepting || isDeclining,
    error,
  };
}
