"use client";

import { ShieldAlert } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Button from "@/components/ui/Button";

const POLICY_RULES = [
  "tickets.cancel.policy_rule_1",
  "tickets.cancel.policy_rule_2",
  "tickets.cancel.policy_rule_3",
  "tickets.cancel.policy_rule_4",
];

/**
 * Desktop cancel rail: the same four rules the mobile sheet lists, shown inline —
 * a bottom sheet is the wrong affordance on a 1280px canvas, and reading the
 * terms before confirming is the whole point of this step.
 */
export default function CancelPolicyPanel({ onContinue }: { onContinue: () => void }) {
  const { translate } = useLocale();

  return (
    <section className="space-y-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
      <h2 className="flex items-center gap-2 text-sm font-extrabold tracking-wide text-(--color-text-primary) uppercase">
        <ShieldAlert size={15} className="text-(--color-gold)" />
        {translate("tickets.cancel.policy_title")}
      </h2>

      <ul className="space-y-2.5">
        {POLICY_RULES.map((ruleKey) => (
          <li
            key={ruleKey}
            className="flex gap-2.5 text-sm leading-relaxed text-(--color-text-secondary)"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-gold)" />
            {translate(ruleKey)}
          </li>
        ))}
      </ul>

      <Button onClick={onContinue}>{translate("tickets.cancel.continue")}</Button>
    </section>
  );
}
