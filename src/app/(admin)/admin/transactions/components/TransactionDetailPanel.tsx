"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
  cancelAdminTransactionAction,
  getAdminTransactionDetailAction,
} from "@/features/admin/actions/transactions.action";
import type { AdminTransactionDetail } from "@/features/admin/types";

/**
 * Expanded-row detail for one transaction. The list row deliberately carries
 * no payments/refunds, so the panel fetches the full detail once on mount —
 * keyed by `transactionId`, which is the request-keyed refetch the client
 * rules allow. Cancel goes through a confirm dialog: a paid booking refunds
 * real money, so the operator sees the consequence before committing.
 */
export default function TransactionDetailPanel({
  transactionId,
}: {
  transactionId: string;
}) {
  const { translate, locale } = useLocale();
  const { token } = useAuth();
  const { notify } = useToast();
  const router = useRouter();
  const [detail, setDetail] = useState<AdminTransactionDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    void getAdminTransactionDetailAction(transactionId).then((result) => {
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
  }, [transactionId]);

  const handleCancel = () => {
    if (!token) return;
    startTransition(async () => {
      const result = await cancelAdminTransactionAction(token, transactionId);
      if (!result.success) {
        setActionError(resolveAdminError(result, translate));
        return;
      }
      setIsConfirmOpen(false);
      notify(
        translate(
          result.data.refundStatus === "processing"
            ? "admin.transactions.cancelled_refund"
            : "admin.transactions.cancelled",
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
    return <p className="py-4 text-[12px] text-(--color-text-muted)">{translate("admin.common.loading")}</p>;
  }

  const isCancellable = detail.status === "pending" || detail.status === "paid";

  return (
    <div className="space-y-4">
      <div className="grid gap-4 text-[12px] sm:grid-cols-2 lg:grid-cols-4">
        <section>
          <h4 className="text-[10px] font-bold tracking-[0.14em] text-(--color-text-muted) uppercase">
            {translate("admin.transactions.detail_customer")}
          </h4>
          <p className="mt-1 font-semibold text-(--color-text-primary)">
            {detail.customer.fullname ?? detail.customer.email}
          </p>
          <p className="text-(--color-text-muted)">{detail.customer.email}</p>
          {(detail.contact.name || detail.contact.phone || detail.contact.email) && (
            <p className="mt-1 text-(--color-text-muted)">
              {[detail.contact.name, detail.contact.phone, detail.contact.email]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </section>

        <section>
          <h4 className="text-[10px] font-bold tracking-[0.14em] text-(--color-text-muted) uppercase">
            {translate("admin.transactions.detail_showtime")}
          </h4>
          <p className="mt-1 font-semibold text-(--color-text-primary)">
            {detail.showtime.movie.title}
          </p>
          <p className="text-(--color-text-muted)">
            {formatCalendarDate(detail.showtime.date.slice(0, 10), locale)} ·{" "}
            {detail.showtime.startTime}–{detail.showtime.endTime} · {detail.showtime.format}
          </p>
          <p className="text-(--color-text-muted)">
            {detail.showtime.cinema.name} — {detail.showtime.room.name}
          </p>
        </section>

        <section>
          <h4 className="text-[10px] font-bold tracking-[0.14em] text-(--color-text-muted) uppercase">
            {translate("admin.transactions.detail_seats")}
          </h4>
          <ul className="mt-1 space-y-0.5">
            {detail.seats.map((seat) => (
              <li key={seat.id} className="text-(--color-text-primary)">
                {seat.label}{" "}
                <span className="text-(--color-text-muted)">
                  ({seat.type} · {formatVND(seat.price, locale)})
                </span>
              </li>
            ))}
            {detail.combos.map((combo) => (
              <li key={combo.id} className="text-(--color-text-primary)">
                {combo.name} ×{combo.quantity}{" "}
                <span className="text-(--color-text-muted)">
                  ({formatVND(combo.price, locale)})
                </span>
              </li>
            ))}
            {detail.foods.map((food) => (
              <li key={food.id} className="text-(--color-text-primary)">
                {food.name} ×{food.quantity}{" "}
                <span className="text-(--color-text-muted)">
                  ({formatVND(food.price, locale)})
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h4 className="text-[10px] font-bold tracking-[0.14em] text-(--color-text-muted) uppercase">
            {translate("admin.transactions.detail_payment")}
          </h4>
          <div className="mt-1 space-y-2">
            {detail.payments.length === 0 && (
              <p className="text-(--color-text-muted)">—</p>
            )}
            {detail.payments.map((payment) => (
              <div key={payment.id} className="rounded-lg border border-(--color-border) p-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      payment.status === "success"
                        ? "success"
                        : payment.status === "pending"
                          ? "gold"
                          : "error"
                    }
                    size="xs"
                  >
                    {translate(`admin.transactions.pay_${payment.status}`)}
                  </Badge>
                  <span className="text-[11px] text-(--color-text-muted)">
                    {payment.kind} · {translate(`admin.transactions.method_${payment.method}`)} ·{" "}
                    {formatVND(payment.amount, locale)}
                  </span>
                </div>
                {payment.transactionRef && (
                  <p className="mt-1 text-[11px] text-(--color-text-muted)">
                    {payment.transactionRef}
                  </p>
                )}
                {payment.refunds.map((refund) => (
                  <p key={refund.id} className="mt-1 text-[11px] text-(--color-text-muted)">
                    ↩ {translate("admin.transactions.refund")}: {formatVND(refund.amount, locale)} (
                    {refund.status}
                    {refund.reason ? ` · ${refund.reason}` : ""})
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>

      {detail.ticket && (
        <section className="rounded-lg border border-(--color-border) p-3">
          <h4 className="text-[10px] font-bold tracking-[0.14em] text-(--color-text-muted) uppercase">
            {translate("admin.transactions.detail_ticket")}
          </h4>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px]">
            <Badge
              variant={
                detail.ticket.status === "active"
                  ? "gold"
                  : detail.ticket.status === "used"
                    ? "success"
                    : "neutral"
              }
              size="xs"
            >
              {translate(`admin.tickets.status_${detail.ticket.status}`)}
            </Badge>
            <span className="text-(--color-text-muted)">
              {translate("admin.transactions.ticket_owner")}:{" "}
              {detail.ticket.owner.fullname ?? detail.ticket.owner.email}
            </span>
            {detail.ticket.usedAt && (
              <span className="text-(--color-text-muted)">
                · {translate("admin.tickets.used_at")}:{" "}
                {new Date(detail.ticket.usedAt).toLocaleString()}
              </span>
            )}
            {detail.ticket.transfers.length > 0 && (
              <span className="text-(--color-text-muted)">
                · {detail.ticket.transfers.length}{" "}
                {translate("admin.transactions.ticket_transfers")}
              </span>
            )}
          </div>
        </section>
      )}

      <div className="flex items-center gap-2 border-t border-(--color-border) pt-3">
        {isCancellable && (
          <AdminButton
            size="sm"
            variant="danger"
            disabled={isPending}
            onClick={() => {
              setActionError(null);
              setIsConfirmOpen(true);
            }}
          >
            {translate("admin.transactions.cancel_booking")}
          </AdminButton>
        )}
        {actionError && <ErrorAlert message={actionError} />}
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleCancel}
        title={translate("admin.transactions.cancel_title")}
        description={translate("admin.transactions.cancel_body")}
        confirmLabel={translate("admin.transactions.cancel_booking")}
        cancelLabel={translate("admin.common.cancel")}
        isPending={isPending}
        danger
      />
    </div>
  );
}
