import CurrentShowtime from "./components/shared/CurrentShowtime";
import CinemaSearchBar from "./components/shared/CinemaSearchBar";
import DatePickerWrapper from "./components/shared/DatePickerWrapper";
import ShowtimeList from "./components/shared/ShowtimeList";
import ShowtimeBottomBar from "./components/mobile/BottomBar";

import EligibleShowtimesAdopter from "@/features/tickets/components/EligibleShowtimesAdopter";
import ShowtimeStepBody from "@/features/tickets/components/ShowtimeStepBody";

import DesktopShowtimeContent from "./components/desktop/ShowtimeContent";

interface ShowtimePageProps {
  params: Promise<{ id: string }>;
}

export default async function ShowtimePage({ params }: ShowtimePageProps) {
  const { id } = await params;

  return (
    <>
      {/* Both device trees render, so the eligible slots and the date strip they
          derive are adopted once here; the skins only paint what the draft holds. */}
      <EligibleShowtimesAdopter ticketId={id} />

      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col min-h-dvh">
          <main className="flex-1 overflow-y-auto pb-5 p-4 space-y-5">
            <CurrentShowtime />
            <CinemaSearchBar />
            <ShowtimeStepBody>
              <DatePickerWrapper />
              <ShowtimeList />
            </ShowtimeStepBody>
          </main>
          <ShowtimeBottomBar />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopShowtimeContent />
      </div>
    </>
  );
}
