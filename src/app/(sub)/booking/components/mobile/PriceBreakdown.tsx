"use client";

import type { ReactNode } from "react";
import { Armchair, CreditCard, Popcorn } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND } from "@/libs/utils";
import DetailRow from "./DetailRow";
import MicroLabel from "@/components/ui/MicroLabel";

interface BreakdownSeat {
  label: string;
  type: string;
  price: number;
}

interface BreakdownSnack {
  id?: string | number;
  name: string;
  qty: number;
  price: number;
}

interface PriceBreakdownProps {
  /** Flat seat list — grouped by type internally for rendering. */
  seats: BreakdownSeat[];
  /** Section header text after the seat icon (default: "Seats (n)"; transfer passes its own count). */
  seatsHeaderText?: ReactNode;
  /** Snack/food line items; the section is hidden when empty. */
  snacks: BreakdownSnack[];
  /** When defined, renders the payment-method row beside the total; omit for total only. */
  paymentMethod?: string | null;
  /** Grand total; `null`/`undefined` renders `totalFallback` instead. */
  total?: number | null;
  totalFallback?: string;
  totalClassName?: string;
  /** Hides the whole payment/total row (transfer confirm shows it only with snacks). */
  hideTotal?: boolean;
}

/**
 * Shared price breakdown: seats grouped by type → snacks → payment + total.
 * Used by ticket detail, booking success/failure cards, transfer confirm and
 * both booking OrderSummary panels (previously ~50 duplicated lines each).
 * Total is formatted via `formatVND` — callers pass raw numbers only.
 */
export default function PriceBreakdown({
  seats,
  seatsHeaderText,
  snacks,
  paymentMethod,
  total,
  totalFallback = "—",
  totalClassName = "text-(--color-gold)",
  hideTotal = false,
}: PriceBreakdownProps) {
  const { translate } = useLocale();

  const seatsByType = seats.reduce<Record<string, BreakdownSeat[]>>((acc, seat) => {
    (acc[seat.type] ??= []).push(seat);
    return acc;
  }, {});

  const totalBlock = (
    <div className="text-right">
      <MicroLabel className="flex items-center justify-end gap-1.5 text-white/60">
        {translate("booking.common.total_price")}
      </MicroLabel>
      <p className={`font-bold text-base ${totalClassName}`}>
        {total != null ? formatVND(total) : totalFallback}
      </p>
    </div>
  );

  return (
    <>
      {/* Seats grouped by type */}
      <div className="space-y-3">
        <MicroLabel className="flex items-center gap-1.5 text-white/60">
          <Armchair size={10} />
          {seatsHeaderText ?? (
            <>
              {translate("booking.common.seats")} ({seats.length})
            </>
          )}
        </MicroLabel>
        {Object.entries(seatsByType).map(([type, typeSeats]) => (
          <div key={type} className="space-y-1">
            <p className="text-sm font-bold text-white">
              {typeSeats.map((seat) => seat.label).join(", ")}
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-white">
                {type} {translate("booking.common.ticket")}
              </span>
              <span className="font-medium text-white">
                {typeSeats.length}× {formatVND(typeSeats[0].price)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Snacks */}
      {snacks.length > 0 && (
        <div className="space-y-2">
          <MicroLabel className="flex items-center gap-1.5 text-white/60">
            <Popcorn size={10} />
            {translate("booking.common.snacks_combos")}
          </MicroLabel>
          <div className="space-y-1">
            {snacks.map((snack, index) => (
              <div
                key={snack.id ?? `${snack.name}-${index}`}
                className="flex justify-between text-sm"
              >
                <span className="text-white">{snack.name}</span>
                <span className="font-medium text-white">
                  {snack.qty}× {formatVND(snack.qty * snack.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment method + total, or total alone */}
      {!hideTotal &&
        (paymentMethod !== undefined ? (
          <div className="flex justify-between items-end gap-4">
            <DetailRow
              icon={CreditCard}
              label={translate("booking.common.payment_method")}
              value={paymentMethod || "N/A"}
            />
            {totalBlock}
          </div>
        ) : (
          <div className="flex justify-end">{totalBlock}</div>
        ))}
    </>
  );
}
