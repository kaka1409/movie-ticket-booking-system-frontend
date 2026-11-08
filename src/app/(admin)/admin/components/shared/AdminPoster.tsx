import { POSTER_FALLBACK } from "@/features/tickets/constants";

interface AdminPosterProps {
  src?: string | null;
  alt?: string;
  /** Tailwind size/aspect classes, e.g. `h-11 w-20 aspect-video`. */
  className?: string;
}

/**
 * Landscape movie poster thumbnail for the console. Admin-supplied URLs are
 * arbitrary hosts, so it renders a plain `<img>` (same convention as
 * `MoviesManager`) and falls back to the shared placeholder when the movie
 * has no artwork.
 */
export default function AdminPoster({ src, alt = "", className = "" }: AdminPosterProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- poster hosts are arbitrary URLs, outside the next/image allowlist
    <img
      src={src ?? POSTER_FALLBACK}
      alt={alt}
      loading="lazy"
      className={`shrink-0 rounded-md border border-(--color-border) object-cover ${className}`}
    />
  );
}
