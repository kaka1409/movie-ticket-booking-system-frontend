"use client";

import { useEffect } from "react";
import { useMovieList } from "@/features/movies/contexts/MovieListContext";
import type { CatalogOption, FilterOptions } from "@/features/movies/types";

export default function FilterOptionsAdopter({
  catalog,
  options,
}: {
  catalog: keyof FilterOptions;
  options: CatalogOption[];
}) {
  const { adoptFilterOptions } = useMovieList();

  useEffect(() => {
    adoptFilterOptions(catalog, options);
  }, [adoptFilterOptions, catalog, options]);

  return null;
}
