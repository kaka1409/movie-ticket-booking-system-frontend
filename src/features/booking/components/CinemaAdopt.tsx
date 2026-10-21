"use client";

import { useEffect, useRef } from "react";
import { useBooking } from "../context";
import { resolveCinemaAdoption } from "../utils/cinema";
import type { Cinema, DateOption } from "../types";
import type { Movie } from "@/types";

/**
 * Effect-only (renders nothing): adopts the server-resolved URL selection into
 * the draft once per mount (URL wins over the saved draft; a different date
 * clears the slot) plus the movie snapshot later steps read instead of
 * refetching.
 */
export default function CinemaAdopt({
  movie,
  cinemas,
  dates,
  initialCinemaId,
  initialTime,
  initialDate,
  initialShowtimeId,
}: {
  movie: Movie;
  cinemas: Cinema[];
  dates: DateOption[];
  initialCinemaId: string | null;
  initialTime: string;
  initialDate: string;
  initialShowtimeId?: string | null;
}) {
  const { cinemaId, time, date, showtimeId, setCinema, adoptMovie } = useBooking();

  const adoptedRef = useRef(false);
  useEffect(() => {
    if (adoptedRef.current) return;
    adoptedRef.current = true;

    adoptMovie({
      slug: movie.slug,
      title: movie.title,
      src: movie.src,
      genre: movie.genre,
      duration: movie.duration,
      ageRating: movie.ageRating,
    });
    setCinema(
      resolveCinemaAdoption({
        cinemas,
        dates,
        initialCinemaId,
        initialTime,
        initialDate,
        initialShowtimeId: initialShowtimeId ?? null,
        draft: { cinemaId, time, date, showtimeId },
      }),
    );
  }, [
    movie,
    cinemas,
    dates,
    initialCinemaId,
    initialTime,
    initialDate,
    initialShowtimeId,
    cinemaId,
    time,
    date,
    showtimeId,
    setCinema,
    adoptMovie,
  ]);

  return null;
}
