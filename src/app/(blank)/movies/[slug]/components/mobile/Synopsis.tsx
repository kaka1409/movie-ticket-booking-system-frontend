"use client";

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useMovieDetail } from "@/features/movies/contexts/MovieDetailContext";
import { useLocale } from "@/contexts/LocaleContext";

export default function Synopsis() {
  const movie = useMovieDetail();
  const { translate } = useLocale();
  const [expanded, setExpanded] = useState(false);
  const SHORT_LIMIT = 160;
  const isLong = movie.synopsis.length > SHORT_LIMIT;
  const displayText =
    !isLong || expanded ? movie.synopsis : movie.synopsis.slice(0, SHORT_LIMIT) + "…";

  return (
    <section className="px-4">
      <SectionHeader variant="goldBar">{translate("movies.detail.synopsis")}</SectionHeader>
      <p className="text-(--color-text-secondary) text-sm leading-relaxed">
        {displayText}
        {isLong && (
          <button
            type="button"
            className="text-(--color-gold) font-bold ml-1 hover:underline"
            onClick={() => setExpanded((previous) => !previous)}
          >
            {expanded ? translate("movies.detail.show_less") : translate("movies.detail.read_more")}
          </button>
        )}
      </p>
    </section>
  );
}
