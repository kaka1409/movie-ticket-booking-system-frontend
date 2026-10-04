"use client";

import { useEffect } from "react";
import { Check, Popcorn } from "lucide-react";
import { useTransfer } from "@/features/tickets/contexts/TransferContext";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND } from "@/libs/utils";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";

export default function SeatSelector() {
  const { ticket } = useTicketDetail();
  const { selectedSeats, setSelectedSeats, toggleSeat, transferSnacks, setTransferSnacks } =
    useTransfer();
  const { translate } = useLocale();

  const seatItems = ticket.seatItems;
  const total = seatItems.length;
  const allSelected = selectedSeats.length === total;
  const hasSnacks = !!ticket.foodDrink && ticket.foodDrink.length > 0;
  const showSnackOption = allSelected && hasSnacks;

  // Reset snack transfer when selection is no longer complete
  useEffect(() => {
    if (!allSelected && transferSnacks) {
      setTransferSnacks(false);
    }
  }, [allSelected, transferSnacks, setTransferSnacks]);

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedSeats([]);
    } else {
      setSelectedSeats(seatItems.map((seat) => seat.label));
    }
  };

  return (
    <section className="px-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl text-(--color-text-primary)">
          {translate("tickets.transfer.select_seats")}
        </h2>
        <button
          type="button"
          onClick={handleToggleAll}
          className="text-xs font-bold uppercase tracking-widest text-(--color-gold) transition-colors hover:text-(--color-gold-light)"
        >
          {allSelected
            ? translate("tickets.transfer.clear_all")
            : translate("tickets.transfer.select_all")}
        </button>
      </div>

      <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) overflow-hidden">
        {seatItems.map((seat, index) => {
          const isSelected = selectedSeats.includes(seat.label);
          const isLast = index === seatItems.length - 1;
          return (
            <button
              key={seat.label}
              type="button"
              onClick={() => toggleSeat(seat.label)}
              className={`flex items-center gap-3.5 w-full px-4 py-3.5 text-left transition-all duration-150 active:scale-[0.98] ${
                isSelected ? "bg-(--color-gold)/10" : "hover:bg-(--color-surface-2)"
              } ${!isLast ? "border-b border-(--color-border)" : ""}`}
            >
              <span
                className={`flex shrink-0 items-center justify-center w-5 h-5 rounded-full border-2 transition-colors ${
                  isSelected ? "border-(--color-gold) bg-(--color-gold)" : "border-(--color-border)"
                }`}
              >
                {isSelected && <Check size={12} className="text-[#0F0F0F]" />}
              </span>

              <span className="font-extrabold text-sm text-(--color-text-primary)">
                {seat.label}
              </span>
              <span className="text-xs font-bold uppercase tracking-wide text-(--color-text-muted)">
                · {seat.type}
              </span>

              <span className="ml-auto text-sm font-medium text-(--color-text-secondary)">
                {formatVND(seat.price)}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-(--color-text-muted)">
        {translate("tickets.transfer.seats_selected")
          .replace("{count}", String(selectedSeats.length))
          .replace("{total}", String(total))}
      </p>

      {showSnackOption && (
        <button
          type="button"
          onClick={() => setTransferSnacks(!transferSnacks)}
          className="animate-fade-in flex items-center gap-3.5 w-full p-4 rounded-2xl bg-(--color-surface-2) border border-(--color-border) text-left transition-all duration-150 active:scale-[0.98]"
        >
          <span
            className={`flex shrink-0 items-center justify-center w-5 h-5 rounded-md border-2 transition-colors ${
              transferSnacks ? "border-(--color-gold) bg-(--color-gold)" : "border-(--color-border)"
            }`}
          >
            {transferSnacks && <Check size={12} className="text-[#0F0F0F]" />}
          </span>
          <span className="flex flex-col gap-0.5 min-w-0">
            <span className="flex items-center gap-1.5 text-sm font-bold text-(--color-text-primary)">
              <Popcorn size={14} className="text-(--color-gold)" />
              {translate("tickets.transfer.transfer_snacks_label")}
            </span>
            <span className="text-xs text-(--color-text-muted)">
              {translate("tickets.transfer.transfer_snacks_desc")}
            </span>
          </span>
        </button>
      )}
    </section>
  );
}
