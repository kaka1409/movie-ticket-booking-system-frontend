"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMovieSelection } from "@/features/movies/context";
import { getShowtimes } from "./api";
import { isValidDateParam } from "./utils";
import type { GroupedShowtimeCinema, ShowtimeDateOption } from "./types";

interface ShowtimesContextType {
  /** The day the cinema list currently shows (server default until a switch). */
  activeDate: string;
  cinemas: GroupedShowtimeCinema[];
  error: string | null;
  /** True while a date switch or retry is in flight. */
  isPending: boolean;
  dates: ShowtimeDateOption[];
  today: string;
  /** Switch the day: fetches its slot list client-side and updates the URL. */
  selectDate: (value: string) => void;
  /** Re-fetch the active day (used by the error state's try-again button). */
  retry: () => void;
}

const ShowtimesContext = createContext<ShowtimesContextType | null>(null);

/**
 * Shared date/slot state for the movie-detail page.
 *
 * The page is statically generated (ISR), so it no longer reads `?date=`
 * server-side — date switching runs entirely here: one fetch per switch that
 * both the mobile and desktop trees observe (they are both mounted, one is
 * CSS-hidden), and a `?date=` deep link is applied after hydration by reading
 * `window.location.search` directly (using `useSearchParams` would force a
 * Suspense boundary on a static page).
 */
export function ShowtimesProvider({
  movieSlug,
  initialDate,
  dates,
  today,
  initialCinemas,
  initialError,
  children,
}: {
  movieSlug: string;
  initialDate: string;
  dates: ShowtimeDateOption[];
  today: string;
  initialCinemas: GroupedShowtimeCinema[];
  initialError: string | null;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { setSelectedShowtime } = useMovieSelection();

  const [activeDate, setActiveDate] = useState(initialDate);
  const [cinemas, setCinemas] = useState(initialCinemas);
  const [error, setError] = useState(initialError);
  const [isPending, startTransition] = useTransition();

  const availableDates = useMemo(
    () => dates.filter((record) => record.hasShowtimes).map((record) => record.date),
    [dates],
  );

  const loadDate = useCallback(
    (value: string) => {
      startTransition(async () => {
        setActiveDate(value);
        // Switching the day invalidates any picked showtime.
        setSelectedShowtime(null);
        router.replace(`${pathname}?date=${value}`, { scroll: false });

        const result = await getShowtimes(movieSlug, value);
        if ("error" in result) {
          setCinemas([]);
          setError(result.error.message);
        } else {
          setCinemas(result.data.cinemas);
          setError(null);
        }
      });
    },
    [movieSlug, pathname, router, setSelectedShowtime],
  );

  const retry = useCallback(() => loadDate(activeDate), [activeDate, loadDate]);

  /* Deep link: the static HTML always renders the server-resolved default
     day, so a `?date=` param is applied once, after hydration. */
  const deepLinkCheckedRef = useRef(false);
  useEffect(() => {
    if (deepLinkCheckedRef.current) return;
    deepLinkCheckedRef.current = true;

    const param = new URLSearchParams(window.location.search).get("date");
    if (param && param !== initialDate && isValidDateParam(param, availableDates, today)) {
      loadDate(param);
    }
  }, [availableDates, initialDate, loadDate, today]);

  const value = useMemo(
    () => ({ activeDate, cinemas, error, isPending, dates, today, selectDate: loadDate, retry }),
    [activeDate, cinemas, error, isPending, dates, today, loadDate, retry],
  );

  return <ShowtimesContext.Provider value={value}>{children}</ShowtimesContext.Provider>;
}

export function useShowtimes(): ShowtimesContextType {
  const ctx = useContext(ShowtimesContext);
  if (!ctx) throw new Error("useShowtimes must be used within ShowtimesProvider");
  return ctx;
}
