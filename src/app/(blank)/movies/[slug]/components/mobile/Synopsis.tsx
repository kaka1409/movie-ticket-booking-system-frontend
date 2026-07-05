"use client";

import { useState } from "react";
import SectionHeading from "../shared/SectionHeading";
import { useMovie } from "../shared/MovieContext";

export default function Synopsis() {
  const movie = useMovie();
  const [expanded, setExpanded] = useState(false);
  const SHORT_LIMIT = 160;
  const isLong = movie.synopsis.length > SHORT_LIMIT;
  const displayText =
    !isLong || expanded
      ? movie.synopsis
      : movie.synopsis.slice(0, SHORT_LIMIT) + "…";

  return (
    <section className="px-4">
      <SectionHeading>Synopsis</SectionHeading>
      <p className="text-(--color-text-secondary) text-sm leading-relaxed">
        {displayText}
        {isLong && (
          <button
            className="text-(--color-gold) font-bold ml-1 hover:underline"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        )}
      </p>
    </section>
  );
}
