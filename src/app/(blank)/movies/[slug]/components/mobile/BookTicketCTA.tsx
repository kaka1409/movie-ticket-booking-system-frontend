"use client";

import { useRouter } from "next/navigation";
import { useMovieDetail } from "@/features/movies/contexts/MovieDetailContext";
import { useMovieSelection } from "@/features/movies/contexts/MovieSelectionContext";
import { useLocale } from "@/contexts/LocaleContext";
import Button from "@/components/ui/Button";

export default function BookTicketCTA() {
  const movie = useMovieDetail();
  const router = useRouter();
  const { selectedShowtime } = useMovieSelection();
  const { translate } = useLocale();

  const handleClick = () => {
    const params = new URLSearchParams();
    if (selectedShowtime?.showtimeId) params.set("showtimeId", selectedShowtime.showtimeId);
    if (selectedShowtime?.cinemaId) params.set("cinema", String(selectedShowtime.cinemaId));
    if (selectedShowtime?.time) params.set("time", selectedShowtime.time);
    if (selectedShowtime?.date) params.set("date", selectedShowtime.date);

    const query = params.toString();
    router.push(`/booking/${movie.slug}/cinema${query ? `?${query}` : ""}`);
  };

  return (
    <div className="px-4">
      <Button onClick={handleClick}>{translate("movies.detail.book_ticket")}</Button>
    </div>
  );
}
