"use client";

import { useState } from "react";
import { useMovieDetail } from "@/features/movies/context";
import { useLocale } from "@/contexts/LocaleContext";

const SHORT_LIMIT = 220;

export default function Synopsis() {
  const movie = useMovieDetail();
  const { translate } = useLocale();
  const [expanded, setExpanded] = useState(false);

  const isLong = movie.synopsis.length > SHORT_LIMIT;
  const displayText =
    !isLong || expanded ? movie.synopsis : `${movie.synopsis.slice(0, SHORT_LIMIT).trimEnd()}…`;

  return (
    <section>
      <h2 className="mb-3 text-xl font-bold text-(--color-text-primary)">
        {translate("movies.detail.synopsis")}
      </h2>
      <p className="text-sm leading-relaxed text-(--color-text-muted)">
        {displayText}
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="ml-1.5 cursor-pointer text-sm font-semibold text-(--color-gold) transition-colors hover:text-(--color-gold-light)"
          >
            {expanded ? translate("movies.detail.show_less") : translate("movies.detail.read_more")}
          </button>
        )}
      </p>
    </section>
  );
}
