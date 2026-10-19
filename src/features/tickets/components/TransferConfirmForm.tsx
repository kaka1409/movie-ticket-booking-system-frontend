"use client";

import { useLocale } from "@/contexts/LocaleContext";
import Button from "@/components/ui/Button";

/**
 * The transfer-confirm form, shared by the mobile confirm bar and the desktop
 * confirm rail. Purely presentational — the action state comes from
 * `useTransferSubmit` so both skins drive the same submit.
 */
export default function TransferConfirmForm({
  formAction,
  isPending,
  ticketId,
  seatIds,
  recipientEmail,
  transferSnacks,
  className,
}: {
  formAction: (formData: FormData) => void;
  isPending: boolean;
  ticketId: string;
  /** Backend seat UUIDs of the selected labels — disabled submit when empty. */
  seatIds: string[];
  recipientEmail: string;
  transferSnacks: boolean;
  className?: string;
}) {
  const { translate } = useLocale();

  return (
    <form action={formAction} className={className}>
      <input type="hidden" name="ticketId" value={ticketId} />
      <input type="hidden" name="recipientEmail" value={recipientEmail} />
      <input type="hidden" name="transferSnacks" value={String(transferSnacks)} />
      {seatIds.map((seatId) => (
        <input key={seatId} type="hidden" name="seatId" value={seatId} />
      ))}
      <Button type="submit" loading={isPending} disabled={seatIds.length === 0}>
        {translate("tickets.transfer.confirm_cta")}
      </Button>
    </form>
  );
}
