"use client";

import { useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { modifyTicketAction } from "@/features/tickets/action";

/**
 * Change fees mirrored by hand from the backend's fee schedule — the server is
 * the authority on the final charge, so these must move with it.
 */
const SHOWTIME_CHANGE_FEE = 15_000;
const SEAT_CHANGE_FEE = 10_000;

interface ModifyPayment {
  /** Amount to charge (negative = a refund is due). */
  difference: number;
  selectedMethod: string | null;
  setSelectedMethod: (methodId: string) => void;
  canPay: boolean;
  isPending: boolean;
  errorMessage: string | null;
  /** Submits the modification and routes to the success step. */
  confirm: () => void;
}

/**
 * Modify-payment controller — fee math plus the `modifyTicketAction` submit, shared by
 * the mobile payment step and the desktop payment rail. The refund/charge lands
 * on the original payment method server-side; the local gateway cards only pick
 * which method the difference is charged to.
 */
export function useModifyPayment(): ModifyPayment {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const { ticket } = useTicketDetail();
  const { modificationType, selectedShowtime, selectedSeats } = useModification();

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const id = params.id as string;
  const showShowtime = modificationType === "showtime" || modificationType === "both";
  const showSeats = modificationType === "seats" || modificationType === "both";
  const hasSeatChange = selectedSeats.length > 0;

  let difference = 0;
  if (showShowtime) difference += SHOWTIME_CHANGE_FEE;
  if (showSeats && hasSeatChange) {
    const currentSeatTotal = ticket.seatItems.reduce((sum, seat) => sum + seat.price, 0);
    const newSeatTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    difference += newSeatTotal - currentSeatTotal;
  }
  if (hasSeatChange) difference += SEAT_CHANGE_FEE;

  const canPay = Boolean(selectedMethod) && !isPending;

  const confirm = () => {
    if (!canPay) return;
    setErrorMessage(null);

    startTransition(async () => {
      const newShowtime = selectedShowtime?.showtimeId
        ? { showtimeId: selectedShowtime.showtimeId }
        : undefined;
      const seatIds = selectedSeats.flatMap((seat) => seat.seatIds);
      const newSeats = seatIds.length > 0 ? { seatIds } : undefined;

      const result = await modifyTicketAction(
        { success: false, error: "" },
        {
          ticketId: id,
          modificationType: modificationType ?? "showtime",
          newShowtime,
          newSeats,
          token: token ?? "",
        },
      );

      if (!result.success) {
        setErrorMessage(result.error);
        return;
      }

      const transactionId = `TXN${Date.now()}`;
      router.push(`/tickets/${id}/modify/success?transactionId=${transactionId}`);
    });
  };

  return {
    difference,
    selectedMethod,
    setSelectedMethod,
    canPay,
    isPending,
    errorMessage,
    confirm,
  };
}
