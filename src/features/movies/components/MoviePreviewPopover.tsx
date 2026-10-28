"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import { Star, Clock, Loader2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useMounted } from "@/hooks/useMounted";
import { formatDate } from "@/libs/utils";
import { ALL_MOVIES } from "../mock";
import type { Movie } from "../types";

interface MoviePreviewPopoverProps {
  movie: Movie;
  cursorPos: { x: number; y: number };
  isOpen: boolean;
  isLoading?: boolean;
}

const POPOVER_WIDTH = 360;
const ESTIMATED_HEIGHT = 420;
const VIEWPORT_PADDING = 16;
const CURSOR_OFFSET_X = 25;
const CURSOR_OFFSET_Y = 25;

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function MoviePreviewPopover({
  movie,
  cursorPos,
  isOpen,
  isLoading = false,
}: MoviePreviewPopoverProps) {
  const { translate, locale } = useLocale();
  // Shared mount guard (a synchronous setState-in-effect trips
  // `react-hooks/set-state-in-effect`); the 80ms flip is invisible behind
  // the 200ms hover-enter delay.
  const mounted = useMounted();

  if (!mounted || !isOpen) return null;

  // List rows are shallow — the local catalog only fills the fields the API never sends.
  const fallback = ALL_MOVIES.find(
    (candidate) => candidate.slug === movie.slug || candidate.id === movie.id,
  );
  const effectiveSynopsis = movie.synopsis || fallback?.synopsis || "";
  const effectiveCast = movie.cast && movie.cast.length > 0 ? movie.cast : (fallback?.cast ?? []);
  const effectiveDirector = movie.director || fallback?.director || "";

  let left = cursorPos.x + CURSOR_OFFSET_X;
  if (left + POPOVER_WIDTH > window.innerWidth - VIEWPORT_PADDING) {
    // Flip to the left of the cursor if overflowing right edge
    left = cursorPos.x - POPOVER_WIDTH - CURSOR_OFFSET_X;
    if (left < VIEWPORT_PADDING) {
      left = VIEWPORT_PADDING;
    }
  }

  let top = cursorPos.y + CURSOR_OFFSET_Y;
  if (top + ESTIMATED_HEIGHT > window.innerHeight - VIEWPORT_PADDING) {
    // Flip above the cursor if overflowing bottom edge
    top = cursorPos.y - ESTIMATED_HEIGHT - CURSOR_OFFSET_Y;
    if (top < VIEWPORT_PADDING) {
      top = VIEWPORT_PADDING;
    }
  }

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
        width: `${POPOVER_WIDTH}px`,
      }}
      className="pointer-events-none z-[9999] select-none animate-fade-in transition-[top,left] ease-out"
    >
      <div className="overflow-hidden rounded-(--radius-lg) border border-(--color-gold)/40 bg-(--color-surface) shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-md max-h-[calc(100vh-32px)] overflow-y-auto">
        <div className="relative aspect-video w-full overflow-hidden bg-(--color-surface-2)">
          <Image
            src={movie.src || "/images/movie-poster-placeholder.jpg"}
            alt={movie.title}
            fill
            sizes="380px"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/20" />

          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            {movie.rating > 0 && (
              <span className="flex items-center gap-1 rounded-(--radius-sm) bg-(--color-gold) px-2 py-0.5 text-[11px] font-black text-black shadow">
                <Star size={11} fill="currentColor" /> {movie.rating}
              </span>
            )}
            {movie.ageRating && (
              <span className="rounded-(--radius-xs) border border-white/20 bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                {movie.ageRating}
              </span>
            )}
          </div>

          {isLoading && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-(--color-gold) backdrop-blur-xs">
              <Loader2 size={11} className="animate-spin" />
              <span>{translate("common.loading")}</span>
            </div>
          )}

          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2 text-xs">
            <span className="font-extrabold uppercase tracking-wide text-(--color-gold) truncate min-w-0">
              {movie.genre}
            </span>
            {movie.duration > 0 && (
              <div className="flex shrink-0 items-center gap-1 rounded-(--radius-sm) bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
                <Clock size={11} className="text-(--color-gold)" />
                <span>
                  {movie.duration} {translate("common.min")}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-3.5 space-y-3">
          <div>
            <h3 className="line-clamp-1 text-base font-black tracking-tight text-white">
              {movie.title}
            </h3>
          </div>

          {effectiveSynopsis && (
            <div className="space-y-1">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-(--color-gold)">
                {translate("movies.detail.synopsis")}
              </h4>
              <p className="line-clamp-3 text-xs leading-relaxed text-white/80">
                {effectiveSynopsis}
              </p>
            </div>
          )}

          {effectiveCast.length > 0 && (
            <div className="space-y-1.5 border-t border-(--color-border) pt-2">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-(--color-gold)">
                  {translate("movies.detail.top_cast")}
                </h4>
                {effectiveDirector && (
                  <span className="text-[10px] text-(--color-text-muted) truncate text-right">
                    {translate("home.desktop.preview_director")}:{" "}
                    <span className="font-semibold text-white/90">{effectiveDirector}</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {effectiveCast.slice(0, 3).map((actor) => (
                  <div
                    key={actor.name}
                    className="flex items-center gap-1.5 rounded-(--radius-sm) border border-white/10 bg-white/5 p-1.5"
                  >
                    <div className="relative h-6.5 w-6.5 shrink-0 overflow-hidden rounded-full border border-white/20 bg-(--color-surface-2)">
                      {actor.src ? (
                        <Image
                          src={actor.src}
                          alt={actor.name}
                          fill
                          sizes="26px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-[9px] font-black text-white/40">
                          {getInitials(actor.name)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-bold leading-tight text-white">
                        {actor.name}
                      </p>
                      <p className="truncate text-[9px] leading-tight text-(--color-text-muted)">
                        {actor.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-(--color-border) pt-2 text-[10px] text-(--color-text-muted)">
            {movie.releaseDate && (
              <span>
                {translate("home.desktop.preview_release_date")}:{" "}
                <strong className="font-medium text-white/80">
                  {formatDate(movie.releaseDate, locale)}
                </strong>
              </span>
            )}
            {movie.language && (
              <span>
                {translate("home.desktop.preview_language")}:{" "}
                <strong className="font-medium text-white/80">{movie.language}</strong>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
