import Image from "next/image";

/** Brand portrait shown wherever a member has not uploaded an avatar. */
export const DEFAULT_AVATAR_SRC = "/images/default-avatar.jpg";

/**
 * Circular member portrait.
 *
 * Without `src` it falls back to `fallbackSrc` when the caller owns a brand
 * default (site header, profile page) or to the member's initial when it does
 * not — a generic face on a review author would be noise.
 */
export default function Avatar({
  src,
  name,
  size = "h-11 w-11",
  fallbackSrc,
  className = "",
}: {
  src?: string | null;
  name: string;
  /** Tailwind sizing classes (`h-* w-*`). */
  size?: string;
  /** Image used when `src` is missing — omit to render the initial instead. */
  fallbackSrc?: string;
  className?: string;
}) {
  const imageSrc = src ?? fallbackSrc;

  return (
    <div
      className={`${size} shrink-0 overflow-hidden rounded-full border border-(--color-border) ${className}`}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={name}
          width={88}
          height={88}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-(--color-border)">
          <span className="text-xs font-bold text-(--color-gold)">{name.charAt(0)}</span>
        </div>
      )}
    </div>
  );
}
