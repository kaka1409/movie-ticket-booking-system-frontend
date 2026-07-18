"use client";

import { useState } from "react";
import SectionHeading from "../shared/SectionHeading";
import { useMovie } from "../shared/MovieContext";
import { useLocale } from "@/contexts/LocaleContext";

export default function Synopsis() {
  const movie = useMovie();
  const { translate } = useLocale();
  const [expanded, setExpanded] = useState(false);
  const SHORT_LIMIT = 160;
  const isLong = movie.synopsis.length > SHORT_LIMIT;
  const displayText =
    !isLong || expanded
      ? movie.synopsis
      : movie.synopsis.slice(0, SHORT_LIMIT) + "…";

  return (
    <section className="px-4">
      <SectionHeading>{translate("movies.detail.synopsis")}</SectionHeading>
      <p className="text-(--color-text-secondary) text-sm leading-relaxed">
        {displayText}
        {isLong && (
          <button
            className="text-(--color-gold) font-bold ml-1 hover:underline"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? translate("movies.detail.show_less") : translate("movies.detail.read_more")}
          </button>
        )}
      </p>
    </section>
  );
}
