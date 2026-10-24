"use client";

import { useLocale } from "@/contexts/LocaleContext";
import Button from "@/components/ui/Button";

/**
 * The transfer-confirm form, shared by the mobile confirm bar and the desktop
 * confirm rail. Purely presentational — the action state comes from
 * `useTransferSubmit` so both skins drive the same submit. The offer is the whole
 * ticket, so the payload carries no seat ids and no snack flag.
 */
export default function TransferConfirmForm({
  formAction,
  isPending,
  ticketId,
  recipientEmail,
  className,
}: {
  formAction: (formData: FormData) => void;
  isPending: boolean;
  ticketId: string;
  recipientEmail: string;
  className?: string;
}) {
  const { translate } = useLocale();

  return (
    <form action={formAction} className={className}>
      <input type="hidden" name="ticketId" value={ticketId} />
      <input type="hidden" name="recipientEmail" value={recipientEmail} />
      <Button type="submit" loading={isPending}>
        {translate("tickets.transfer.confirm_cta")}
      </Button>
    </form>
  );
}
