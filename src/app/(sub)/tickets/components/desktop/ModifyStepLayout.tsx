import type { ReactNode } from "react";
import ModifyRail from "@/app/(sub)/tickets/components/desktop/ModifyRail";
import ModifyStepRail, {
  type ModifyStepKey,
} from "@/app/(sub)/tickets/components/desktop/ModifyStepRail";
import SplitStepLayout from "@/components/shared/SplitStepLayout";

/**
 * Desktop shell for the modify wizard: the draft-derived stepper on top, the step
 * body beside `ModifyRail`. The panel/rail geometry lives in
 * `shared/SplitStepLayout`; this only binds the modify flow's own pieces.
 */
export default function ModifyStepLayout({
  current,
  summary,
  action,
  errorText,
  children,
}: {
  current: ModifyStepKey;
  summary?: ReactNode;
  action: ReactNode;
  errorText?: string | null;
  children: ReactNode;
}) {
  return (
    <SplitStepLayout
      stepper={<ModifyStepRail current={current} />}
      rail={<ModifyRail summary={summary} action={action} errorText={errorText} />}
    >
      {children}
    </SplitStepLayout>
  );
}
