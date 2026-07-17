"use client";

import { createContext, useContext, useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import type { Cinema, DateOption } from "../types";
import { useBooking } from "../context";

interface CinemaSelectionContextType {
  cinemas: Cinema[];
  dates: DateOption[];
  selectedDate: string;
  query: string;
  selectedCinemaId: number | null;
  selectedTime: string;
  filteredCinemas: Cinema[];
  selectedCinema: Cinema | undefined;
  hasSelection: boolean;
  setSelectedDate: (date: string) => void;
  setQuery: (query: string) => void;
  handleSelect: (cinemaId: number, time: string) => void;
  clearSelection: () => void;
}

const CinemaSelectionContext = createContext<CinemaSelectionContextType | null>(null);

export function CinemaSelectionProvider({
  cinemas,
  dates,
  initialCinemaId,
  initialTime,
  initialDate,
  children,
}: {
  cinemas: Cinema[];
  dates: DateOption[];
  initialCinemaId: number | null;
  initialTime: string;
  initialDate: string;
  children: ReactNode;
}) {
  const { cinemaId: savedCinemaId, time: savedTime, date: savedDate, setCinema } = useBooking();

  const resolvedCinemaId = savedCinemaId ?? initialCinemaId;
  const resolvedTime = savedTime || initialTime;
  const resolvedDate = savedDate || initialDate || dates[0]?.value || "";

  const [selectedDate, setSelectedDate] = useState(resolvedDate);
  const [query, setQuery] = useState("");
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(resolvedCinemaId);
  const [selectedTime, setSelectedTime] = useState(resolvedTime);

  const selectedCinema = cinemas.find((cinema) => cinema.id === selectedCinemaId);

  useEffect(() => {
    if (selectedCinema && selectedTime) {
      setCinema(selectedCinema.id, selectedCinema.name, selectedTime, selectedDate, selectedCinema.badge);
    }
  }, [selectedCinemaId, selectedTime, selectedDate, selectedCinema, setCinema]);

  const handleSelect = (cinemaId: number, time: string) => {
    if (selectedCinemaId === cinemaId && selectedTime === time) {
      setSelectedCinemaId(null);
      setSelectedTime("");
    } else {
      setSelectedCinemaId(cinemaId);
      setSelectedTime(time);
    }
  };

  const clearSelection = () => {
    setSelectedCinemaId(null);
    setSelectedTime("");
  };

  const filteredCinemas = useMemo(
    () =>
      cinemas.filter(
        (cinema) =>
          cinema.name.toLowerCase().includes(query.toLowerCase()) ||
          cinema.address.toLowerCase().includes(query.toLowerCase())
      ),
    [cinemas, query]
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
  if (!ctx) throw new Error("useCinemaSelection must be used within CinemaSelectionProvider");
  return ctx;
}
