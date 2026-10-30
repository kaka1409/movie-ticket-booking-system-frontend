"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import TypeCard from "../shared/TypeCard";
import { MODIFY_TYPE_OPTIONS } from "@/features/tickets/constants";

export default function TypeCards() {
  const { translate } = useLocale();
  const { modificationType, setModificationType } = useModification();

  return (
    <section className="px-4 space-y-3">
      <p className="text-sm font-bold text-(--color-text-secondary) mb-4">
        {translate("tickets.modify.select_type")}
      </p>

      {MODIFY_TYPE_OPTIONS.map((option) => (
        <TypeCard
          key={option.type}
          option={option}
          isSelected={modificationType === option.type}
          onSelect={setModificationType}
        />
      ))}
    </section>
  );
}
