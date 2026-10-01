"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Cinema, DateOption } from "../types";
import { useBooking } from "../context";

export interface ShowtimeSelectionMeta {
  room?: string;
  date?: string;
  showtimeId?: string;
}

interface CinemaSelectionContextType {
  cinemas: Cinema[];
  dates: DateOption[];
  selectedDate: string;
  query: string;
  selectedCinemaId: string | null;
  selectedTime: string;
  selectedShowtimeId: string;
  filteredCinemas: Cinema[];
  selectedCinema: Cinema | undefined;
  hasSelection: boolean;
  setSelectedDate: (date: string) => void;
  setQuery: (query: string) => void;
  handleSelect: (
    cinemaId: string,
    time: string,
    meta?: ShowtimeSelectionMeta,
  ) => void;
  clearSelection: () => void;
}

const CinemaSelectionContext = createContext<CinemaSelectionContextType | null>(
  null,
);

/* Resolve a showtime (and its cinema) coming from the movie detail page. */
function findShowtime(cinemas: Cinema[], showtimeId?: string | null) {
  if (!showtimeId) return null;

  for (const cinema of cinemas) {
    const showtime = cinema.showtimes.find((slot) => slot.id === showtimeId);
    if (showtime) {
      return { cinema, time: showtime.time, room: showtime.room };
    }
  }

  return null;
}

export function CinemaSelectionProvider({
  cinemas,
  dates,
  initialCinemaId,
  initialTime,
  initialDate,
  initialShowtimeId,
  children,
}: {
  cinemas: Cinema[];
  dates: DateOption[];
  initialCinemaId: string | null;
  initialTime: string;
  initialDate: string;
  initialShowtimeId?: string | null;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    cinemaId: savedCinemaId,
    time: savedTime,
    date: savedDate,
    showtimeId: savedShowtimeId,
    setCinema,
  } = useBooking();

  const preselected = useMemo(
    () => findShowtime(cinemas, initialShowtimeId),
    [cinemas, initialShowtimeId],
  );

  // URL params (already resolved server-side) win over the previously saved
  // booking state so the date strip, cinemas and showtimes always agree.
  const resolvedCinemaId =
    preselected?.cinema.id ?? initialCinemaId ?? savedCinemaId;
  const resolvedTime = preselected?.time || initialTime || savedTime;
  const resolvedShowtimeId = initialShowtimeId || savedShowtimeId || "";
  const resolvedDate = initialDate || savedDate || dates[0]?.value || "";

  const [selectedDate, setSelectedDateState] = useState(resolvedDate);
  const [query, setQuery] = useState("");
  const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(
    resolvedCinemaId,
  );
  const [selectedTime, setSelectedTime] = useState(resolvedTime);
  const [selectedShowtimeId, setSelectedShowtimeId] =
    useState(resolvedShowtimeId);

  const selectedCinema = cinemas.find(
    (cinema) => cinema.id === selectedCinemaId,
  );

  /* Showtimes are fetched per date on the server, so a new date re-renders it. */
  const setSelectedDate = useCallback(
    (date: string) => {
      if (date === selectedDate) return;

      setSelectedDateState(date);
      setSelectedCinemaId(null);
      setSelectedTime("");
      setSelectedShowtimeId("");

      router.replace(`${pathname}?date=${date}`, { scroll: false });
    },
    [pathname, router, selectedDate],
  );

  useEffect(() => {
    if (!selectedCinema || !selectedTime) return;

    const matchedShowtime = selectedCinema.showtimes.find(
      (slot) =>
        (selectedShowtimeId !== "" && slot.id === selectedShowtimeId) ||
        slot.time === selectedTime,
    );

    setCinema(
      selectedCinema.id,
      selectedCinema.name,
      selectedTime,
      selectedDate,
      matchedShowtime?.room ?? "",
      selectedCinema.address,
      matchedShowtime?.id ?? selectedShowtimeId,
    );
  }, [
    selectedCinema,
    selectedTime,
    selectedDate,
    selectedShowtimeId,
    setCinema,
  ]);

  const handleSelect = (
    cinemaId: string,
    time: string,
    meta?: ShowtimeSelectionMeta,
  ) => {
    if (selectedCinemaId === cinemaId && selectedTime === time) {
      setSelectedCinemaId(null);
      setSelectedTime("");
      setSelectedShowtimeId("");
      return;
    }

    setSelectedCinemaId(cinemaId);
    setSelectedTime(time);
    setSelectedShowtimeId(meta?.showtimeId ?? "");
  };

  const clearSelection = () => {
    setSelectedCinemaId(null);
    setSelectedTime("");
    setSelectedShowtimeId("");
  };

  const filteredCinemas = useMemo(
    () =>
      cinemas.filter(
        (cinema) =>
          cinema.name.toLowerCase().includes(query.toLowerCase()) ||
          cinema.address.toLowerCase().includes(query.toLowerCase()),
      ),
    [cinemas, query],
  );

  const hasSelection = !!selectedCinema && !!selectedTime;

  return (
    <CinemaSelectionContext.Provider
      value={{
        cinemas,
        dates,
        selectedDate,
        query,
        selectedCinemaId,
        selectedTime,
        selectedShowtimeId,
        filteredCinemas,
        selectedCinema,
        hasSelection,
        setSelectedDate,
        setQuery,
        handleSelect,
        clearSelection,
      }}
    >
      {children}
    </CinemaSelectionContext.Provider>
  );
}

export function useCinemaSelection() {
  const ctx = useContext(CinemaSelectionContext);
  if (!ctx)
    throw new Error(
      "useCinemaSelection must be used within CinemaSelectionProvider",
    );
  return ctx;
}
