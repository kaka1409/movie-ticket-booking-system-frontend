"use client";

import { useState } from "react";
import MovieCard from "@/components/ui/MovieCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { useLocale } from "@/contexts/LocaleContext";
import { RECOMMENDED_MOBILE_PAGE_SIZE } from "@/features/movies/constants";
import type { Movie } from "@/features/movies/types";
import RecommendedPager from "./RecommendedPager";

export default function MobileRecommended({ movies }: { movies: Movie[] }) {
  const { translate } = useLocale();
  const [pageIndex, setPageIndex] = useState(0);

  const pageSize = RECOMMENDED_MOBILE_PAGE_SIZE;
  const pageCount = Math.max(1, Math.ceil(movies.length / pageSize));
  const safePage = Math.min(pageIndex, pageCount - 1);
  const pageStart = safePage * pageSize;
  const visibleMovies = movies.slice(pageStart, pageStart + pageSize);

  return (
    <section className="px-4">
      <SectionHeader variant="goldBar">{translate("movies.detail.you_may_like")}</SectionHeader>
      <div key={safePage} role="list" className="grid grid-cols-2 gap-x-3 gap-y-6 animate-fade-in">
        {visibleMovies.map((movie) => (
          <div key={movie.id} role="listitem">
            <MovieCard
              movie={movie}
              isFluid
              minLabel={translate("common.min")}
              sizes="(max-width: 767px) calc(50vw - 22px), 130px"
            />
          </div>
        ))}
      </div>
      <RecommendedPager page={safePage} pageCount={pageCount} onChange={setPageIndex} />
    </section>
  );
}
