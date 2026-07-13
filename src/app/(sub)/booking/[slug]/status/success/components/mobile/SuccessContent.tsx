"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useBooking } from "@/contexts/BookingContext";
import { ALL_MOVIES } from "@/features/movies/mock";
import { Download, Home, Share2 } from "lucide-react";
import SuccessIcon from "./SuccessIcon";
import TicketCard from "./TicketCard";

export default function SuccessContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const transactionId = searchParams.get("transactionId") ?? "N/A";

  const {
    cinemaName,
    room,
    date,
    time,
    selectedSeats,
    seatType,
    paymentMethod,
    combos,
    foods,
    total,
  } = useBooking();

  const movie = ALL_MOVIES.find((m) => m.slug === slug);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-dvh max-w-md mx-auto flex flex-col bg-(--color-bg)">
      {/* Share button */}
      <div className="flex justify-end px-4 pt-5">
        <button
          className="w-9 h-9 flex items-center justify-center rounded-full bg-(--color-surface) border border-(--color-border) text-(--color-text-muted) hover:text-(--color-gold) hover:border-(--color-gold)/40 transition-colors"
          aria-label="Share booking"
        >
          <Share2 size={16} />
        </button>
      </div>

      {/* Scrollable body */}
      <main className="flex-1 overflow-y-auto pb-8 pt-4 space-y-6">
        {/* Success hero */}
        <section className="flex flex-col items-center text-center px-6 gap-4">
          <SuccessIcon visible={mounted} />

          <div
            className={`transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h1 className="font-extrabold text-3xl text-white leading-tight mb-2">
              Booking Successful
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs mx-auto">
              Your tickets have been successfully booked and sent to your email.
            </p>
          </div>
        </section>

        {/* Ticket card */}
        <div
          className={`transition-all duration-700 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <TicketCard
            movie={movie}
            transactionId={transactionId}
            cinemaName={cinemaName}
            room={room}
            date={date}
            time={time}
            selectedSeats={selectedSeats}
            seatType={seatType}
            paymentMethod={paymentMethod}
            combos={combos}
            foods={foods}
            total={total}
          />
        </div>

        {/* Action buttons */}
        <div
          className={`px-4 space-y-3 pb-4 transition-all duration-700 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-extrabold text-sm tracking-wide bg-(--color-gold) text-[#0F0F0F] shadow-[0_0_20px_rgba(255,204,77,0.25)] hover:opacity-90 active:scale-[0.98] transition-all duration-150">
            <Download size={18} />
            Download Tickets
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm text-(--color-text-secondary) bg-(--color-surface) border border-(--color-border) hover:border-(--color-gold)/30 hover:text-(--color-gold) active:scale-[0.98] transition-all duration-150"
          >
            <Home size={17} />
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
