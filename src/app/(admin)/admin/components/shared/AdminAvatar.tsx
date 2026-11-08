import { DEFAULT_AVATAR_SRC } from "@/components/ui/Avatar";

interface AdminAvatarProps {
  name: string | null | undefined;
  avatarUrl?: string | null;
  /** Rendered diameter in px. */
  size?: number;
}

/**
 * Circular account avatar for console tables. Members without an uploaded
 * photo get the brand default portrait — the same fallback the site header
 * and profile pages use.
 */
export default function AdminAvatar({ name, avatarUrl, size = 28 }: AdminAvatarProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- avatar hosts are arbitrary uploads, outside the next/image allowlist
    <img
      src={avatarUrl ?? DEFAULT_AVATAR_SRC}
      alt={name ?? ""}
      loading="lazy"
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full border border-(--color-border) object-cover"
    />
  );
}
