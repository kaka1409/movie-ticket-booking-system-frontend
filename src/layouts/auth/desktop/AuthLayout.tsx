"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";
import DesktopShell from "@/layouts/components/DesktopShell";
import Logo from "@/components/ui/Logo";
import { AUTH_PROMO_SLIDES, AUTH_PROMO_IMAGE_SIZES } from "../constants";

/**
 * Brand cue printed over the artwork — logo plus strapline. Shared by the
 * tablet banner and the `lg:` artwork tile, which is why it is not duplicated.
 */
function PromoBrand() {
  const { translate } = useLocale();

  return (
    <div className="flex items-center gap-2">
      <Logo size="sm" />
      <span className="text-3xs font-semibold tracking-widest text-(--color-text-muted) uppercase">
        {translate("common.cinematic_excellence")}
      </span>
    </div>
  );
}

/**
 * Desktop auth chrome: DesktopShell around one card with two tiles — artwork
 * (3fr) + form (2fr) with a `620px` floor from `lg:`; below `lg:` the artwork
 * is an in-flow `h-52` banner in one column. The form column carries
 * `.surface-raised` so the input wells stay visible on the flat card.
 *
 * The artwork tile features an automatic crossfade slideshow with pause-on-hover
 * and interactive indicator dots on desktop screens.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { translate } = useLocale();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const intervalId = setInterval(() => {
      setActiveSlideIndex((previousIndex) => (previousIndex + 1) % AUTH_PROMO_SLIDES.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isPaused, activeSlideIndex]);

  return (
    <div className="relative min-h-dvh">
      {/* Full-screen blurred promo backdrop. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {AUTH_PROMO_SLIDES.map((slide, slideIndex) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt=""
            fill
            priority={slideIndex === 0}
            sizes="100vw"
            className={`object-cover blur-md scale-110 transition-opacity duration-1000 ease-in-out ${
              slideIndex === activeSlideIndex ? "opacity-35" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <DesktopShell>
        <div className="relative mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-2 lg:p-3">
            <div className="lg:grid lg:min-h-[620px] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-3">
              {/* Without lg:h-auto the fixed h-52 wins over the row height. */}
              <div
                className="relative h-52 w-full overflow-hidden rounded-xl lg:h-auto lg:min-h-[620px]"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Tablet / Small banner (< lg): Static first slide image */}
                <div className="absolute inset-0 lg:hidden">
                  <Image
                    src={AUTH_PROMO_SLIDES[0].src}
                    alt=""
                    fill
                    priority
                    quality={90}
                    sizes={AUTH_PROMO_IMAGE_SIZES}
                    className="object-cover"
                  />
                </div>

                {/* Desktop slideshow (>= lg): Stacked crossfade slides */}
                <div className="absolute inset-0 hidden lg:block">
                  {AUTH_PROMO_SLIDES.map((slide, slideIndex) => (
                    <Image
                      key={slide.src}
                      src={slide.src}
                      alt=""
                      fill
                      priority={slideIndex === 0}
                      quality={90}
                      sizes={AUTH_PROMO_IMAGE_SIZES}
                      className={`object-cover transition-opacity duration-700 ease-in-out ${
                        slideIndex === activeSlideIndex
                          ? "opacity-100"
                          : "pointer-events-none opacity-0"
                      }`}
                    />
                  ))}
                </div>

                {/* Keeps the copy readable whatever the artwork underneath does;
                  darkest towards the bottom-left, where the copy sits. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/95 via-black/55 to-black/10"
                />

                <div className="absolute inset-0 flex flex-col justify-between gap-3 p-6 lg:p-8">
                  <PromoBrand />

                  <div className="flex flex-col gap-4">
                    {/* Tablet / Small banner (< lg): Static slogan */}
                    <div className="flex flex-col gap-2.5 lg:hidden">
                      <p className="text-xl font-black text-white">
                        {translate(AUTH_PROMO_SLIDES[0].titleKey)}
                      </p>
                      <p className="text-sm text-white/70">
                        {translate(AUTH_PROMO_SLIDES[0].subtitleKey)}
                      </p>
                    </div>

                    {/* Desktop view (>= lg): Animated slogan according to active slide */}
                    <div className="hidden min-h-[120px] lg:block">
                      <div key={activeSlideIndex} className="animate-fade-in flex flex-col gap-2.5">
                        <p className="text-xl font-black text-white lg:text-[26px] xl:text-[30px] xl:leading-[1.15]">
                          {translate(AUTH_PROMO_SLIDES[activeSlideIndex].titleKey)}
                        </p>
                        <p className="text-sm text-white/70 lg:text-base">
                          {translate(AUTH_PROMO_SLIDES[activeSlideIndex].subtitleKey)}
                        </p>
                      </div>
                    </div>

                    {/* Indicator dots: Desktop only */}
                    <div
                      className="hidden items-center gap-2 pt-2 lg:flex"
                      role="tablist"
                      aria-label="Promo slideshow navigation"
                    >
                      {AUTH_PROMO_SLIDES.map((slide, slideIndex) => {
                        const isActive = slideIndex === activeSlideIndex;
                        return (
                          <button
                            key={slide.src}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-label={`Slide ${slideIndex + 1}`}
                            onClick={() => setActiveSlideIndex(slideIndex)}
                            className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                              isActive
                                ? "w-8 bg-(--color-gold)"
                                : "w-2 bg-white/40 hover:bg-white/70"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="surface-raised flex items-center justify-center p-6 lg:p-8">
                <div className="w-full">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </DesktopShell>
    </div>
  );
}
