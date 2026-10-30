"use client";

import { useMoviePreviewState } from "@/features/movies/contexts/MoviePreviewContext";
import MoviePreviewPopover from "./MoviePreviewPopover";

/** Renders the home-only preview UI from state owned by the movie feature. */
export default function MoviePreviewLayer() {
  const { previewMovie, cursorPos, isOpen, isLoadingDetail } = useMoviePreviewState();

  if (!previewMovie || !cursorPos) return null;

  return (
    <MoviePreviewPopover
      movie={previewMovie}
      cursorPos={cursorPos}
      isOpen={isOpen}
      isLoading={isLoadingDetail}
    />
  );
}
