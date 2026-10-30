import { DEFAULT_AVATAR } from "../constants";
import type { IncomingTransfer, OpenTransferStatus, TicketTransfer } from "../types";
import type { TicketDetailWire } from "../types";

/** Wire status → the two open states; anything unexpected reads as undecided. */
export function toOpenTransferStatus(status: string): OpenTransferStatus {
  return status === "awaiting_payment" ? "awaiting_payment" : "pending";
}

/** Open transfer → owner panel shape (who it went to, how much they pay). */
export function toTransfer(detail: TicketDetailWire): TicketTransfer | undefined {
  const pending = detail.pendingTransfer;
  if (!pending) return undefined;
  return {
    id: pending.id,
    status: toOpenTransferStatus(pending.status),
    recipient: {
      id: pending.recipient.id,
      name: pending.recipient.name,
      email: pending.recipient.email,
      avatar: pending.recipient.avatarUrl ?? DEFAULT_AVATAR,
    },
    amount: pending.amount,
    paymentExpiresAt: pending.paymentExpiresAt,
    createdAt: pending.createdAt,
  };
}

/** Incoming offer → recipient panel shape; the sender replaces the recipient. */
export function toIncomingTransfer(detail: TicketDetailWire): IncomingTransfer | undefined {
  const incoming = detail.incomingTransfer;
  if (!incoming) return undefined;
  return {
    id: incoming.id,
    status: toOpenTransferStatus(incoming.status),
    sender: {
      id: incoming.sender.id,
      name: incoming.sender.name,
      email: incoming.sender.email,
      avatar: incoming.sender.avatarUrl ?? DEFAULT_AVATAR,
    },
    amount: incoming.amount,
    paymentExpiresAt: incoming.paymentExpiresAt,
    createdAt: incoming.createdAt,
  };
}
