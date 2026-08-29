import CurrentShowtime from "./components/mobile/CurrentShowtime";
import SearchBar from "./components/mobile/SearchBar";
import ShowtimeDataLoader from "./components/mobile/ShowtimeDataLoader";
import DatePickerWrapper from "./components/mobile/DatePickerWrapper";
import ShowtimeList from "./components/mobile/ShowtimeList";
import ShowtimeBottomBar from "./components/mobile/BottomBar";

import DesktopShowtimeContent from "./components/desktop/ShowtimeContent";

interface ShowtimePageProps {
  params: Promise<{ id: string }>;
}

export default async function ShowtimePage({ params }: ShowtimePageProps) {
  const { id } = await params;

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col min-h-dvh">
          <main className="flex-1 overflow-y-auto pb-5 p-4 space-y-5">
            <CurrentShowtime />
            <SearchBar />
            <ShowtimeDataLoader ticketId={id}>
              <DatePickerWrapper />
              <ShowtimeList />
            </ShowtimeDataLoader>
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
