import Avatar, { DEFAULT_AVATAR_SRC } from "@/components/ui/Avatar";

/**
 * Circular member portrait with the conic gold ring used on the profile surfaces
 * (mobile avatar, desktop overview hero, avatar editor). Wraps `ui/Avatar` so the
 * ring treatment stays in one place.
 */
export default function AvatarRing({
  src,
  name,
  size = "h-28 w-28",
  fallbackSrc = DEFAULT_AVATAR_SRC,
}: {
  src?: string | null;
  name: string;
  /** Tailwind sizing classes (`h-* w-*`) for the outer ring. */
  size?: string;
  fallbackSrc?: string;
}) {
  return (
    <div className={`relative ${size} shrink-0`}>
      <div
        className="absolute inset-0 rounded-full p-[3px]"
        style={{
          background:
            "conic-gradient(var(--color-gold) 0%, var(--color-gold-dark) 50%, var(--color-gold-light) 100%)",
        }}
      >
        <div className="h-full w-full rounded-full bg-(--color-bg)" />
      </div>

      <div className="absolute inset-[3px]">
        <Avatar
          src={src}
          fallbackSrc={fallbackSrc}
          name={name}
          size="h-full w-full"
          className="border-0"
        />
      </div>
    </div>
  );
}
