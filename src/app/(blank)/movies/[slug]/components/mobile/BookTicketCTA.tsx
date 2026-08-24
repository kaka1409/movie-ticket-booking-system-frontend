"use client";

import { useRouter } from "next/navigation";
import { useMovie } from "../shared/MovieContext";
import { useMovieSelection } from "../shared/MovieSelectionContext";
import { useLocale } from "@/contexts/LocaleContext";
import Button from "@/components/ui/Button";

export default function BookTicketCTA() {
  const movie = useMovie();
  const router = useRouter();
  const { selectedShowtime } = useMovieSelection();
  const { translate } = useLocale();

  const handleClick = () => {
    const params = new URLSearchParams();
    if (selectedShowtime?.cinemaId) params.set("cinema", String(selectedShowtime.cinemaId));
    if (selectedShowtime?.time) params.set("time", selectedShowtime.time);
    if (selectedShowtime?.date) params.set("date", selectedShowtime.date);

    const query = params.toString();
    router.push(`/booking/${movie.slug}/cinema${query ? `?${query}` : ""}`);
  };

  return (
    <div className="px-4">
      <Button onClick={handleClick}>
        {translate("movies.detail.book_ticket")}
      </Button>
    </div>
  );
}
