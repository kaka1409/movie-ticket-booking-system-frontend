"use client";

import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";
import DesktopShell from "@/layouts/components/DesktopShell";
import Logo from "@/layouts/components/Logo";
import { AUTH_PROMO_BULLETS, AUTH_PROMO_IMAGE, AUTH_PROMO_IMAGE_SIZES } from "../constants";

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
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { translate } = useLocale();

  return (
    <DesktopShell>
      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-2 lg:p-3">
          <div className="lg:grid lg:min-h-[620px] lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-3">
            {/* Without lg:h-auto the fixed h-52 wins over the row height. */}
            <div className="relative h-52 w-full overflow-hidden rounded-xl lg:h-auto lg:min-h-[620px]">
              <Image
                src={AUTH_PROMO_IMAGE}
                alt=""
                fill
                priority
                quality={90}
                sizes={AUTH_PROMO_IMAGE_SIZES}
                className="object-cover"
              />

              {/* Keeps the copy readable whatever the artwork underneath does;
                  darkest towards the bottom-left, where the copy sits. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-tr from-black/95 via-black/55 to-black/10"
              />

              <div className="absolute inset-0 flex flex-col justify-between gap-3 p-6 lg:p-8">
                <PromoBrand />

                <div className="flex flex-col gap-2.5">
                  <p className="text-xl font-black text-white lg:text-[26px] xl:text-[30px] xl:leading-[1.15]">
                    {translate("auth.promo.title")}
                  </p>
                  <p className="text-sm text-white/70 lg:text-base">
                    {translate("auth.promo.subtitle")}
                  </p>

                  {/* The banner (740–1023px) is only 208px tall — the bullets
                      need the `lg:` tile where there is room for them. */}
                  <ul className="hidden flex-col gap-2.5 lg:flex">
                    {AUTH_PROMO_BULLETS.map(({ labelKey, icon: Icon }) => (
                      <li key={labelKey} className="flex items-center gap-2">
                        <Icon size={15} className="shrink-0 text-(--color-gold)" aria-hidden />
                        <span className="text-xs font-semibold text-(--color-gold-light)">
                          {translate(labelKey)}
                        </span>
                      </li>
                    ))}
                  </ul>
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
  );
}
