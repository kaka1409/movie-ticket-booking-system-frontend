"use client";

import { useLocale } from "@/contexts/LocaleContext";

export default function SnackSectionHeading({ sectionKey }: { sectionKey: string }) {
  const { translate } = useLocale();
  return (
    <h3 className="px-4 text-xs font-bold tracking-widest uppercase text-(--color-gold-dark)">
      {translate(sectionKey)}
    </h3>
  );
}
