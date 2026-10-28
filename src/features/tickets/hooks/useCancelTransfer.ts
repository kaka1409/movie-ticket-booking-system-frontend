"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import { cancelTransferAction } from "@/features/tickets/action";
import type { CancelTransferActionResult } from "@/features/tickets/action";
import { getTransferErrorMessage } from "../utils";

const initialState: CancelTransferActionResult = { success: false, error: "" };

/**
 * Owner-side "withdraw the offer" controller. The CTA is a real
 * `<form action={formAction}>` with a hidden `ticketId`; on success the route is
 * refreshed so the ticket comes back into the owner view (QR included).
 *
 * Withdrawing can be refused while the recipient's checkout is live
 * (`TRANSFER_PAYMENT_IN_PROGRESS`), so the rejection is surfaced, localized,
 * next to the button instead of being swallowed.
 */
export function useCancelTransfer() {
  const router = useRouter();
  const { translate } = useLocale();
  const { notify } = useToast();
  const [state, formAction, isPending] = useActionState(cancelTransferAction, initialState);

  useEffect(() => {
    if (state.success) router.refresh();
    else if (state.error) {
      notify(getTransferErrorMessage(translate, { message: state.error, code: state.code }), {
        variant: "error",
      });
    }
  }, [state, router, translate, notify]);

  const error = state.success
    ? ""
    : state.error
      ? getTransferErrorMessage(translate, { message: state.error, code: state.code })
      : "";

  return { cancelFormAction: formAction, isCancelPending: isPending, error };
}
