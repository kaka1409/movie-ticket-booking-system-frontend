"use client";

import { useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import { ALL_MOVIES } from "@/features/movies/mock";
import { CINEMAS, DATES } from "@/features/booking/mock";

// Mobile components
import StepBar from "./components/mobile/StepBar";
import MovieSummary from "./components/mobile/MovieSummary";
import DatePicker from "./components/mobile/DatePicker";
import SearchBar from "./components/mobile/SearchBar";
import CinemaList from "./components/mobile/CinemaList";
import BottomBar from "./components/mobile/BottomBar";

// Desktop components
import DesktopCinemaContent from "./components/desktop/CinemaContent";

export default function CinemaShowtimePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const movie = ALL_MOVIES.find((m) => m.slug === slug);

  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date") || DATES[0].value
  );
  const [query, setQuery] = useState("");
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(
    searchParams.get("cinema") ? Number(searchParams.get("cinema")) : null
  );
  const [selectedTime, setSelectedTime] = useState(
    searchParams.get("time") || ""
  );

  const handleSelect = (cinemaId: number, time: string) => {
    if (selectedCinemaId === cinemaId && selectedTime === time) {
      setSelectedCinemaId(null);
      setSelectedTime("");
    } else {
      setSelectedCinemaId(cinemaId);
      setSelectedTime(time);
    }
  };

  const filteredCinemas = useMemo(
    () =>
      CINEMAS.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.address.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const selectedCinema = CINEMAS.find((c) => c.id === selectedCinemaId);
  const hasSelection = !!selectedCinema && !!selectedTime;

  if (!movie) {
    notFound();
  }

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <StepBar current={1} />

        <div className="flex flex-col gap-4 px-4 py-6 pb-12">
          <MovieSummary movie={movie} />

          <DatePicker
            dates={DATES}
            selected={selectedDate}
            onSelect={(v) => setSelectedDate(v)}
          />

          <SearchBar query={query} onQueryChange={setQuery} />

          <CinemaList
            cinemas={filteredCinemas}
            selectedCinemaId={selectedCinemaId}
            selectedTime={selectedTime}
            onSelect={handleSelect}
            query={query}
            onClearQuery={() => setQuery("")}
          />
        </div>

        <BottomBar
          cinema={selectedCinema}
          time={selectedTime}
          onClear={() => {
            setSelectedCinemaId(null);
            setSelectedTime("");
          }}
          movieSlug={slug}
          hasSelection={hasSelection}
        />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopCinemaContent />
      </div>
    </>
  );
}
