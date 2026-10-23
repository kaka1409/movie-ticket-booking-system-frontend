"use client";

import { useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { modifyTicketAction } from "@/features/tickets/action";

interface ModifySubmit {
  /** False when the draft holds nothing the backend could act on. */
  canSubmit: boolean;
  isPending: boolean;
  errorMessage: string | null;
  /** Sends the change and lands on the success step. */
  submit: () => void;
}

/**
 * Review-step controller. A modification is a same-price swap (the server
 * refuses anything else), so there is no payment step — this submit is the
 * last screen before success, and the payload names only what actually changed.
 */
export function useModifySubmit(): ModifySubmit {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const { modificationType, selectedShowtime, selectedSeats } = useModification();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const id = params.id as string;

  // A seats-only change targets the current showtime by definition, so a
  // leftover target showtime from an earlier attempt must not be sent.
  const isSeatsOnly = modificationType === "seats";
  const newShowtimeId = isSeatsOnly ? undefined : selectedShowtime?.showtimeId;
  const newSeatIds = selectedSeats.flatMap((seat) => seat.seatIds);
  const canSubmit = Boolean(newShowtimeId) || newSeatIds.length > 0;

  const submit = () => {
    if (isPending || !canSubmit) return;
    setErrorMessage(null);

    startTransition(async () => {
      const result = await modifyTicketAction(
        { success: false, error: "" },
        {
          ticketId: id,
          newShowtimeId,
          newSeatIds: newSeatIds.length > 0 ? newSeatIds : undefined,
          token: token ?? "",
        },
      );

      if (!result.success) {
        setErrorMessage(result.error);
        return;
      }

      router.push(`/tickets/${id}/modify/success`);
    });
  };

  return { canSubmit, isPending, errorMessage, submit };
}
