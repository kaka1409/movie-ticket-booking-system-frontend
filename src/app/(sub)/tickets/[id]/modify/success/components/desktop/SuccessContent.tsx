"use client";

import { useParams } from "next/navigation";
import { Ticket } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Button from "@/components/ui/Button";
import SuccessIcon from "@/components/shared/SuccessIcon";

/**
 * Desktop modification outcome: the same centred hero the booking flow uses,
 * with the single return-to-ticket action. No stepper — success is terminal.
 */
export default function SuccessContent() {
  const params = useParams();
  const id = params.id as string;
  const { translate } = useLocale();

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-6 py-20 lg:px-8">
      <SuccessIcon
        titleKey="tickets.modify.success.title"
        messageKey="tickets.modify.success.message"
      />

      <div className="mt-10 w-full max-w-sm">
        <Button href={`/tickets/${id}`} icon={Ticket} iconPosition="left">
          {translate("tickets.modify.success.view_ticket")}
        </Button>
      </div>
    </div>
  );
}
