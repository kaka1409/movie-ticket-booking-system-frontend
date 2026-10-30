import { notFound, redirect } from "next/navigation";
import { getPaymentMethods } from "@/features/booking/api";
import { getTicketById } from "@/features/tickets/api";
import { getRequestCookie, getRequestLocale } from "@/libs/session";
import TransferPaymentScreen from "./components/shared/TransferPaymentScreen";

/**
 * The recipient's checkout for an accepted transfer. Only an `awaiting_payment`
 * deal has one: before the accept the offer belongs on the ticket page, and once
 * the deal closed there is nothing to pay.
 */
export default async function TransferPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [cookie, locale] = await Promise.all([getRequestCookie(), getRequestLocale()]);
  const [ticketResult, catalogResult] = await Promise.all([
    getTicketById(id, cookie, locale),
    getPaymentMethods(locale),
  ]);

  if ("error" in ticketResult) notFound();

  const ticket = ticketResult.data;
  const incoming = "incomingTransfer" in ticket ? ticket.incomingTransfer : undefined;
  if (!incoming || incoming.status !== "awaiting_payment") redirect(`/tickets/${id}`);

  const catalog = "error" in catalogResult ? null : catalogResult.data;

  return (
    <TransferPaymentScreen
      transferId={incoming.id}
      amount={incoming.amount}
      paymentExpiresAt={incoming.paymentExpiresAt}
      paymentMethods={catalog?.methods ?? []}
      isDemo={catalog?.demo ?? false}
      catalogError={"error" in catalogResult ? catalogResult.error.message : null}
    />
  );
}
