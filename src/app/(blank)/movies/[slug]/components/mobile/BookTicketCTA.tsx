"use client";

import { useRouter } from "next/navigation";
import { useMovie } from "../shared/MovieContext";

export default function BookTicketCTA({
  selectedCinemaId,
  selectedTime,
  selectedDate,
}: {
  selectedCinemaId: number | null;
  selectedTime: string;
  selectedDate: string;
}) {
  const movie = useMovie();
  const router = useRouter();

  const handleClick = () => {
    const params = new URLSearchParams();
    if (selectedCinemaId) params.set("cinema", String(selectedCinemaId));
    if (selectedTime) params.set("time", selectedTime);
    if (selectedDate) params.set("date", selectedDate);

    const query = params.toString();
    router.push(`/booking/${movie.slug}/cinema${query ? `?${query}` : ""}`);
  };

  return (
    <div className="px-4">
      <button
        onClick={handleClick}
        className="w-full py-4 rounded-2xl bg-(--color-gold) text-(--color-bg) font-extrabold text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-(--color-gold-dark) active:scale-[0.98] transition-all duration-150 shadow-[0_0_24px_rgba(255,204,77,0.3)]"
      >
        Book Ticket
      </button>
    </div>
  );
}
