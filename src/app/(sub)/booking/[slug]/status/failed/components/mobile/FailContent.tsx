"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useBooking } from "@/contexts/BookingContext";
import { ALL_MOVIES } from "@/features/movies/mock";
import {
  RefreshCw,
  Home,
  ChevronRight,
  HeadphonesIcon,
} from "lucide-react";
import FailedIcon from "./FailedIcon";
import FailedOrderCard from "./FailedOrderCard";

const REASONS: Record<string, string> = {
  payment_declined: "Your payment was declined by the bank.",
  insufficient_funds: "Insufficient funds in your account.",
  network_error: "A network error occurred. Please try again.",
  expired_card: "Your card has expired. Please use a different card.",
};

export default function FailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const reason = searchParams.get("reason") ?? "payment_declined";
  const transactionId = searchParams.get("transactionId") ?? "N/A";
  const message = REASONS[reason] ?? "An unexpected error occurred.";

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
    <>
      {/* Shake keyframe injection */}
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-6px) rotate(-2deg); }
          40%      { transform: translateX(6px)  rotate(2deg);  }
          60%      { transform: translateX(-4px) rotate(-1deg); }
          80%      { transform: translateX(4px)  rotate(1deg);  }
        }
      `}</style>

      <div className="min-h-dvh max-w-md mx-auto flex flex-col bg-(--color-bg)">
        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto pb-8 pt-10 space-y-6">
          {/* Error hero */}
          <section className="flex flex-col items-center text-center px-6 gap-4">
            <FailedIcon visible={mounted} />

            <div
              className={`transition-all duration-700 delay-200 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <h1 className="font-extrabold text-3xl text-white leading-tight mb-2">
                Payment Failed
              </h1>
              <p className="text-sm text-white/60 leading-relaxed max-w-xs mx-auto">
                {message}
              </p>
            </div>
          </section>

          {/* Failed order card */}
          <div
            className={`transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <FailedOrderCard
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
              reason={reason}
            />
          </div>

          {/* Action buttons */}
          <div
            className={`px-4 space-y-3 transition-all duration-700 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <button
              onClick={() => router.push(`/booking/${slug}/payment`)}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-extrabold text-sm tracking-wide bg-(--color-gold) text-[#0F0F0F] shadow-[0_0_20px_rgba(255,204,77,0.25)] hover:opacity-90 active:scale-[0.98] transition-all duration-150"
            >
              <RefreshCw size={17} />
              Retry Payment
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm text-(--color-text-secondary) bg-(--color-surface) border border-(--color-border) hover:border-(--color-gold)/30 hover:text-(--color-gold) active:scale-[0.98] transition-all duration-150"
            >
              <Home size={17} />
              Back to Home
            </button>
          </div>

          {/* Help link */}
          <div
            className={`px-4 pb-4 transition-all duration-700 delay-[600ms] ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            <Link
              href="/help"
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-(--color-surface) border border-(--color-border) hover:border-(--color-gold)/20 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-(--color-surface-2) flex items-center justify-center text-(--color-text-muted) group-hover:text-(--color-gold) transition-colors">
                  <HeadphonesIcon size={15} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-(--color-text-secondary) group-hover:text-(--color-gold) transition-colors">
                    Need help?
                  </p>
                  <p className="text-xs text-(--color-text-muted)">
                    Contact our support team
                  </p>
                </div>
              </div>
              <ChevronRight
                size={16}
                className="text-(--color-text-muted) group-hover:text-(--color-gold) transition-colors"
              />
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
