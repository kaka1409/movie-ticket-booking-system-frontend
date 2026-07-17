import { notFound } from "next/navigation";
import { getMovieBySlug } from "@/features/movies/api";
import { getCinemas, getDates } from "@/features/booking/api";
import { CinemaSelectionProvider } from "@/features/booking/contexts/CinemaSelectionContext";

// Shared
import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";

// Local mobile
import MovieSummary from "./components/mobile/MovieSummary";
import DatePicker from "./components/mobile/DatePicker";
import SearchBar from "./components/mobile/SearchBar";
import CinemaList from "./components/mobile/CinemaList";
import BottomBar from "./components/mobile/BottomBar";

// Desktop
import DesktopCinemaContent from "./components/desktop/CinemaContent";

export default async function CinemaShowtimePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cinema?: string; time?: string; date?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const [movie, cinemas, dates] = await Promise.all([
    getMovieBySlug(slug),
    getCinemas(),
    getDates(),
  ]);

  if (!movie) {
    notFound();
  }

  return (
    <CinemaSelectionProvider
      cinemas={cinemas}
      dates={dates}
      initialCinemaId={sp.cinema ? Number(sp.cinema) : null}
      initialTime={sp.time || ""}
      initialDate={sp.date || dates[0]?.value || ""}
    >
      {/* Mobile */}
      <div className="block md:hidden">
        <StepBar current={1} />
        <div className="flex flex-col gap-4 px-4 py-6 pb-12">
          <MovieSummary movie={movie} />
          <DatePicker />
          <SearchBar />
          <CinemaList />
        </div>
        <BottomBar movieSlug={slug} />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopCinemaContent />
      </div>
    </CinemaSelectionProvider>
  );
}
