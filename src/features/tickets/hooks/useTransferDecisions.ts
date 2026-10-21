"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { acceptTransferAction, declineTransferAction } from "@/features/tickets/action";
import type { TransferDecisionActionResult } from "@/features/tickets/action";

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
  /** Error text while neither decision settled; empty otherwise. */
  error: string;
}

/**
 * Recipient-side transfer decision controller (accept / decline), shared by the
 * mobile action block and the desktop actions rail. Both dispatchers belong on a
 * real `<form action={...}>` (hidden `transferId`) — never on an `onClick`.
 *
 * Accepted → the same URL re-renders as the owner view (QR included), so the
 * route is refreshed. Declined (or already settled) → the ticket is no longer
 * readable here, so the visitor goes back to the listing.
 */
export function useTransferDecisions(): TransferDecisions {
  const router = useRouter();

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
    router.refresh();
  }, [acceptState, router]);

  useEffect(() => {
    if (!isSettled(declineState)) return;
    router.replace("/tickets");
    router.refresh();
  }, [declineState, router]);

  const isSettledNow = isSettled(acceptState) || isSettled(declineState);
  // A settled decision is "already handled", not a failure — only surface an
  // error while neither side has settled.
  const error =
    !isSettledNow && !acceptState.success && !declineState.success
      ? acceptState.error || declineState.error
      : "";

  return {
    acceptFormAction,
    declineFormAction,
    isAccepting,
    isDeclining,
    isBusy: isAccepting || isDeclining,
    error,
  };
}
