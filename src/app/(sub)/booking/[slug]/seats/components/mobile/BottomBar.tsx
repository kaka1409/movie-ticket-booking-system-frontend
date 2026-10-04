"use client";

import { useParams } from "next/navigation";
import type { SeatPrice, SeatRow } from "@/features/booking/types";
import { useSeatSelection } from "@/features/booking/contexts/SeatSelectionContext";
import { getSeatLabel } from "@/features/booking/utils";
import { useLocale } from "@/contexts/LocaleContext";
import BookingBottomBar from "@/components/shared/BookingBottomBar";

interface Selection {
  label: string;
  type: string;
  price: number;
}

function collectSelections(
  rows: SeatRow[],
  seatPrices: SeatPrice,
  translate: (key: string) => string,
): Selection[] {
  return rows.flatMap((row) =>
    row.segments.flatMap((seg) =>
      seg
        .filter((s) => s.status === "selected")
        .map((s) => ({
          label: getSeatLabel(row.label, s),
          type:
            s.kind === "available"
              ? translate("booking.seats.standard")
              : s.kind === "vip"
                ? "VIP"
                : "SweetBox",
          price: seatPrices[s.kind as keyof SeatPrice],
        })),
    ),
  );
}

export default function BottomBar({ seatPrices }: { seatPrices: SeatPrice }) {
  const params = useParams();
  const slug = params.slug as string;
  const { rows } = useSeatSelection();
  const { translate } = useLocale();

  const items = collectSelections(rows, seatPrices, translate);
  const total = items.reduce((sum, s) => sum + s.price, 0);
  const labels = items.map((s) => s.label).join(", ");
  const hasSeats = items.length > 0;

  return (
    <BookingBottomBar
      selectionInfo={{
        subLabel: labels,
      }}
      totalInfo={{
        label: translate("booking.common.total_price"),
        amount: total,
        showEmptyState: true,
      }}
      canProceed={hasSeats}
      ctaText={translate("booking.seats.continue_snacks")}
      ctaHref={`/booking/${slug}/snack`}
    />
  );
}
