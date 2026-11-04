"use client";

import { ExternalLink } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function CreditsPage() {
  const { translate } = useLocale();
  return (
    <main className="mx-auto min-h-[55vh] max-w-4xl px-5 py-16 md:px-8">
      <p className="mb-3 text-xs font-bold tracking-[0.2em] text-(--color-gold) uppercase">
        PrimeSeat
      </p>
      <h1 className="text-3xl font-bold text-(--color-text-primary)">
        {translate("credits.title")}
      </h1>
      <section className="mt-8 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6">
        <h2 className="text-xl font-semibold text-(--color-text-primary)">TMDB</h2>
        <p className="mt-3 text-sm leading-6 text-(--color-text-secondary)">
          {translate("credits.tmdb_notice")}
        </p>
        <a
          href="https://www.themoviedb.org"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm text-(--color-gold)"
        >
          The Movie Database <ExternalLink size={15} />
        </a>
      </section>
    </main>
  );
}
