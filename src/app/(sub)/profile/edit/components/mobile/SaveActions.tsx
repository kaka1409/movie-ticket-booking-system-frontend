"use client";

import { useLocale } from "@/contexts/LocaleContext";

export default function SaveActions({
  onSave,
  onCancel,
  disabled = false,
}: {
  onSave: () => void;
  onCancel: () => void;
  disabled?: boolean;
}) {
  const { translate } = useLocale();

  return (
    <div className="mt-8 flex flex-col gap-4">
      <button
        type="button"
        onClick={onSave}
        disabled={disabled}
        className="w-full rounded-xl bg-(--color-gold) py-4 text-base font-extrabold tracking-wide text-black active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none"
      >
        {translate("profile.edit.save")}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="w-full rounded-xl border border-(--color-gold) py-4 text-base font-extrabold tracking-wide text-(--color-gold) active:scale-[0.98] transition-all duration-150"
      >
        {translate("profile.edit.cancel")}
      </button>
    </div>
  );
}
