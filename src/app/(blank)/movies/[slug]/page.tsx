"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ALL_MOVIES } from "@/features/movies/mock";
import { MovieProvider } from "./components/shared/MovieContext";

// Mobile
import MobileHeroSection from "./components/mobile/HeroSection";
import MobileSynopsis from "./components/mobile/Synopsis";
import MobileTopCast from "./components/mobile/TopCast";
import MobileShowtimes from "./components/mobile/Showtimes";
import MobileBookTicketCTA from "./components/mobile/BookTicketCTA";
import MobileReviews from "./components/mobile/Reviews";

// Desktop
import DesktopHeroSection from "./components/desktop/HeroSection";
import DesktopSynopsis from "./components/desktop/Synopsis";
import DesktopTopCast from "./components/desktop/TopCast";
import DesktopShowtimes from "./components/desktop/Showtimes";
import DesktopBookTicketCTA from "./components/desktop/BookTicketCTA";
import DesktopReviews from "./components/desktop/Reviews";

export default function MovieDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const movie = ALL_MOVIES.find((m) => m.slug === slug);

  const [selectedShowtime, setSelectedShowtime] = useState<{
    cinemaId: number;
    time: string;
    date: string;
  } | null>(null);

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-(--color-bg)">
        <p className="text-(--color-text-secondary) text-lg">Movie not found</p>
      </div>
    );
  }

  return (
    <MovieProvider movie={movie}>
      {/* Mobile */}
      <div className="block md:hidden min-h-dvh bg-(--color-bg) w-full max-w-md mx-auto flex flex-col overflow-x-hidden">
        <MobileHeroSection />
        <div className="flex flex-col gap-8 py-6 pb-12">
          <MobileSynopsis />
          <MobileTopCast />
          <MobileShowtimes onSelectionChange={setSelectedShowtime} />
          <MobileBookTicketCTA
            selectedCinemaId={selectedShowtime?.cinemaId ?? null}
            selectedTime={selectedShowtime?.time ?? ""}
            selectedDate={selectedShowtime?.date ?? ""}
          />
          <MobileReviews />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopHeroSection />
        <DesktopSynopsis />
        <DesktopTopCast />
        <DesktopShowtimes />
        <DesktopBookTicketCTA />
        <DesktopReviews />
      </div>
    </MovieProvider>
  );
}
