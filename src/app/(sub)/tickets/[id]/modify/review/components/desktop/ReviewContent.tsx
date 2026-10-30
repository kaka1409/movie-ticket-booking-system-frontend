"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useModifySubmit } from "@/features/tickets/hooks/useModifySubmit";
import Button from "@/components/ui/Button";
import ModifyStepLayout from "@/app/(sub)/tickets/components/desktop/ModifyStepLayout";
import ComparisonCard from "../shared/ComparisonCard";
import PriceSummary from "../shared/PriceSummary";

/**
 * Desktop review step: the side-by-side change in the content column; the
 * total and the single confirm action live in the rail. A modification is a
 * same-price swap, so there is no payment step here.
 */
export default function ReviewContent() {
  const { translate } = useLocale();
  const { canSubmit, isPending, errorMessage, submit } = useModifySubmit();

  return (
    <ModifyStepLayout
      current="review"
      summary={<PriceSummary />}
      action={
        <Button disabled={!canSubmit} loading={isPending} onClick={submit}>
          {translate("tickets.modify.review.confirm_cta")}
        </Button>
      }
      errorText={errorMessage}
    >
      <div className="space-y-5">
        <h1 className="text-xl font-extrabold tracking-wide text-(--color-text-primary)">
          {translate("tickets.modify.review.title")}
        </h1>

        <ComparisonCard />
      </div>
    </ModifyStepLayout>
  );
}
