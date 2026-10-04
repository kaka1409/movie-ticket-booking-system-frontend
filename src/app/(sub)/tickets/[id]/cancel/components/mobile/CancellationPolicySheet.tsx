"use client";

import { useLocale } from "@/contexts/LocaleContext";
import ActionSheet from "@/components/ui/ActionSheet";

export default function CancellationPolicySheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { translate } = useLocale();

  const rules = [
    translate("tickets.cancel.policy_rule_1"),
    translate("tickets.cancel.policy_rule_2").replace("{fee}", "\u20AB20,000"),
    translate("tickets.cancel.policy_rule_3"),
    translate("tickets.cancel.policy_rule_4"),
  ];

  return (
    <ActionSheet open={open} onClose={onClose}>
      <div className="space-y-5">
        <h2 className="text-lg font-extrabold text-(--color-text-primary) text-center">
          {translate("tickets.cancel.policy_title")}
        </h2>

        <ul className="space-y-3">
          {rules.map((rule, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm text-(--color-text-secondary) leading-relaxed"
            >
              <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-(--color-gold)" />
              {rule}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl font-extrabold text-sm tracking-widest uppercase bg-(--color-gold) text-[#0F0F0F] shadow-[--shadow-glow] active:scale-[0.98] transition-all duration-150"
        >
          {translate("tickets.cancel.done")}
        </button>
      </div>
    </ActionSheet>
  );
}
