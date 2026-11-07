"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ScanLine } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ErrorAlert from "@/components/ui/ErrorAlert";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import { formatVND } from "@/libs/utils";
import { formatCalendarDate } from "@/libs/date";
import { resolveAdminError } from "@/features/admin/errorMessages";
import {
  cancelAdminTicketAction,
  checkInAdminTicketAction,
  getAdminTicketDetailAction,
} from "@/features/admin/actions/transactions.action";
import type { AdminTicket, AdminTicketDetail } from "@/features/admin/types";

/**
 * Expanded-row detail for one ticket (entitlement). Fetches the full detail on
 * mount — keyed by `ticket.id` — and owns the two staff writes: manual
 * check-in (the QR path stays on /admin/check-in) and cancel/refund.
 */
export default function TicketDetailPanel({ ticket }: { ticket: AdminTicket }) {
  const { translate, locale } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();
  const [detail, setDetail] = useState<AdminTicketDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    void getAdminTicketDetailAction(ticket.id).then((result) => {
      if (cancelled) return;
      if (result.success) {
        setDetail(result.data);
      } else {
        setLoadError(result.error);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [ticket.id]);

  const handleCheckIn = () => {
    if (!token) return;
    startTransition(async () => {
      const result = await checkInAdminTicketAction(token, ticket.id);
      if (!result.success) {
        notify(resolveAdminError(result, translate), { variant: "error" });
        return;
      }
      notify(translate("admin.tickets.checked_in"), { variant: "success" });
      router.refresh();
    });
  };

  const handleCancel = () => {
    if (!token) return;
    startTransition(async () => {
      const result = await cancelAdminTicketAction(token, ticket.id);
      if (!result.success) {
        setActionError(resolveAdminError(result, translate));
        return;
      }
      setIsCancelOpen(false);
      notify(
        translate(
          result.data.refundStatus === "processing"
            ? "admin.tickets.cancelled_refund"
            : "admin.tickets.cancelled",
        ),
        { variant: "success" },
      );
      router.refresh();
    });
  };

  if (loadError) {
    return <ErrorAlert message={loadError} />;
  }
  if (!detail) {
    return (
      <p className="py-4 text-[12px] text-(--color-text-muted)">
        {translate("admin.common.loading")}
      </p>
    );
  }

  const isActive = detail.status === "active" && !detail.revokedAt;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 text-[12px] sm:grid-cols-2 lg:grid-cols-4">
        <section>
          <h4 className="text-[10px] font-bold tracking-[0.14em] text-(--color-text-muted) uppercase">
            {translate("admin.tickets.detail_owner")}
          </h4>
          <p className="mt-1 font-semibold text-(--color-text-primary)">
            {detail.owner.fullname ?? detail.owner.email}
          </p>
          <p className="text-(--color-text-muted)">{detail.owner.email}</p>
          <p className="mt-1 text-(--color-text-muted)">
            {translate("admin.tickets.buyer")}:{" "}
            {detail.booking.contact?.name ?? detail.booking.contact?.email ?? "—"}
          </p>
        </section>

        <section>
          <h4 className="text-[10px] font-bold tracking-[0.14em] text-(--color-text-muted) uppercase">
            {translate("admin.tickets.detail_showtime")}
          </h4>
          <p className="mt-1 font-semibold text-(--color-text-primary)">
            {detail.booking.showtime.movie.title}
          </p>
          <p className="text-(--color-text-muted)">
            {formatCalendarDate(detail.booking.showtime.date.slice(0, 10), locale)} ·{" "}
            {detail.booking.showtime.startTime}–{detail.booking.showtime.endTime} ·{" "}
            {detail.booking.showtime.format}
          </p>
          <p className="text-(--color-text-muted)">
            {detail.booking.showtime.cinema.name} — {detail.booking.showtime.room.name}
          </p>
        </section>

        <section>
          <h4 className="text-[10px] font-bold tracking-[0.14em] text-(--color-text-muted) uppercase">
            {translate("admin.tickets.detail_seats")}
          </h4>
          <ul className="mt-1 space-y-0.5">
            {detail.booking.seats.map((seat) => (
              <li key={seat.id} className="text-(--color-text-primary)">
                {seat.label}{" "}
                <span className="text-(--color-text-muted)">
                  ({seat.type} · {formatVND(seat.price, locale)})
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h4 className="text-[10px] font-bold tracking-[0.14em] text-(--color-text-muted) uppercase">
            {translate("admin.tickets.detail_status")}
          </h4>
          <div className="mt-1 space-y-1">
            <Badge
              variant={
                detail.status === "active"
                  ? "gold"
                  : detail.status === "used"
                    ? "success"
                    : "neutral"
              }
              size="xs"
            >
              {translate(`admin.tickets.status_${detail.status}`)}
            </Badge>
            <p className="text-(--color-text-muted)">
              {translate("admin.tickets.issued_at")}:{" "}
              {new Date(detail.issuedAt).toLocaleString()}
            </p>
            {detail.usedAt && (
              <p className="text-(--color-text-muted)">
                {translate("admin.tickets.used_at")}:{" "}
                {new Date(detail.usedAt).toLocaleString()}
              </p>
            )}
            {detail.reminderSentAt && (
              <p className="text-(--color-text-muted)">
                {translate("admin.tickets.reminder_sent")}:{" "}
                {new Date(detail.reminderSentAt).toLocaleString()}
              </p>
            )}
          </div>
        </section>
      </div>

      {detail.transfers.length > 0 && (
        <section className="rounded-lg border border-(--color-border) p-3">
          <h4 className="text-[10px] font-bold tracking-[0.14em] text-(--color-text-muted) uppercase">
            {translate("admin.tickets.detail_transfers")}
          </h4>
          <ul className="mt-2 space-y-2">
            {detail.transfers.map((transfer) => (
              <li
                key={transfer.id}
                className="rounded-lg border border-(--color-border) p-2 text-[12px]"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="neutral" size="xs">
                    {transfer.status}
                  </Badge>
                  <span className="text-(--color-text-primary)">
                    {transfer.sender.fullname ?? transfer.sender.email} →{" "}
                    {transfer.recipient.fullname ?? transfer.recipient.email}
                  </span>
                  <span className="tabular-nums text-(--color-text-muted)">
                    {formatVND(transfer.amount, locale)}
                  </span>
                  <span className="text-[11px] text-(--color-text-muted)">
                    {new Date(transfer.createdAt).toLocaleString()}
                  </span>
                </div>
                {transfer.payments.map((payment) => (
                  <p key={payment.id} className="mt-1 text-[11px] text-(--color-text-muted)">
                    {payment.kind} · {payment.status} · {formatVND(payment.amount, locale)}
                    {payment.transactionRef ? ` · ${payment.transactionRef}` : ""}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-(--color-border) pt-3">
        {isActive && (
          <>
            <AdminButton
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={handleCheckIn}
            >
              <ScanLine size={13} aria-hidden className="mr-1 inline" />
              {translate("admin.tickets.check_in")}
            </AdminButton>
            <AdminButton
              size="sm"
              variant="danger"
              disabled={isPending}
              onClick={() => {
                setActionError(null);
                setIsCancelOpen(true);
              }}
            >
              {translate("admin.tickets.cancel_ticket")}
            </AdminButton>
          </>
        )}
        {actionError && <ErrorAlert message={actionError} />}
      </div>

      <ConfirmDialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleCancel}
        title={translate("admin.tickets.cancel_title")}
        description={translate("admin.tickets.cancel_body")}
        confirmLabel={translate("admin.tickets.cancel_ticket")}
        cancelLabel={translate("admin.common.cancel")}
        isPending={isPending}
        danger
      />
    </div>
  );
}
