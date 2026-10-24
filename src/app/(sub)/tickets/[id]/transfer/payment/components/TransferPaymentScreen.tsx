"use client";

import { useState } from "react";
import { getPaymentLabel } from "@/features/booking/paymentBrand";
import type { PaymentMethodOption } from "@/features/booking/types";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import {
  useTransferPayment,
  type UseTransferPaymentResult,
} from "@/features/tickets/hooks/useTransferPayment";
import TransferPaymentDesktop from "./desktop/TransferPaymentContent";
import TransferPaymentMobile from "./mobile/TransferPaymentContent";

/** Props both device skins drive — one shape, so a state can never fork by width. */
export interface TransferPaymentViewProps {
  amount: number;
  paymentExpiresAt: string | null;
  methodLabel: string;
  isDemo: boolean;
  catalogError: string | null;
  paymentMethods: PaymentMethodOption[];
  selectedMethodId: string;
  onSelectMethod: (method: PaymentMethodOption) => void;
  payment: UseTransferPaymentResult;
}

/**
 * Both device trees render, so the checkout lifecycle (read the stored attempt,
 * poll it, settle or refund) is mounted exactly once here and the skins stay
 * presentational. The gateway choice lives here too — a per-skin copy would fork
 * the picker.
 */
export default function TransferPaymentScreen({
  transferId,
  amount,
  paymentExpiresAt,
  paymentMethods,
  isDemo,
  catalogError,
}: {
  transferId: string;
  amount: number;
  paymentExpiresAt: string | null;
  paymentMethods: PaymentMethodOption[];
  isDemo: boolean;
  catalogError: string | null;
}) {
  const { ticket } = useTicketDetail();
  const payment = useTransferPayment({ ticketId: ticket.id, transferId });

  const [selectedMethodId, setSelectedMethodId] = useState(() => {
    const sellable = paymentMethods.filter((method) => method.enabled);
    return sellable.length === 1 ? sellable[0].id : "";
  });

  // A resumed attempt owns its gateway: switching methods means a new attempt,
  // whose amount and deadline are the deal's, never this page's.
  const viewProps: TransferPaymentViewProps = {
    amount,
    paymentExpiresAt,
    methodLabel: getPaymentLabel(paymentMethods, payment.intent?.method ?? selectedMethodId),
    isDemo,
    catalogError,
    paymentMethods,
    selectedMethodId,
    onSelectMethod: (method) => setSelectedMethodId(method.id),
    payment,
  };

  return (
    <>
      <div className="block md:hidden">
        <TransferPaymentMobile {...viewProps} />
      </div>

      <div className="hidden md:block">
        <TransferPaymentDesktop {...viewProps} />
      </div>
    </>
  );
}
