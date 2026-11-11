/**
 * Remote image hosts, shared by the two places that must agree on them:
 * `next/image` (`remotePatterns` in `next.config.ts`) and the CSP `img-src`
 * directive in `src/proxy.ts`. Adding a host here allows it in both.
 */
export const IMAGE_HOSTS = [
  "i.ebayimg.com",
  "cdn11.bigcommerce.com",
  "cdn.dribbble.com",
  "encrypted-tbn0.gstatic.com",
  "m.media-amazon.com",
  "upload.wikimedia.org",
  "image.tmdb.org",
  "lumiere-a.akamaihd.net",
  "i.pravatar.cc",
  "images.ctfassets.net",
  "res.cloudinary.com",
  "flagcdn.com",
] as const;
