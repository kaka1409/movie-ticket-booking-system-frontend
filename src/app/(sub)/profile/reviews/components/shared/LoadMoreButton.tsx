"use client";

import { useLocale } from "@/contexts/LocaleContext";

export default function LoadMoreButton({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  const { translate } = useLocale();
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="
          w-full rounded-2xl border border-(--color-border)
          bg-(--color-surface) py-3.5 text-sm font-bold uppercase
          tracking-widest text-(--color-gold-light)
          transition duration-150
          hover:border-(--color-gold)/40 hover:text-(--color-gold)
          active:scale-[0.98]
        "
      >
        {translate("movies.load_more")}
      </button>
    </div>
  );
}
