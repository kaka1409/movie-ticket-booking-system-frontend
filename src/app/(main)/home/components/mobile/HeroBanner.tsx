"use client";

import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";

export default function HeroBanner() {
  const { t } = useLocale();
  return (
    <section className="relative h-55 w-full overflow-hidden" aria-label="Featured film">
      <Image
        className="object-cover"
        src="/images/hero-interstellar.jpg"
        alt="Featured movies"
        sizes=""
        fill
        priority
      />
      <div aria-hidden className="absolute inset-0 bg-hero-gradient" />
      <span className="absolute bottom-(--space-md) left-(--space-md) z-20 rounded-(--radius-sm) bg-(--color-gold) px-(--space-sm) py-0.5 text-[0.6rem] font-bold tracking-widest text-black">
        {t("home.promo")}
      </span>
    </section>
  );
}
