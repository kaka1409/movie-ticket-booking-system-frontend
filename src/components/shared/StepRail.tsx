import Link from "next/link";
import { Check } from "lucide-react";

export interface StepRailItem {
  key: string;
  label: string;
  /**
   * Backward-only target. A completed step can be re-entered (its draft is still
   * intact); the current and the future steps are inert because forward movement
   * belongs to the step's own CTA, the only thing that knows whether it is done.
   */
  href: string | null;
}

/**
 * Desktop stepper shared by the booking flow and the ticket-modify wizard: the
 * steps come from the caller, this only paints numbers/checks, connectors and
 * `aria-current="step"`.
 *
 * Between 740 and 1023 the labels are hidden — only numbers + connectors fit
 * beside a full-width step body.
 */
export default function StepRail({
  steps,
  current,
  ariaLabel,
}: {
  steps: StepRailItem[];
  /** 1-based index of the step being rendered. */
  current: number;
  ariaLabel?: string;
}) {
  return (
    <nav aria-label={ariaLabel}>
      <ol className="flex w-full items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < current;
          const isCurrent = stepNumber === current;

          const badgeClass = isDone
            ? "border-(--color-gold) bg-(--color-gold) text-(--color-bg)"
            : isCurrent
              ? "border-(--color-gold) bg-(--color-gold)/10 text-(--color-gold)"
              : "border-(--color-border) text-(--color-text-muted)";

          const body = (
            <>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-extrabold transition-colors duration-200 ${badgeClass}`}
              >
                {isDone ? <Check size={14} /> : stepNumber}
              </span>
              <span
                className={`hidden text-[10px] font-bold tracking-widest uppercase lg:inline ${
                  isDone || isCurrent ? "text-(--color-gold)" : "text-(--color-text-muted)"
                }`}
              >
                {step.label}
              </span>
            </>
          );

          return (
            <li
              key={step.key}
              aria-current={isCurrent ? "step" : undefined}
              className="flex flex-1 items-center gap-3 last:flex-none"
            >
              {step.href ? (
                <Link
                  href={step.href}
                  className="flex items-center gap-3 rounded-lg transition-opacity duration-150 hover:opacity-80"
                >
                  {body}
                </Link>
              ) : (
                <div className="flex items-center gap-3">{body}</div>
              )}

              {index < steps.length - 1 && (
                <span
                  className={`h-px flex-1 ${isDone ? "bg-(--color-gold)/50" : "bg-(--color-border)"}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
