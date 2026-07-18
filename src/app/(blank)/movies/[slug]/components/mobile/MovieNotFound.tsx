"use client";

import { useLocale } from "@/contexts/LocaleContext";

export default function MovieNotFound() {
  const { translate } = useLocale();
  return (
    <div className="flex items-center justify-center min-h-dvh bg-(--color-bg)">
      <p className="text-(--color-text-secondary) text-lg">
        {translate("movies.not_found")}
      </p>
    </div>
  );
}
