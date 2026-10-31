/**
 * Artwork slides for the desktop auth card slideshow.
 * Each slide includes the image asset path and localization keys for title and subtitle.
 */
export const AUTH_PROMO_SLIDES = [
  {
    src: "/images/promo-image-1.jpg",
    titleKey: "auth.promo.slide1_title",
    subtitleKey: "auth.promo.slide1_subtitle",
  },
  {
    src: "/images/promo-image-2.webp",
    titleKey: "auth.promo.slide2_title",
    subtitleKey: "auth.promo.slide2_subtitle",
  },
  {
    src: "/images/promo-image-3.jpg",
    titleKey: "auth.promo.slide3_title",
    subtitleKey: "auth.promo.slide3_subtitle",
  },
] as const;

export type AuthPromoSlide = (typeof AUTH_PROMO_SLIDES)[number];

/**
 * `next/image` `sizes` for that artwork: the `lg:` tile is 60% of the capped
 * `max-w-7xl` card (~710px), and a full-width banner in the 740–1023px band.
 */
export const AUTH_PROMO_IMAGE_SIZES = "(min-width: 1280px) 720px, (min-width: 1024px) 60vw, 100vw";
