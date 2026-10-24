"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { createTransferAction } from "@/features/tickets/action";
import type { TransferActionResult } from "@/features/tickets/action";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { getTransferErrorMessage } from "../utils";

const initialState: TransferActionResult = { success: false, error: "" };

interface TransferSubmit {
  formAction: (formData: FormData) => void;
  isPending: boolean;
  /** Backend rejection, localized; `null` while idle or succeeding. */
  error: string | null;
}

/**
 * Transfer-confirm submit controller: binds `createTransferAction` to a real form
 * action (hidden `ticketId` + `recipientEmail`), so React 19 wraps the submit in
 * a transition and the RAM access token never enters the DOM. The route moves to
 * the ticket detail from an effect on success — never during render.
 *
 * Shared by the mobile confirm bar and the desktop confirm rail; the markup
 * lives in `TransferConfirmForm`, and both skins print `error` above the buttons.
 */
export function useTransferSubmit(): TransferSubmit {
  const router = useRouter();
  const { translate } = useLocale();
  const { ticket } = useTicketDetail();

  const [state, formAction, isPending] = useActionState(createTransferAction, initialState);

  useEffect(() => {
    if (state.success) router.push(`/tickets/${ticket.id}`);
  }, [state, router, ticket.id]);

  const error = state.success
    ? null
    : state.error
      ? getTransferErrorMessage(translate, { message: state.error, code: state.code })
      : null;

  return { formAction, isPending, error };
}
