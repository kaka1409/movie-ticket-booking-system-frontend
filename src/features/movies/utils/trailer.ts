/**
 * Derive the provider embed URL from a canonical trailer link. Mirrors the
 * backend `parseTrailerUrl` allowlist: only YouTube/Vimeo watch links resolve,
 * anything else (including unknown hosts) yields `null` so the Play button can
 * hide instead of shipping a broken iframe.
 */
export function toTrailerEmbedUrl(
  raw: string | null | undefined,
): string | null {
  if (typeof raw !== "string" || !raw.trim()) return null;

  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const segments = url.pathname.split("/").filter(Boolean);
  const first = segments[0] ?? "";

  const youtubeId = /^[A-Za-z0-9_-]{6,32}$/;
  const vimeoId = /^\d{5,12}$/;

  let provider: "youtube" | "vimeo" | null = null;
  let videoId: string | null = null;

  if (host === "youtu.be") {
    if (youtubeId.test(first)) {
      provider = "youtube";
      videoId = first;
    }
  } else if (
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtube-nocookie.com"
  ) {
    let candidate = "";
    if (first === "watch") candidate = url.searchParams.get("v") ?? "";
    else if (["embed", "shorts", "live", "v"].includes(first)) {
      candidate = segments[1] ?? "";
    }
    if (youtubeId.test(candidate)) {
      provider = "youtube";
      videoId = candidate;
    }
  } else if (host === "vimeo.com" || host === "player.vimeo.com") {
    const isEmbedPath = first === "video";
    const candidate = isEmbedPath ? (segments[1] ?? "") : first;
    if (isEmbedPath || segments.length <= 1) {
      if (vimeoId.test(candidate)) {
        provider = "vimeo";
        videoId = candidate;
      }
    }
  }

  if (!provider || !videoId) return null;
  if (provider === "youtube") {
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
  }
  return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
}
