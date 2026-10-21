"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cancelTransferAction } from "@/features/tickets/action";
import type { CancelTransferActionResult } from "@/features/tickets/action";

const initialState: CancelTransferActionResult = { success: false, error: "" };

/**
 * Owner-side "cancel the pending transfer" controller. The CTA is a real
 * `<form action={formAction}>` with a hidden `ticketId`; on success the route is
 * refreshed so the ticket comes back into the owner view (QR included).
 *
 * Shared by the mobile pending-transfer panel and the desktop actions rail.
 */
export function useCancelTransfer() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(cancelTransferAction, initialState);

  useEffect(() => {
    if (state.success) router.refresh();
  }, [state, router]);

  return { cancelFormAction: formAction, isCancelPending: isPending };
}
