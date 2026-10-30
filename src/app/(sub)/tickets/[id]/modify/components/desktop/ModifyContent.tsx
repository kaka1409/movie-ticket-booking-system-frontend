"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { useModifyTypeStep } from "@/features/tickets/hooks/useModifySteps";
import Button from "@/components/ui/Button";
import ModifyStepLayout from "@/app/(sub)/tickets/components/desktop/ModifyStepLayout";
import TypeCard from "../shared/TypeCard";
import { MODIFY_TYPE_OPTIONS } from "@/features/tickets/constants";

/**
 * Desktop step 1 of the modify wizard: which kind of change this is. The choice
 * decides the ladder (see `ModifyStepRail`), so the rail itself moves once the
 * type is picked.
 */
export default function ModifyContent() {
  const { translate } = useLocale();
  const { modificationType, setModificationType } = useModification();
  const { canContinue, goToNextStep } = useModifyTypeStep();

  return (
    <ModifyStepLayout
      current="type"
      action={
        <Button disabled={!canContinue} onClick={goToNextStep}>
          {translate("tickets.transfer.continue")}
        </Button>
      }
    >
      <div className="space-y-3">
        <p className="text-sm font-bold text-(--color-text-secondary)">
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

        <p className="pt-1 text-xs text-(--color-text-muted)">
          {translate("tickets.modify.limit_notice")}
        </p>
      </div>
    </ModifyStepLayout>
  );
}
